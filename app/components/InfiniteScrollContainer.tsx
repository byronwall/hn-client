import React, { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

interface InfiniteScrollContainerProps<TItemType> {
  items: TItemType[];
  itemsToAddOnRefresh: number;

  children: (item: TItemType, index: number) => React.ReactNode;
}

export function InfiniteScrollContainer<TItemType>(
  props: InfiniteScrollContainerProps<TItemType>
) {
  const { items, itemsToAddOnRefresh, children } = props;

  const [itemsToShow, setItemsToShow] = useState<TItemType[]>(
    items.slice(0, 2)
  );

  const [isShowingMore, setIsShowingMore] = useState(false);

  const handleNextItems = useCallback(() => {
    // need to add NUMBER_OF_ITEMS_TO_LOAD more items at a time

    if (isShowingMore) {
      console.log("isShowingMore true = skip more items");
      return;
    }

    const currentLength = itemsToShow.length;

    const newItemsToShow = items.slice(0, currentLength + itemsToAddOnRefresh);

    setIsShowingMore(true);
    setTimeout(() => {
      console.log("handleNextItems", newItemsToShow);
      setItemsToShow(newItemsToShow);
      setIsShowingMore(false);
    }, 100);
  }, [isShowingMore, items, itemsToAddOnRefresh, itemsToShow.length]);

  const hasMore = itemsToShow.length < items.length;

  const { ref, inView } = useInView({ threshold: 0 });

  useEffect(() => {
    if (inView && hasMore) {
      handleNextItems();
    }
  }, [handleNextItems, hasMore, inView]);

  return (
    <div>
      {itemsToShow.map((item, index) => children(item, index))}
      {isShowingMore && hasMore && (
        <div className="text-center bg-gradient-to-r from-white to-orange-500 p-1">
          See me? More coming...
        </div>
      )}
      <div ref={ref} />
    </div>
  );
}
