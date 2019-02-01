import {ArticleResource} from "entity/article";
import {moduleGetter} from "modules";
import {loadModel} from "react-coat";
import ResourceHandlers from "./ResourceHandlers";

export default class Handlers<S extends R["State"], R extends ArticleResource> extends ResourceHandlers<S, R> {
  /*
    使用服务器渲染时，不能依赖于react-router-dom路由来自动载入model，需要自已载入model
  */
  protected async onInit() {
    const result = await super.onInit();
    if (result.views[this.namespace as "photos"]!.Details) {
      await loadModel(moduleGetter.comments).then(subModel => subModel(this.store));
    }
    return result;
  }
}
