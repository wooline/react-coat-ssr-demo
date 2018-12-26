import {DeepPartial} from "entity/common";
import {defRouteData as appDefRouteData, ModuleState as AppState} from "modules/app/facade";
import {defRouteData as commentsDefRouteData, ModuleState as CommentsState} from "modules/comments/facade";
import {defRouteData as photosDefRouteData, ModuleState as PhotosState} from "modules/photos/facade";
import {defRouteData as videosDefRouteData, ModuleState as VideosState} from "modules/videos/facade";
import {RootState as BaseState, RouterState} from "react-coat";
import {ModuleNames} from "./names";

export const ModuleGetter = {
  [ModuleNames.app]: () => {
    return import(/* webpackChunkName: "app" */ "modules/app");
  },
  [ModuleNames.photos]: () => {
    return import(/* webpackChunkName: "photos" */ "modules/photos");
  },
  [ModuleNames.videos]: () => {
    return import(/* webpackChunkName: "videos" */ "modules/videos");
  },
  [ModuleNames.comments]: () => {
    return import(/* webpackChunkName: "comments" */ "modules/comments");
  },
};

interface States {
  [ModuleNames.app]: AppState;
  [ModuleNames.photos]: PhotosState;
  [ModuleNames.videos]: VideosState;
  [ModuleNames.comments]: CommentsState;
}

export const defRouteData = {
  [ModuleNames.app]: appDefRouteData,
  [ModuleNames.photos]: photosDefRouteData,
  [ModuleNames.videos]: videosDefRouteData,
  [ModuleNames.comments]: commentsDefRouteData,
};
type RouteData = typeof defRouteData;
type RouteDataOptions = {[k in keyof RouteData]: DeepPartial<RouteData[k]>};

export type RootState = BaseState<
  RouterState & {
    views: {[moduleName: string]: {[viewName: string]: boolean}};
    pathData: {[M in keyof RouteData]?: RouteData[M]["pathData"]};
    searchData: {[M in keyof RouteDataOptions]?: RouteDataOptions[M]["searchData"]};
    hashData: {[M in keyof RouteDataOptions]?: RouteDataOptions[M]["hashData"]};
    wholeSearchData: {[M in keyof RouteData]?: RouteData[M]["searchData"]};
    wholeHashData: {[M in keyof RouteData]?: RouteData[M]["hashData"]};
  }
> &
  States;

export type RouterData = RootState["router"];
