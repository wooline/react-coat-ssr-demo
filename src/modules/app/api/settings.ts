import * as env from "conf/env";
import {ProjectConfig} from "entity/global";
import {delayPromise} from "react-coat";

export class API {
  // mock一个耗时3秒的异步请求
  @delayPromise(3)
  public getSettings(): Promise<ProjectConfig> {
    return Promise.resolve({
      startupPage: {
        extAdvertUrl: "http://www.baidu.com/",
        imageUrl: `${env.sitePath}imgs/startup.jpg`,
        times: 1000,
      },
    });
  }
  @delayPromise(3)
  public reportError(error: any): Promise<boolean> {
    return Promise.resolve(true);
  }
}

export const api = new API();
