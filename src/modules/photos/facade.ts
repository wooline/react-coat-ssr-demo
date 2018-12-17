import {ListSearch} from "entity/photo";
import {ModuleNames} from "modules/names";
import {exportModule} from "react-coat";
import {ModuleActions, State} from "./model";

export type ModuleState = State;

export const defaultSearch: ListSearch = {
  title: null,
  page: 1,
  pageSize: 10,
};

export default exportModule<ModuleActions>(ModuleNames.photos);
