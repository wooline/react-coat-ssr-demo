import ResourceHandlers from "common/ResourceHandlers";
import {MessageResource, State} from "entity/message";
import {ModuleNames} from "modules/names";
import {Actions, effect, exportModel} from "react-coat";
import api from "./api";

export {State} from "entity/message";

const initState: State = {};

class ModuleHandlers extends ResourceHandlers<State, MessageResource> {
  constructor(init: State) {
    super(init, {api});
  }
  @effect()
  protected async [ModuleNames.messages + "/INIT"]() {
    await super.onInit();
  }
}

// 导出本模块的Actions
export type ModuleActions = Actions<ModuleHandlers>;

export default exportModel(ModuleNames.messages, ModuleHandlers, initState);
