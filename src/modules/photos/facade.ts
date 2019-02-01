import {ModuleRoute} from "entity/common";
import {HashData, PathData, SearchData} from "entity/photo";
import {ModuleNames} from "modules/names";
import {exportModule} from "react-coat";
import {ModuleActions, State} from "./model";

export type ModuleState = State;

export default exportModule<ModuleActions>(ModuleNames.photos);

export const defRouteData: ModuleRoute<PathData, SearchData, HashData> = {
  pathData: {},
  searchData: {
    search: {
      title: "",
      page: 1,
      pageSize: 10,
    },
    showComment: false,
  },
  hashData: {},
};
