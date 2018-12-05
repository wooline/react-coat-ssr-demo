import {Icon, NavBar} from "antd-mobile";
import {routerActions} from "connected-react-router";
import {RootState} from "modules";
import * as React from "react";
import {connect, DispatchProp} from "react-redux";
import "./index.less";

interface Props extends DispatchProp {
  avatarUrl: string;
  logoUrl: string;
}

class Component extends React.PureComponent<Props> {
  private onShowUser = () => {
    // this.props.dispatch(thisModule.actions.showCurModal(CurModal.userInfo));
  };
  public openBulletins = () => {
    this.props.dispatch(routerActions.push("/bulletins"));
  };
  public render() {
    const {logoUrl, avatarUrl} = this.props;
    return (
      <div className="app-TopNav g-doc-width">
        <NavBar onLeftClick={this.onShowUser} icon={<span className="avatar" style={{backgroundImage: `url(${avatarUrl})`}} />} rightContent={<Icon key="0" type="search" />}>
          <img src={logoUrl} className="logo" />
        </NavBar>
      </div>
    );
  }
}
const mapStateToProps = (state: RootState) => {
  return {
    logoUrl: state.app.projectConfig!.logoUrl,
    avatarUrl: state.app.curUser!.avatarUrl,
  };
};

export default connect(mapStateToProps)(Component);
