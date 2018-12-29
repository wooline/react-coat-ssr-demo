import ArticleHandlers from "common/ArticleHandlers";
import {PhotoResource, State} from "entity/photo";
import {ModuleNames} from "modules/names";
import {Actions, effect, exportModel} from "react-coat";
import api from "./api";

export {State} from "entity/photo";

class ModuleHandlers extends ArticleHandlers<State, PhotoResource> {
  constructor() {
    super({}, {api});
  }
  @effect()
  protected async parseRouter() {
    const result = await super.parseRouter();
    this.dispatch(this.callThisAction(this.putRouteData, {showComment: result.moduleSearchData.showComment}));
    return result;
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
