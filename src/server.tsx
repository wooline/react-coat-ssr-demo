import * as React from "react";
import * as ReactServer from "react-dom/server";
import App from "./App";

export default ReactServer.renderToString(<App />);
