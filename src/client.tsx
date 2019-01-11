import {advanceRouter, routerParser} from "common/routers";
import {moduleGetter} from "modules";
import {ModuleNames} from "modules/names";
import {buildApp} from "react-coat";

const env = getInitEnv();
const initEnv: typeof InitEnv = {
  clientPublicPath: env.clientPublicPath,
  apiServerPath: env.apiServerPath.client,
};
// tslint:disable-next-line:no-string-literal
window["InitEnv"] = initEnv;
const rootRouter = advanceRouter(window.location.href);
if (typeof rootRouter === "string") {
  window.location.href = rootRouter;
} else {
  buildApp(moduleGetter, ModuleNames.app, {routerParser, initData: {router: rootRouter}});
}
