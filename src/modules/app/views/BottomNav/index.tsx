import {TabBar} from "antd-mobile";
import {isCur, toPath, toUrl} from "common/routers";
import Icon, {IconClass} from "components/Icon";
import {routerActions} from "connected-react-router";
import {RootState, RouterData} from "modules";
import {ModuleNames} from "modules/names";
import React from "react";
import {connect, DispatchProp} from "react-redux";
import "./index.less";

interface Props extends DispatchProp {
  views: RouterData["views"];
}
const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => e.preventDefault();

class Component extends React.PureComponent<Props> {
  public render() {
    const {dispatch, views} = this.props;
    const photosUrl = toUrl(toPath(ModuleNames.photos, "List"), {}, {app: {refresh: true}});
    const videosUrl = toUrl(toPath(ModuleNames.videos, "List"), {}, {app: {refresh: true}});
    const messagesUrl = toUrl(toPath(ModuleNames.messages, "List"), {}, {app: {refresh: true}});
    const PhotosLink = (
      <a href={photosUrl} onClick={onClick}>
        <Icon type={IconClass.PICTURE} />
      </a>
    );
    const VideosLink = (
      <a href={videosUrl} onClick={onClick}>
        <Icon type={IconClass.LIVE} />
      </a>
    );
    const MessagesLink = (
      <a href={messagesUrl} onClick={onClick}>
        <Icon type={IconClass.MESSAGE} />
      </a>
    );
    return (
      <div className="app-BottomNav g-doc-width">
        <TabBar noRenderContent={true} barTintColor="#108ee9" tintColor="#ff0" unselectedTintColor="#fff">
          <TabBar.Item
            icon={PhotosLink}
            selectedIcon={PhotosLink}
            title="组团"
            key="photos"
            selected={isCur(views, ModuleNames.photos)}
            onPress={() => {
              dispatch(routerActions.push(photosUrl));
            }}
          />
          <TabBar.Item
            title="分享"
            key="videos"
            icon={VideosLink}
            selectedIcon={VideosLink}
            selected={isCur(views, ModuleNames.videos)}
            onPress={() => {
              dispatch(routerActions.push(videosUrl));
            }}
          />
          <TabBar.Item
            icon={MessagesLink}
            selectedIcon={MessagesLink}
            title="消息"
            key="messages"
            selected={isCur(views, ModuleNames.messages)}
            onPress={() => {
              dispatch(routerActions.push(messagesUrl));
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
