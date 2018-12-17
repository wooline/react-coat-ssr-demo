import {ListSearch} from "entity/comment";
import {ModuleNames} from "modules/names";
import {exportModule} from "react-coat";
import {ModuleActions, State} from "./model";

export type ModuleState = State;

export const defaultSearch: ListSearch = {
  articleId: "",
  isNewest: false,
  page: 1,
  pageSize: 10,
};

export default exportModule<ModuleActions>(ModuleNames.comments);
