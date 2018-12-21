import {toUrl} from "common/routers";
import {RootState, RouterData} from "modules";
import {ModuleNames} from "modules/names";
import * as React from "react";
import {connect} from "react-redux";
import {Route, Switch} from "react-router-dom";
import DetailsView from "./Details";
import ListView from "./List";

interface Props {
  routerData: RouterData;
}
class Component extends React.PureComponent<Props> {
  public render() {
    const {routerData} = this.props;
    return (
      <Switch>
        <Route exact={false} path={toUrl(routerData, ModuleNames.photos, "List")} component={ListView} />
        <Route exact={false} path={toUrl(routerData, ModuleNames.photos, "Details")} component={DetailsView} />
      </Switch>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    routerData: state.app.routerData,
  };
};

export default connect(mapStateToProps)(Component);
