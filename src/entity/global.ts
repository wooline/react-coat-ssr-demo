export interface StartupPageConfig {
  linkUrl: string;
  imageUrl: string;
  times: number;
}
export interface ProjectConfig {
  logoUrl: string;
  newMessage: number;
  startupPage: StartupPageConfig;
}
export enum StartupStep {
  init = "init",
  configLoaded = "configLoaded",
  startupImageLoaded = "startupImageLoaded",
  startupCountEnd = "startupCountEnd",
  startupAnimateEnd = "startupAnimateEnd",
}
export interface MessageList {
  list: string[];
}
