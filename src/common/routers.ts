import {routerActions} from "connected-react-router";
import * as assignDeep from "deep-extend";
import {RootRouter, routerData, viewToPath} from "modules";
import {ModuleNames} from "modules/names";
import {RouterParser} from "react-coat";
import {matchPath} from "react-router";
import {Dispatch} from "redux";

/*
@Type PathToView
根据 modules/index.ts中定义的 viewToPath 反推导出来，形如：
{
  "/": ["app", "Main"],
  "/photos": ["photos", "Main"],
  "/photos/:itemId": ["photos", "Details"],
  "/videos": ["videos", "Main"],
  "/videos/:itemId": ["videos", "Details"],
  "/messages": ["messages", "Main"],
  "/:type/:typeId/comments": ["comments", "Main"],
  "/:type/:typeId/comments/:itemId": ["comments", "Details"],
}
*/
type ViewToPath = typeof viewToPath;
type PathToView = {[pathname: string]: [string, string]};

const pathToView: PathToView = ((maps: {[mName: string]: string | {[vName: string]: string}}) => {
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
})(viewToPath as any);

/*
  解析 pathname，得到当前展示了哪些 view，以及 pathname中的参数，不同模块对应的解析结果是不同的，例如：
  当前 pathname 为 /photos/2/comments/66
  对于 photos 模块，因为配置了："/photos/:itemId": ["photos", "Details"]，所以解析出 {itemId:2}, 当前展示Details
  对于 comments 模块，因为配置了："/:type/:typeId/comments/:itemId": ["comments", "Details"]，所以解析出 {type:photos, typeId:2, itemId:66}, 当前展示Details
*/
function parsePathname(pathname: string) {
  const views: RootRouter["views"] = {};
  const pathData: {[moduleName: string]: {[key: string]: any}} = {};
  Object.keys(pathToView).forEach(url => {
    const match = matchPath(pathname, url);
    if (match) {
      const [moduleName, viewName] = pathToView[url];
      if (!views[moduleName]) {
        views[moduleName] = {[viewName]: 1};
      } else {
        views[moduleName][viewName] = 1;
      }
      if (match.params) {
        pathData[moduleName] = match.params;
      }
    }
  });
  return {views, pathData};
}

/*
  根据 modules/index.ts中定义的 viewToPath, 只需知道要展示哪个view，就能推导出它的 pathname，并自动将path中的参数占位符替换，例如：
  /:type/:typeId/comments => photos/4/comments
*/
export function toPath<N extends ModuleNames, V extends keyof ViewToPath[N], P extends RootRouter["pathData"][N]>(moduleName: N, viewName: V, params?: P): string {
  const pathExp = viewToPath[moduleName as "app"][viewName as "Main"] || "";
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

// 生成 Url
export function toUrl(pathname: string, searchData?: RootRouter["searchData"] | null, hashData?: RootRouter["hashData"]): string {
  let url = pathname;
  if (searchData) {
    const str = serialize(excludeDefData(searchData, routerData.wholeSearchData));
    if (str) {
      url += "?" + str.replace("?", "");
    }
  }
  if (hashData) {
    const str = serialize(excludeDefData(hashData, routerData.wholeHashData));
    if (str) {
      url += "#" + str.replace("#", "");
    }
  }
  return url;
}

/*
用JSON格式序列化路由参数，并加上模块名作前缀，例如：
{
  app: {showSearch: false, showRegisterPop: false},
  photos: {search: {title: "张家界"}, showComment: false},
}
序列化为：
app-showSearch=false&app-showRegisterPop=false&photos-search={title: "张家界"}&photos-showComment=false
*/
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

/*
  将module前缀去掉，并转换成结构，列如：
  app-showSearch=false&app-showRegisterPop=false&photos-search={title: "张家界"}&photos-showComment=false
  反序列化为：
  {
    app: {showSearch: false, showRegisterPop: false},
    photos: {search: {title: "张家界"}, showComment: false},
  }
*/
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
      pre[moduleName][moduleKey] = unserializeQuery(val);
    }
  }
  return pre;
}

const ISO_DATE_FORMAT = /^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(\.\d+)?(Z|[+-][01]\d:[0-5]\d)$/;

/*
  将字符串变成 Data，因为 JSON 中没有 Date 类型，所以用正则表达式匹配自动转换
*/
function unserializeQuery(query: string): any {
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

/*
 排除默认路由参数，如果传参与默认一致，则省去
*/
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

/*
 合并默认路由参数，与以上方法互逆，并补足当前views中展示的
*/
function mergeDefData<T extends {[moduleName: string]: any}>(views: {[moduleName: string]: any}, data: any, def: T) {
  const newData: T = {...data};
  Object.keys(views).forEach(moduleName => {
    if (!newData[moduleName]) {
      newData[moduleName] = {};
    }
  });
  Object.keys(newData).forEach(moduleName => {
    if (def[moduleName]) {
      newData[moduleName] = assignDeep({}, def[moduleName], data[moduleName]);
    }
  });
  return newData;
}

/*
  react-coat 框架中只集成了 connected-react-router，只对路由做简单的解析，比如：
  /photos/item/2/comments/item/66?photos-search={title: "张家界"}&photos-showComment=false
  connected-react-router 只解析为：{
    location: {
      pathname: "/photos/item/2/comments/item/66",
      search: "photos-search={title: "张家界"}&photos-showComment=false",
      hash: ""
    }
  }
  react-coat 框架留了一个自定义解析的钩子方便用户扩展：
  RouterParser<T = any> = (nextRouter: T, prevRouter?: T) => T
*/
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
    nRouter.wholeSearchData = mergeDefData(nRouter.views, nRouter.searchData, routerData.wholeSearchData);
  }
  if (changed.pathname || changed.hash) {
    nRouter.wholeHashData = mergeDefData(nRouter.views, nRouter.hashData, routerData.wholeHashData);
  }
  return nRouter;
};

/*
为了节省ssr时服务器资源，将一些能静态判断的URL跳转及路由解析提前处理
该方法只作抛砖引玉的示例，还有很多细节未完整处理
*/
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
      replace: "/photos",
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
    wholeSearchData: mergeDefData(views, searchData, routerData.wholeSearchData),
    wholeHashData: mergeDefData(views, hashData, routerData.wholeHashData),
  };
}

export function linkTo(e: React.MouseEvent<HTMLAnchorElement>, dispatch: Dispatch) {
  e.preventDefault();
  const href = e.currentTarget.getAttribute("href") as string;
  if (href && href !== "#") {
    dispatch(routerActions.push(href));
  }
}
