import { getCleanPathName } from "@/hooks/getCleanPathName";
import localforage from "localforage";
import { create } from "zustand";
import { getContentViaFetch } from "./getContentViaFetch";
import {
  getSummaryViaFetch,
  mapStoriesToSummaries,
} from "./getSummaryViaFetch";

export interface HnItem {
  by: string;
  descendants?: number;
  id: number;
  score: number;
  time: number;
  title: string;
  type: string;
  url?: string; // optional for Ask HN and internal items
  kidsObj?: Array<KidsObj3 | null>;
  lastUpdated: number;
  text?: string; // this is for Ask HN and others that are internal
}

export interface KidsObj3 {
  by?: string;
  id: number;
  parent: number;
  text?: string;
  time: number;
  type: string;
  kidsObj?: KidsObj3[];
  deleted?: boolean;
  dead?: boolean;
}

type StoryPage = "front" | "day" | "week";

type StoryId = number;

type DataStore = {
  rawData: Record<StoryId, HnItem>;
  readItems: TimestampHash;
  pendingReadItems: number[];

  isLocalForageInitialized: boolean;

  dataNonce: number;
  isLoadingData: boolean;

  shouldHideReadItems: boolean;

  storyListSaveCount: number;
};

type DataStoreActions = {
  getContent: (
    id: StoryId,
    fromLocalStorageOnly?: boolean
  ) => Promise<HnItem | undefined>;
  getContentForPage: (
    page: string,
    fromLocalStorageOnly?: boolean
  ) => Promise<HnStorySummary[] | undefined>;

  initializeFromLocalForage: () => void;

  saveStoryList: (page: StoryPage, data: HnItem[]) => void;
  saveContent: (id: StoryId, content: HnItem) => void;

  refreshCurrent(url: string): Promise<HnItem | HnStorySummary[] | undefined>;

  saveIdToReadList: (id: number) => void;

  getAllLocalContent: () => Promise<HnStorySummary[] | undefined>;

  purgeLocalForage: () => void;

  setShouldHideReadItems: (shouldHide: boolean) => void;
};

if (typeof window !== "undefined") {
  localforage.config({
    driver: localforage.INDEXEDDB, // Force WebSQL; same as using setDriver()
    name: "hn_next",
    version: 1.0,
    size: 4980736, // Size of database, in bytes. WebSQL-only for now.
    storeName: "keyvaluepairs", // Should be alphanumeric, with underscores.
    description: "some description",
  });
}

const LOCAL_READ_ITEMS = "STORAGE_READ_ITEMS";
const SHOULD_HIDE_READ_ITEMS = "SHOULD_HIDE_READ_ITEMS";

export const useDataStore = create<DataStore & DataStoreActions>(
  (set, get) => ({
    dataNonce: 0,
    isLoadingData: false,
    isLocalForageInitialized: false,
    storyLists: {
      front: [],
      day: [],
      week: [],
    },

    storyListSaveCount: 0,

    rawData: {},

    shouldHideReadItems: false,

    setShouldHideReadItems: async (shouldHide: boolean) => {
      set({ shouldHideReadItems: shouldHide });

      // save via localforage
      await localforage.setItem(SHOULD_HIDE_READ_ITEMS, shouldHide);
    },

    readItems: {},
    pendingReadItems: [],

    purgeLocalForage: async () => {
      // goal is to remove stories that are not current or recently read

      console.log("purging localforage");

      const { readItems } = get();

      const idsToKeep = new Set<number>();

      // get the three main story lists - front, day, week
      // add those ids to the keep list

      const keys = await localforage.keys();

      // bad ones have a / in them - remove them
      const badStoryLists = keys.filter((key) => key.includes("/"));
      for (const key of badStoryLists) {
        console.log("removing bad key", key);
        await localforage.removeItem(key);
      }

      const storyIds = keys.filter((key) => key.startsWith("STORIES_"));

      for (const key of storyIds) {
        const list = await localforage.getItem<HnStorySummary[]>(key);

        if (list) {
          console.log("list to keep", list.length, key);
          for (const item of list) {
            idsToKeep.add(item.id);
          }
        }
      }

      // get the 50 most recent read items
      const readItemsArray = Object.entries(readItems).sort(
        (a, b) => b[1] - a[1]
      );

      console.log("readItemsArray", readItemsArray);

      const maxToKeep = Math.min(50, readItemsArray.length);

      for (let i = 0; i < maxToKeep; i++) {
        idsToKeep.add(Number(readItemsArray[i][0]));
      }

      // get all keys starting with RAW_
      const rawKeys = keys.filter((key) => key.startsWith("raw_"));

      console.log("all keys", rawKeys.length, idsToKeep.size);

      for (const key of rawKeys) {
        const id = Number(key.replace("raw_", ""));

        if (!idsToKeep.has(id)) {
          console.log("deleting", id);
          await localforage.removeItem(key);
        }
      }
    },

    getAllLocalContent: async () => {
      const { isLocalForageInitialized, initializeFromLocalForage } = get();

      if (!isLocalForageInitialized) {
        await initializeFromLocalForage();
      }

      // get all keys starting with RAW_
      const keys = await localforage.keys();
      const rawKeys = keys.filter((key) => key.startsWith("raw_"));

      const data: HnItem[] = [];

      for (const key of rawKeys) {
        const item = await localforage.getItem<HnItem>(key);

        if (item) {
          data.push(item);
        }
      }

      // get summaries and return
      const summaries = mapStoriesToSummaries(data);

      return summaries;
    },

    saveIdToReadList: async (id: number) => {
      const { readItems, isLocalForageInitialized, initializeFromLocalForage } =
        get();

      if (!isLocalForageInitialized) {
        // don't save data before list is loaded --- will clear it
        await initializeFromLocalForage();
      }
      console.log("new read list", readItems);

      // skip out if already there
      if (readItems[id]) {
        return;
      }

      const newReadList = { ...readItems };

      newReadList[id] = Date.now();

      localforage.setItem(LOCAL_READ_ITEMS, newReadList);

      set({ readItems: newReadList });
    },

    saveContent: (id: StoryId, content: HnItem) => {
      const { rawData, dataNonce } = get();

      set({
        rawData: { ...rawData, [id]: content },
        dataNonce: dataNonce + 1,
      });

      localforage.setItem("raw_" + id, content);
    },

    saveStoryList: async (page: StoryPage, data: HnItem[]) => {
      const { rawData, dataNonce } = get();

      const storySummaries = mapStoriesToSummaries(data);

      // also save the new list to localforage
      console.log("saving to localforage", "STORIES_" + page, storySummaries);
      await localforage.setItem("STORIES_" + page, storySummaries);

      const newRawData: Record<StoryId, HnItem> = {};

      for (const item of data) {
        newRawData[item.id] = item;
        await localforage.setItem("raw_" + item.id, item);
      }

      set({
        rawData: { ...rawData, ...newRawData },
        dataNonce: dataNonce + 1,
        storyListSaveCount: get().storyListSaveCount + 1,
      });
    },

    refreshCurrent: async (url: string) => {
      // attempt to load from local info
      const { saveContent, saveStoryList } = get();

      console.log("refreshing", url);

      // determine if page is a story or a list
      const isStory = url.startsWith("/story");

      if (isStory) {
        const apiUrl = "/api" + url;

        set({ isLoadingData: true });
        const newContent = await getContentViaFetch(apiUrl);
        set({ isLoadingData: false });

        if (newContent) {
          saveContent(newContent.id, newContent);
        }

        return newContent;
      }

      const isFrontPage = url === "/";

      if (isFrontPage) {
        url = "/topstories";
      }

      // need to hit topsotries API
      const apiUrl = "/api/topstories" + url;
      set({ isLoadingData: true });
      const { data, storySummaries } = await getSummaryViaFetch(apiUrl);

      console.log("storySummaries", storySummaries);

      set({ isLoadingData: false });

      saveStoryList(url.replace("/", "") as StoryPage, data);

      return storySummaries;
    },

    initializeFromLocalForage: async () => {
      // load the read items
      const { purgeLocalForage, isLocalForageInitialized } = get();

      if (isLocalForageInitialized) {
        console.log("already initialized");
        return;
      }

      console.log("initializeFromLocalForage");

      const readItems =
        (await localforage.getItem<TimestampHash>(LOCAL_READ_ITEMS)) || {};

      const { pendingReadItems } = get();

      // add any pending items
      for (const id of pendingReadItems) {
        readItems[id] = Date.now();
      }

      // get the shouldHideReadItems
      const shouldHideReadItems =
        (await localforage.getItem<boolean>(SHOULD_HIDE_READ_ITEMS)) || false;

      console.log(
        "initializeFromLocalForage done",
        readItems,
        shouldHideReadItems
      );

      set({
        isLocalForageInitialized: true,
        readItems,
        pendingReadItems: [],
        shouldHideReadItems,
      });

      // do a purge in the future, 1 seconds
      setTimeout(purgeLocalForage, 1000);
    },

    async getContent(id: StoryId, fromLocalStorageOnly = false) {
      // attempt to load from local info
      const {
        rawData,
        isLocalForageInitialized,
        saveContent,
        initializeFromLocalForage,
      } = get();
      console.log("getContent", id);

      const url = "/api/story/" + id;

      if (!isLocalForageInitialized) {
        // kick out for SSR
        console.log("localforage not initialized");

        await initializeFromLocalForage();
      }

      // check if we have the item in the cache
      if (id in rawData) {
        return rawData[id];
      }

      // load the item from localforage
      const item = await localforage.getItem<HnItem>("raw_" + id);

      if (item) {
        return item;
      }

      if (fromLocalStorageOnly) {
        console.log("fromLocalStorageOnly");
        return undefined;
      }

      const data = await getContentViaFetch(url);
      if (data) saveContent(id, data);

      return data;
    },

    async getContentForPage(page: string, fromLocalStorageOnly = false) {
      // attempt to load from local info
      const {
        isLocalForageInitialized,
        saveStoryList,
        initializeFromLocalForage,
      } = get();

      // remove leading slash
      page = getCleanPathName(page);

      if (page == "") {
        page = "topstories";
      }

      const urlSlug = "/api/topstories/" + page;

      if (urlSlug === undefined) {
        console.error("error missing type");
        return undefined;
      }

      const url = urlSlug;

      if (!isLocalForageInitialized) {
        console.log("localforage not initialized");

        await initializeFromLocalForage();
      }

      // load the list from localforage
      const list = await localforage.getItem<HnStorySummary[]>(
        "STORIES_" + page
      );

      if (list) {
        console.log("loaded from localforage", list, page);
        return list;
      }

      if (fromLocalStorageOnly) {
        console.log("fromLocalStorageOnly");
        return undefined;
      }

      const { data, storySummaries } = await getSummaryViaFetch(url);

      saveStoryList(page as StoryPage, data);

      return storySummaries;
    },
  })
);
export interface HnStorySummary {
  title: string;
  score: number;
  id: number;
  url: string | undefined;
  commentCount: number | undefined;
  time: number;
}
export type TimestampHash = Record<number, number>;