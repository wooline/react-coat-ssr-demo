import {routerActions} from "connected-react-router";
import * as assignDeep from "deep-extend";
import {defRouteData, ModuleGetter, moduleToUrl, ReturnModule, RootRouter, RouterData} from "modules";
import {RouterParser} from "react-coat";
import {matchPath} from "react-router";
import {Dispatch} from "redux";

type MData = {[moduleName: string]: {[key: string]: any}};
type Views = {[moduleName: string]: {[viewName: string]: boolean}};

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

const {defSearch, defHash}: {defSearch: RouterData["wholeSearchData"]; defHash: RouterData["wholeHashData"]} = (routeData => {
  const search = {};
  const hash = {};
  for (const moduleName in routeData) {
    if (routeData.hasOwnProperty(moduleName)) {
      search[moduleName] = routeData[moduleName].searchData;
      hash[moduleName] = routeData[moduleName].hashData;
    }
  }
  return {defSearch: search, defHash: hash};
})(defRouteData);

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

export function toPath<N extends keyof RouterData["pathData"], M extends ReturnModule<ModuleGetter[N]>, V extends keyof M["views"], P extends RouterData["pathData"][N]>(
  moduleName: N,
  viewName?: V,
  params?: P
): string {
  viewName = viewName || ("Main" as any);
  let pathExp: string | {[viewName: string]: string} = moduleToUrl[moduleName] as string;
  if (typeof pathExp !== "string") {
    pathExp = pathExp[viewName as string];
  }
  let pathname = pathExp;
  if (params) {
    pathname = pathExp.replace(/:\w+/g, flag => {
      const key = flag.substr(1);
      if (params[key]) {
        return params[key];
      } else {
        return "";
      }
    });
  }
  return pathname;
}
export function toUrl(pathname: string, searchData?: RouterData["searchData"], hashData?: RouterData["hashData"]): string {
  let url = pathname;
  if (searchData) {
    let str = searchData as string;
    if (typeof searchData !== "string") {
      str = serialize(excludeDefData(searchData, defSearch));
    }
    if (str) {
      url += "?" + str.replace("?", "");
    }
  }
  if (hashData) {
    let str = hashData as string;
    if (typeof hashData !== "string") {
      str = serialize(excludeDefData(hashData, defHash));
    }
    if (str) {
      url += "#" + str.replace("#", "");
    }
  }
  return url;
}

export function isCur<N extends keyof ModuleGetter, M extends ReturnModule<ModuleGetter[N]>, V extends keyof M["views"]>(views: RouterData["views"], moduleName: N, viewName?: V): boolean {
  return views[moduleName] && views[moduleName][(viewName as string) || "Main"];
}

export function linkTo(e: React.MouseEvent<HTMLAnchorElement>, dispatch: Dispatch) {
  e.preventDefault();
  const href = e.currentTarget.getAttribute("href") as string;
  if (href && href !== "#") {
    dispatch(routerActions.push(href));
  }
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
/* export function mergeSearch<S>(options: Partial<S>, def: S): Partial<S> {
  const search = {...def, ...options};
  return Object.keys(search).reduce((prev, cur) => {
    if (typeof search[cur] === "object") {
      if (JSON.stringify(search[cur]) !== JSON.stringify(def[cur])) {
        prev[cur] = search[cur];
      }
    } else {
      if (search[cur] !== def[cur]) {
        prev[cur] = search[cur];
      }
    }
    return prev;
  }, {});
} */

function parsePathname(
  pathname: string
): {
  pathData: MData;
  views: Views;
} {
  const views: Views = {};
  const pathData: MData = {};
  Object.keys(modulePaths).forEach(url => {
    const match = matchPath(pathname, url);
    if (match) {
      const result = modulePaths[url];
      if (!views[result[0]]) {
        views[result[0]] = {};
      }
      views[result[0]][result[1]] = true;
      if (match.params) {
        pathData[result[0]] = match.params;
      }
    }
  });
  return {views, pathData};
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

export const routerParser: RouterParser<RootRouter> = (nextRouter, prevRouter) => {
  const nRouter: RootRouter = {...nextRouter};
  const changed = {pathname: false, search: false, hash: false};
  if (prevRouter && nextRouter.location.pathname !== prevRouter.location.pathname) {
    const {views, pathData} = parsePathname(nextRouter.location.pathname);
    nRouter.views = views;
    nRouter.pathData = pathData;
    changed.pathname = true;
  }
  if (prevRouter && nextRouter.location.search !== prevRouter.location.search) {
    nRouter.searchData = nextRouter.location.search.split(/[&?]/).reduce(parseRoute, {});
    changed.search = true;
  }
  if (prevRouter && nextRouter.location.hash !== prevRouter.location.hash) {
    nRouter.hashData = nextRouter.location.hash.split(/[&#]/).reduce(parseRoute, {});
    changed.hash = true;
  }
  if (changed.pathname || changed.search) {
    nRouter.wholeSearchData = mergeDefData(nRouter.views, nRouter.searchData, defSearch);
  }
  if (changed.pathname || changed.hash) {
    nRouter.wholeHashData = mergeDefData(nRouter.views, nRouter.hashData, defHash);
  }
  return nRouter;
};
function mergeDefData(views: Views, data: any, def: any) {
  const newData = {...data};
  Object.keys(views).forEach(mName => {
    if (!newData[mName]) {
      newData[mName] = {};
    }
  });
  Object.keys(newData).forEach(mName => {
    if (def[mName]) {
      newData[mName] = assignDeep({}, def[mName], newData[mName]);
    }
  });
  return newData;
}
const excludeDefData = (data: any, def: any) => {
  const result: any = {};
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      if (typeof data[key] === "object" && def[key] && !Array.isArray(def[key])) {
        result[key] = excludeDefData(data[key], def[key]);
      } else if (data[key] !== def[key]) {
        result[key] = data[key];
      }
    }
  }
  if (Object.keys(result).length === 0) {
    return undefined;
  }
  return result;
};
export function advanceRouter(url: string): RootRouter | string {
  let [pathname, search, hash] = url.split(/[?#]/);
  if (url.indexOf("?") === -1) {
    hash = search;
    search = "";
  }
  pathname = pathname.replace(/^.+:\/\/[^/]+/, "");
  search = search ? "?" + search : "";
  hash = hash ? "#" + hash : "";
  const redirects = [
    {
      path: /^\/$/,
      replace: "/photos/list",
    },
    {
      path: /\/$/,
      replace: "",
    },
  ];
  for (const rule of redirects) {
    if (rule.path.test(pathname)) {
      return pathname.replace(rule.path, rule.replace);
    }
  }
  const {views, pathData} = parsePathname(pathname);
  if (Object.keys(views).length < 2) {
    return `${InitEnv.clientPublicPath}404.html`;
  }
  const searchData = search.split(/[&?]/).reduce(parseRoute, {});
  const hashData = hash.split(/[&#]/).reduce(parseRoute, {});
  return {
    location: {pathname, search, hash, state: null},
    action: "POP",
    views,
    pathData,
    searchData,
    hashData,
    wholeSearchData: mergeDefData(views, searchData, defSearch),
    wholeHashData: mergeDefData(views, hashData, defHash),
  };
}
