import {ModuleNames} from "modules/names";
import {Resource, ResourceDefined} from "./resource";

interface Item {
  userId: string;
  username: string;
  avatarUrl: string;
  content: string;
  createdTime: string;
  replies: number;
}
interface Detail extends Item {
  repliesList: Array<Item & {id: string}>;
}
export type CommentDefined = ResourceDefined & {
  PathData: {type: ModuleNames.photos | ModuleNames.videos; typeId: string};
  ListItem: Item;
  ItemDetail: Detail;
  ListSearch: {
    articleId: string;
    isNewest: boolean;
  };
};

export type CommentResource = Resource<CommentDefined>;

export type ListItem = CommentResource["ListItem"];
export type ListSearch = CommentResource["ListSearch"];
export type ListSummary = CommentResource["ListSummary"];
export type ListOptional = CommentResource["ListOptional"];
export type ItemDetail = CommentResource["ItemDetail"];
export type ListData = CommentResource["ListData"];
export type PathData = CommentResource["PathData"];
export type State = CommentResource["State"];
export type SearchData = State["searchData"];
export type API = CommentResource["API"];
