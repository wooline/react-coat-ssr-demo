import {PhotoList, PhotoListFilter} from "entity/photo";
import {delayPromise} from "react-coat-pkg";

export class API {
  @delayPromise(3)
  public getPhotoList(filter: PhotoListFilter): Promise<PhotoList> {
    return Promise.resolve({
      list: [
        {
          title: "生化危机外传 第二卷",
          commentCount: 500,
          imageCount: 10,
          coverUrl: "http://103.90.137.51:8020/images/20180914203359610.PNG",
          createTimeDesc: "1天前",
          clickCount: 500,
        },
        {
          title: "梁朝伟 Tony Leung",
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
