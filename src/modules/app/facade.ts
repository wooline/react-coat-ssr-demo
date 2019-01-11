import {ModuleRoute} from "entity/common";
import {ModuleNames} from "modules/names";
import {exportModule} from "react-coat";
import {ModuleActions, State} from "./model";

export type ModuleState = State;

export default exportModule<ModuleActions>(ModuleNames.app);

export const defRouteData: ModuleRoute<{}, {showSearch: boolean; showRegisterPop: boolean}, {refresh: boolean | null}> = {
  pathData: {},
  searchData: {showSearch: false, showRegisterPop: false},
  hashData: {
    refresh: null,
  },
};
