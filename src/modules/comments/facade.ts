import {PathData, SearchData} from "entity/comment";
import {ModuleRouterData} from "entity/common";
import {ModuleNames} from "modules/names";
import {exportModule} from "react-coat";
import {ModuleActions, State} from "./model";

export type ModuleState = State;

export default exportModule<ModuleActions>(ModuleNames.comments);

export type ModuleSearchData = SearchData;
export type ModulePathData = PathData;

export const defSearch: SearchData = {
  search: {articleId: "", isNewest: false, page: 1, pageSize: 10},
};
export type ModuleRouter = ModuleRouterData<PathData, SearchData, {}>;
