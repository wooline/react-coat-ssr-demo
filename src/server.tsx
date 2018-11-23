import {ModuleGetter} from "modules";
import {ModuleNames} from "modules/names";
import {renderApp} from "react-coat";

export default function render(path: string) {
  return renderApp(ModuleGetter, ModuleNames.app, [path]);
}
