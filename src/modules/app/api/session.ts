import {CurUser, LoginRequest, LoginResponse} from "entity/session";
import {delayPromise} from "react-coat";

export class API {
  // mock一个耗时3秒的异步请求
  @delayPromise(3)
  public getCurUser(): Promise<CurUser> {
    return Promise.resolve({uid: "0", username: "guest", hasLogin: false});
  }

  // mock一个耗时3秒的异步请求
  @delayPromise(3)
  public login(request: LoginRequest): Promise<LoginResponse> {
    return Promise.resolve({data: {uid: "1", username: "jimmy", hasLogin: true}, error: null});
  }
}

export const api = new API();
