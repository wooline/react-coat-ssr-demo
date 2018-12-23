import {defSearch as appDefSearch, ModuleRouter as AppModuleRouter, ModuleState as AppState} from "modules/app/facade";
import {defSearch as commentsDefSearch, ModuleRouter as CommentsModuleRouter, ModuleState as CommentsState} from "modules/comments/facade";
import {defSearch as photosDefSearch, ModuleRouter as PhotosModuleRouter, ModuleState as PhotosState} from "modules/photos/facade";
import {defSearch as videosDefSearch, ModuleRouter as VideosModuleRouter, ModuleState as VideosState} from "modules/videos/facade";
import {RootState as BaseState} from "react-coat";
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
interface SearchData {
  [ModuleNames.app]?: AppModuleRouter["search"];
  [ModuleNames.photos]?: PhotosModuleRouter["search"];
  [ModuleNames.videos]?: VideosModuleRouter["search"];
  [ModuleNames.comments]?: CommentsModuleRouter["search"];
}
interface PathData {
  [ModuleNames.app]?: AppModuleRouter["path"];
  [ModuleNames.photos]?: PhotosModuleRouter["path"];
  [ModuleNames.videos]?: VideosModuleRouter["path"];
  [ModuleNames.comments]?: CommentsModuleRouter["path"];
}
export type RootState = BaseState<{
  views: {[viewName: string]: boolean};
  pathData: PathData;
  searchData: SearchData;
  hashData: {};
}> &
  States;

export type RouterData = RootState["router"];
/* export const defSearch: SearchData = {
  [ModuleNames.app]: appDefSearch,
  [ModuleNames.photos]: photosDefSearch,
  [ModuleNames.videos]: videosDefSearch,
  [ModuleNames.comments]: commentsDefSearch,
}; */
