"use client";

import { useGetContent } from "@/hooks/useGetContent";
import { HnStoryPage } from "@/components/HnStoryPage";
import { useParams } from "next/navigation";
import { HnItem, useDataStore } from "@/stores/useDataStore";

export function StoryPageClient(props: { ssrData: HnItem | undefined }) {
  const params = useParams();

  const rawId = params?.id;

  if (Array.isArray(rawId) || !rawId) {
    throw new Error("Unexpected array");
  }

  const id = parseInt(rawId, 10);

  const { data, isLoading } = useGetContent(id, props.ssrData);

  const saveIdToReadList = useDataStore((s) => s.saveIdToReadList);

  return (
    <div>
      {isLoading && <p>Loading...</p>}

      <HnStoryPage id={id} onVisitMarker={saveIdToReadList} storyData={data} />
    </div>
  );
}
