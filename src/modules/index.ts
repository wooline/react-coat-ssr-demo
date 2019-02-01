import {defineModuleGetter, defineRouterData, defineViewToPath} from "common/utils";
import {defRouteData as appDefRouteData} from "modules/app/facade";
import {defRouteData as commentsDefRouteData} from "modules/comments/facade";
import {defRouteData as messagesDefRouteData} from "modules/messages/facade";
import {defRouteData as photosDefRouteData} from "modules/photos/facade";
import {defRouteData as videosDefRouteData} from "modules/videos/facade";
import {RootState as BaseState, RouterState} from "react-coat";

// 定义模块的加载方案，同步或者异步均可
export const moduleGetter = defineModuleGetter({
  app: () => {
    return import(/* webpackChunkName: "app" */ "modules/app");
  },
  photos: () => {
    return import(/* webpackChunkName: "photos" */ "modules/photos");
  },
  videos: () => {
    return import(/* webpackChunkName: "videos" */ "modules/videos");
  },
  messages: () => {
    return import(/* webpackChunkName: "messages" */ "modules/messages");
  },
  comments: () => {
    return import(/* webpackChunkName: "comments" */ "modules/comments");
  },
});

export type ModuleGetter = typeof moduleGetter;

// 扩展 connected-react-router 的路由结构
export const routerData = defineRouterData({
  app: appDefRouteData,
  photos: photosDefRouteData,
  videos: videosDefRouteData,
  messages: messagesDefRouteData,
  comments: commentsDefRouteData,
});

// 通过下面的 viewToPath 配置，可通过当前 pathname 推导出当前展示了哪些 views，具体实现在 ./src/common/routers.ts
export type RootRouter = RouterState & typeof routerData & {views: RootState["views"]};

export type RootState = BaseState<ModuleGetter, RootRouter>;

// 定义整站路由与view的匹配模式
export const viewToPath = defineViewToPath({
  app: {Main: "/"},
  photos: {Main: "/photos", Details: "/photos/:itemId", List: null},
  videos: {Main: "/videos", Details: "/videos/:itemId", List: null},
  messages: {Main: "/messages", List: null},
  comments: {Main: "/:type/:typeId/comments", Details: "/:type/:typeId/comments/:itemId", List: null},
});
