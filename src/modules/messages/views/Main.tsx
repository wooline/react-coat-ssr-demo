import {RootState} from "modules";
import * as React from "react";
import {connect} from "react-redux";
import {Route, Switch} from "react-router-dom";
import {List as ListView} from "./index";

interface Props {
  pathname: string;
}
class Component extends React.PureComponent<Props> {
  public render() {
    return (
      <Switch>
        <Route component={ListView} />
      </Switch>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    pathname: state.router.location.pathname,
  };
};

export default connect(mapStateToProps)(Component);
