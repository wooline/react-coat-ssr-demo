import axios, {AxiosRequestConfig} from "axios";

export default function ajax<T>(method: string, url: string, params: {[key: string]: any} = {}, data: {[key: string]: any} = {}, headers: {[key: string]: string} = {}): Promise<T> {
  method = method.toLocaleLowerCase();
  url = url.replace(/:\w+/g, flag => {
    const key = flag.substr(1);
    if (params[key]) {
      const val: string = params[key];
      delete params[key];
      return encodeURIComponent(val);
    } else {
      return "";
    }
  });
  Object.keys(InitEnv.apiServer).some(key => {
    const reg = new RegExp(key);
    if (reg.test(url)) {
      url = url.replace(reg, InitEnv.apiServer[key]);
      return true;
    } else {
      return false;
    }
  });

  const config: AxiosRequestConfig = {method, url, params, data};

  return axios.request(config).then(response => response.data);
}

/* export function stringifyQuery<A>(key: string, args: A, defArgs: A, locationSearch: string): string {
  const parms = Object.keys(args).reduce((prev, cur) => {
    if (typeof args[cur] === "object") {
      if (JSON.stringify(args[cur]) !== JSON.stringify(defArgs[cur])) {
        prev[cur] = args[cur];
      }
    } else {
      if (args[cur] !== defArgs[cur]) {
        prev[cur] = args[cur];
      }
    }

    return prev;
  }, {});
  const jsonStr = escape(JSON.stringify(parms));
  const str = key + "=";
  const search = locationSearch.replace(new RegExp("[&?]" + str + "[^&]*", "i"), "") + ("&" + str + jsonStr);
  return search.replace(/^&/, "?");
} */

/* export function pushQuery(moduleName: string, key: string, args: string | boolean | number | object | null, locationSearch: string): string {
  const jsonStr = escape(JSON.stringify(args));
  const str = `${moduleName}-${key}=`;
  const search = locationSearch.replace(new RegExp("[&?]" + str + "[^&]*", "i"), "") + ("&" + str + jsonStr);
  return search.replace(/^&/, "?");
} */

/* export function extractQuery(key: string, locationSearch: string): string | boolean | number | object | null {
  const str = key + "=";
  let [, query] = locationSearch.split(str);
  if (query) {
    query = query.split("&")[0];
  }
  if (query) {
    const args = JSON.parse(unescape(query), (prop: any, value: any) => {
      if (typeof value === "string" && ISO_DATE_FORMAT.test(value)) {
        return new Date(value);
      }
      return value;
    });
    return args;
  } else {
    return null;
  }
} */

/* export function parseModuleRouteData(moduleName: string, search: string): {[key: string]: string | boolean | number | object | null} | null {
  const arr = search.match(new RegExp(`\\b${moduleName}\\b[\\w-]*=`, "g"));
  if (arr) {
    return arr.reduce((pre, cur) => {
      pre[cur.replace(`${moduleName}-`, "")] = extractQuery(cur.substr(0, cur.length - 1), search);
      return pre;
    }, {});
  } else {
    return null;
  }
} */
