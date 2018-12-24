import {RedirectError} from "common/Errors";
import {advanceRouter} from "common/routers";
import {ModuleGetter} from "modules";
import {ModuleNames} from "modules/names";
import {renderApp} from "react-coat";

export default function render(path: string): Promise<any> {
  getInitEnv(global, process.env.NODE_ENV !== "production");
  const routerData = advanceRouter(path);
  if (typeof routerData === "string") {
    throw new RedirectError("301", routerData);
  } else {
    return renderApp(ModuleGetter, ModuleNames.app, [path], {initData: {router: routerData}});
  }
}
