import request from "common/request";
import {PhotoList, PhotoListFilter} from "entity/photo";

export class API {
  public getPhotoList(filter: PhotoListFilter): Promise<PhotoList> {
    return request<PhotoList>("get", "/ajax/photos", filter);
  }
}

export default new API();
