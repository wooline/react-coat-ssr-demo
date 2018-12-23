import {BaseModuleState} from "react-coat";
import {DefaultResult} from "./common";

export type EditorType = "create" | "update";

export interface Defined {
  State: {};
  SearchData: {};
  PathData: {};
  HashData: {};
  ListItem?: {};
  ListSearch?: {};
  ListSummary?: {};
  ItemDetail?: {};
  ItemEditor?: {};
  ItemCreateData?: {};
  ItemUpdateData?: {};
  ItemCreateResult?: {};
  ItemUpdateResult?: {};
}

export type ResourceDefined = Defined & {
  State: BaseModuleState;
  PathData: {itemId?: string};
  ListItem: {
    id: string;
  };
  ListSearch: {
    page: number;
    pageSize: number;
  };
  ListSummary: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
  ItemDetail: {
    id: string;
  };
  ItemEditor: {
    type: EditorType;
  };
  ItemUpdateData: {
    id: string;
  };
  ItemCreateResult: DefaultResult;
  ItemUpdateResult: DefaultResult;
};
export interface Resource<D extends ResourceDefined = ResourceDefined> {
  ListItem: D["ListItem"];
  ListSearch: D["ListSearch"];
  ListSummary: D["ListSummary"];
  ListOptional: Partial<D["ListSearch"]>;
  ItemDetail: D["ItemDetail"];
  ItemEditor: D["ItemEditor"];
  ItemCreateData: D["ItemCreateData"];
  ItemUpdateData: D["ItemUpdateData"];
  ItemCreateResult: D["ItemCreateResult"];
  SearchData: D["SearchData"] & {search?: D["ListSearch"]};
  PathData: D["PathData"];
  State: D["State"] & {
    listSearch: D["ListSearch"];
    listItems?: Array<D["ListItem"]>;
    listSummary?: D["ListSummary"];
    itemDetail?: D["ItemDetail"];
    itemEditor?: D["ItemEditor"];
    selectedIds?: string[];
  };
  API: {
    hitItem?(id: string): Promise<void>;
    getItemDetail?(id: string): Promise<D["ItemDetail"]>;
    searchList(request: D["ListSearch"]): Promise<{listItems: Array<D["ListItem"]>; listSummary: D["ListSummary"]}>;
    createItem?(request: D["ItemCreateData"]): Promise<D["ItemCreateResult"]>;
    updateItem?(request: D["ItemUpdateData"]): Promise<D["ItemUpdateResult"]>;
    deleteItems?(ids: string[]): Promise<void>;
  };
}
