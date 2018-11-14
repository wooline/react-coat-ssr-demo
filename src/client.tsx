import {ModuleGetter} from "modules";
import {ModuleNames} from "modules/names";
import {buildApp} from "react-coat-pkg";

setTimeout(() => {
  buildApp(ModuleGetter, ModuleNames.app);
}, 5000);
