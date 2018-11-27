import {PhotoList, PhotoListFilter, PhotoListItem} from "entity/photo";
import {RootState} from "modules";
import {ModuleNames} from "modules/names";
import {Actions, BaseModuleHandlers, BaseModuleState, effect, exportModel, reducer} from "react-coat";
import api from "./api";

const defaultFilter: PhotoListFilter = {
  title: "",
};
// 定义本模块的State
export interface State extends BaseModuleState {
  tableList: PhotoList | null;
  curItem: PhotoListItem | null;
}

// 定义本模块的Handlers
class ModuleHandlers extends BaseModuleHandlers<State, RootState> {
  constructor() {
    // 定义本模块State的初始值
    const initState: State = {
      tableList: null,
      curItem: null,
      loading: {},
    };
    super(initState);
  }
  @reducer
  public putCurItem(curItem: PhotoListItem): State {
    return {...this.state, curItem};
  }
  @reducer
  public putTableList(tableList: PhotoList): State {
    return {...this.state, tableList};
  }
  @effect()
  public async getTableList(filter: Partial<PhotoListFilter>) {
    const request = {...defaultFilter, ...filter};
    const tableList = await api.getPhotoList(request);
    this.dispatch(this.callThisAction(this.putTableList, tableList));
  }
  @effect()
  protected async [ModuleNames.photos + "/INIT"]() {
    await this.dispatch(this.callThisAction(this.getTableList, {}));
  }
}

// 导出本模块的Actions
export type ModuleActions = Actions<ModuleHandlers>;

export default exportModel(ModuleNames.photos, ModuleHandlers);
