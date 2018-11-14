export interface StartupPageConfig {
  extAdvertUrl: string;
  imageUrl: string;
  times: number;
}
export interface ProjectConfig {
  startupPage: StartupPageConfig;
}
export enum StartupStep {
  init = "init",
  configLoaded = "configLoaded",
  startupCountEnd = "startupCountEnd",
  startupAnimateEnd = "startupAnimateEnd",
}
export interface MessageList {
  list: string[];
}
