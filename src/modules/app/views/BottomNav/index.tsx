import {TabBar} from "antd-mobile";
import Icon, {IconClass} from "components/Icon";
import {routerActions} from "connected-react-router";
import {RootState} from "modules";
import React from "react";
import {connect, DispatchProp} from "react-redux";

import "./index.less";

interface Props extends DispatchProp {
  pathname: string;
}

class Component extends React.PureComponent<Props> {
  public render() {
    const props = {...this.props, noRenderContent: true};
    const {pathname} = this.props;
    return (
      <div className="app-BottomNav g-doc-width">
        <TabBar {...props}>
          <TabBar.Item
            icon={<Icon type={IconClass.PICTURE} />}
            selectedIcon={<Icon type={IconClass.PICTURE} />}
            title="风景"
            key="photos"
            selected={pathname === "/photos"}
            onPress={() => {
              this.props.dispatch(routerActions.push("/photos"));
            }}
          />
          <TabBar.Item
            title="视频"
            key="videos"
            icon={<Icon type={IconClass.LIVE} />}
            selectedIcon={<Icon type={IconClass.LIVE} />}
            selected={pathname === "/videos"}
            onPress={() => {
              this.props.dispatch(routerActions.push("/videos"));
            }}
          />
          <TabBar.Item
            icon={<Icon type={IconClass.MESSAGE} />}
            selectedIcon={<Icon type={IconClass.MESSAGE} />}
            title="消息"
            key="messages"
            selected={pathname === "/support"}
            onPress={() => {
              if (pathname !== "/support") {
                this.props.dispatch(routerActions.push("/support"));
              }
            }}
          />
        </TabBar>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    pathname: state.router.location.pathname,
  };
};

export default connect(mapStateToProps)(Component);
