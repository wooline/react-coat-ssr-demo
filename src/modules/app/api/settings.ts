import request from "common/request";
import {ProjectConfig} from "entity/global";

export class API {
  public getSettings() {
    return request<ProjectConfig>("get", "/ajax/project-config").then(projectConfig => {
      projectConfig.logoUrl = InitEnv.clientPublicPath + projectConfig.logoUrl;
      projectConfig.startupPage.imageUrl = InitEnv.clientPublicPath + projectConfig.startupPage.imageUrl;
      return projectConfig;
    });
  }

  public reportError(error: any): Promise<boolean> {
    console.log("report", error.message);
    return Promise.resolve(true);
  }
}

export const api = new API();
