import ArticleHandlers from "common/ArticleHandlers";
import {ListSearch, Resource, State} from "entity/photo";
export {State} from "entity/photo";
import {ModuleNames} from "modules/names";
import {Actions, effect, exportModel, LoadingState} from "react-coat";
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
        loading: {global: LoadingState.Stop},
        route: {},
      },
      {
        defaultSearch,
        api,
      }
    );
  }
  @effect()
  protected async [ModuleNames.photos + "/INIT"]() {
    await this.dispatch(this.callThisAction(this.searchList));
  }
}

// 导出本模块的Actions
export type ModuleActions = Actions<ModuleHandlers>;

export default exportModel(ModuleNames.photos, ModuleHandlers);
