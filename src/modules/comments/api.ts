import request from "common/request";
import {ItemCreateData, ItemCreateResult, ItemDetail, ListItem, ListSearch, ListSummary} from "entity/comment";

export class API {
  public searchList(listSearch: ListSearch): Promise<{listItems: ListItem[]; listSummary: ListSummary}> {
    return request("get", "/ajax/comments", listSearch);
  }
  public getItemDetail(id: string): Promise<ItemDetail> {
    return request("get", "/ajax/comments/:id", {id});
  }
  public createItem(item: ItemCreateData): Promise<ItemCreateResult> {
    return request("post", "/ajax/comments", {}, item);
  }
}

export default new API();
