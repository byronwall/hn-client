import "./App.css";

import React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { Subscribe } from "unstated";

import { GLOBAL_DATA_LAYER } from ".";
import { DataLayer } from "./DataLayer";
import { Header } from "./Header";
import { HnStoryList } from "./HnStoryList";
import { HnStoryPage } from "./HnStoryPage";

type AppPageProps = RouteComponentProps<{
  page?: string;
  storyId?: string;
  searchTerm?: string;
}>;

enum HnPage {
  STORY_LIST,
  STORY,
}

export enum HnListSource {
  Front,
  Day,
  Week,
  Month,
  Search,
}

export type TrueHash = {
  [key: number]: true;
};

interface AppState {
  activeList: HnListSource;
  activePage: HnPage;
  activeStoryId: number | undefined;
  activeSearchTerm: string;
}

class _App extends React.Component<AppPageProps, AppState> {
  lastOpenTime: number;
  constructor(props: AppPageProps) {
    super(props);

    this.lastOpenTime = Date.now();

    this.state = {
      activeList: HnListSource.Front,
      activeSearchTerm: "",
      activePage: HnPage.STORY_LIST,
      activeStoryId: undefined,
    };

    this.onFocus = this.onFocus.bind(this);
  }
  static getDerivedStateFromProps(
    props: AppPageProps,
    state: AppState
  ): Partial<AppState> {
    let listType: HnListSource;
    let hnPage: HnPage;
    let storyId: number | undefined = undefined;
    let searchTerm = "";

    console.log("props page", props.match.params.page);

    const page =
      props.match.params.storyId === undefined
        ? props.match.params.searchTerm === undefined
          ? props.match.params.page
          : "search"
        : "story";

    console.log(props.match, page);
    switch (page) {
      case "day":
        listType = HnListSource.Day;
        hnPage = HnPage.STORY_LIST;
        break;

      case "week":
        listType = HnListSource.Week;
        hnPage = HnPage.STORY_LIST;
        break;

      case "month":
        listType = HnListSource.Month;
        hnPage = HnPage.STORY_LIST;
        break;

      case "story":
        hnPage = HnPage.STORY;
        storyId = +(props.match.params.storyId ?? "");
        listType = state.activeList;
        break;

      case "search":
        hnPage = HnPage.STORY_LIST;

        listType = HnListSource.Search;
        searchTerm = props.match.params.searchTerm ?? "";
        break;

      default:
        listType = HnListSource.Front;
        hnPage = HnPage.STORY_LIST;
        break;
    }

    console.log("derived state", props.match.params, listType, hnPage, storyId);

    return {
      activeList: listType,
      activePage: hnPage,
      activeStoryId: storyId,
      activeSearchTerm: searchTerm,
    };
  }

  async componentDidMount() {
    const { activePage, activeList, activeSearchTerm } = this.state;
    // ensure that list and story are correct on a direct load
    if (activePage === HnPage.STORY_LIST) {
      if (activeList === HnListSource.Search) {
        GLOBAL_DATA_LAYER.executeSearch(activeSearchTerm);
      } else {
        GLOBAL_DATA_LAYER.updateActiveList(activeList);
      }
    }

    this.lastOpenTime = Date.now();

    window.addEventListener("focus", this.onFocus);
  }

  componentWilUnmount() {
    window.removeEventListener("focus", this.onFocus);
  }

  onFocus() {
    const curTime = Date.now();
    const timeSinceInit = curTime - this.lastOpenTime;
    console.log("time since init", timeSinceInit, this.lastOpenTime, curTime);

    // if it's been more than 1 minute
    if (timeSinceInit > 20 * 1000) {
      console.log(
        "been too long... force reload from local storage in case data changed on other tabs"
      );
      GLOBAL_DATA_LAYER.initializeFromLocalStorage();
    }

    this.lastOpenTime = curTime;
  }

  async componentDidUpdate(prevProps: AppPageProps, prevState: AppState) {
    const { activePage, activeList, activeSearchTerm } = this.state;
    const didPageChange = prevState.activeList !== activeList;
    const didGoFromStoryToList =
      prevState.activePage !== activePage && activePage === HnPage.STORY_LIST;

    const didChangeSearchTerm = activeSearchTerm !== prevState.activeSearchTerm;

    const pageIsSearch = activeList === HnListSource.Search;

    console.log("search did update", didChangeSearchTerm, pageIsSearch);

    if (didChangeSearchTerm && pageIsSearch) {
      GLOBAL_DATA_LAYER.executeSearch(activeSearchTerm);
      return;
    }
    console.log("active list", activeList);
    if (didPageChange || didGoFromStoryToList || didChangeSearchTerm) {
      // load the correct items from the data layer
      GLOBAL_DATA_LAYER.updateActiveList(activeList);
    }
  }

  render() {
    const { activePage, activeSearchTerm, activeStoryId } = this.state;
    const { history } = this.props;
    console.log("app render", window.scrollY);
    return (
      <Subscribe to={[DataLayer]}>
        {(dataLayer: DataLayer) => (
          <div>
            <Header
              requestNewData={this.requestFreshDataFromDataLayer}
              isLoading={dataLayer.state.isLoadingNewData}
              searchTerm={activeSearchTerm}
            />
            {activePage === HnPage.STORY && (
              <HnStoryPage
                id={activeStoryId}
                history={history}
                key={activeStoryId + "-" + dataLayer.state.storyKey}
                onVisitMarker={dataLayer.saveIdToReadList}
              />
            )}
            {activePage === HnPage.STORY_LIST && (
              <HnStoryList
                items={dataLayer.state.activeList}
                readIds={dataLayer.state.readItems}
                isLoading={dataLayer.state.isLoadingNewData}
                history={history}
              />
            )}
          </div>
        )}
      </Subscribe>
    );
  }
  private requestFreshDataFromDataLayer = () => {
    const { activePage, activeList, activeStoryId } = this.state;
    switch (activePage) {
      case HnPage.STORY:
        if (activeStoryId !== undefined) {
          console.log("reloading active story");
          GLOBAL_DATA_LAYER.reloadStoryById(activeStoryId);
        }
        break;
      case HnPage.STORY_LIST:
        console.log("reloading active list");
        GLOBAL_DATA_LAYER.reloadStoryListFromServer(activeList);
        break;
    }
  };
}

export const App = withRouter(_App);
