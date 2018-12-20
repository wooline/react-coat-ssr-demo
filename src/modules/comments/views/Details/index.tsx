import {Icon as MIcon} from "antd-mobile";
import {toUrl} from "common/routers";
import LinkButton from "components/LinkButton";
import {ItemDetail, PathData} from "entity/comment";
import {RootRouter, RootState} from "modules";
import {ModuleNames} from "modules/names";
import React from "react";
import {findDOMNode} from "react-dom";
import {connect, DispatchProp} from "react-redux";
import "./index.less";

interface Props extends DispatchProp {
  pathData: PathData;
  rootRouter: RootRouter;
  dataSource: ItemDetail | undefined;
}

class Component extends React.PureComponent<Props> {
  public render() {
    const {
      dataSource,
      dispatch,
      rootRouter,
      pathData: {type, typeId},
    } = this.props;

    if (dataSource) {
      return (
        <div className={`${ModuleNames.comments}-Details g-modal g-enter-in`}>
          <div className="list-header">
            <LinkButton dispatch={dispatch} href={toUrl(ModuleNames.comments, "List", {type, typeId}, rootRouter.location.search)} className="close-button">
              <MIcon size="md" type="left" />
            </LinkButton>
          </div>
          <div className="list-items">
            <div className="g-border-top">
              <div className="avatar" style={{backgroundImage: `url(${dataSource.avatarUrl})`}} />
              <div className="user">
                {dataSource.username}
                <span className="date">{dataSource.createdTime}</span>
              </div>
              <div className="content">{dataSource.content}</div>
              <span className="reply">
                <span className="act">回复</span>({dataSource.replies})
              </span>
            </div>
            {dataSource.repliesList.map((item, index) => (
              <div className={index !== 0 ? "g-border-top" : ""} key={item.id}>
                <div className="avatar" style={{backgroundImage: `url(${item.avatarUrl})`}} />
                <div className="user">
                  {item.username}
                  <span className="date">{item.createdTime}</span>
                </div>
                <div className="content">{item.content}</div>
              </div>
            ))}
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
  private fadeIn() {
    const dom = findDOMNode(this) as HTMLElement;
    if (dom && dom.className.indexOf("g-enter-in") > -1) {
      setTimeout(() => {
        dom.className = dom.className.replace("g-enter-in", "");
      }, 0);
    }
  }
  public componentDidUpdate() {
    this.fadeIn();
  }
  public componentDidMount() {
    this.fadeIn();
    const dom = findDOMNode(this) as HTMLElement;
    if (dom) {
      (dom.parentNode as HTMLDivElement).scrollTop = 0;
    }
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    rootRouter: state.router,
    pathData: state.comments.pathData,
    dataSource: state.comments.itemDetail,
  };
};

export default connect(mapStateToProps)(Component);
