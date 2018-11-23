import {ModuleState as AppState} from "modules/app/facade";
import {ModuleState as PhotosState} from "modules/photos/facade";
import {ModuleState as VideosState} from "modules/videos/facade";
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
};

export type RootState = BaseState & {
  [ModuleNames.app]: AppState;
  [ModuleNames.photos]: PhotosState;
  [ModuleNames.videos]: VideosState;
};
