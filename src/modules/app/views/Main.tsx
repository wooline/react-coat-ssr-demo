import {Modal} from "antd-mobile";
import "asset/css/global.less";
import {toPath, toUrl} from "common/routers";
import {routerActions} from "connected-react-router";
import {StartupStep} from "entity/global";
import {ModuleGetter, RootState, RouterData} from "modules";
import {ModuleNames} from "modules/names";
import * as React from "react";
import {LoadingState, loadView} from "react-coat";
import {connect, DispatchProp} from "react-redux";
import {Route, Switch} from "react-router-dom";
import BottomNav from "./BottomNav";
import "./index.less";
import Loading from "./Loading";
import LoginForm from "./LoginForm";
import LoginPop from "./LoginPop";
import TopNav from "./TopNav";
import Welcome from "./Welcome";

const PhotosView = loadView(ModuleGetter, ModuleNames.photos, "Main");
const VideosView = loadView(ModuleGetter, ModuleNames.videos, "Main");

interface Props extends DispatchProp {
  pathname: string;
  search: string;
  hashData: RouterData["hashData"];
  showLoginPop: boolean;
  startupStep: StartupStep;
  globalLoading: LoadingState;
}

class Component extends React.PureComponent<Props> {
  private onCloseLoginPop = () => {
    const {pathname, search, hashData, dispatch} = this.props;
    const url = toUrl(pathname, search, {...hashData, [ModuleNames.app]: {showLoginPop: false}});
    dispatch(routerActions.push(url));
  };

  public render() {
    const {showLoginPop, startupStep, globalLoading} = this.props;
    return (
      <div className={ModuleNames.app}>
        {startupStep !== StartupStep.init && (
          <div className="g-page">
            <TopNav />
            <Switch>
              <Route exact={false} path={toPath(ModuleNames.photos)} component={PhotosView} />
              <Route exact={false} path={toPath(ModuleNames.videos)} component={VideosView} />
              <Route exact={true} path={toPath(ModuleNames.app, "LoginForm")} component={LoginForm} />
            </Switch>
            <BottomNav />
          </div>
        )}
        <Modal visible={showLoginPop} transparent={true} onClose={this.onCloseLoginPop} title="请登录" closable={true}>
          <LoginPop />
        </Modal>
        {(startupStep === StartupStep.configLoaded || startupStep === StartupStep.startupImageLoaded || startupStep === StartupStep.startupCountEnd) && <Welcome className={startupStep} />}
        <Loading loading={globalLoading} />
      </div>
    );
  }
}
// todo document title处理
const mapStateToProps = (state: RootState) => {
  const app = state.app;
  const {pathname, search} = state.router.location;
  return {
    pathname,
    search,
    hashData: state.router.hashData,
    showLoginPop: app.showLoginPop && app.curUser !== null && !app.curUser.hasLogin,
    startupStep: app.startupStep,
    globalLoading: app.loading.global,
  };
};

export default connect(mapStateToProps)(Component);
