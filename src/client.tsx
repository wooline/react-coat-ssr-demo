import {ModuleGetter} from "modules";
import {ModuleNames} from "modules/names";
import {buildApp} from "react-coat";

getInitEnv(window, process.env.NODE_ENV !== "production");
buildApp(ModuleGetter, ModuleNames.app);
