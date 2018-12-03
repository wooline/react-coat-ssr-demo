import {Toast} from "antd-mobile";
import {pushQuery} from "common/request";
import {Resource} from "entity/resource";
import {RootState} from "modules";
import {BaseModuleHandlers, effect, reducer} from "react-coat";

export default class Handlers<S extends R["State"], R extends Resource> extends BaseModuleHandlers<S, RootState> {
  constructor(initState: S, protected config: {api: R["API"]; defaultSearch: R["ListSearch"]}) {
    super(initState);
  }

  @reducer
  protected putListData(listData: R["ListData"]): S {
    return {...(this.state as any), listData};
  }
  @reducer
  protected putItemEditor(itemEditor?: R["ItemEditor"]): S {
    return {...(this.state as any), itemEditor};
  }
  @reducer
  protected putItemDetail(itemDetail: R["ItemDetail"]): S {
    return {...(this.state as any), itemDetail};
  }
  @reducer
  protected putSelectedIds(selectedIds: string[]): S {
    return {...(this.state as any), selectedIds};
  }
  @effect()
  public async openList({options, extend}: {options: R["ListOptional"]; extend: "DEFAULT" | "CURRENT"}) {
    const defaultSearch = this.config.defaultSearch;
    const baseSearch = extend === "DEFAULT" ? defaultSearch : this.state.listData.search;
    const search: R["ListSearch"] = {...(baseSearch as any), ...(options as any)};
    /* 过滤与默认值相等的参数 */
    const parms = Object.keys(search).reduce((prev, cur) => {
      if (typeof search[cur] === "object") {
        if (JSON.stringify(search[cur]) !== JSON.stringify(defaultSearch[cur])) {
          prev[cur] = search[cur];
        }
      } else {
        if (search[cur] !== defaultSearch[cur]) {
          prev[cur] = search[cur];
        }
      }
      return prev;
    }, {});
    this.dispatch(this.routerActions.push(pushQuery(this.namespace, "listOptional", parms, this.rootState.router.location.search)));
  }
  @effect()
  public async searchList(playload?: {options: R["ListOptional"]; extend: "DEFAULT" | "CURRENT"}) {
    const {options, extend} = playload || {options: {}, extend: "CURRENT"};
    const baseSearch = extend === "DEFAULT" ? this.config.defaultSearch : this.state.listData.search;
    const search: R["ListSearch"] = {...(baseSearch as any), ...(options as any)};
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

  /* @effect()
  protected async [LOCATION_CHANGE](router: RouterState) {
    if (router.location.pathname === this.config.pathname) {
      const {listOptional} = this.parseRouter(router.location.search);
      // merge 默认参数
      const listSearch: R["ListSearch"] = {...(this.config.defaultSearch as any), ...(listOptional as any)};
      if (!equal(listSearch, this.state.listData.search)) {
        this.dispatch(this.callThisAction(this.searchList, {options: listSearch, extend: "CURRENT"}));
      }
    }
  } */
}
