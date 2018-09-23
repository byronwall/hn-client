import * as nedb from "nedb";
import { AlgoliaApi } from "./algolia";
import { HackerNewsApi } from "./api";
import { _getUnixTimestamp } from "./helpers";
import { HasTime, ItemExt, TopStories, TopStoriesType } from "./interfaces";
import { Item } from "./item";

export class Database {
  static _db: Nedb;
  static get() {
    if (Database._db === undefined) {
      console.log("creating DB");
      Database._db = new nedb({ filename: "./data_test.db", autoload: true });
      Database._db.ensureIndex({ fieldName: "id", unique: true }, function(
        err
      ) {
        if (err !== null) {
          console.log("nedb unique error", err);
        }
      });
    }

    return Database._db;
  }
}

export async function db_getTopStoryIds(reqType: TopStoriesType) {
  return new Promise<number[]>((resolve, reject) => {
    console.log("searching DB for topstories");
    Database.get().findOne<TopStories>({ id: reqType }, (err, doc) => {
      if (err !== null) {
        console.log("error occurred fetching ids", err);
        return reject(err);
      }

      console.log("group search", doc);

      if (doc !== null) {
        console.log("doc exists");
        const shouldUpdate = _getUnixTimestamp() - doc.lastUpdated > 600;
        if (!shouldUpdate) {
          console.log("time is good");
          return resolve(doc.items);
        }
      }

      // TODO: add a second check here to determine when to reload

      console.log("updating the top stories");

      _getTopStories(reqType).then(ids => {
        let topstories: TopStories = {
          id: reqType,
          items: ids,
          lastUpdated: _getUnixTimestamp()
        };

        console.log("new top stories", topstories);

        // this will update or insert the new topstories
        Database.get().update(
          { id: topstories.id },
          topstories,
          { upsert: true },
          (err, numUpdated, upsert) => {
            console.log("topstories upsert", err, numUpdated, upsert);
            return resolve(ids);
          }
        );
      });
    });
  });
}

async function addAllChildren(items: Item[]) {
  var newItems: Item[] = [];

  for (let item of items) {
    // this now needs to go grab comments if they are desired
    // TODO: consider building a giant normalized list and then doing a final denorm step... that final obj coudl be saved too as a cache.

    if (item !== null) {
      let freshItems = await addChildrenToItem(item);
      freshItems = freshItems.filter(item => item !== null);
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
    return Promise.all(
      item.kids.map(kid => HackerNewsApi.get().fetchItem(kid))
    ).then(result => {
      // result contains all of the comments loaded, run them back into the parent
      item.kidsObj = result;
      delete item.kids;

      return item.kidsObj;
    });
  } else {
    /// just send  back empty array
    return Promise.resolve([]);
  }
}

async function addItemToDb(item: Item) {
  // outputItem(item, 0);

  let itemExt: ItemExt = { ...item, lastUpdated: _getUnixTimestamp() };

  return new Promise((resolve, reject) => {
    Database.get().update(
      { id: item.id },
      itemExt,
      { upsert: true },
      (err, numCount) => {
        if (err) {
          return reject(err);
        } else {
          console.log("item added to DB: ", item.id);
          return resolve(true);
        }
      }
    );
  });
}

async function _getTopStories(type: TopStoriesType) {
  switch (type) {
    case "topstories":
      return (await HackerNewsApi.get().fetchItemIds("topstories")).slice(
        0,
        20
      );
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

async function getItemFromDb(itemId: number): Promise<ItemExt> {
  return new Promise<ItemExt>((resolve, reject) => {
    console.log("find one: ", itemId);
    Database.get().findOne<ItemExt>({ id: itemId }, (err, doc) => {
      if (err !== null) {
        console.log("error, find one: ", err);
        return reject(err);
      } else {
        if (doc === null || _isTimePastThreshold(doc)) {
          return resolve(null);
        } else {
          return resolve(doc);
        }
      }
    });
  });
}

export async function _getFullDataForIds(itemIDs: number[]) {
  let itemObjs = await Promise.all(itemIDs.map(getItemFromDb));

  for (var i = 0; i < itemObjs.length; i++) {
    let obj = itemObjs[i];

    /// TODO: add a check to the data updated
    if (obj === null) {
      console.log("id was null, going for an update", itemIDs[i]);

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
  // TODO: consider building a giant normalized list and then doing a final denorm step... that final obj coudl be saved too as a cache.

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
