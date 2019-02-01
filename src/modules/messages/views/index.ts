import {exportView} from "react-coat";
import model from "../model";
import ListComponent from "./List";
import MainComponent from "./Main";

enum ViewNames {
  Main = "Main",
  List = "List",
}
export const Main = exportView(MainComponent, model, ViewNames.Main);
export const List = exportView(ListComponent, model, ViewNames.List);
