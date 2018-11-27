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

  return axios
    .request(config)
    .then(response => response.data)
    .catch(error => {
      console.log(error);
    });
}
