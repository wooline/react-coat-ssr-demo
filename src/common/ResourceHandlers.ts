import {Toast} from "antd-mobile";
import {equal} from "common/utils";
import {Resource} from "entity/resource";
import {RootState} from "modules";
import {ModuleNames} from "modules/names";
import {BaseModuleHandlers, effect, VIEW_INVALID} from "react-coat";

export default class Handlers<R extends Resource = Resource, S extends R["State"] = R["State"]> extends BaseModuleHandlers<S, RootState, ModuleNames> {
  constructor(initState: S, protected config: {api: R["API"]}) {
    super(initState);
  }
  @effect()
  public async searchList(options: R["ListOptions"] = {}) {
    const listSearch: R["ListSearch"] = {...this.state.listSearch!, ...options};
    const {listItems, listSummary} = await this.config.api.searchList(listSearch);
    this.updateState({listSearch, listItems, listSummary} as Partial<S>);
  }
  @effect()
  public async getItemDetail(itemDetailId: string) {
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
  protected async [VIEW_INVALID]() {
    const views = this.rootState.views;
    if (views[this.namespace]) {
      this.parseRouter();
    }
  }

  protected async parseRouter() {
    const {views, pathData, wholeSearchData, wholeHashData} = this.rootState.router;
    const modulePathData = pathData[this.namespace as "photos"]!; // 以photos为例
    const moduleSearchData = wholeSearchData[this.namespace as "photos"]!;
    const moduleHashData = wholeHashData[this.namespace as "photos"]!;
    const appHashData = wholeHashData.app!;

    if (views[this.namespace as "photos"]!.Details) {
      if (appHashData.refresh || (appHashData.refresh === null && (!this.state.itemDetail || this.state.itemDetail.id !== modulePathData.itemId))) {
        await this.dispatch(this.actions.getItemDetail(modulePathData.itemId!));
      }
    } else {
      if (appHashData.refresh || (appHashData.refresh === null && !equal(this.state.listSearch, moduleSearchData.search))) {
        await this.dispatch(this.actions.searchList(moduleSearchData.search));
      }
    }
    return {views, modulePathData, moduleSearchData, moduleHashData};
  }

  /*  VIEW_INVALID action是由view派发的，在服务器渲染时无法监听到，所以需要主动调用  */
  protected async onInit() {
    return this.parseRouter();
  }
}
