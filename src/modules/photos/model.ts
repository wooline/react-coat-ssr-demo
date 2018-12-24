import ArticleHandlers from "common/ArticleHandlers";
import {PhotoResource, State} from "entity/photo";
import {ModuleNames} from "modules/names";
import {Actions, effect, exportModel} from "react-coat";
import api from "./api";
import {defSearchData} from "./facade";

export {State} from "entity/photo";

class ModuleHandlers extends ArticleHandlers<State, PhotoResource> {
  constructor() {
    super(
      {
        listSearch: defSearchData.search,
        searchData: defSearchData,
      },
      {
        api,
      }
    );
  }
  @effect()
  protected async [ModuleNames.photos + "/INIT"]() {
    await super.onInit();
    this.inited();
  }
}

// 导出本模块的Actions
export type ModuleActions = Actions<ModuleHandlers>;

export default exportModel(ModuleNames.photos, ModuleHandlers);
