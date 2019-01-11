import request from "common/request";
import {ItemCreateData, ItemCreateResult, ItemDetail, ListItem, ListSearch, ListSummary} from "entity/comment";

export class API {
  public searchList(listSearch: ListSearch) {
    return request<{listItems: ListItem[]; listSummary: ListSummary}>("get", "/ajax/comments", listSearch).then(reslut => {
      reslut.listItems.forEach(item => {
        item.avatarUrl = InitEnv.clientPublicPath + item.avatarUrl;
      });
      return reslut;
    });
  }
  public getItemDetail(id: string) {
    return request<ItemDetail>("get", "/ajax/comments/:id", {id}).then(reslut => {
      reslut.avatarUrl = InitEnv.clientPublicPath + reslut.avatarUrl;
      reslut.repliesList.forEach(item => {
        item.avatarUrl = InitEnv.clientPublicPath + item.avatarUrl;
      });
      return reslut;
    });
  }
  public createItem(item: ItemCreateData) {
    return request<ItemCreateResult>("post", "/ajax/comments", {}, item);
  }
}

export default new API();
