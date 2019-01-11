declare module "rc-form";
declare module "deep-extend";
declare function getInitEnv(): {
  clientPublicPath: string;
  apiServerPath: {server: {[key: string]: string}; client: {[key: string]: string}};
};
declare const InitEnv: {
  clientPublicPath: string;
  apiServerPath: {[key: string]: string};
};
