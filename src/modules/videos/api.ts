import {PhotoList, PhotoListFilter} from "entity/photo";
import {delayPromise} from "react-coat";

export class API {
  @delayPromise(3)
  public getPhotoList(filter: PhotoListFilter): Promise<PhotoList> {
    return Promise.resolve({
      list: [
        {
          title: "环太平洋",
          commentCount: 500,
          imageCount: 10,
          coverUrl: "http://103.90.137.51:8020/images/20180914203359610.PNG",
          createTimeDesc: "1天前",
          clickCount: 500,
        },
        {
          title: "环太平洋",
          commentCount: 120,
          imageCount: 5,
          coverUrl: "http://103.90.137.51:8020/images/20180914203359610.PNG",
          createTimeDesc: "1个月前",
          clickCount: 256,
        },
      ],
    });
  }
}

export default new API();
