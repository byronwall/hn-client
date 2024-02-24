import React from "react";

import { TrueHash } from "@/app/stores/useDataStore";
import { HnStorySummary } from "@/app/stores/useDataStore";
import { HnListItem } from "./HnListItem";

interface HnStoryListProps {
  items: HnStorySummary[];
  readIds: TrueHash;
}

const SESSION_SCROLL = "SCROLL_LIST";
export class HnStoryList extends React.PureComponent<HnStoryListProps> {
  constructor(props: HnStoryListProps) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.scrollToPrevious();
  }

  private scrollToPrevious() {
    // if (history.action === "POP") {
    //   // restore scroll pos if available
    //   const scrollPos = +sessionStorage.getItem(SESSION_SCROLL)!;
    //   if (!isNaN(scrollPos)) {
    //     console.log("fire off scroll", scrollPos);
    //     window.scrollTo({ top: scrollPos });
    //   }
    // }
  }

  componentWillUnmount() {
    console.log("save scroll pos", window.scrollY);

    sessionStorage.setItem(SESSION_SCROLL, "" + window.scrollY);
  }

  render() {
    const { items, readIds } = this.props;

    document.title = `HN: Offline`;

    return (
      <div>
        <div id="list-holder" className="flex flex-col gap-2">
          {items.map((item) => (
            <HnListItem data={item} key={item.id} isRead={readIds[item.id]} />
          ))}
        </div>
      </div>
    );
  }
}
