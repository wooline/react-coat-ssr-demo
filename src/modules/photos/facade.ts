import {exportModule} from "react-coat-pkg";
import {NAMESPACE} from "./exportNames";
import {ModuleActions, ModuleState} from "./model";

// 导出本模块State数据格式
export interface State {
  [NAMESPACE]: ModuleState;
}

export default exportModule<ModuleActions>(NAMESPACE);
