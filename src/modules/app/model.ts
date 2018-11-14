import {CustomError, RedirectError} from "core/Errors";
import {ProjectConfig, StartupStep} from "entity/global";
import {CurUser} from "entity/session";
import {ModuleGetter, RootState} from "modules";
import {ModuleNames} from "modules/names";
import {Actions, BaseModuleHandlers, BaseModuleState, effect, ERROR, exportModel, loading, LoadingState, loadModel, reducer, RouterState} from "react-coat-pkg";
import * as sessionService from "./api/session";
import * as settingsService from "./api/settings";

enum SubModule {
  photos = "photos",
  videos = "videos",
  my = "my",
}
interface Router {
  subModule: SubModule;
}

// 定义本模块的State
export interface State extends BaseModuleState {
  subModule: SubModule;
  projectConfig: ProjectConfig;
  curUser: CurUser;
  startupStep: StartupStep;
  loading: {
    global: LoadingState;
    login: LoadingState;
  };
}

// 定义本模块的Handlers
class ModuleHandlers extends BaseModuleHandlers<State, RootState> {
  constructor() {
    // 定义本模块State的初始值
    const initState: State = {
      subModule: null,
      projectConfig: null,
      curUser: null,
      startupStep: StartupStep.init,

      loading: {
        global: LoadingState.Stop,
        login: LoadingState.Stop,
      },
    };
    super(initState);
  }
  @reducer
  public putStartup(startupStep: StartupStep): State {
    return {...this.state, startupStep};
  }

  @loading("login") // 使用自定义loading状态
  @effect
  public async login(payload: {username: string; password: string}) {
    const loginResult = await sessionService.api.login(payload);
    if (!loginResult.error) {
      this.dispatch(this.callThisAction(this.putCurUser, loginResult.data));
    } else {
      alert(loginResult.error.message);
    }
  }

  @reducer
  protected putCurUser(curUser: {uid: string; username: string; hasLogin: boolean}): State {
    return {...this.state, curUser};
  }

  protected parseRouter(router: RouterState): Router {
    return {subModule: SubModule[router.location.pathname.replace(/^\//, "")] || SubModule.photos};
  }
  // 兼听自已的INIT Action，做一些异步数据请求，不需要手动触发，所以请使用protected或private
  @loading() // 使用全局loading状态
  @effect
  protected async [ModuleNames.app + "/INIT"]() {
    const [projectConfig, curUser] = await Promise.all([settingsService.api.getSettings(), sessionService.api.getCurUser()]);
    const router = this.parseRouter(this.rootState.router);
    if (router.subModule === SubModule.my && !curUser.hasLogin) {
      throw new RedirectError("301", "/login");
    }
    this.dispatch(this.callThisAction(this.UPDATE, {...this.state, subModule: router.subModule, projectConfig, curUser, startupStep: StartupStep.configLoaded}));
    await loadModel(ModuleGetter.photos).then(subModel => subModel(this.store));
    // const pathname = this.rootState.router.location.pathname;
    // const views = { level1: null };
    // if (pathname.startsWith("/admin")) {
    //   if (hasAuth(pathname, curUser) === "Forbidden") {
    //     views.level1 = "Login";
    //   } else {
    //     await import(/* webpackChunkName: "admin" */ "modules/admin/model").then(admin => admin.default());
    //   }
    // }
    // this.dispatch(this.callThisAction(this.UPDATE, { ...this.state, views }));
    // // 最后记得必须手动触发调用INITED
    // this.dispatch(this.callThisAction(this.setInited));
  }

  // 兼听全局错误的Action，并发送给后台
  // 兼听外部模块的Action，不需要手动触发，所以请使用protected或private
  @effect
  protected async [ERROR](error: CustomError) {
    if (error.code === "301" || error.code === "302") {
      this.dispatch(this.routerActions.replace(error.detail));
    } else {
      await settingsService.api.reportError(error);
    }
  }
}

// 导出本模块的Actions
export type ModuleActions = Actions<ModuleHandlers>;

export default exportModel(ModuleNames.app, ModuleHandlers);
