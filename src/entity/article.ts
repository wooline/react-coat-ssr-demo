import {Resource, ResourceDefined} from "./resource";

export type ArticleDefined = ResourceDefined & {
  ListSearch: {
    title: string;
  };
};

export interface ArticleResource<D extends ArticleDefined = ArticleDefined> extends Resource<D> {}
