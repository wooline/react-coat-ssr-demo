import ArticleHandlers from "common/ArticleHandlers";
import {State, VideoResource} from "entity/video";
import {ModuleNames} from "modules/names";
import {Actions, effect, exportModel} from "react-coat";
import api from "./api";

export {State} from "entity/video";

class ModuleHandlers extends ArticleHandlers<State, VideoResource> {
  constructor() {
    super({}, {api});
  }
  @effect()
  protected async [ModuleNames.videos + "/INIT"]() {
    await super.onInit();
  }
}

// 导出本模块的Actions
export type ModuleActions = Actions<ModuleHandlers>;

export default exportModel(ModuleNames.videos, ModuleHandlers);
