import {Toast} from "antd-mobile";
import {CustomError, RedirectError} from "common/Errors";
import {isCur, toUrl} from "common/routers";
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
  protected putRouteData(routeData: Partial<State>): State {
    return {...this.state, ...routeData};
  }
  @effect("login") // 使用自定义loading状态
  public async login(payload: {username: string; password: string}) {
    const loginResult = await sessionService.api.login(payload);
    if (!loginResult.error) {
      this.updateState({curUser: loginResult.data});
    } else {
      alert(loginResult.error.message);
    }
  }

  @reducer
  protected putCurUser(curUser: CurUser): State {
    return {...this.state, curUser};
  }

  @effect()
  protected async parseRouter() {
    const searchData = this.rootState.router.wholeSearchData.app! || {};
    // const hashData = this.rootState.router.wholeHashData.app! || {};
    this.dispatch(this.callThisAction(this.putRouteData, {showSearch: searchData.showSearch, showLoginPop: searchData.showLoginPop, showRegisterPop: searchData.showRegisterPop}));
  }

  @effect(null)
  protected async [LOCATION_CHANGE]() {
    this.dispatch(this.callThisAction(this.parseRouter));
  }

  // uncatched错误会触发@@framework/ERROR，兼听并发送给后台
  // 兼听外部模块的Action，不需要手动触发，所以请使用protected或private
  @effect(null) // 不需要loading，设置为null
  protected async [ERROR](error: CustomError) {
    if (error.code === "401") {
      const {
        searchData,
        location: {pathname},
      } = this.rootState.router;
      const url = toUrl(pathname, {...searchData, [ModuleNames.app]: {...searchData.app, showLoginPop: true}});
      this.updateState({showLoginPop: true});
      this.dispatch(this.routerActions.replace(url));
    } else if (error.code === "301" || error.code === "302") {
      const url = error.detail as string;
      if (url.endsWith("404.html")) {
        window.location.href = error.detail;
      } else {
        this.dispatch(this.routerActions.replace(url));
      }
    } else {
      Toast.fail(error.message);
      await settingsService.api.reportError(error);
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
    const views = this.rootState.router.views;
    if (isCur(views, ModuleNames.app, "LoginForm") && curUser.hasLogin) {
      throw new RedirectError("301", "/");
    }

    const subModules: ModuleNames[] = [ModuleNames.photos, ModuleNames.videos, ModuleNames.messages];
    for (const subModule of subModules) {
      if (isCur(views, subModule)) {
        await loadModel(moduleGetter[subModule as any]).then(subModel => subModel(this.store));
        break;
      }
    }
  }
}

// 导出本模块的Actions
export type ModuleActions = Actions<ModuleHandlers>;

export default exportModel(ModuleNames.app, ModuleHandlers);
