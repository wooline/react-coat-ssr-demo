import {Toast} from "antd-mobile";
import {isCur} from "common/routers";
import {equal} from "common/utils";
import {Resource} from "entity/resource";
import {RootState} from "modules";
import {ModuleNames} from "modules/names";
import {BaseModuleHandlers, effect, LOCATION_CHANGE, RouterState} from "react-coat";
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
  @effect()
  public async searchList(options: R["ListOptions"] = {}) {
    const listSearch: R["ListSearch"] = {...this.state.listSearch, ...options};
    const {listItems, listSummary} = await this.config.api.searchList(listSearch);
    this.updateState({listSearch, listItems, listSummary} as Partial<S>);
  }
  @effect()
  public async getItemDetail(id: string) {
    const arr: Array<Promise<any>> = [this.config.api.getItemDetail!(id)];
    if (this.config.api.hitItem) {
      arr.push(this.config.api.hitItem!(id));
    }
    const [itemDetail] = await Promise.all(arr);
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
  @effect()
  protected async [LOCATION_CHANGE](router: RouterState) {
    await this.parseRouter();
  }

  protected async parseRouter() {
    if (this.rootState.router.views[this.namespace]) {
      const searchData = this.rootState.router.fullSearchData[this.namespace];
      this.updateState({searchData} as Partial<S>);
    }
    const {views, pathData} = this.rootState.router;
    const modulePathData = pathData[this.namespace as ModuleNames.photos];

    if (isCur(views, this.namespace, "Details" as any)) {
      const itemId = modulePathData!.itemId;
      if (!this.state.itemDetail || this.state.itemDetail!.id !== itemId) {
        await this.getItemDetail(itemId!);
      }
    } else if (isCur(views, this.namespace, "List" as any)) {
      if (!this.state.listItems || !equal(this.state.searchData.search, this.state.listSearch)) {
        await this.searchList(this.state.searchData.search);
      }
    }
  }
  protected async onInit() {
    await this.parseRouter();
  }
}
