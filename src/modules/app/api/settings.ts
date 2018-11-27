import request from "common/request";
import {ProjectConfig} from "entity/global";

export class API {
  public getSettings(): Promise<ProjectConfig> {
    return request("get", "/ajax/project-config");
  }

  public reportError(error: any): Promise<boolean> {
    console.log("report", error);
    return Promise.resolve(true);
  }
}

export const api = new API();
