import {ModuleGetter} from "modules";
import {ModuleNames} from "modules/names";
import {Module} from "react-coat";
import {matchPath} from "react-router";

type MG = typeof ModuleGetter;

export const emptyModule: Module = {model: () => Promise.resolve(void 0), views: {}};

const moduleToUrl: {[K in keyof MG]+?: string | {[V in keyof ReturnModule<MG[K]>["views"]]+?: string}} = {
  [ModuleNames.app]: {LoginForm: "/login"},
  [ModuleNames.photos]: "/photos",
  [ModuleNames.videos]: "/videos",
  [ModuleNames.messages]: "/message",
};

const fastRedirect: Array<{path?: string; exact?: boolean; to: {code: "301" | "302"; url: string}}> = [
  {
    path: "/",
    exact: true,
    to: {code: "301", url: "/photos"},
  },
];
export function checkFastRedirect(pathname: string) {
  for (const route of fastRedirect) {
    if (matchPath(pathname, route)) {
      return route.to;
    }
  }
  return null;
}

type ReturnModule<T extends () => any> = T extends () => Promise<infer R> ? R : T extends () => infer R ? R : never;

export function toUrl<N extends keyof MG, M extends ReturnModule<MG[N]>, V extends keyof M["views"]>(moduleName: N, viewName?: V, args?: any): string {
  viewName = viewName || ("Main" as any);
  let pathExp: string | {[viewName: string]: string} = moduleToUrl[moduleName] as any;
  if (typeof pathExp !== "string") {
    pathExp = pathExp[viewName as string];
  }
  return pathExp;
}

export function isCur<N extends keyof MG, M extends ReturnModule<MG[N]>, V extends keyof M["views"]>(pathname: string, moduleName: N, viewName?: V): boolean {
  const path = toUrl(moduleName, viewName);
  return matchPath(pathname, {path, exact: true}) !== null;
}
