import { Spinner } from "@blueprintjs/core";
import { History } from "history";
import React from "react";

import { TrueHash } from "./App";
import { HnListItem } from "./HnListItem";

interface HnStoryListProps {
  items: HnItem[];
  readIds: TrueHash;
  history: History;
  isLoading: boolean;
}

const SESSION_SCROLL = "SCROLL_LIST";
export class HnStoryList extends React.Component<HnStoryListProps> {
  constructor(props: HnStoryListProps) {
    super(props);
    this.state = {
      items: [],
    };
  }

  componentDidMount() {
    // TODO: get the types right for this
    const history = this.props.history;
    console.log("story list mount", history);

    if (history.action === "POP") {
      // restore scroll pos if available
      const scrollPos = +sessionStorage.getItem(SESSION_SCROLL)!;

      if (!isNaN(scrollPos)) {
        console.log("fire off scroll", scrollPos);
        window.scrollTo({ top: scrollPos });
      }
    }
  }

  componentWillUnmount() {
    console.log("save scroll pos", window.scrollY);

    sessionStorage.setItem(SESSION_SCROLL, "" + window.scrollY);
  }

  render() {
    document.title = `HN: Offline`;

    if (this.props.items.length === 0 && this.props.isLoading) {
      return (
        <div style={{ marginTop: 20 }}>
          <Spinner size={200} intent="warning" />
        </div>
      );
    }

    return (
      <div>
        {this.props.items
          .filter((story) => story.descendants !== undefined)
          .map((item) => (
            <HnListItem
              data={item}
              key={item.id}
              isRead={this.props.readIds[item.id]}
            />
          ))}
      </div>
    );
  }
}
