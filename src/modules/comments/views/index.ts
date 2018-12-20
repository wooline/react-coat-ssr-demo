import {exportView} from "react-coat";
import model from "../model";
import DetailsComponent from "./Details";
import ListComponent from "./List";
import MainComponent from "./Main";

export const Main = exportView(MainComponent, model);
export const List = exportView(ListComponent, model);
export const Details = exportView(DetailsComponent, model);
