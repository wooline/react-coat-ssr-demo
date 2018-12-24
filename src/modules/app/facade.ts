import {ModuleRouterData} from "entity/common";
import {ModuleNames} from "modules/names";
import {exportModule} from "react-coat";
import {ModuleActions, State} from "./model";

export type ModuleState = State;

export default exportModule<ModuleActions>(ModuleNames.app);

export type ModuleRouter = ModuleRouterData<{}, {}, {}>;

export const defSearchData = {};
