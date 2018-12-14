import request from "common/request";
import {ListData, ListSearch} from "entity/comment";

export class API {
  public searchList(listSearch: ListSearch): Promise<ListData> {
    return request("get", "/ajax/comments", listSearch);
  }
}

export default new API();
