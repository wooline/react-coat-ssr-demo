import {advanceRouter, hashParser, pathParser, searchParser} from "common/routers";
import {ModuleGetter} from "modules";
import {ModuleNames} from "modules/names";
import {buildApp} from "react-coat";

getInitEnv(window, process.env.NODE_ENV !== "production");
const router = advanceRouter(window.location.href);
if (typeof router === "string") {
  window.location.href = router;
} else {
  buildApp(ModuleGetter, ModuleNames.app, {pathParser, searchParser, hashParser, initData: {router}});
}
