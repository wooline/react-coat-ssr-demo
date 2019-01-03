import ResourceHandlers from "common/ResourceHandlers";
import {CommentResource, State} from "entity/comment";
import {ModuleNames} from "modules/names";
import {Actions, effect, exportModel} from "react-coat";
import api from "./api";
export {State} from "entity/comment";

class ModuleHandlers extends ResourceHandlers<State, CommentResource> {
  constructor() {
    super({}, {api});
  }
  @effect()
  protected async [ModuleNames.comments + "/INIT"]() {
    await super.onInit();
  }
}

// 导出本模块的Actions
export type ModuleActions = Actions<ModuleHandlers>;

export default exportModel(ModuleNames.comments, ModuleHandlers);
