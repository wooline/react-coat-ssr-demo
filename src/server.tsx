import {RedirectError} from "common/Errors";
import {advanceRouter} from "common/routers";
import {moduleGetter} from "modules";
import {ModuleNames} from "modules/names";
import {renderApp} from "react-coat";

export default function render(path: string): Promise<any> {
  // 定义初始化的全局变量，getInitEnv()该函数定义在/public/client/index.html中
  const env = getInitEnv();
  const initEnv: typeof InitEnv = {
    clientPublicPath: env.clientPublicPath,
    apiServerPath: env.apiServerPath.server,
  };
  // tslint:disable-next-line:no-string-literal
  global["InitEnv"] = initEnv;
  // 为提高ssr服务器的执行效率，对于重定向或是404提前判断并短路执行
  const rootRouter = advanceRouter(path);
  if (typeof rootRouter === "string") {
    throw new RedirectError("301", rootRouter);
  } else {
    return renderApp(moduleGetter, ModuleNames.app, [path], {initData: {router: rootRouter}});
  }
}
