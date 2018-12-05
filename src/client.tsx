import {checkFastRedirect, parseQuery} from "common/routers";
import {ModuleGetter} from "modules";
import {ModuleNames} from "modules/names";
import {buildApp} from "react-coat";

getInitEnv(window, process.env.NODE_ENV !== "production");
const redirect = checkFastRedirect(window.location.pathname);
if (redirect) {
  window.location.href = redirect.url;
} else {
  buildApp(ModuleGetter, ModuleNames.app, {routerParser: parseQuery});
}
