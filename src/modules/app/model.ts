import {Toast} from "antd-mobile";
import {CustomError} from "common/Errors";
import {isCur} from "common/routers";
import {isBrowser} from "common/utils";
import {ProjectConfig, StartupStep} from "entity/global";
import {CurUser} from "entity/session";
import {moduleGetter, RootState} from "modules";
import {ModuleNames} from "modules/names";
import {Actions, BaseModuleHandlers, BaseModuleState, effect, ERROR, exportModel, LoadingState, loadModel, LOCATION_CHANGE, reducer} from "react-coat";
import * as sessionService from "./api/session";
import * as settingsService from "./api/settings";

// 定义本模块的State类型

export interface State extends BaseModuleState {
  showLoginPop?: boolean;
  showNotFoundPop?: boolean;
  showRegisterPop?: boolean;
  showSearch?: boolean;
  projectConfig: ProjectConfig | null;
  curUser: CurUser | null;
  startupStep: StartupStep;
  loading: {
    global: LoadingState;
    login: LoadingState;
  };
}

// 定义本模块的Handlers
class ModuleHandlers extends BaseModuleHandlers<State, RootState, ModuleNames> {
  constructor() {
    // 定义本模块State的初始值
    const initState: State = {
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
  @reducer
  protected putCurUser(curUser: CurUser): State {
    return {...this.state, curUser};
  }
  @reducer
  public putCloseLoginPop(): State {
    return {...this.state, showLoginPop: false};
  }
  @reducer
  public putCloseNotFoundPop(): State {
    return {...this.state, showNotFoundPop: false};
  }
  @effect("login") // 使用自定义loading状态
  public async login(payload: {username: string; password: string}) {
    const loginResult = await sessionService.api.login(payload);
    if (!loginResult.error) {
      this.updateState({curUser: loginResult.data});
      Toast.success("欢迎您回来！");
    } else {
      alert(loginResult.error.message);
    }
  }

  @effect()
  protected async parseRouter() {
    const searchData = this.rootState.router.wholeSearchData.app! || {};
    this.updateState({
      showSearch: searchData.showSearch,
      showRegisterPop: searchData.showRegisterPop,
    });
  }

  @effect(null)
  protected async [LOCATION_CHANGE]() {
    // 由于 parseRouter 是 protected 不对外开放的，所以这里不能使用 this.actions.parseRouter() 必须使用 this.callThisAction(this.parseRouter)
    this.dispatch(this.callThisAction(this.parseRouter));
  }

  // uncatched错误会触发@@framework/ERROR，兼听并发送给后台
  // 在服务器渲染时，仅能兼听到model执行时的错误，其它错误请用nodejs兼听
  @effect(null)
  protected async [ERROR](error: CustomError) {
    if (error.code === "401") {
      this.updateState({showLoginPop: true});
    } else if (error.code === "404") {
      this.updateState({showNotFoundPop: true});
    } else if (error.code === "301" || error.code === "302") {
      this.dispatch(this.routerActions.replace(error.detail));
    } else if (isBrowser()) {
      Toast.fail(error.message);
      await settingsService.api.reportError(error);
    } else {
      console.log(error);
    }
  }

  // 兼听自已的INIT Action，做一些异步数据请求，不需要手动触发，所以请使用protected或private
  @effect()
  protected async [ModuleNames.app + "/INIT"]() {
    this.parseRouter();

    const [projectConfig, curUser] = await Promise.all([settingsService.api.getSettings(), sessionService.api.getCurUser()]);
    this.updateState({
      projectConfig,
      curUser,
      startupStep: StartupStep.configLoaded,
    });

    // 以下逻辑专为 SSR 设计，在浏览器端运行时，加载 view 会自动导入其 model，所以我们无需手动 load model。
    // 在 SSR 时，我们不能等到加载 view 时再来自动导入 model，需要提前手动 load model。
    const views = this.rootState.router.views;
    const subModules: ModuleNames[] = [ModuleNames.photos, ModuleNames.videos];
    for (const subModule of subModules) {
      if (isCur(views, subModule)) {
        // 加载子模块的model，并初始化它
        await loadModel(moduleGetter[subModule as any]).then(subModel => subModel(this.store));
        break;
      }
    }
  }
}

// 导出本模块的Actions
export type ModuleActions = Actions<ModuleHandlers>;

export default exportModel(ModuleNames.app, ModuleHandlers);
