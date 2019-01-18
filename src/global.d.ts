declare module "rc-form";
declare module "deep-extend";

// 定义全局设置数据结构
declare const InitEnv: {
  clientPublicPath: string;
  apiServerPath: {[key: string]: string};
};

// 在浏览器中，全局对象持载在 window 对象上
declare interface Window {
  InitEnv: typeof InitEnv;
}

// 在server中，全局对象持载在 global 对象上
declare namespace NodeJS {
  interface Global {
    InitEnv: typeof InitEnv;
  }
}

// 定义获取全局设置的函数，为了在上线后可以由运维修改，该函数的实现放在/public/index.html中，以防止被 webpack 打包
declare function getInitEnv(): {
  clientPublicPath: string;
  apiServerPath: {server: {[key: string]: string}; client: {[key: string]: string}};
};
