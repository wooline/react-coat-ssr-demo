import "asset/css/global.less";
import {toPath} from "common/routers";
import ClientRoute from "components/ClientRoute";
import Modal from "components/Modal";
import NotFound from "components/NotFound";
import {StartupStep} from "entity/global";
import {moduleGetter, RootState, RouterData} from "modules";
import {ModuleNames} from "modules/names";
import * as React from "react";
import {LoadingState, loadView} from "react-coat";
import {connect, DispatchProp} from "react-redux";
import {Route, Switch} from "react-router-dom";
import thisModule from "../facade";
import BottomNav from "./BottomNav";
import "./index.less";
import Loading from "./Loading";
import LoginPop from "./LoginPop";
import TopNav from "./TopNav";
import Welcome from "./Welcome";

const PhotosView = loadView(moduleGetter, ModuleNames.photos, "Main");
const VideosView = loadView(moduleGetter, ModuleNames.videos, "Main");
const MessagesView = loadView(moduleGetter, ModuleNames.messages, "Main");

interface Props extends DispatchProp {
  pathname: string;
  searchData: RouterData["searchData"];
  showLoginPop: boolean;
  showNotFoundPop: boolean;
  startupStep: StartupStep;
  globalLoading: LoadingState;
}

class Component extends React.PureComponent<Props> {
  private onCloseLoginPop = () => {
    this.props.dispatch(thisModule.actions.putCloseLoginPop());
  };
  private onCloseNotFound = () => {
    this.props.dispatch(thisModule.actions.putCloseNotFoundPop());
  };
  public render() {
    const {showLoginPop, startupStep, globalLoading, showNotFoundPop} = this.props;
    return (
      <div className={ModuleNames.app}>
        {startupStep !== StartupStep.init && (
          <div className="g-page">
            <TopNav />
            <Switch>
              <Route exact={false} path={toPath(ModuleNames.photos)} component={PhotosView} />
              <Route exact={false} path={toPath(ModuleNames.videos)} component={VideosView} />
              <ClientRoute exact={false} path={toPath(ModuleNames.messages)} component={MessagesView} />
              <Route component={NotFound} />
            </Switch>
            <BottomNav />
          </div>
        )}
        {(startupStep === StartupStep.configLoaded || startupStep === StartupStep.startupImageLoaded || startupStep === StartupStep.startupCountEnd) && <Welcome className={startupStep} />}
        <Modal visible={showLoginPop} onClose={this.onCloseLoginPop} title="请登录" closable={true}>
          <LoginPop />
        </Modal>
        <Modal visible={showNotFoundPop} onClose={this.onCloseNotFound} title="找不到" closable={true}>
          <NotFound />
        </Modal>
        <Loading loading={globalLoading} />
      </div>
    );
  }
}
// todo document title处理
const mapStateToProps = (state: RootState) => {
  const app = state.app;
  return {
    pathname: state.router.location.pathname,
    searchData: state.router.searchData,
    showLoginPop: Boolean(app.showLoginPop && app.curUser !== null && !app.curUser.hasLogin),
    showNotFoundPop: Boolean(app.showNotFoundPop),
    startupStep: app.startupStep,
    globalLoading: app.loading.global,
  };
};

export default connect(mapStateToProps)(Component);
