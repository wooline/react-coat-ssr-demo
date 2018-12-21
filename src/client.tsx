import {advanceRouter} from "common/routers";
import {ModuleGetter} from "modules";
import {ModuleNames} from "modules/names";
import {buildApp} from "react-coat";

getInitEnv(window, process.env.NODE_ENV !== "production");
const routerData = advanceRouter(window.location.href);
if (typeof routerData === "string") {
  window.location.href = routerData;
} else {
  buildApp(ModuleGetter, ModuleNames.app, {initData: {[ModuleNames.app]: {routerData}}});
}
