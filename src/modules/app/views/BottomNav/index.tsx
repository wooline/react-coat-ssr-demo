import {TabBar} from "antd-mobile";
import {isCur, toPath} from "common/routers";
import Icon, {IconClass} from "components/Icon";
import {routerActions} from "connected-react-router";
import {RootState} from "modules";
import {ModuleNames} from "modules/names";
import React from "react";
import {connect, DispatchProp} from "react-redux";
import "./index.less";

interface Props extends DispatchProp {
  views: {[viewName: string]: boolean};
}
const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => e.preventDefault();

class Component extends React.PureComponent<Props> {
  public render() {
    const {dispatch, views} = this.props;
    const PhotosLink = (
      <a href={toPath(ModuleNames.photos, "List")} onClick={onClick}>
        <Icon type={IconClass.PICTURE} />
      </a>
    );
    const VideosLink = (
      <a href={toPath(ModuleNames.videos, "Main")} onClick={onClick}>
        <Icon type={IconClass.LIVE} />
      </a>
    );
    const MessageLink = (
      <a href={toPath(ModuleNames.videos)} onClick={onClick}>
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
            selected={isCur(views, ModuleNames.photos)}
            onPress={() => {
              dispatch(routerActions.push(toPath(ModuleNames.photos, "List")));
            }}
          />
          <TabBar.Item
            title="视频"
            key="videos"
            icon={VideosLink}
            selectedIcon={VideosLink}
            selected={isCur(views, ModuleNames.videos)}
            onPress={() => {
              dispatch(routerActions.push(toPath(ModuleNames.videos)));
            }}
          />
          <TabBar.Item
            icon={MessageLink}
            selectedIcon={MessageLink}
            title="消息"
            key="messages"
            selected={isCur(views, ModuleNames.videos)}
            onPress={() => {
              dispatch(routerActions.push(toPath(ModuleNames.videos)));
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
