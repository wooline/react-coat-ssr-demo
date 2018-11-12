import * as app from "modules/app";
import * as photos from "modules/photos";
import * as videos from "modules/videos";
import {renderApp} from "react-coat-pkg";

const modules = {app, photos, videos};

export default function render(path: string) {
  return renderApp([path], {
    getModule: (name: string) => {
      return modules[name];
    },
  });
}
