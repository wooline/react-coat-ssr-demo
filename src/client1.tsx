import {buildApp} from "react-coat-pkg";

declare global {
  interface Window {
    reactCoatInitStore: any;
  }
}

buildApp(
  {
    initData: window.reactCoatInitStore,
    getModule: (name: string) => {
      return import(/* webpackChunkName: "module-[request]", webpackInclude: /[\/\\]modules[\/\\]\w+[\/\\]index\.(js|ts)$/ */ `modules/${name}/`);
    },
  },
  "root",
);
