import { History } from "history";
import React from "react";

import { DataLayer } from "./DataLayer";
import { getDomain } from "./getDomain";
import { HnComment } from "./HnComment";
import { timeSince } from "./timeSince";

interface HnStoryPageState {
  data: HnItem | undefined;
}

export interface HnStoryPageProps {
  dataLayer: DataLayer | null;
  id: number;
  history: History;
}

export class HnStoryPage extends React.Component<
  HnStoryPageProps,
  HnStoryPageState
> {
  constructor(props: HnStoryPageProps) {
    super(props);

    this.state = {
      data: undefined
    };

    this.anchorClickHandler = this.anchorClickHandler.bind(this);
  }

  render() {
    if (this.state.data === undefined) {
      return null;
    }

    const storyData = this.state.data;

    const comments = storyData.kidsObj || [];
    return (
      <div>
        <h2>
          <a href={storyData.url}>{storyData.title}</a>
        </h2>
        <h4>
          <span>{storyData.by}</span>
          <span>{" | "}</span>
          <span>{storyData.score}</span>
          <span>{" | "}</span>
          <span>{timeSince(storyData.time)} ago</span>
          <span>{" | "}</span>
          <span>{getDomain(storyData.url)}</span>
        </h4>
        {storyData.text !== undefined && (
          <p
            className="top-text"
            dangerouslySetInnerHTML={{ __html: storyData.text }}
          />
        )}

        {comments.map(comment => (
          <HnComment
            key={(comment || { id: 0 }).id}
            comment={comment}
            depth={0}
            canExpand={true}
          />
        ))}
      </div>
    );
  }

  componentDidMount() {
    window.scrollTo(0, 0);

    // set the data initially -- kick off async request if needed
    this.updateDataFromDataLayer();
    document.body.addEventListener("click", this.anchorClickHandler);
  }

  componentWillUnmount() {
    document.body.removeEventListener("click", this.anchorClickHandler);
  }
  anchorClickHandler(e: any) {
    if (e.target.tagName !== "A") {
      return;
    }

    // have a link

    const link = e.target as HTMLAnchorElement;

    const regex = /https?:\/\/news\.ycombinator\.com\/item\?id=(\d+)/;
    const matches = link.href.match(regex);

    if (matches === null) {
      return;
    }

    // this will navigate to the new page
    this.props.history.push("/story/" + matches[1]);

    e.preventDefault();
    return false;
  }

  private async updateDataFromDataLayer() {
    const storyData = await this.getStoryData(this.props.id);

    this.setState({ data: storyData });
  }

  componentDidUpdate(prevProps: HnStoryPageProps) {
    // load the story once the data layer is available
    if (prevProps.dataLayer === null && this.props.dataLayer !== null) {
      this.updateDataFromDataLayer();
    }
  }

  private async getStoryData(id: number): Promise<HnItem | undefined> {
    return this.props.dataLayer === null
      ? undefined
      : await this.props.dataLayer.getStoryData(id);
  }
}
