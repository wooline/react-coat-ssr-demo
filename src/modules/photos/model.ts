import ArticleHandlers from "common/ArticleHandlers";
import {replaceCurRouter} from "common/routers";
import {ListSearch, Resource, State} from "entity/photo";
import {ModuleNames} from "modules/names";
import {Actions, effect, exportModel} from "react-coat";
import api from "./api";
export {State} from "entity/photo";

export const defaultSearch: ListSearch = {
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
        searchData: {},
        showComment: false,
      },
      {
        defaultSearch,
        api,
      }
    );
  }
  @effect()
  public async showComment(showComment: boolean) {
    this.dispatch(this.routerActions.push(replaceCurRouter(this.rootState.router, ModuleNames.photos, {showComment})));
  }
  @effect()
  protected async [ModuleNames.photos + "/INIT"]() {
    await super.onInit();
  }
}

// 导出本模块的Actions
export type ModuleActions = Actions<ModuleHandlers>;

export default exportModel(ModuleNames.photos, ModuleHandlers);
