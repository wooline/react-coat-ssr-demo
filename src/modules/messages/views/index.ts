import {exportView} from "react-coat";
import model from "../model";
import ListComponent from "./List";
import MainComponent from "./Main";

export const Main = exportView(MainComponent, model);
export const List = exportView(ListComponent, model);
