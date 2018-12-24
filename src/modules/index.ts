import {defSearchData as appDefSearch, ModuleRouter as AppModuleRouter, ModuleState as AppState} from "modules/app/facade";
import {defSearchData as commentsDefSearch, ModuleRouter as CommentsModuleRouter, ModuleState as CommentsState} from "modules/comments/facade";
import {defSearchData as photosDefSearch, ModuleRouter as PhotosModuleRouter, ModuleState as PhotosState} from "modules/photos/facade";
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
interface SearchData {
  [ModuleNames.app]?: AppModuleRouter["search"];
  [ModuleNames.photos]?: PhotosModuleRouter["search"];
  [ModuleNames.comments]?: CommentsModuleRouter["search"];
}
interface PathData {
  [ModuleNames.app]?: AppModuleRouter["path"];
  [ModuleNames.photos]?: PhotosModuleRouter["path"];
  [ModuleNames.comments]?: CommentsModuleRouter["path"];
}
export type RootState = BaseState<
  RouterState & {
    views: {[moduleName: string]: {[viewName: string]: boolean}};
    pathData: PathData;
    searchData: SearchData;
    fullSearchData: SearchData;
    hashData: {};
  }
> &
  States;

export type RouterData = RootState["router"];

export const defSearch: SearchData = {
  [ModuleNames.app]: appDefSearch,
  [ModuleNames.photos]: photosDefSearch,
  [ModuleNames.comments]: commentsDefSearch,
};
