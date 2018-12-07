import {Toast} from "antd-mobile";
import {extendSearch, isCur, mergeSearch} from "common/routers";
import {equal} from "common/utils";
import {Resource} from "entity/resource";
import {RootState} from "modules";
import {ModuleNames} from "modules/names";
import {BaseModuleHandlers, effect, LOCATION_CHANGE, reducer, RouterState} from "react-coat";

export default class Handlers<S extends R["State"], R extends Resource> extends BaseModuleHandlers<S, RootState> {
  constructor(initState: S, protected config: {api: R["API"]; defaultSearch: R["ListSearch"]}) {
    super(initState);
  }

  @reducer
  protected putListData(listData: R["ListData"]): S {
    return {...this.state, listData};
  }
  @reducer
  protected putItemEditor(itemEditor?: R["ItemEditor"]): S {
    return {...this.state, itemEditor};
  }
  @reducer
  protected putItemDetail(itemDetail: R["ItemDetail"]): S {
    return {...this.state, itemDetail};
  }
  @reducer
  protected putSelectedIds(selectedIds: string[]): S {
    return {...this.state, selectedIds};
  }
  @effect(null)
  public async openList({options, extend}: {options: R["ListOptional"]; extend: "DEFAULT" | "CURRENT"}) {
    const search = mergeSearch(options, extend === "DEFAULT" ? this.config.defaultSearch : this.state.listData.search);
    this.dispatch(this.routerActions.push(extendSearch(this.namespace as ModuleNames, this.rootState.router, search)));
  }
  @effect()
  public async searchList(playload?: {options: R["ListOptional"]; extend: "DEFAULT" | "CURRENT"}) {
    const {options, extend} = playload || {options: {}, extend: "CURRENT"};
    const baseSearch = extend === "DEFAULT" ? this.config.defaultSearch : this.state.listData.search;
    const search: R["ListSearch"] = {...baseSearch, ...options};
    const listData = await this.config.api.searchList(search);
    this.dispatch(this.callThisAction(this.putListData, listData));
    return listData;
  }
  @effect()
  protected async getItemDetail(id: string) {
    const itemDetail = await this.config.api.getItem!(id);
    this.dispatch(this.callThisAction(this.putItemDetail, itemDetail));
    this.config.api.hitItem!(id);
  }
  @effect()
  protected async createItem(data: R["ItemCreateData"]) {
    const response = await this.config.api.createItem!(data);
    if (!response.error) {
      Toast.info("操作成功");
      this.dispatch(this.callThisAction(this.putItemEditor)); // 关闭当前创建窗口
      this.dispatch(this.callThisAction(this.openList, {options: {page: 1}, extend: "DEFAULT"})); // 返回第一页
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
      this.dispatch(this.callThisAction(this.putItemEditor)); // 关闭当前创建窗口
      this.dispatch(this.callThisAction(this.searchList, {options: {}, extend: "CURRENT"})); // 刷新当前页
    } else {
      Toast.info(response.error.message);
    }
    return response;
  }
  @effect()
  protected async deleteItems(ids: string[]) {
    await this.config.api.deleteItems!(ids);
    Toast.info("操作成功");
    this.dispatch(this.callThisAction(this.putSelectedIds, [])); // 清空当前选中项
    this.dispatch(this.callThisAction(this.searchList, {options: {}, extend: "CURRENT"})); // 刷新当前页
  }
  @effect(null)
  protected async [LOCATION_CHANGE](router: RouterState) {
    if (isCur(router.location.pathname, this.namespace as ModuleNames)) {
      const routeData = this.state.query || {};
      const search: R["ListSearch"] = {...this.config.defaultSearch, ...routeData.search};
      if (!equal(search, this.state.listData.search)) {
        this.dispatch(this.callThisAction(this.searchList, {options: search, extend: "CURRENT"}));
      }
    }
  }
  protected async onInit() {
    const routeData = this.state.query || {};
    const search: R["ListSearch"] = {...this.config.defaultSearch, ...routeData.search};
    await this.dispatch(this.callThisAction(this.searchList, {options: search, extend: "CURRENT"}));
  }
}
