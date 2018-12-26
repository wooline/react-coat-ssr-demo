import {ArticleDefined, ArticleResource} from "./article";

interface Item {
  title: string;
  departure: string;
  type: string;
  hot: number;
  price: number;
  coverUrl: string;
  comments: number;
}

export type VideoDefined = ArticleDefined & {
  ListItem: Item;
  ItemDetail: Item;
};

export type VideoResource = ArticleResource<VideoDefined>;

export type ListItem = VideoResource["ListItem"];
export type ListSearch = VideoResource["ListSearch"];
export type ListSummary = VideoResource["ListSummary"];
export type ListOptions = VideoResource["ListOptions"];
export type ItemDetail = VideoResource["ItemDetail"];
export type PathData = VideoResource["PathData"];
export type SearchData = VideoResource["SearchData"];
export type HashData = VideoResource["HashData"];
export type API = VideoResource["API"];
export type State = VideoResource["State"];
