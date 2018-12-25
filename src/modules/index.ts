import {DeepPartial} from "entity/common";
import {defRouteData as appDefRoute, ModuleState as AppState} from "modules/app/facade";
import {defRouteData as commentsDefRoute, ModuleState as CommentsState} from "modules/comments/facade";
import {defRouteData as photosDefRoute, ModuleState as PhotosState} from "modules/photos/facade";
import {RootState as BaseState, RouterState} from "react-coat";
import {ModuleNames} from "./names";

export const ModuleGetter = {
  [ModuleNames.app]: () => {
    return import(/* webpackChunkName: "app" */ "modules/app");
  },
  [ModuleNames.photos]: () => {
    return import(/* webpackChunkName: "photos" */ "modules/photos");
  },
  [ModuleNames.comments]: () => {
    return import(/* webpackChunkName: "comments" */ "modules/comments");
  },
};

interface States {
  [ModuleNames.app]: AppState;
  [ModuleNames.photos]: PhotosState;
  [ModuleNames.comments]: CommentsState;
}

export type RootState = BaseState<
  RouterState & {
    views: {[moduleName: string]: {[viewName: string]: boolean}};
    pathData: {[M in keyof States]?: States[M]["pathData"]};
    searchData: {[M in keyof States]?: DeepPartial<States[M]["searchData"]>};
    hashData: {[M in keyof States]?: DeepPartial<States[M]["hashData"]>};
    wholeSearchData: {[M in keyof States]?: States[M]["searchData"]};
    wholeHashData: {[M in keyof States]?: States[M]["hashData"]};
  }
> &
  States;

export type RouterData = RootState["router"];

export const defSearch = {
  [ModuleNames.photos]: photosDefRoute.searchData,
  [ModuleNames.comments]: commentsDefRoute.searchData,
};
export const defHash = {
  [ModuleNames.app]: appDefRoute.hashData,
  [ModuleNames.photos]: photosDefRoute.hashData,
  [ModuleNames.comments]: commentsDefRoute.hashData,
};
