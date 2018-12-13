import {ArticleResource} from "entity/article";
import ResourceHandlers from "./ResourceHandlers";

export default class Handlers<S extends R["State"], R extends ArticleResource> extends ResourceHandlers<S, R> {}
