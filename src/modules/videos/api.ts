import request from "common/request";
import {ListData, ListSearch} from "entity/video";

export class API {
  public searchList(listSearch: ListSearch): Promise<ListData> {
    return request("get", "/ajax/videos", listSearch);
  }
}

export default new API();
