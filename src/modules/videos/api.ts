import request from "common/request";
import {ItemDetail, ListItem, ListSearch, ListSummary} from "entity/video";

export class API {
  public searchList(listSearch: ListSearch): Promise<{listItems: ListItem[]; listSummary: ListSummary}> {
    return request("get", "/ajax/videos", listSearch);
  }
  public getItemDetail(id: string): Promise<ItemDetail> {
    return request("get", "/ajax/videos/:id", {id});
  }
  public hitItem(id: string): Promise<void> {
    return request("post", "/ajax/videos/:id/hit", {id});
  }
}

export default new API();
