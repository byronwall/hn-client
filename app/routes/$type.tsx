import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { ClientLoaderFunctionArgs, useLoaderData } from "@remix-run/react";

import { HnStoryList } from "~/components/HnStoryList";
import { HnItem, HnStorySummary, useDataStore } from "~/stores/useDataStore";
import { loader as listLoader } from "./api.topstories.$type";
import { useGetContentForPage } from "./useGetContentForPage";

export const meta: MetaFunction = ({ params }) => {
  // capitalize the first letter of the type
  const type = params.type?.charAt(0).toUpperCase() + params.type?.slice(1);

  return [
    { title: "HN Offline: " + type },
    { name: "description", content: "Hacker News " + type + " page" },
  ];
};

type PageLoaderData = {
  rawStoryData?: HnItem[];
  summaryData?: HnStorySummary[];
  page?: string;
};

export async function loader({ params }: LoaderFunctionArgs) {
  const type = params.type;

  console.log("loader", type, new Date());

  const res = await listLoader({
    params: {
      type,
    },
  });

  const storyData = await res.json();

  const response: PageLoaderData = {
    rawStoryData: storyData,
    page: type,
  };

  return response;
}

export const clientLoader = async ({ params }: ClientLoaderFunctionArgs) => {
  // this action will run only on a CSR request - client side navigation
  // will not call the server loader function
  console.log("clientLoader page", params.type);

  const data = await useDataStore.getState().getContentForPage(params.type);

  const response: PageLoaderData = {
    summaryData: data,
    page: params.type,
  };

  return response;
};

export default function HnStoryListServer() {
  // loader data
  const { rawStoryData, summaryData, page } = useLoaderData<PageLoaderData>();

  const realData = useGetContentForPage(page!, rawStoryData);

  console.log("HnStoryListServer", {
    page,
    realData,
    summaryData,
    rawStoryData,
  });

  // real data wins since it responds to refreshes
  // summary data is the initial data from the client loader
  const dataToUse = realData ?? summaryData;

  return <HnStoryList items={dataToUse} />;
}
