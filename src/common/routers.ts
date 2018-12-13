import {ModuleGetter, RootRouter} from "modules";
import {ModuleNames} from "modules/names";
import {HashParser, Module, PathParser, SearchParser} from "react-coat";
import {matchPath} from "react-router";

type MG = typeof ModuleGetter;

const moduleToUrl: {[K in keyof MG]+?: string | {[V in keyof ReturnModule<MG[K]>["views"]]+?: string}} = {
  [ModuleNames.app]: {Main: "/", LoginForm: "/login"},
  [ModuleNames.photos]: {Main: "/photos", Details: "/photos/:itemId"},
  [ModuleNames.videos]: {Main: "/videos"},
  [ModuleNames.messages]: "/message",
};

const modulePaths = ((maps: {[mName: string]: string | {[vName: string]: string}}) => {
  const urls: {[pathname: string]: [string, string]} = {};
  for (const mName in maps) {
    if (maps.hasOwnProperty(mName)) {
      const item = maps[mName];
      if (typeof item === "string") {
        urls[item] = [mName, "Main"];
      } else {
        for (const vName in item) {
          if (item.hasOwnProperty(vName)) {
            urls[item[vName]] = [mName, vName];
          }
        }
      }
    }
  }
  return urls;
})(moduleToUrl as any);

let fastRedirect: Array<{path: RegExp; to: {code: "301" | "302"; url: string}}> = [];

export function checkFastRedirect(pathname: string) {
  if (!fastRedirect.length) {
    fastRedirect = [
      {
        path: /^\/$/,
        to: {code: "301", url: "/photos"},
      },
      {
        path: /^\/(?!photos|videos|login)/,
        to: {code: "301", url: `${InitEnv.clientPublicPath}404.html`},
      },
    ];
  }
  for (const route of fastRedirect) {
    if (route.path.test(pathname)) {
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
            if (mRoute[mKey] !== undefined) {
              flatArr.push(`${mName}-${mKey}=${escape(JSON.stringify(mRoute[mKey]))}`);
            }
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

export function replaceQuery<M extends keyof RootRouter["searchData"]>(
  rootRouter: RootRouter,
  moduleName: M,
  newSearchData?: Partial<RootRouter["searchData"][M]>,
  extendSearchData?: boolean,
  newHashData?: Partial<RootRouter["hashData"][M]>,
  extendHashData?: boolean
) {
  const {pathname, search, hash} = rootRouter.location;
  const {searchData, hashData} = rootRouter;
  let url = pathname;
  if (newSearchData) {
    let str = "";
    if (extendSearchData) {
      str = serialize({...searchData, [moduleName]: {...searchData[moduleName], ...newSearchData}});
    } else {
      str = serialize({...searchData, [moduleName]: newSearchData});
    }
    if (str) {
      url += "?" + str;
    }
  } else {
    url += search;
  }
  if (newHashData) {
    let str = "";
    if (extendHashData) {
      str = serialize({...hashData, [moduleName]: {...hashData[moduleName], ...newHashData}});
    } else {
      str = serialize({...hashData, [moduleName]: newHashData});
    }
    if (str) {
      url += "#" + str;
    }
  } else {
    url += hash;
  }
  return url;
}

export function toUrl<
  N extends keyof RootRouter["pathData"],
  M extends ReturnModule<MG[N]>,
  V extends keyof M["views"],
  P extends RootRouter["pathData"][N],
  R extends RootRouter["searchData"],
  H extends RootRouter["hashData"]
>(moduleName: N, viewName?: V, params?: P, query?: R | string, hash?: H | string): string {
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
        return params[key];
      } else {
        return "";
      }
    });
  }
  if (query) {
    if (typeof query === "string") {
      url += query;
    } else {
      const str = serialize(query);
      if (str) {
        url = url + "?" + serialize(query);
      }
    }
  }
  if (hash) {
    if (typeof hash === "string") {
      url += hash;
    } else {
      const str = serialize(hash);
      if (str) {
        url = url + "#" + serialize(hash);
      }
    }
  }
  return url;
}

export function isCur<N extends keyof MG, M extends ReturnModule<MG[N]>, V extends keyof M["views"]>(views: RootRouter["views"], moduleName: N, viewName?: V): boolean {
  return views[[moduleName, viewName || "Main"].join(".")];
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

export const searchParser: SearchParser = (search: string) => {
  return search.split(/[&?]/).reduce(parseRoute, {});
};
export const hashParser: HashParser = (hash: string) => {
  return hash.split(/[&#]/).reduce(parseRoute, {});
};
export const pathParser: PathParser = (pathname: string) => {
  const views: {[viewName: string]: boolean} = {};
  const data: {[moduleName: string]: {[key: string]: any}} = {};
  Object.keys(modulePaths).forEach(url => {
    const match = matchPath(pathname, url);
    if (match) {
      const result = modulePaths[url];
      views[result.join(".")] = true;
      if (match.params) {
        data[result[0]] = match.params;
      }
    }
  });
  return {views, data};
};

/* export const pathParser2: PathParser = (pathname: string) => {
  let searchData: {[mName: string]: any} = {};
  let hashData: {[mName: string]: any} = {};
  let pathData: {[mName: string]: any} = {};
  if (prev.search !== cur.search || prev.pathname !== cur.pathname) {
    searchData = cur.search.split(/[&?]/).reduce(parseRoute, {});
    pathData = parsePath(cur.pathname, searchData);
  } else {
    pathData = data.pathData;
    searchData = data.searchData;
  }
  if (prev.hash !== cur.hash) {
    hashData = cur.hash.split(/[&#]/).reduce(parseRoute, {});
  } else {
    hashData = data.hashData;
  }

  return {searchData, hashData, pathData};
};
 */
