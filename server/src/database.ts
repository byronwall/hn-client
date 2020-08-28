import * as fs from "fs";
import * as _ from "lodash";

import { AlgoliaApi, HITS_PER_PAGE } from "./algolia";
import { HackerNewsApi } from "./api";
import { _getUnixTimestamp } from "./helpers";
import { ItemExt, TopStories, TopStoriesType } from "./interfaces";
import { Item } from "./item";

type ItemHash = {
  [id: number]: ItemExt;

  topstories?: TopStories;
  day?: TopStories;
  week?: TopStories;
  month?: TopStories;
};

export let db: ItemHash = {};
const dbPath = "./newdb.json";

export function saveDatabase() {
  const dataStr = JSON.stringify(db);
  fs.writeFileSync(dbPath, dataStr);
}

export function reloadDatabase() {
  // create database if it's missing
  if (!fs.existsSync(dbPath)) {
    saveDatabase();
  }

  const dataStr = fs.readFileSync(dbPath).toString();

  db = JSON.parse(dataStr) as ItemExt[];
}

export async function db_clearOldStories(idsToKeep: number[]) {
  // remove the day/week items from the delete list
  const allIds = Object.keys(db)
    .map((c) => +c)
    .filter((c) => !isNaN(c));

  console.log("all ids in database", allIds);

  allIds.forEach((id) => {
    const shouldKeep = _.includes(idsToKeep, id);

    if (!shouldKeep) {
      delete db[id];
    }
  });

  return allIds.length - idsToKeep.length;
}

export async function db_getTopStoryIds(
  reqType: TopStoriesType
): Promise<number[]> {
  const doc = db[reqType] as TopStories;

  if (doc !== undefined) {
    const shouldUpdate = _getUnixTimestamp() - doc.lastUpdated > 600;
    if (!shouldUpdate) {
      // same type of obj as created below
      return doc.items;
    }
  }

  const ids = await _getTopStories(reqType);

  let topstories: TopStories = {
    id: reqType,
    items: ids,
    lastUpdated: _getUnixTimestamp(),
  };

  // add to database
  db[reqType] = topstories;

  return ids;
}

async function addAllChildren(items: Item[]) {
  var newItems: Item[] = [];

  for (let item of items) {
    // this now needs to go grab comments if they are desired
    // TODO: consider building a giant normalized list and then doing a final denorm step... that final obj coudl be saved too as a cache.

    if (item !== null) {
      let freshItems = await addChildrenToItem(item);
      freshItems = freshItems.filter((item) => item !== null);
      newItems = newItems.concat(freshItems);
    }

    // all of the kids were added... check if more kids to do
  }

  // console.log("new items", newItems.map(item => item.id));

  if (newItems.length == 0) {
    return true;
  } else {
    return addAllChildren(newItems);
  }
}

async function addChildrenToItem(item: Item): Promise<Item[]> {
  if (item.kids !== undefined && item.kids.length > 0) {
    // load all the kids and then return those
    const result = await Promise.all(
      item.kids.map((kid) => HackerNewsApi.get().fetchItem(kid))
    );

    // result contains all of the comments loaded, run them back into the parent
    item.kidsObj = result;
    delete item.kids;

    return item.kidsObj;
  }

  // just send  back empty array otherwise
  return [];
}

function addItemToDb(item: Item) {
  let itemExt: ItemExt = { ...item, lastUpdated: _getUnixTimestamp() };

  db[item.id] = itemExt;

  return true;
}

async function _getTopStories(type: TopStoriesType): Promise<number[]> {
  switch (type) {
    case "topstories":
      const topStories = (
        await HackerNewsApi.get().fetchItemIds("topstories")
      ).slice(0, HITS_PER_PAGE);

      return topStories;
    case "day":
      return await AlgoliaApi.getDay();
    case "month":
      return await AlgoliaApi.getMonth();
    case "week":
      return await AlgoliaApi.getWeek();
    default:
      console.log("error missing type");
      break;
  }
}

function getItemFromDb(itemId: number): ItemExt | null {
  const doc = db[itemId];

  if (doc === undefined || _isTimePastThreshold(doc)) {
    // this is caught later and used to refresh the story
    return null;
  }

  return doc;
}

export async function _getFullDataForIds(itemIDs: number[]) {
  let itemObjs = await Promise.all(itemIDs.map(getItemFromDb));

  for (var i = 0; i < itemObjs.length; i++) {
    let obj = itemObjs[i];

    /// TODO: add a check to the data updated
    if (obj === null) {
      let item = await HackerNewsApi.get().fetchItem(itemIDs[i]);
      await addChildrenToItemRecurse(item);
      await addItemToDb(item);

      itemObjs[i] = { ...item, lastUpdated: _getUnixTimestamp() };
    }
  }

  return itemObjs;
}

async function addChildrenToItemRecurse(item: Item) {
  var newItems: Item[] = [];

  // this now needs to go grab comments if they are desired

  let freshItems = await addChildrenToItem(item);

  newItems = newItems.concat(freshItems);

  // all of the kids were added... check if more kids to do

  // console.log("new items", newItems.map(item => item.id));

  if (newItems.length == 0) {
    return true;
  } else {
    return addAllChildren(newItems);
  }
}

function _isTimePastThreshold(itemExt: ItemExt) {
  if (itemExt.lastUpdated === undefined) {
    return true;
  }

  // set up to update the story if the ratio on time marks the story old
  return (
    (_getUnixTimestamp() - itemExt.lastUpdated) /
      (itemExt.lastUpdated - itemExt.time) >
    0.25
  );
}
