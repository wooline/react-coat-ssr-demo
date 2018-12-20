import request from "common/request";
import {ItemDetail, ListData, ListSearch} from "entity/comment";

export class API {
  public searchList(listSearch: ListSearch): Promise<ListData> {
    return request("get", "/ajax/comments", listSearch);
  }
  public getItemDetail(id: string): Promise<ItemDetail> {
    return request("get", "/ajax/comments/:id", {id});
  }
}

export default new API();
