import {Defined as CommonDefined, Resource as CommonResource} from "./resource";

export interface Defined extends CommonDefined {
  ListSearch: {
    title: string | null;
  };
}
export interface Actions {
  id: string;
  comment: boolean;
}
export interface Resource<D extends Defined = Defined> extends CommonResource<D> {
  State: CommonResource<D>["State"];
}
