import {advanceRouter, routerParser} from "common/routers";
import {moduleGetter} from "modules";
import {ModuleNames} from "modules/names";
import {buildApp} from "react-coat";

// 定义初始化的全局变量，getInitEnv()该函数定义在/public/client/index.html中
const env = getInitEnv();
const initEnv: typeof InitEnv = {
  clientPublicPath: env.clientPublicPath,
  apiServerPath: env.apiServerPath.client,
};
// tslint:disable-next-line:no-string-literal
window["InitEnv"] = initEnv;
// 为提高执行效率，对于重定向或是404提前判断并短路执行
const rootRouter = advanceRouter(window.location.href);
if (typeof rootRouter === "string") {
  window.location.href = rootRouter;
} else {
  buildApp(moduleGetter, ModuleNames.app, {routerParser, initData: {router: rootRouter}});
}
