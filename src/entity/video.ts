import {ArticleDefined, ArticleResource} from "./article";

interface Item {
  title: string;
  hits: number;
  commentCount: number;
  coverUrl: string;
  createTimeDesc: string;
  videoUrl: string;
}
export type VideoDefined = ArticleDefined & {
  ListItem: Item;
  ItemDetail: Item;
};
export type Resource = ArticleResource<VideoDefined>;

export type ListItem = Resource["ListItem"];
export type ListSearch = Resource["ListSearch"];
export type ListSummary = Resource["ListSummary"];
export type ListOptional = Resource["ListOptional"];
export type ItemDetail = Resource["ItemDetail"];
export type ListData = Resource["ListData"];
export type State = Resource["State"];
export type API = Resource["API"];
