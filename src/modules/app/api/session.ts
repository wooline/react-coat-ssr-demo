import request from "common/request";
import {CurUser, LoginRequest, LoginResponse} from "entity/session";

export class API {
  public getCurUser(): Promise<CurUser> {
    return request("get", "/ajax/session");
  }
  public login(req: LoginRequest): Promise<LoginResponse> {
    return request("put", "/ajax/session", {}, req);
  }
}

export const api = new API();
