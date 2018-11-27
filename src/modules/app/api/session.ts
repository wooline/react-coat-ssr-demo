import request from "common/request";
import {CurUser, LoginRequest, LoginResponse} from "entity/session";

export class API {
  public getCurUser(): Promise<CurUser> {
    return request("get", "/ajax/session");
  }
  public login(req: LoginRequest): Promise<LoginResponse> {
    // return request("put", "/ajax/session", {}, req);
    return Promise.resolve({data: {uid: "1", username: "jimmy", hasLogin: true, avatarUrl: ""}, error: null});
  }
}

export const api = new API();
