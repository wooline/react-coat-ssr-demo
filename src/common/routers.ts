import {ModuleGetter, RootRouter} from "modules";
import {ModuleNames} from "modules/names";
import {Module, RouterState} from "react-coat";
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

type ReturnModule<T extends () => any> = T extends () => Promise<infer R> ? R : T extends () => infer R ? R : Module;

function serialize(data: {[key: string]: any}): string {
  const flatArr: string[] = [];
  for (const mName in data) {
    if (data.hasOwnProperty(mName)) {
      const mRoute = data[mName];
      if (mRoute) {
        for (const mKey in mRoute) {
          if (mRoute.hasOwnProperty(mKey)) {
            flatArr.push(`${mName}-${mKey}=${escape(JSON.stringify(mRoute[mKey]))}`);
          }
        }
      }
    }
  }
  if (flatArr.length) {
    return flatArr.sort().join("&");
  } else {
    return "";
  }
}

export function replaceCurRouter<M extends keyof RootRouter["searchData"]>(
  rootRouter: RootRouter,
  moduleName: M,
  newSearchData?: Partial<RootRouter["searchData"][M]>,
  newHashData?: Partial<RootRouter["hashData"][M]>
) {
  const {pathname, search, hash} = rootRouter.location;
  const {searchData, hashData} = rootRouter;
  let url = pathname;
  if (newSearchData) {
    url += "?" + serialize({...searchData, [moduleName]: {...searchData[moduleName], ...newSearchData}});
  } else {
    url += search;
  }
  if (newHashData) {
    url += "#" + serialize({...hashData, [moduleName]: {...hashData[moduleName], ...newHashData}});
  } else {
    url += hash;
  }
  return url;
}

export function toUrl<N extends keyof MG, M extends ReturnModule<MG[N]>, V extends keyof M["views"], R extends RootRouter["searchData"], H extends RootRouter["hashData"]>(
  moduleName: N,
  viewName?: V,
  params?: {[keys: string]: string},
  query?: R,
  hash?: H
): string {
  viewName = viewName || ("Main" as any);
  let pathExp: string | {[viewName: string]: string} = moduleToUrl[moduleName] as string;
  if (typeof pathExp !== "string") {
    pathExp = pathExp[viewName as string];
  }
  let url = pathExp;
  if (params) {
    url = pathExp.replace(/:\w+/g, flag => {
      const key = flag.substr(1);
      if (params[key]) {
        const val = params[key];
        return encodeURIComponent(val);
      } else {
        return "";
      }
    });
  }
  if (query) {
    url = url + "?" + serialize(query);
  }
  if (hash) {
    url = url + "#" + serialize(hash);
  }
  return url;
}

export function isCur<N extends keyof MG, M extends ReturnModule<MG[N]>, V extends keyof M["views"]>(pathname: string, moduleName: N, viewName?: V): boolean {
  const path = toUrl(moduleName, viewName);
  return matchPath(pathname, path) !== null;
}

const ISO_DATE_FORMAT = /^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(\.\d+)?(Z|[+-][01]\d:[0-5]\d)$/;

export function unserializeUrlQuery(query: string): any {
  if (!query) {
    return "";
  }
  let args;
  try {
    args = JSON.parse(unescape(query), (prop: any, value: any) => {
      if (typeof value === "string" && ISO_DATE_FORMAT.test(value)) {
        return new Date(value);
      }
      return value;
    });
  } catch (e) {
    args = "";
  }
  return args;
}
export function mergeSearch<S>(options: Partial<S>, base: S): Partial<S> {
  const search = {...base, ...options};
  /* 过滤与默认值相等的参数 */
  return Object.keys(search).reduce((prev, cur) => {
    if (typeof search[cur] === "object") {
      if (JSON.stringify(search[cur]) !== JSON.stringify(base[cur])) {
        prev[cur] = search[cur];
      }
    } else {
      if (search[cur] !== base[cur]) {
        prev[cur] = search[cur];
      }
    }
    return prev;
  }, {});
  // this.dispatch(this.routerActions.push(pushQuery(this.namespace, "listOptional", parms, this.rootState.router.location.search)));
}

function parseRoute(pre: {}, cur: string) {
  const [key, val] = cur.split("=");
  if (key) {
    const arr = key.split("-");
    const moduleName = arr.shift();
    const moduleKey = arr.join("-");
    if (moduleName && moduleKey) {
      if (!pre[moduleName]) {
        pre[moduleName] = {};
      }
      pre[moduleName][moduleKey] = unserializeUrlQuery(val);
    }
  }
  return pre;
}
export function parseHash({location: {hash}}: RouterState): {[moduleName: string]: {[key: string]: any}} {
  return hash.split(/[&#]/).reduce(parseRoute, {});
}
export function parseQuery({location: {search}}: RouterState): {[moduleName: string]: {[key: string]: any}} {
  return search.split(/[&?]/).reduce(parseRoute, {});
}
