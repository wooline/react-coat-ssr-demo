import {Defined as ArticleDefined, Resource as ArticleResource} from "./article";

export interface VideoItem {
  id: string;
  url: string;
}
interface Item {
  title: string;
  hits: number;
  commentCount: number;
  coverUrl: string;
  createTimeDesc: string;
  video: VideoItem[];
}
export interface Defined extends ArticleDefined {
  ListItem: Item;
  ItemDetail: Item & {remark: string};
}
export type Resource = ArticleResource<Defined>;

export type ListItem = Resource["ListItem"];
export type ListSearch = Resource["ListSearch"];
export type ListSummary = Resource["ListSummary"];
export type ListOptional = Resource["ListOptional"];
export type ItemDetail = Resource["ItemDetail"];
export type ListData = Resource["ListData"];
export type State = Resource["State"];
export type API = Resource["API"];
