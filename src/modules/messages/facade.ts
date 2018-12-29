import {ModuleRoute} from "entity/common";
import {HashData, PathData, SearchData} from "entity/message";
import {ModuleNames} from "modules/names";
import {exportModule} from "react-coat";
import {ModuleActions, State} from "./model";

export type ModuleState = State;

export default exportModule<ModuleActions>(ModuleNames.messages);

export const defRouteData: ModuleRoute<PathData, SearchData, HashData> = {
  pathData: {},
  searchData: {
    search: {
      title: null,
      page: 1,
      pageSize: 10,
    },
  },
  hashData: {},
};
