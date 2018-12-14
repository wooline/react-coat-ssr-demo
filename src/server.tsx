import {RedirectError} from "common/Errors";
import {advanceRouter, pathParser, searchParser} from "common/routers";
import {ModuleGetter} from "modules";
import {ModuleNames} from "modules/names";
import {renderApp} from "react-coat";

export default function render(path: string): Promise<any> {
  getInitEnv(global, process.env.NODE_ENV !== "production");
  const router = advanceRouter(path);
  if (typeof router === "string") {
    throw new RedirectError("301", router);
  } else {
    return renderApp(ModuleGetter, ModuleNames.app, [path], {pathParser, searchParser, initData: {router}});
  }
}
