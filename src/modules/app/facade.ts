import {ModuleRoute} from "entity/common";
import {ModuleNames} from "modules/names";
import {exportModule} from "react-coat";
import {ModuleActions, State} from "./model";

export type ModuleState = State;

export default exportModule<ModuleActions>(ModuleNames.app);

export const defRouteData: ModuleRoute<{}, {}, {showSearch: boolean; showLoginPop: boolean; showRegisterPop: boolean}> = {
  pathData: {},
  searchData: {},
  hashData: {
    showSearch: false,
    showLoginPop: false,
    showRegisterPop: false,
  },
};
