import {HashData, SearchData} from "entity/comment";
import {ModuleNames} from "modules/names";
import {exportModule} from "react-coat";
import {ModuleActions, State} from "./model";

export type ModuleState = State;

export default exportModule<ModuleActions>(ModuleNames.comments);

export const defRouteData: {searchData: SearchData; hashData: HashData} = {
  searchData: {
    search: {articleId: "", isNewest: false, page: 1, pageSize: 10},
  },
  hashData: {},
};
