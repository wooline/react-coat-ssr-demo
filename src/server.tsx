import {ModuleGetter} from "modules";
import {ModuleNames} from "modules/names";
import {renderApp} from "react-coat";

getInitEnv(global, process.env.NODE_ENV !== "production");

export default function render(path: string) {
  return renderApp(ModuleGetter, ModuleNames.app, [path]);
}
