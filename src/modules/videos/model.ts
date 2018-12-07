import ArticleHandlers from "common/ArticleHandlers";
import {ListSearch, Resource, State} from "entity/video";
export {State} from "entity/video";
import {ModuleNames} from "modules/names";
import {Actions, effect, exportModel} from "react-coat";
import api from "./api";

const defaultSearch: ListSearch = {
  title: null,
  page: 1,
  pageSize: 10,
};

class ModuleHandlers extends ArticleHandlers<State, Resource> {
  constructor() {
    super(
      {
        listData: {
          search: {...defaultSearch},
          items: null,
          summary: null,
        },
        query: {},
      },
      {
        defaultSearch,
        api,
      }
    );
  }
  @effect()
  protected async [ModuleNames.videos + "/INIT"]() {
    await this.dispatch(this.callThisAction(this.searchList));
  }
}

// 导出本模块的Actions
export type ModuleActions = Actions<ModuleHandlers>;

export default exportModel(ModuleNames.videos, ModuleHandlers);
