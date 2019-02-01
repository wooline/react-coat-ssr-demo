import {Icon, NavBar} from "antd-mobile";
import {toUrl} from "common/routers";
import LinkButton from "components/LinkButton";
import {RootRouter, RootState} from "modules";
import * as React from "react";
import {connect, DispatchProp} from "react-redux";
import "./index.less";

interface Props extends DispatchProp {
  showSearch: boolean;
  pathname: string;
  searchData: RootRouter["searchData"];
  avatarUrl: string;
  logoUrl: string;
}

class Component extends React.PureComponent<Props> {
  public render() {
    const {pathname, showSearch, searchData, logoUrl, avatarUrl, dispatch} = this.props;
    return (
      <div className="app-TopNav g-doc-width">
        <NavBar
          icon={<span className="avatar" style={{backgroundImage: `url(${avatarUrl})`}} />}
          rightContent={
            <LinkButton href={toUrl(pathname, {...searchData, app: {...searchData.app, showSearch: !showSearch}})} key="0" dispatch={dispatch}>
              <Icon type="search" />
            </LinkButton>
          }
        >
          <img src={logoUrl} className="logo" />
        </NavBar>
      </div>
    );
  }
}
const mapStateToProps = (state: RootState) => {
  const app = state.app!;
  return {
    pathname: state.router.location.pathname,
    searchData: state.router.searchData,
    showSearch: Boolean(app.showSearch),
    logoUrl: app.projectConfig!.logoUrl,
    avatarUrl: app.curUser!.avatarUrl,
  };
};

export default connect(mapStateToProps)(Component);
