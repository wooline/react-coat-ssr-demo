import {ModuleRoute} from "entity/common";
import {HashData, PathData, SearchData} from "entity/video";
import {ModuleNames} from "modules/names";
import {exportModule} from "react-coat";
import {ModuleActions, State} from "./model";

export type ModuleState = State;

export default exportModule<ModuleActions>(ModuleNames.videos);

export const defRouteData: ModuleRoute<PathData, SearchData, HashData> = {
  pathData: {},
  searchData: {
    search: {
      title: "",
      page: 1,
      pageSize: 10,
    },
  },
  hashData: {},
};
