import {DeepPartial} from "entity/common";
import {ModuleGetter} from "modules";
import {ModuleNames} from "modules/names";
import {ReturnModule} from "react-coat";

type ExcludeNull<T> = {[K in keyof T]-?: T[K] extends null ? never : K}[keyof T];

export function defineModuleGetter<T extends {[moduleName in ModuleNames]: () => any}>(getter: T) {
  return getter as {[key in ModuleNames]: T[key]};
}

export function defineViewToPath<P extends {[K in ModuleNames]: {[V in keyof ReturnModule<ModuleGetter[K]>["views"]]: string | null}}>(paths: P): {[K in keyof P]: {[D in ExcludeNull<P[K]>]: string}} {
  return paths as any;
}

export function defineRouterData<T extends {[moduleName in ModuleNames]: {searchData: any; hashData: any; pathData: any}}>(routeData: T) {
  const pathData: {[key in ModuleNames]?: T[key]["pathData"]} = {};
  const searchData: {[key in ModuleNames]?: DeepPartial<T[key]["searchData"]>} = {};
  const hashData: {[key in ModuleNames]?: DeepPartial<T[key]["hashData"]>} = {};
  const wholeSearchData: {[key in ModuleNames]?: T[key]["searchData"]} = {};
  const wholeHashData: {[key in ModuleNames]?: T[key]["hashData"]} = {};

  for (const moduleName in routeData) {
    if (routeData.hasOwnProperty(moduleName)) {
      const key = moduleName as ModuleNames;
      wholeSearchData[key] = routeData[key].searchData;
      wholeHashData[key] = routeData[key].hashData;
    }
  }
  return {
    pathData,
    searchData,
    hashData,
    wholeSearchData,
    wholeHashData,
  };
}

export function equal(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) {
    return true;
  } else if (typeof obj1 !== typeof obj2 || typeof obj1 !== "object") {
    return false;
  } else {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) {
      return false;
    } else {
      let result = true;
      for (const key of keys1) {
        if (obj1[key] !== obj2[key]) {
          result = false;
          if (typeof obj1[key] !== "object" || typeof obj2[key] !== "object") {
            return false;
          }
        }
      }
      if (result) {
        return true;
      } else {
        return JSON.stringify(obj1) === JSON.stringify(obj2);
      }
    }
  }
}
export function reference(data: any) {
  return data;
}
export function isBrowser(): boolean {
  return typeof window === "object";
}
