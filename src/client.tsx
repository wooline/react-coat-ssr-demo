import Model from "modules/app/model";
import {Main} from "modules/app/views";
import {buildApp} from "react-coat-pkg";

declare global {
  interface Window {
    reactCoatInitStore: {
      api: string;
      wh: [number, number];
    };
  }
}

buildApp(Model, Main, "root", {initData: window.reactCoatInitStore});
