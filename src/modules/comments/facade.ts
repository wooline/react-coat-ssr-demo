import {PathData, SearchData, SearchDataOptions} from "entity/comment";
import {ModuleRouterData} from "entity/common";
import {ModuleNames} from "modules/names";
import {exportModule} from "react-coat";
import {ModuleActions, State} from "./model";

export type ModuleState = State;

export default exportModule<ModuleActions>(ModuleNames.comments);

export type ModuleRouter = ModuleRouterData<PathData, SearchDataOptions, {}>;

export const defSearchData: SearchData = {search: {articleId: "", isNewest: false, page: 1, pageSize: 10}};
