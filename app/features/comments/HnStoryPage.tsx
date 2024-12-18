import { useNavigate } from "@remix-run/react";
import { ArrowUpRightFromSquare } from "lucide-react";
import React, { useEffect, useState } from "react";

import { useGetContent } from "~/hooks/useGetContent";
import { isValidComment } from "~/lib/isValidComment";
import { processHtmlAndTruncateAnchorText } from "~/lib/processHtmlAndTruncateAnchorText";
import { cn, getDomain, isNavigator, timeSince } from "~/lib/utils";
import { HnItem, useDataStore } from "~/stores/useDataStore";

import { HnCommentList } from "./HnCommentList";

interface HnStoryPageProps {
  id: number | undefined;
  storyData?: HnItem;
}

export const HnStoryPage: React.FC<HnStoryPageProps> = ({
  id,
  storyData: _storyData,
}) => {
  const updateCollapsedState = useDataStore((s) => s.updateCollapsedState);

  const setIdToScrollTo = useDataStore((s) => s.setScrollToId);

  const storyData = useGetContent(id!, _storyData);

  const textToRender = processHtmlAndTruncateAnchorText(storyData?.text || "");

  const onVisitMarker = useDataStore((s) => s.saveIdToReadList);

  const handleShareClick = () => {
    navigator.share?.({ url: window.location.href });
  };

  const navigate = useNavigate();

  useEffect(() => {
    const anchorClickHandler = (e: any) => {
      if (e.target.tagName !== "A") {
        return;
      }

      const link = e.target as HTMLAnchorElement;

      const regex = /https?:\/\/news\.ycombinator\.com\/item\?id=(\d+)/;
      const matches = link.href.match(regex);

      if (matches === null) {
        link.target = "_blank";
        return;
      }

      navigate("/story/" + matches[1]);
      e.preventDefault();
      return false;
    };

    window.scrollTo({ top: 0 });
    document.body.addEventListener("click", anchorClickHandler);

    if (id !== undefined) {
      onVisitMarker(id);
    }

    return () => {
      document.body.removeEventListener("click", anchorClickHandler);
    };
  }, []);

  const collapsedIds = useDataStore((s) => s.collapsedIds);

  const _isOpen = storyData?.id ? collapsedIds[storyData.id] !== true : false;
  const [isTextOpen, setIsTextCollapsed] = useState(_isOpen);

  useEffect(() => {
    setIsTextCollapsed(_isOpen);
  }, [_isOpen]);

  const isTextCollapsed = isTextOpen === false;

  if (!storyData) {
    return null;
  }

  const storyLinkEl =
    storyData.url === undefined ? (
      <span>{storyData.title}</span>
    ) : (
      <a href={storyData.url}>{storyData.title}</a>
    );

  const comments = (storyData.kidsObj || []).filter(isValidComment);

  function handleStoryTextClick() {
    if (!storyData?.text) {
      return;
    }

    const newIsCollapsed = !isTextCollapsed;

    setIsTextCollapsed(newIsCollapsed);
    updateCollapsedState(storyData.id, newIsCollapsed);

    // scroll to first comment if it exists
    // schedule out 200ms to allow the collapse animation to finish
    setTimeout(() => {
      if (newIsCollapsed && comments.length > 0 && comments[0]?.id) {
        setIdToScrollTo(comments[0]?.id);
      }
    }, 100);
  }

  return (
    <div className="relative">
      <h2
        className="text-2xl font-bold hover:underline mb-2"
        style={{ overflowWrap: "break-word" }}
      >
        {storyLinkEl}
      </h2>

      <div
        className={cn(
          {
            "border-l-4 border-orange-500 px-2 rounded-tl rounded-bl":
              storyData.text,
          },
          {
            collapsed: isTextCollapsed,
          }
        )}
        onClick={handleStoryTextClick}
      >
        <h4 className="mb-2">
          <span>{storyData.by}</span>
          <span>{" | "}</span>
          <span>
            {storyData.score}
            {" points"}
          </span>
          <span>{" | "}</span>
          <span>{timeSince(storyData.time)} ago</span>
          <span>{" | "}</span>
          <span>{getDomain(storyData.url)}</span>
          {isNavigator && "share" in navigator && (
            <>
              <span>{" | "}</span>
              <button
                onClick={handleShareClick}
                className="hover:text-orange-500"
              >
                <ArrowUpRightFromSquare size={16} />
              </button>
            </>
          )}
        </h4>

        {storyData.text !== undefined && !isTextCollapsed && (
          <p
            className="user-text break-words "
            dangerouslySetInnerHTML={{ __html: textToRender }}
          />
        )}
      </div>

      <div className="user-text">
        <HnCommentList childComments={comments} depth={0} authorChain={[]} />
      </div>
    </div>
  );
};
