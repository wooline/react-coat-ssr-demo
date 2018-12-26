import {isCur} from "common/routers";
import {ArticleResource} from "entity/article";
import {ModuleGetter} from "modules";
import {loadModel} from "react-coat";
import ResourceHandlers from "./ResourceHandlers";

export default class Handlers<S extends R["State"], R extends ArticleResource> extends ResourceHandlers<S, R> {
  protected async onInit() {
    const result = await super.onInit();
    if (isCur(result.views, this.namespace, "Details" as any)) {
      await loadModel(ModuleGetter.comments).then(subModel => subModel(this.store));
    }
    return result;
  }
}
