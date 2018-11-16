import {StartupStep} from "entity/global";
import {CurUser} from "entity/session";
import {RootState} from "modules";
import {ModuleGetter} from "modules";
import {ModuleNames} from "modules/names";
import * as React from "react";
import {LoadingState, loadView} from "react-coat-pkg";
import {connect, DispatchProp} from "react-redux";
import {Redirect, Route, Switch} from "react-router-dom";
import LoginForm from "./LoginForm";
import Welcome from "./Welcome";

const Photos = loadView(ModuleGetter.photos, "Main");
interface Props extends DispatchProp {
  curUser: CurUser;
  startupStep: StartupStep;
  globalLoading: LoadingState;
}

class Component extends React.PureComponent<Props> {
  public render() {
    const {startupStep} = this.props;
    return (
      <div id={ModuleNames.app}>
        {startupStep !== StartupStep.init && (
          <div className="g-page">
            <Switch>
              <Redirect exact={true} path="/" to="/photos" />
              <Route exact={true} path="/photos" component={Photos} />
              <Route exact={true} path="/login" component={LoginForm} />
            </Switch>
          </div>
        )}
        {(startupStep === StartupStep.configLoaded || startupStep === StartupStep.startupImageLoaded || startupStep === StartupStep.startupCountEnd) && <Welcome className={startupStep} />}
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  const app = state.app;
  return {
    curUser: app.curUser,
    startupStep: app.startupStep,
    globalLoading: app.loading.global,
  };
};

export default connect(mapStateToProps)(Component);
