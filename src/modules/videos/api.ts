import request from "common/request";
import {ItemDetail, ListItem, ListSearch, ListSummary} from "entity/video";

export class API {
  public searchList(listSearch: ListSearch) {
    listSearch = {...listSearch};
    if (!listSearch.title) {
      delete listSearch.title;
    }
    return request<{listItems: ListItem[]; listSummary: ListSummary}>("get", "/ajax/videos", listSearch).then(reslut => {
      reslut.listItems.forEach(item => {
        item.coverUrl = InitEnv.clientPublicPath + item.coverUrl;
      });
      return reslut;
    });
  }
  public getItemDetail(id: string) {
    return request<ItemDetail>("get", "/ajax/videos/:id", {id}).then(reslut => {
      reslut.coverUrl = InitEnv.clientPublicPath + reslut.coverUrl;
      reslut.videoUrl = InitEnv.clientPublicPath + reslut.videoUrl;
      return reslut;
    });
  }
  public hitItem(id: string) {
    return request<void>("post", "/ajax/videos/:id/hit", {id});
  }
}

export default new API();
