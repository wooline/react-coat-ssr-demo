import {TabBar} from "antd-mobile";
import {isCur, toUrl} from "common/routers";
import Icon, {IconClass} from "components/Icon";
import {routerActions} from "connected-react-router";
import {RootRouter, RootState} from "modules";
import {ModuleNames} from "modules/names";
import React from "react";
import {connect, DispatchProp} from "react-redux";
import "./index.less";

interface Props extends DispatchProp {
  views: RootRouter["views"];
}
const PhotosLink = (
  <a href={toUrl(ModuleNames.photos)} onClick={e => e.preventDefault()}>
    <Icon type={IconClass.PICTURE} />
  </a>
);
const VideosLink = (
  <a href={toUrl(ModuleNames.videos)} onClick={e => e.preventDefault()}>
    <Icon type={IconClass.LIVE} />
  </a>
);
const MessageLink = (
  <a href={toUrl(ModuleNames.videos)} onClick={e => e.preventDefault()}>
    <Icon type={IconClass.MESSAGE} />
  </a>
);
class Component extends React.PureComponent<Props> {
  public render() {
    const {views} = this.props;
    return (
      <div className="app-BottomNav g-doc-width">
        <TabBar noRenderContent={true} barTintColor="#108ee9" tintColor="#ff0" unselectedTintColor="#fff">
          <TabBar.Item
            icon={PhotosLink}
            selectedIcon={PhotosLink}
            title="风景"
            key="photos"
            selected={isCur(views, ModuleNames.photos)}
            onPress={() => {
              this.props.dispatch(routerActions.push(toUrl(ModuleNames.photos)));
            }}
          />
          <TabBar.Item
            title="视频"
            key="videos"
            icon={VideosLink}
            selectedIcon={VideosLink}
            selected={isCur(views, ModuleNames.videos)}
            onPress={() => {
              this.props.dispatch(routerActions.push(toUrl(ModuleNames.videos)));
            }}
          />
          <TabBar.Item
            icon={MessageLink}
            selectedIcon={MessageLink}
            title="消息"
            key="messages"
            selected={isCur(views, ModuleNames.messages)}
            onPress={() => {
              this.props.dispatch(routerActions.push(toUrl(ModuleNames.videos)));
            }}
          />
        </TabBar>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    views: state.router.views,
  };
};

export default connect(mapStateToProps)(Component);
