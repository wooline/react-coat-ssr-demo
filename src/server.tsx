import Model from "modules/app/model";
import {Main} from "modules/app/views";
import {renderApp} from "react-coat-pkg";

export default function render(path: string) {
  return renderApp(Model, Main, [path]);
}
