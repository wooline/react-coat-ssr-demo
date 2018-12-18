import {Toast} from "antd-mobile";
import {isCur} from "common/routers";
import {equal} from "common/utils";
import {Resource} from "entity/resource";
import {RootState} from "modules";
import {ModuleNames} from "modules/names";
import {BaseModuleHandlers, effect, LOCATION_CHANGE, RouterState} from "react-coat";
//  mergeSearch, replaceQuery

export default class Handlers<S extends R["State"] = R["State"], R extends Resource = Resource> extends BaseModuleHandlers<S, RootState, ModuleNames> {
  constructor(initState: S, protected config: {api: R["API"]; defaultSearch: R["ListSearch"]}) {
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
  @effect()
  public async searchList(playload?: {options: R["ListOptional"]; extend: "DEFAULT" | "CURRENT"}) {
    const {options, extend} = playload || {options: {}, extend: "CURRENT"};
    const baseSearch = extend === "DEFAULT" ? this.config.defaultSearch : this.state.listData.search;
    const search: R["ListSearch"] = {...baseSearch, ...options};
    const listData = await this.config.api.searchList(search);
    this.updateState({listData: {...listData, search}} as Partial<S>);
  }
  @effect()
  public async getItemDetail(id: string) {
    const [itemDetail] = await Promise.all([this.config.api.getItemDetail!(id), this.config.api.hitItem!(id)]);
    this.updateState({itemDetail} as Partial<S>);
  }
  @effect()
  protected async createItem(data: R["ItemCreateData"]) {
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
      this.searchList({options: {}, extend: "CURRENT"}); // 刷新当前页
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
    this.searchList({options: {}, extend: "CURRENT"}); // 刷新当前页
  }
  @effect()
  protected async [LOCATION_CHANGE](router: RouterState) {
    await this.parseRouter();
  }
  protected async parseRouter() {
    if (isCur(this.rootState.router.views, this.namespace, "Details" as any)) {
      const itemId = this.state.pathData!.itemId;
      if (!this.state.itemDetail || this.state.itemDetail!.id !== itemId) {
        await this.getItemDetail(itemId!);
      }
    } else if (isCur(this.rootState.router.views, this.namespace, "Main")) {
      const searchData = this.state.searchData || {};
      const search: R["ListSearch"] = {...this.config.defaultSearch, ...searchData.search};
      if (!this.state.listData.items || !equal(search, this.state.listData.search)) {
        await this.searchList({options: search, extend: "CURRENT"});
      }
    }
  }
  protected async onInit() {
    await this.parseRouter();
  }
}
