import {advanceRouter, routerParser} from "common/routers";
import {moduleGetter} from "modules";
import {ModuleNames} from "modules/names";
import {buildApp} from "react-coat";

getInitEnv(window, process.env.NODE_ENV !== "production");
const rootRouter = advanceRouter(window.location.href);
if (typeof rootRouter === "string") {
  window.location.href = rootRouter;
} else {
  buildApp(moduleGetter, ModuleNames.app, {routerParser, initData: {router: rootRouter}});
}
