import {Resource} from "entity/article";
import ResourceHandlers from "./ResourceHandlers";

export default class Handlers<S extends R["State"], R extends Resource> extends ResourceHandlers<S, R> {}
