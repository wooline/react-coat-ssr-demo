import request from "common/request";
import {ItemDetail, ListData, ListSearch} from "entity/photo";

export class API {
  public searchList(listSearch: ListSearch): Promise<ListData> {
    return request("get", "/ajax/photos", listSearch);
  }
  public getItemDetail(id: string): Promise<ItemDetail> {
    return request("get", "/ajax/photos/:id", {id});
  }
  public hitItem(id: string): Promise<void> {
    return request("post", "/ajax/photos/:id/hit", {id});
  }
}

export default new API();
