import request from "common/request";
import {ItemDetail, ListItem, ListSearch, ListSummary} from "entity/photo";

export class API {
  public searchList(listSearch: ListSearch) {
    listSearch = {...listSearch};
    if (!listSearch.title) {
      delete listSearch.title;
    }
    return request<{listItems: ListItem[]; listSummary: ListSummary}>("get", "/ajax/photos", listSearch).then(reslut => {
      reslut.listItems.forEach(item => {
        item.coverUrl = InitEnv.clientPublicPath + item.coverUrl;
      });
      return reslut;
    });
  }
  public getItemDetail(id: string) {
    return request<ItemDetail>("get", "/ajax/photos/:id", {id}).then(reslut => {
      reslut.coverUrl = InitEnv.clientPublicPath + reslut.coverUrl;
      reslut.picList = reslut.picList.map(item => InitEnv.clientPublicPath + item);
      return reslut;
    });
  }
  public hitItem(id: string) {
    return request<void>("post", "/ajax/photos/:id/hit", {id});
  }
}

export default new API();
