import {LoadingState} from "react-coat";
import {DefaultResult} from "./common";

export interface ListData<Item, Search, Summary> {
  search: Search;
  items: Item[] | null;
  summary: Summary | null;
}

export type EditorType = "create" | "update";

export interface Defined {
  ListItem: {};
  ListSearch: {};
  ListSummary: {};
  ItemDetail: {};
  ItemEditor: {};
  ItemCreateData: {};
  ItemUpdateData: {};
  ItemCreateResult: {};
  ItemUpdateResult: {};
}

interface Base<D extends Defined> {
  ListItem: D["ListItem"] & {
    id: string;
  };
  ListSearch: D["ListSearch"] & {
    page: number | null;
    pageSize: number | null;
  };
  ListSummary: D["ListSummary"] & {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
  ItemDetail: D["ItemDetail"] & {
    id: string;
  };
  ItemEditor: D["ItemEditor"] & {
    type: EditorType;
  };
  ItemCreateData: D["ItemCreateData"];
  ItemUpdateData: D["ItemUpdateData"] & {
    id: string;
  };
  ItemCreateResult: D["ItemCreateResult"] & DefaultResult;
  ItemUpdateResult: D["ItemUpdateResult"] & DefaultResult;
}
export interface Resource<D extends Defined = Defined, B extends Base<D> = Base<D>> {
  ListItem: B["ListItem"];
  ListSearch: B["ListSearch"];
  ListSummary: B["ListSummary"];
  ListOptional: Partial<B["ListSearch"]>;
  ItemDetail: B["ItemDetail"];
  ItemEditor: B["ItemEditor"];
  ItemCreateData: B["ItemCreateData"];
  ItemUpdateData: B["ItemUpdateData"];
  ItemCreateResult: B["ItemCreateResult"];
  ListData: ListData<B["ListItem"], B["ListSearch"], B["ListSummary"]>;
  State: {
    itemDetail?: B["ItemDetail"];
    itemEditor?: B["ItemEditor"];
    selectedIds?: string[];
    listData: ListData<B["ListItem"], B["ListSearch"], B["ListSummary"]>;
    loading: {global: LoadingState};
    route: {search?: B["ListSearch"]};
  };
  API: {
    hitItem?(id: string): Promise<void>;
    getItem?(id: string): Promise<B["ItemDetail"]>;
    searchList(request: B["ListSearch"]): Promise<ListData<B["ListItem"], B["ListSearch"], B["ListSummary"]>>;
    createItem?(request: B["ItemCreateData"]): Promise<B["ItemCreateResult"]>;
    updateItem?(request: B["ItemUpdateData"]): Promise<B["ItemUpdateResult"]>;
    deleteItems?(ids: string[]): Promise<void>;
  };
}
