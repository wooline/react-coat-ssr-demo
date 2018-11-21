import {CustomError, RedirectError} from "common/Errors";
import {checkFastRedirect} from "common/utils";
import * as env from "conf/env";
import {ProjectConfig, StartupStep} from "entity/global";
import {CurUser} from "entity/session";
import {ModuleGetter, RootState} from "modules";
import {ModuleNames} from "modules/names";
import {Actions, BaseModuleHandlers, BaseModuleState, effect, ERROR, exportModel, GetModule, LoadingState, loadModel, reducer} from "react-coat-pkg";
import {matchPath} from "react-router";
import * as sessionService from "./api/session";
import * as settingsService from "./api/settings";

// 定义本模块的State类型
export interface State extends BaseModuleState {
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

  @effect("login") // 使用自定义loading状态
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

  // 兼听自已的INIT Action，做一些异步数据请求，不需要手动触发，所以请使用protected或private
  @effect()
  protected async [ModuleNames.app + "/INIT"]() {
    const router = this.rootState.router;
    // 对于一些不需要运算的重定向跳转，可以称之为前置快速重定向，
    // 如果启用ssr，应当在服务器路由层就进行拦截跳转，如果路由层没有做，此处也会补救
    if (
      checkFastRedirect(
        router.location.pathname,
        [
          {
            path: "/",
            exact: true,
            module: "/photos",
          },
        ]
      ) !== true
    ) {
      return;
    }
    const [projectConfig, curUser] = await Promise.all([settingsService.api.getSettings(), sessionService.api.getCurUser()]);
    this.dispatch(
      this.callThisAction(this.UPDATE, {
        ...this.state,
        projectConfig,
        curUser,
        startupStep: StartupStep.configLoaded,
      })
    );
    const routes: Array<{path?: string; exact?: boolean; module: GetModule}> = [
      {
        path: "/my",
        exact: true,
        module: () => {
          if (!curUser.hasLogin) {
            throw new RedirectError("301", "/login");
          } else {
            return ModuleGetter.photos();
          }
        },
      },
      {
        path: "/login",
        exact: true,
        module: () => {
          if (curUser.hasLogin) {
            throw new RedirectError("301", "/");
          } else {
            return null;
          }
        },
      },
      {path: "/photos", exact: true, module: ModuleGetter.photos},
      {path: "/videos", exact: true, module: ModuleGetter.videos},
    ];
    const matchs = routes.filter(route => matchPath(router.location.pathname, route));
    if (!matchs.length) {
      matchs.push({
        module: () => {
          throw new RedirectError("301", `${env.sitePath}404.html`);
        },
      });
    }
    await Promise.all(matchs.map(route => loadModel(route.module).then(subModel => subModel && subModel(this.store))));
  }

  // 兼听全局错误的Action，并发送给后台
  // 兼听外部模块的Action，不需要手动触发，所以请使用protected或private
  @effect(null) // 不需要loading，设置为null
  protected async [ERROR](error: CustomError) {
    if (error.code === "301" || error.code === "302") {
      const url = error.detail as string;
      if (url.endsWith("404.html")) {
        window.location.href = error.detail;
      } else {
        this.dispatch(this.routerActions.replace(url));
      }
    } else {
      await settingsService.api.reportError(error);
    }
  }
}

// 导出本模块的Actions
export type ModuleActions = Actions<ModuleHandlers>;

export default exportModel(ModuleNames.app, ModuleHandlers);
