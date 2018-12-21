import {ModuleRouterData} from "entity/common";
import {PathData, SearchData} from "entity/photo";
import {ModuleNames} from "modules/names";
import {exportModule} from "react-coat";
import {ModuleActions, State} from "./model";

export type ModuleState = State;

export default exportModule<ModuleActions>(ModuleNames.photos);

export type ModuleRouter = ModuleRouterData<PathData, SearchData, {}>;

export const defSearch: SearchData = {
  search: {
    title: null,
    page: 1,
    pageSize: 10,
  },
  showComment: false,
};
