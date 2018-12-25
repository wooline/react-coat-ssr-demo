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

export type PhotoDefined = ArticleDefined & {
  ListItem: Item;
  ItemDetail: Item & {remark: string; picList: string[]};
  SearchData: {showComment: boolean};
};

export type PhotoResource = ArticleResource<PhotoDefined>;

export type ListItem = PhotoResource["ListItem"];
export type ListSearch = PhotoResource["ListSearch"];
export type ListSummary = PhotoResource["ListSummary"];
export type ListOptions = PhotoResource["ListOptions"];
export type ItemDetail = PhotoResource["ItemDetail"];
export type PathData = PhotoResource["PathData"];
export type SearchData = PhotoResource["SearchData"];
export type HashData = PhotoResource["HashData"];
export type API = PhotoResource["API"];
export type State = PhotoResource["State"];
