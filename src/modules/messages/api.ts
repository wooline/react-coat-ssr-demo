import request from "common/request";
import {ListItem, ListSearch, ListSummary} from "entity/message";

export class API {
  public searchList(listSearch: ListSearch) {
    listSearch = {...listSearch};
    if (!listSearch.title) {
      delete listSearch.title;
    }
    return request<{listItems: ListItem[]; listSummary: ListSummary}>("get", "/ajax/messages", listSearch).then(result => {
      result.listItems = result.listItems.map(item => {
        item.date = new Date(item.date);
        return item;
      });
      return result;
    });
  }
}

export default new API();
