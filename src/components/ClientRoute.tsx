import * as React from "react";
import {Route, RouteProps} from "react-router-dom";

const isBrowser = typeof window === "object";

const Component = (props: RouteProps) => {
  return isBrowser ? <Route {...props} /> : null;
};

export default Component;
