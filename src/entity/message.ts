import {ArticleDefined, ArticleResource} from "./article";

interface Item {
  author: string;
  content: string;
  date: Date;
}

export type MessageDefined = ArticleDefined & {
  ListItem: Item;
};

export type MessageResource = ArticleResource<MessageDefined>;

export type ListItem = MessageResource["ListItem"];
export type ListSearch = MessageResource["ListSearch"];
export type ListSummary = MessageResource["ListSummary"];
export type ListOptions = MessageResource["ListOptions"];
export type ItemDetail = MessageResource["ItemDetail"];
export type PathData = MessageResource["PathData"];
export type SearchData = MessageResource["SearchData"];
export type HashData = MessageResource["HashData"];
export type API = MessageResource["API"];
export type State = MessageResource["State"];
