import { HnItem, useDataStore } from "../stores/useDataStore";
import { useCallback, useEffect } from "react";
import { useGetSimpleData } from "./useGetSimpleData";
import { usePrevious } from "react-use";

export function useGetContent(id: number, _ssrData: HnItem | undefined) {
  const getContent = useDataStore((s) => s.getContent);
  const isInit = useDataStore((s) => s.isLocalForageInitialized);
  const saveContent = useDataStore((s) => s.saveContent);
  const dataNonce = useDataStore((s) => s.dataNonce);

  // throw out SSR data if data nonce has changed - client requested new data
  const ssrData = dataNonce === 0 ? _ssrData : undefined;

  console.log("useGetContent", dataNonce, _ssrData);

  useEffect(() => {
    // only save on server render - nonce is 0
    if (!ssrData || dataNonce !== 0) return;

    saveContent(id, ssrData);
  }, [id, ssrData, saveContent, dataNonce]);

  const getter = useCallback(() => getContent(id), [getContent, id, isInit]);

  return useGetSimpleData(getter, ssrData);
}
