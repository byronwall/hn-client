import React from "react";

import { HnComment } from "./HnComment";
import { InfiniteScrollContainer } from "./InfiniteScrollContainer";
import { KidsObj3 } from "@/stores/useDataStore";

interface HnCommentListProps {
  childComments: Array<KidsObj3 | null>;
  depth: number;

  onUpdateOpen(
    id: number,
    newOpen: boolean,
    scrollId: number | undefined,
    comment: KidsObj3 | null,
    nextChildId: number | undefined
  ): void;

  collapsedIds: number[];
  idToScrollTo: number | undefined;
}

export class HnCommentList extends React.Component<HnCommentListProps, {}> {
  childRefs: Array<React.RefObject<HnComment>> = [];

  constructor(props: HnCommentListProps) {
    super(props);
    props.childComments.forEach((item) => {
      if (item === null) {
        return;
      }
      this.childRefs[item.id] = React.createRef();
    });
  }

  handleUpdateOpen: (
    id: number,
    newIsOpen: boolean,
    scrollId: number | undefined,
    comment: KidsObj3 | null,
    nextChildId: number | undefined
  ) => void = (id, newOpen, scrollId, comment, nextChildId) => {
    const { onUpdateOpen } = this.props;

    return onUpdateOpen(
      id,
      newOpen,
      scrollId ?? (newOpen ? comment?.id : nextChildId),
      comment,
      nextChildId
    );
  };

  render() {
    const { childComments, collapsedIds, depth, idToScrollTo } = this.props;

    const validChildren = childComments.filter((comm) => comm !== null);

    if (depth > 0) {
      // do not use infinite scroll for child comments - just render them all
      return validChildren.map((childComm, index) => (
        <div key={childComm!.id}>
          <HnComment
            comment={childComm}
            depth={depth}
            nextChildId={validChildren[index + 1]?.id}
            ref={this.childRefs[childComm!.id]}
            onUpdateOpen={this.handleUpdateOpen}
            isOpen={
              !(
                collapsedIds.findIndex(
                  (c) => childComm !== null && c === childComm.id
                ) >= 0
              )
            }
            collapsedIds={collapsedIds}
            idToScrollTo={idToScrollTo}
          />
        </div>
      ));
    }

    return (
      <InfiniteScrollContainer items={validChildren} itemsToAddOnRefresh={1}>
        {(childComm, index) => {
          if (childComm === null) {
            return null;
          }

          return (
            <div key={childComm.id}>
              <HnComment
                comment={childComm}
                depth={depth}
                nextChildId={validChildren[index + 1]?.id}
                ref={this.childRefs[childComm.id]}
                onUpdateOpen={this.handleUpdateOpen}
                isOpen={
                  !(
                    collapsedIds.findIndex(
                      (c) => childComm !== null && c === childComm.id
                    ) >= 0
                  )
                }
                collapsedIds={collapsedIds}
                idToScrollTo={idToScrollTo}
              />
            </div>
          );
        }}
      </InfiniteScrollContainer>
    );
  }
}
