import {Resource} from "entity/article";
import ResourceHandlers from "./ResourceHandlers";

export default class Handlers<S extends R["State"], R extends Resource> extends ResourceHandlers<S, R> {
  /* @effect()
  *showComment(show: boolean): SagaIterator {
    yield this.put(this.routerActions.push(stringifyQuery<Actions>("media", Object.assign({}, this.state.actions, {comment: show}))));
  } */
}
