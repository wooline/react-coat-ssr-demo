import {DeepPartial} from "entity/common";
import {defRouteData as appDefRouteData, ModuleState as AppState} from "modules/app/facade";
import {defRouteData as commentsDefRouteData, ModuleState as CommentsState} from "modules/comments/facade";
import {defRouteData as messagesDefRouteData, ModuleState as MessagesState} from "modules/messages/facade";
import {defRouteData as photosDefRouteData, ModuleState as PhotosState} from "modules/photos/facade";
import {defRouteData as videosDefRouteData, ModuleState as VideosState} from "modules/videos/facade";
import {Module, RootState as BaseState, RouterState} from "react-coat";
import {ModuleNames} from "./names";

// 一个验证器，利用TS类型来确保增加一个module时，相关的配置都同时增加了
type ModulesDefined<T extends {[key in ModuleNames]: any}> = T;

// 定义模块的加载方案，同步或者异步均可
export const moduleGetter = {
  [ModuleNames.app]: () => {
    return import(/* webpackChunkName: "app" */ "modules/app");
  },
  [ModuleNames.photos]: () => {
    return import(/* webpackChunkName: "photos" */ "modules/photos");
  },
  [ModuleNames.videos]: () => {
    return import(/* webpackChunkName: "videos" */ "modules/videos");
  },
  [ModuleNames.messages]: () => {
    return import(/* webpackChunkName: "messages" */ "modules/messages");
  },
  [ModuleNames.comments]: () => {
    return import(/* webpackChunkName: "comments" */ "modules/comments");
  },
};

export type ModuleGetter = ModulesDefined<typeof moduleGetter>;

// 定义整站的路由参数默认值
export const defRouteData = {
  [ModuleNames.app]: appDefRouteData,
  [ModuleNames.photos]: photosDefRouteData,
  [ModuleNames.videos]: videosDefRouteData,
  [ModuleNames.messages]: messagesDefRouteData,
  [ModuleNames.comments]: commentsDefRouteData,
};

type ModuleRouterData = ModulesDefined<typeof defRouteData>;
type ModuleRouterDataOptions = {[k in keyof ModuleRouterData]: DeepPartial<ModuleRouterData[k]>}; // 路由参数均为可选项
export type RouterData = {
  views: {[moduleName: string]: {[viewName: string]: boolean}};
  pathData: {[M in keyof ModuleRouterData]?: ModuleRouterData[M]["pathData"]};
  searchData: {[M in keyof ModuleRouterDataOptions]?: ModuleRouterDataOptions[M]["searchData"]};
  hashData: {[M in keyof ModuleRouterDataOptions]?: ModuleRouterDataOptions[M]["hashData"]};
  wholeSearchData: {[M in keyof ModuleRouterData]?: ModuleRouterData[M]["searchData"]};
  wholeHashData: {[M in keyof ModuleRouterData]?: ModuleRouterData[M]["hashData"]};
};
export type RootRouter = RouterState & RouterData;
// 定义整站Module States
interface States {
  [ModuleNames.app]: AppState;
  [ModuleNames.photos]: PhotosState;
  [ModuleNames.videos]: VideosState;
  [ModuleNames.messages]: MessagesState;
  [ModuleNames.comments]: CommentsState;
}

// 定义整站的Root State
export type RootState = BaseState<RootRouter> & ModulesDefined<States>;

export type ReturnModule<T extends () => any> = T extends () => Promise<infer R> ? R : T extends () => infer R ? R : Module;

// 定义整站路由与view的匹配模式
export const moduleToUrl: {[K in keyof ModuleGetter]: {[V in keyof ReturnModule<ModuleGetter[K]>["views"]]+?: string}} = {
  app: {Main: "/", LoginForm: "/login"},
  photos: {Main: "/photos", List: "/photos/list", Details: "/photos/item/:itemId"},
  videos: {Main: "/videos", List: "/videos/list", Details: "/videos/item/:itemId"},
  messages: {Main: "/messages", List: "/messages/list"},
  comments: {Main: "/:type/item/:typeId/comments", List: "/:type/item/:typeId/comments/list", Details: "/:type/item/:typeId/comments/item/:itemId"},
};

export type ModuleToUrl = ModulesDefined<typeof moduleToUrl>;
