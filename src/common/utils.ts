import {matchPath} from "react-router";
import {RedirectError} from "./Errors";

export function checkFastRedirect(pathname: string, rules: Array<{path?: string; exact?: boolean; module: string}>) {
  rules.forEach(route => {
    if (matchPath(pathname, route)) {
      throw new RedirectError("301", route.module);
    }
  });
  return true;
}
