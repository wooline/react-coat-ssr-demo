import assignDeep from "assign-deep";
import {routerActions} from "connected-react-router";
import {defSearch, ModuleGetter, RouterData} from "modules";
import {ModuleNames} from "modules/names";
import {Module} from "react-coat";
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

export function toQuery<R extends RouterData["searchData"], H extends RouterData["hashData"]>(
  pathname: string,
  rootRouter: RouterData,
  newSearchData?: R | string,
  extendSearchData?: boolean,
  newHashData?: H | string,
  extendHashData?: boolean
) {
  const {searchData, hashData} = rootRouter;
  let url = pathname;
  if (newSearchData) {
    let str = newSearchData as string;
    if (typeof newSearchData !== "string") {
      if (extendSearchData) {
        str = serialize({...searchData, ...newSearchData});
      } else {
        str = serialize(newSearchData);
      }
    }
    if (str) {
      url += "?" + str;
    }
  }
  if (newHashData) {
    let str = newHashData as string;
    if (typeof newHashData !== "string") {
      if (extendHashData) {
        str = serialize({...hashData, ...newHashData});
      } else {
        str = serialize(newHashData);
      }
    }
    if (str) {
      url += "#" + str;
    }
  }
  return url;
}

export function replaceQuery<R extends RouterData["searchData"], H extends RouterData["hashData"]>(
  rootRouter: RouterData,
  newSearchData?: R | string,
  extendSearchData?: boolean,
  newHashData?: H | string,
  extendHashData?: boolean
) {
  const {pathname} = rootRouter;
  return toQuery(pathname, rootRouter, newSearchData, extendSearchData, newHashData, extendHashData);
}

export function toUrl<
  N extends keyof RouterData["pathData"],
  M extends ReturnModule<MG[N]>,
  V extends keyof M["views"],
  P extends RouterData["pathData"][N],
  R extends RouterData["searchData"],
  H extends RouterData["hashData"]
>(rootRouter: RouterData, moduleName: N, viewName?: V, params?: P, newSearchData?: R | string, extendSearchData?: boolean, newHashData?: H | string, extendHashData?: boolean): string {
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
  return toQuery(pathname, rootRouter, newSearchData, extendSearchData, newHashData, extendHashData);
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

export function searchParser(
  search: string,
  views: {[viewName: string]: boolean}
): {
  [moduleName: string]: {
    [key: string]: any;
  };
} {
  const data: {[moduleName: string]: {[key: string]: any}} = search.split(/[&?]/).reduce(parseRoute, {});
  Object.keys(views).forEach(vName => {
    const mName = vName.split(".")[0];
    if (!data[mName]) {
      data[mName] = {};
    }
  });
  Object.keys(data).forEach(mName => {
    data[mName] = assignDeep({}, defSearch[mName], data[mName]);
  });

  return data;
}
export function hashParser(
  hash: string,
  views: {[viewName: string]: boolean}
): {
  [moduleName: string]: {
    [key: string]: any;
  };
} {
  const data: {[moduleName: string]: {[key: string]: any}} = hash.split(/[&#]/).reduce(parseRoute, {});
  Object.keys(views).forEach(vName => {
    const mName = vName.split(".")[0];
    if (!data[mName]) {
      data[mName] = {};
    }
  });
  return data;
}
export function pathParser(
  pathname: string
): {
  data: {
    [moduleName: string]: {
      [key: string]: any;
    };
  };
  views: {
    [viewName: string]: boolean;
  };
} {
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
}

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
  const {views, data} = pathParser(pathname);
  if (Object.keys(views).length < 2) {
    return `${InitEnv.clientPublicPath}404.html`;
  }
  return {pathname, search, hash, views, pathData: data, searchData: searchParser(search, views), hashData: hashParser(hash, views)};
}
export function linkTo(e: React.MouseEvent<HTMLAnchorElement>, dispatch: Dispatch) {
  e.preventDefault();
  const href = e.currentTarget.getAttribute("href") as string;
  if (href !== "#") {
    dispatch(routerActions.push(href));
  }
}
