import {RedirectError} from "common/Errors";
import {advanceRouter} from "common/routers";
import {moduleGetter} from "modules";
import {ModuleNames} from "modules/names";
import {renderApp} from "react-coat";

export default function render(path: string): Promise<any> {
  const env = getInitEnv();
  const initEnv: typeof InitEnv = {
    clientPublicPath: env.clientPublicPath,
    apiServerPath: env.apiServerPath.server,
  };
  // tslint:disable-next-line:no-string-literal
  global["InitEnv"] = initEnv;
  const rootRouter = advanceRouter(path);
  if (typeof rootRouter === "string") {
    console.log(path, rootRouter);
    throw new RedirectError("301", rootRouter);
  } else {
    return renderApp(moduleGetter, ModuleNames.app, [path], {initData: {router: rootRouter}});
  }
}
