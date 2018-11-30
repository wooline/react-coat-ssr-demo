import request from "common/request";
import {ListData, ListSearch} from "entity/photo";

export class API {
  public searchList(listSearch: ListSearch): Promise<ListData> {
    return request("get", "/ajax/photos", listSearch);
  }
}

export default new API();
