import request from "common/request";
import {CurUser, LoginRequest, LoginResponse} from "entity/session";

export class API {
  public getCurUser() {
    return request<CurUser>("get", "/ajax/session").then(user => {
      user.avatarUrl = InitEnv.clientPublicPath + user.avatarUrl;
      return user;
    });
  }
  public login(req: LoginRequest) {
    return request<LoginResponse>("put", "/ajax/session", {}, req).then(loginResponse => {
      if (loginResponse.data) {
        loginResponse.data.avatarUrl = InitEnv.clientPublicPath + loginResponse.data.avatarUrl;
      }
      return loginResponse;
    });
  }
}

export const api = new API();
