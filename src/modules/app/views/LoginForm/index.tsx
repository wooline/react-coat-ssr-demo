import RootState from "core/RootState";
import thisModule from "modules/app/facade";
import * as React from "react";
import {LoadingState} from "react-coat-pkg";
import {connect, DispatchProp} from "react-redux";

interface Props extends DispatchProp {
  logining: boolean;
}

class Component extends React.PureComponent<Props> {
  public onLogin = (evt: any) => {
    evt.stopPropagation();
    evt.preventDefault();
    this.props.dispatch(thisModule.actions.login({username: "", password: ""}));
  }

  public render() {
    const {logining} = this.props;

    return (
      <form className="app-Login" onSubmit={this.onLogin}>
        <h3>请登录</h3>
        <ul>
          <li>
            <input name="username" placeholder="Username" />
          </li>
          <li>
            <input name="password" type="password" placeholder="Password" />
          </li>
          <li>
            <input type="submit" value="Login" disabled={logining} />
          </li>
        </ul>
      </form>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    logining: state.app.loading.login !== LoadingState.Stop,
  };
};

export default connect(mapStateToProps)(Component);
