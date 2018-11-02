import RootState from "core/RootState";
import {StartupStep} from "entity/global";
import {CurUser} from "entity/session";
import * as React from "react";
import {loader, LoadingState} from "react-coat-pkg";
import {connect, DispatchProp} from "react-redux";
import {Redirect, Route, Switch} from "react-router-dom";
import LoginForm from "./LoginForm";

const Photos = loader("photos");
interface Props extends DispatchProp {
  curUser: CurUser;
  startupStep: StartupStep;
  globalLoading: LoadingState;
}

class Component extends React.PureComponent<Props> {
  public render() {
    return (
      <div id="application">
        <Switch>
          <Redirect exact={true} path="/" to="/photos" />
          <Route exact={true} path="/photos" component={Photos} />
          <Route exact={true} path="/login" component={LoginForm} />
        </Switch>
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
