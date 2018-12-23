import {routerActions} from "connected-react-router";
import {ModuleGetter, RouterData} from "modules";
import {ModuleNames} from "modules/names";
import {Module, RouterParser} from "react-coat";
import {matchPath} from "react-router";
import {Dispatch} from "redux";

type MG = typeof ModuleGetter;

const moduleToUrl: {[K in keyof MG]+?: string | {[V in keyof ReturnModule<MG[K]>["views"]]+?: string}} = {
  [ModuleNames.app]: {Main: "/", LoginForm: "/login"},
  [ModuleNames.photos]: {Main: "/photos", List: "/photos/list", Details: "/photos/item/:itemId"},
  [ModuleNames.videos]: {Main: "/videos"},
  [ModuleNames.comments]: {Main: "/:type/item/:typeId/comments", List: "/:type/item/:typeId/comments/list", Details: "/:type/item/:typeId/comments/item/:itemId"},
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

export function toPath<N extends keyof RouterData["pathData"], M extends ReturnModule<MG[N]>, V extends keyof M["views"], P extends RouterData["pathData"][N]>(
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
export function toUrl<R extends RouterData["searchData"], H extends RouterData["hashData"]>(pathname: string, searchData?: R | string, hashData?: H | string): string {
  let url = pathname;
  if (searchData) {
    let str = searchData as string;
    if (typeof searchData !== "string") {
      str = serialize(searchData);
    }
    if (str) {
      url += "?" + str.replace("?", "");
    }
  }
  if (hashData) {
    let str = hashData as string;
    if (typeof hashData !== "string") {
      str = serialize(hashData);
    }
    if (str) {
      url += "#" + str.replace("#", "");
    }
  }
  return url;
}

export function isCur<N extends keyof MG, M extends ReturnModule<MG[N]>, V extends keyof M["views"]>(views: RouterData["views"], moduleName: N, viewName?: V): boolean {
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
  pathData: {
    [moduleName: string]: {
      [key: string]: any;
    };
  };
  views: {
    [viewName: string]: boolean;
  };
} {
  const views: {[viewName: string]: boolean} = {};
  const pathData: {[moduleName: string]: {[key: string]: any}} = {};
  Object.keys(modulePaths).forEach(url => {
    const match = matchPath(pathname, url);
    if (match) {
      const result = modulePaths[url];
      views[result.join(".")] = true;
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

export const routerParser: RouterParser<RouterData> = (nextRouter, prevRouter) => {
  let nRouter: RouterData;
  if (prevRouter) {
    nRouter = {...prevRouter};
  } else {
    nRouter = {...nextRouter, views: {}, pathData: {}, searchData: {}, hashData: {}};
  }

  if (prevRouter && nextRouter.location.pathname !== prevRouter.location.pathname) {
    const {views, pathData} = parsePathname(nextRouter.location.pathname);
    nRouter.views = views;
    nRouter.pathData = pathData;
  }
  if (prevRouter && nextRouter.location.search !== prevRouter.location.search) {
    nRouter.searchData = nextRouter.location.search.split(/[&?]/).reduce(parseRoute, {});
  }
  if (prevRouter && nextRouter.location.hash !== prevRouter.location.hash) {
    nRouter.searchData = nextRouter.location.hash.split(/[&#]/).reduce(parseRoute, {});
  }
  return nRouter;
};
export function advanceRouter(url: string): RouterData | string {
  let [pathname, search, hash] = url.split(/[?#]/);
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
  return {location: {pathname, search, hash, state: null}, action: "POP", views, pathData, searchData, hashData};
}
export function linkTo(e: React.MouseEvent<HTMLAnchorElement>, dispatch: Dispatch) {
  e.preventDefault();
  const href = e.currentTarget.getAttribute("href") as string;
  if (href !== "#") {
    dispatch(routerActions.push(href));
  }
}
