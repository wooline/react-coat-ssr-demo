import request from "common/request";
import {ListItem, ListSearch, ListSummary} from "entity/message";

export class API {
  public searchList(listSearch: ListSearch): Promise<{listItems: ListItem[]; listSummary: ListSummary}> {
    return request("get", "/ajax/messages", listSearch);
  }
}

export default new API();
