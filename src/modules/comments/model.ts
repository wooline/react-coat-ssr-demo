import ResourceHandlers from "common/ResourceHandlers";
import {CommentResource, ListSearch, State} from "entity/comment";
import {ModuleNames} from "modules/names";
import {Actions, effect, exportModel} from "react-coat";
import api from "./api";
export {State} from "entity/comment";

export const defaultSearch: ListSearch = {
  isNewest: false,
  page: 1,
  pageSize: 10,
};

class ModuleHandlers extends ResourceHandlers<State, CommentResource> {
  constructor() {
    super(
      {
        listData: {
          search: {...defaultSearch},
          items: null,
          summary: null,
        },
      },
      {
        defaultSearch,
        api,
      }
    );
  }
  @effect()
  protected async [ModuleNames.comments + "/INIT"]() {
    await super.onInit();
  }
}

// 导出本模块的Actions
export type ModuleActions = Actions<ModuleHandlers>;

export default exportModel(ModuleNames.comments, ModuleHandlers);
