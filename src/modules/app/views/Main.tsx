import RootState from "core/RootState";
import {StartupStep} from "entity/global";
import {CurUser} from "entity/session";
import * as React from "react";
import {LoadingState} from "react-coat-pkg";
import {connect} from "react-redux";

interface Props {
  curUser: CurUser;
  startupStep: StartupStep;
  globalLoading: LoadingState;
}

class Component extends React.PureComponent<Props> {
  public render() {
    const {curUser, startupStep} = this.props;
    return (
      <div id="application">
        {curUser && curUser.username} - {startupStep}
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
