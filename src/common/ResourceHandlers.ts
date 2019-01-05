import {Toast} from "antd-mobile";
import {isCur} from "common/routers";
import {equal} from "common/utils";
import {Resource} from "entity/resource";
import {RootState} from "modules";
import {ModuleNames} from "modules/names";
import {BaseModuleHandlers, effect, LOCATION_CHANGE, reducer, RouterState} from "react-coat";
//  mergeSearch, replaceQuery

export default class Handlers<S extends R["State"] = R["State"], R extends Resource = Resource> extends BaseModuleHandlers<S, RootState, ModuleNames> {
  constructor(initState: S, protected config: {api: R["API"]}) {
    super(initState);
  }
  /* @reducer
  protected putListData(listData: R["ListData"]): S {
    return {...this.state, listData};
  }
  @reducer
  protected putItemEditor(itemEditor?: R["ItemEditor"]): S {
    return {...this.state, itemEditor};
  }
  @reducer
  protected putItemDetail(itemDetail: R["ItemDetail"] | undefined): S {
    return {...this.state, itemDetail};
  }
  @reducer
  protected putSelectedIds(selectedIds: string[]): S {
    return {...this.state, selectedIds};
  } */
  @reducer
  public putRouteData(routeData: Partial<S>): S {
    return {...this.state, ...routeData};
  }
  @effect()
  public async searchList(options: R["ListOptions"] = {}) {
    const listSearch: R["ListSearch"] = {...this.state.listSearch!, ...options};
    this.updateState({listSearch} as Partial<S>);
    const {listItems, listSummary} = await this.config.api.searchList(listSearch);
    this.updateState({listItems, listSummary} as Partial<S>);
  }
  @effect()
  public async getItemDetail(itemDetailId: string) {
    this.updateState({itemDetailId} as Partial<S>);
    const arr: Array<Promise<any>> = [this.config.api.getItemDetail!(itemDetailId)];
    if (this.config.api.hitItem) {
      arr.push(this.config.api.hitItem!(itemDetailId));
    }
    const [itemDetail] = await Promise.all(arr);
    this.updateState({itemDetail} as Partial<S>);
  }
  @effect()
  public async createItem(data: R["ItemCreateData"]) {
    const response = await this.config.api.createItem!(data);
    if (!response.error) {
      Toast.info("操作成功");
      this.updateState({itemEditor: undefined} as Partial<S>); // 关闭当前创建窗口
    } else {
      Toast.info(response.error.message);
    }
    return response;
  }
  @effect()
  protected async updateItem(data: R["ItemUpdateData"]) {
    const response = await this.config.api.updateItem!(data);
    if (!response.error) {
      Toast.info("操作成功");
      this.updateState({itemEditor: undefined} as Partial<S>); // 关闭当前创建窗口
      this.searchList(); // 刷新当前页
    } else {
      Toast.info(response.error.message);
    }
    return response;
  }
  @effect()
  protected async deleteItems(ids: string[]) {
    await this.config.api.deleteItems!(ids);
    Toast.info("操作成功");
    this.updateState({selectedIds: []} as any); // 清空当前选中项
    this.searchList(); // 刷新当前页
  }
  @effect(null)
  protected async [LOCATION_CHANGE](router: RouterState) {
    const {views} = this.rootState.router;
    if (isCur(views, this.namespace)) {
      // 因为LOCATION_CHANGE被多个模块监听，但是只有当前模块才需要处理，所以为了性能，不需要监控loading状态，改为parseRouter时监控loading
      // 直接调用this.parseRouter()，将不会触发action，也不会监控loading状态
      this.dispatch(this.callThisAction(this.parseRouter));
    }
  }
  @effect()
  protected async parseRouter() {
    const {views, pathData, wholeSearchData, wholeHashData} = this.rootState.router;
    const modulePathData = pathData[this.namespace as "photos"]!;
    const moduleSearchData = wholeSearchData[this.namespace as "photos"]!;
    const moduleHashData = wholeHashData[this.namespace as "photos"]!;
    const appHashData = wholeHashData[ModuleNames.app]! || {};

    if (isCur(views, this.namespace, "Details" as any)) {
      if (this.state.itemDetailId !== modulePathData.itemId) {
        await this.getItemDetail(modulePathData.itemId!);
      }
    } else if (isCur(views, this.namespace, "List" as any)) {
      if (appHashData.refresh || (appHashData.refresh === null && !equal(this.state.listSearch, moduleSearchData.search))) {
        await this.searchList(moduleSearchData.search);
      }
    }
    return {views, modulePathData, moduleSearchData, moduleHashData};
  }
  protected async onInit() {
    return this.parseRouter();
  }
}
