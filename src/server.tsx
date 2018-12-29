import {RedirectError} from "common/Errors";
import {advanceRouter} from "common/routers";
import {moduleGetter} from "modules";
import {ModuleNames} from "modules/names";
import {renderApp} from "react-coat";

export default function render(path: string): Promise<any> {
  getInitEnv(global, process.env.NODE_ENV !== "production");
  const rootRouter = advanceRouter(path);
  if (typeof rootRouter === "string") {
    throw new RedirectError("301", rootRouter);
  } else {
    return renderApp(moduleGetter, ModuleNames.app, [path], {initData: {router: rootRouter}});
  }
}
