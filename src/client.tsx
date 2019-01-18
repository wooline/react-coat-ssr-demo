import {advanceRouter, routerParser} from "common/routers";
import {moduleGetter} from "modules";
import {ModuleNames} from "modules/names";
import {buildApp} from "react-coat";

// 获取全局设置的函数，为了在上线后可以由运维修改，该函数的实现放在/public/index.html中，以防止被 webpack 打包
const env = getInitEnv();
window.InitEnv = {
  clientPublicPath: env.clientPublicPath,
  apiServerPath: env.apiServerPath.client,
};

// 为提高执行效率，对于重定向或是404提前判断并短路执行
const rootRouter = advanceRouter(window.location.href);
if (typeof rootRouter === "string") {
  window.location.href = rootRouter;
} else {
  buildApp(moduleGetter, ModuleNames.app, {routerParser, initData: {router: rootRouter}});
}
