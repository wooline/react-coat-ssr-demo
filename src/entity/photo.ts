import {Defined as ArticleDefined, Resource as ArticleResource} from "./article";

export interface PhotoItem {
  id: string;
  photoId: string;
  photoUrl: string;
}
interface Item {
  title: string;
  departure: string;
  type: string;
  hot: number;
  price: number;
  coverUrl: string;
  comments: number;
}
export interface Defined extends ArticleDefined {
  ListItem: Item;
  ItemDetail: Item & {remark: string; picList: string[]};
}
export type Resource = ArticleResource<Defined>;

export type ListItem = Resource["ListItem"];
export type ListSearch = Resource["ListSearch"];
export type ListSummary = Resource["ListSummary"];
export type ListOptional = Resource["ListOptional"];
export type ItemDetail = Resource["ItemDetail"];
export type ListData = Resource["ListData"];
export type State = Resource["State"] & {showComment: boolean};
export type API = Resource["API"];
