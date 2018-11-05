import RootState from "core/RootState";
import {PhotoList, PhotoListFilter, PhotoListItem} from "entity/photo";
import {Actions, BaseModuleHandlers, BaseModuleState, effect, exportModel, loading, reducer} from "react-coat-pkg";
import api from "./api";
import {NAMESPACE} from "./exportNames";

// 定义本模块的State
export interface ModuleState extends BaseModuleState {
  tableList: PhotoList;
  curItem: PhotoListItem;
}

// 定义本模块的Handlers
class ModuleHandlers extends BaseModuleHandlers<ModuleState, RootState> {
  constructor() {
    // 定义本模块State的初始值
    const initState: ModuleState = {
      tableList: null,
      curItem: null,
      loading: null,
    };
    super(initState);
  }
  @reducer
  public putCurItem(curItem: PhotoListItem): ModuleState {
    return {...this.state, curItem};
  }
  @reducer
  public putTableList(tableList: PhotoList): ModuleState {
    return {...this.state, tableList};
  }
  @loading()
  @effect
  public async getTableList(filter: PhotoListFilter) {
    const tableList = await api.getPhotoList(filter);
    this.dispatch(this.callThisAction(this.putTableList, tableList));
  }
  @loading() // 使用全局loading状态
  @effect
  protected async [NAMESPACE + "/INIT"]() {
    await this.dispatch(this.callThisAction(this.getTableList, null));
  }
}

// 导出本模块的Actions
export type ModuleActions = Actions<ModuleHandlers>;

export default exportModel(NAMESPACE, ModuleHandlers);
