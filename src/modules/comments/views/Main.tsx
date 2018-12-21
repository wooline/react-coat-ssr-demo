import {toUrl} from "common/routers";
import {RootState, RouterData} from "modules";
import {ModuleNames} from "modules/names";
import * as React from "react";
import {connect} from "react-redux";
import {Route, Switch} from "react-router-dom";
import DetailsView from "./Details";
import Editor from "./Editor";
import ListView from "./List";
import "./Main.less";

interface Props {
  routerData: RouterData;
}

class Component extends React.PureComponent<Props> {
  public render() {
    const {routerData} = this.props;
    return (
      <div className={`${ModuleNames.comments}`}>
        <div className="wrap">
          <Switch>
            <Route exact={false} path={toUrl(routerData, ModuleNames.comments, "List")} component={ListView} />
            <Route exact={false} path={toUrl(routerData, ModuleNames.comments, "Details")} component={DetailsView} />
          </Switch>
        </div>
        <Editor />
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    routerData: state.app.routerData,
  };
};

export default connect(mapStateToProps)(Component);
