import {RedirectError} from "common/Errors";
import {advanceRouter} from "common/routers";
import {moduleGetter} from "modules";
import {ModuleNames} from "modules/names";
import {renderApp} from "react-coat";

export default function render(path: string): Promise<any> {
  // 获取全局设置的函数，为了在上线后可以由运维修改，该函数的实现放在/public/index.html中，以防止被 webpack 打包
  const env = getInitEnv();
  global.InitEnv = {
    clientPublicPath: env.clientPublicPath,
    apiServerPath: env.apiServerPath.server,
  };
  // 为提高ssr服务器的执行效率，对于重定向或是404提前判断并短路执行
  const rootRouter = advanceRouter(path);
  if (typeof rootRouter === "string") {
    throw new RedirectError("301", rootRouter);
  } else {
    return renderApp(moduleGetter, ModuleNames.app, [path], {initData: {router: rootRouter}});
  }
}
