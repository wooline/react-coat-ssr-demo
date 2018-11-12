import {ModuleState as AppState} from "modules/app/facade";
import {ModuleState as PhotosState} from "modules/photos/facade";
import {ModuleState as VideosState} from "modules/videos/facade";
import {RootState as State} from "react-coat-pkg";
import {moduleNames} from "./names";

export type RootState = State & {
  [moduleNames.app]: AppState;
  [moduleNames.photos]: PhotosState;
  [moduleNames.videos]: VideosState;
};

export const modules = {
  [moduleNames.app]: () => {
    return import(/* webpackChunkName: "app" */ "modules/app");
  },
  [moduleNames.photos]: () => {
    return import(/* webpackChunkName: "photos" */ "modules/photos");
  },
  [moduleNames.videos]: () => {
    return import(/* webpackChunkName: "videos" */ "modules/videos");
  },
};
