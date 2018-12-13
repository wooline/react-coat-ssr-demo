import {DefaultResult} from "./common";

export interface ListData<Item, Search, Summary> {
  search: Search;
  items: Item[] | null;
  summary: Summary | null;
}

export type EditorType = "create" | "update";

export interface Defined {
  State?: {};
  SearchData?: {};
  PathData?: {};
  HashData?: {};
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
  PathData: {itemId?: string};
  ListItem: {
    id: string;
  };
  ListSearch: {
    page: number | null;
    pageSize: number | null;
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
  ListData: ListData<D["ListItem"], D["ListSearch"], D["ListSummary"]>;
  State: D["State"] & {
    itemDetail?: D["ItemDetail"];
    itemEditor?: D["ItemEditor"];
    selectedIds?: string[];
    searchData?: D["SearchData"] & {search?: Partial<D["ListSearch"]>};
    hashData?: D["HashData"];
    pathData?: D["PathData"];
    listData: ListData<D["ListItem"], D["ListSearch"], D["ListSummary"]>;
  };
  API: {
    hitItem?(id: string): Promise<void>;
    getItemDetail?(id: string): Promise<D["ItemDetail"]>;
    searchList(request: D["ListSearch"]): Promise<ListData<D["ListItem"], D["ListSearch"], D["ListSummary"]>>;
    createItem?(request: D["ItemCreateData"]): Promise<D["ItemCreateResult"]>;
    updateItem?(request: D["ItemUpdateData"]): Promise<D["ItemUpdateResult"]>;
    deleteItems?(ids: string[]): Promise<void>;
  };
}
