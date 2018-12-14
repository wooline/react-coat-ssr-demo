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
  SearchData: {showComment?: boolean};
};

export type PhotoResource = ArticleResource<PhotoDefined>;

export type ListItem = PhotoResource["ListItem"];
export type ListSearch = PhotoResource["ListSearch"];
export type ListSummary = PhotoResource["ListSummary"];
export type ListOptional = PhotoResource["ListOptional"];
export type ItemDetail = PhotoResource["ItemDetail"];
export type ListData = PhotoResource["ListData"];
export type State = PhotoResource["State"];
export type SearchData = State["searchData"];
export type API = PhotoResource["API"];
