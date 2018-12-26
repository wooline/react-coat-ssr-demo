import {HashData, PathData, SearchData} from "entity/comment";
import {ModuleRoute} from "entity/common";
import {ModuleNames} from "modules/names";
import {exportModule} from "react-coat";
import {ModuleActions, State} from "./model";

export type ModuleState = State;

export default exportModule<ModuleActions>(ModuleNames.comments);

export const defRouteData: ModuleRoute<PathData, SearchData, HashData> = {
  pathData: {type: ModuleNames.photos, typeId: ""},
  searchData: {
    search: {articleId: "", isNewest: false, page: 1, pageSize: 10},
  },
  hashData: {},
};
