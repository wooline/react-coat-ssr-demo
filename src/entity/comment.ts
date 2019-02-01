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
  PathData: {type: "photos" | "videos"; typeId: string};
  ListItem: Item;
  ItemDetail: Detail;
  ListSearch: {
    articleId: string;
    isNewest: boolean;
  };
  ItemCreateData: {
    articleId: string;
    content: string;
    commentId?: string;
  };
};

export type CommentResource = Resource<CommentDefined>;

export type ListItem = CommentResource["ListItem"];
export type ListSearch = CommentResource["ListSearch"];
export type ListSummary = CommentResource["ListSummary"];
export type ListOptions = CommentResource["ListOptions"];
export type ItemDetail = CommentResource["ItemDetail"];
export type ItemCreateData = CommentResource["ItemCreateData"];
export type ItemCreateResult = CommentResource["ItemCreateResult"];
export type PathData = CommentResource["PathData"];
export type SearchData = CommentResource["SearchData"];
export type HashData = CommentResource["HashData"];
export type API = CommentResource["API"];
export type State = CommentResource["State"];
