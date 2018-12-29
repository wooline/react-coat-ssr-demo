import {Icon, NavBar} from "antd-mobile";
import {toUrl} from "common/routers";
import LinkButton from "components/LinkButton";
import {RootState, RouterData} from "modules";
import {ModuleNames} from "modules/names";
import * as React from "react";
import {connect, DispatchProp} from "react-redux";
import "./index.less";

interface Props extends DispatchProp {
  showSearch: boolean;
  pathname: string;
  searchData: RouterData["searchData"];
  avatarUrl: string;
  logoUrl: string;
}

class Component extends React.PureComponent<Props> {
  private onShowUser = () => {
    // this.props.dispatch(thisModule.actions.showCurModal(CurModal.userInfo));
  };

  public render() {
    const {pathname, showSearch, searchData, logoUrl, avatarUrl, dispatch} = this.props;
    return (
      <div className="app-TopNav g-doc-width">
        <NavBar
          icon={<span onClick={this.onShowUser} className="avatar" style={{backgroundImage: `url(${avatarUrl})`}} />}
          rightContent={
            <LinkButton href={toUrl(pathname, {...searchData, [ModuleNames.app]: {...searchData.app, showSearch: !showSearch}})} key="0" dispatch={dispatch}>
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
  return {
    pathname: state.router.location.pathname,
    searchData: state.router.searchData,
    showSearch: Boolean(state.app.showSearch),
    logoUrl: state.app.projectConfig!.logoUrl,
    avatarUrl: state.app.curUser!.avatarUrl,
  };
};

export default connect(mapStateToProps)(Component);
