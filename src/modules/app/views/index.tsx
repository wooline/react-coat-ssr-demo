import {exportView} from "react-coat";
import model from "../model";
import MainComponent from "./Main";

export const Main = exportView(MainComponent, model, "Main");
