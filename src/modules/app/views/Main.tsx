import "asset/css/global.less";
import {toPath} from "common/routers";
import {StartupStep} from "entity/global";
import {CurUser} from "entity/session";
import {ModuleGetter, RootState} from "modules";
import {ModuleNames} from "modules/names";
import * as React from "react";
import {LoadingState, loadView} from "react-coat";
import {connect, DispatchProp} from "react-redux";
import {Route, Switch} from "react-router-dom";
import BottomNav from "./BottomNav";
import "./index.less";
import Loading from "./Loading";
import LoginForm from "./LoginForm";
import TopNav from "./TopNav";
import Welcome from "./Welcome";

const PhotosView = loadView(ModuleGetter, ModuleNames.photos, "Main");

interface Props extends DispatchProp {
  curUser: CurUser;
  startupStep: StartupStep;
  globalLoading: LoadingState;
}

class Component extends React.PureComponent<Props> {
  public render() {
    const {startupStep, globalLoading} = this.props;
    return (
      <div className={ModuleNames.app}>
        {startupStep !== StartupStep.init && (
          <div className="g-page">
            <TopNav />
            <Switch>
              <Route exact={false} path={toPath(ModuleNames.photos)} component={PhotosView} />
              <Route exact={true} path={toPath(ModuleNames.app, "LoginForm")} component={LoginForm} />
            </Switch>
            <BottomNav />
          </div>
        )}
        {(startupStep === StartupStep.configLoaded || startupStep === StartupStep.startupImageLoaded || startupStep === StartupStep.startupCountEnd) && <Welcome className={startupStep} />}
        <Loading loading={globalLoading} />
      </div>
    );
  }
}
// todo document title处理
const mapStateToProps = (state: RootState) => {
  const app = state.app;
  return {
    curUser: app.curUser,
    startupStep: app.startupStep,
    globalLoading: app.loading.global,
  };
};

export default connect(mapStateToProps)(Component);
