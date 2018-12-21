import {TabBar} from "antd-mobile";
import {isCur, toUrl} from "common/routers";
import Icon, {IconClass} from "components/Icon";
import {routerActions} from "connected-react-router";
import {RootState, RouterData} from "modules";
import {ModuleNames} from "modules/names";
import React from "react";
import {connect, DispatchProp} from "react-redux";
import "./index.less";

interface Props extends DispatchProp {
  routerData: RouterData;
}
const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => e.preventDefault();

class Component extends React.PureComponent<Props> {
  public render() {
    const {routerData} = this.props;
    const PhotosLink = (
      <a href={toUrl(routerData, ModuleNames.photos)} onClick={onClick}>
        <Icon type={IconClass.PICTURE} />
      </a>
    );
    const VideosLink = (
      <a href={toUrl(routerData, ModuleNames.videos)} onClick={onClick}>
        <Icon type={IconClass.LIVE} />
      </a>
    );
    const MessageLink = (
      <a href={toUrl(routerData, ModuleNames.videos)} onClick={onClick}>
        <Icon type={IconClass.MESSAGE} />
      </a>
    );
    return (
      <div className="app-BottomNav g-doc-width">
        <TabBar noRenderContent={true} barTintColor="#108ee9" tintColor="#ff0" unselectedTintColor="#fff">
          <TabBar.Item
            icon={PhotosLink}
            selectedIcon={PhotosLink}
            title="风景"
            key="photos"
            selected={isCur(routerData.views, ModuleNames.photos)}
            onPress={() => {
              this.props.dispatch(routerActions.push(toUrl(routerData, ModuleNames.photos, "List")));
            }}
          />
          <TabBar.Item
            title="视频"
            key="videos"
            icon={VideosLink}
            selectedIcon={VideosLink}
            selected={isCur(routerData.views, ModuleNames.videos)}
            onPress={() => {
              this.props.dispatch(routerActions.push(toUrl(routerData, ModuleNames.videos)));
            }}
          />
          <TabBar.Item
            icon={MessageLink}
            selectedIcon={MessageLink}
            title="消息"
            key="messages"
            selected={isCur(routerData.views, ModuleNames.videos)}
            onPress={() => {
              this.props.dispatch(routerActions.push(toUrl(routerData, ModuleNames.videos)));
            }}
          />
        </TabBar>
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
