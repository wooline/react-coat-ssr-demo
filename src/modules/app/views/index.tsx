import {exportView} from "react-coat";
import model from "../model";
import LoginFormnComponent from "./LoginForm";
import MainComponent from "./Main";

export const Main = exportView(MainComponent, model);
export const LoginForm = exportView(LoginFormnComponent, model);
