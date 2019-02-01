import {exportView} from "react-coat";
import model from "../model";
import DetailsComponent from "./Details";
import ListComponent from "./List";
import MainComponent from "./Main";

enum ViewNames {
  Main = "Main",
  List = "List",
  Details = "Details",
}
export const Main = exportView(MainComponent, model, ViewNames.Main);
export const List = exportView(ListComponent, model, ViewNames.List);
export const Details = exportView(DetailsComponent, model, ViewNames.Details);
