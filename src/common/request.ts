import axios, {AxiosError, AxiosRequestConfig} from "axios";
import {CustomError} from "common/Errors";

axios.interceptors.response.use(
  response => response,
  error => {
    handleError(error);
  }
);

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
  Object.keys(InitEnv.apiServerPath).some(key => {
    const reg = new RegExp(key);
    if (reg.test(url)) {
      url = url.replace(reg, InitEnv.apiServerPath[key]);
      return true;
    } else {
      return false;
    }
  });

  const config: AxiosRequestConfig = {method, url, params, data};

  return axios.request(config).then(response => response.data);
}
function handleError(error: AxiosError) {
  const httpErrorCode = error.response ? error.response.status : 0;
  const responseData = error.response ? error.response.data : "";

  const errorMessage = responseData && responseData.message ? responseData.message : `failed to call ${error.config.url}`;
  throw new CustomError(errorMessage, httpErrorCode.toString(), responseData);
}
