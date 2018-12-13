import {Carousel, Icon} from "antd-mobile";
import {toUrl} from "common/routers";
import {routerActions} from "connected-react-router";
import {ItemDetail} from "entity/photo";
import {RootState} from "modules";
import {ModuleNames} from "modules/names";
import thisModule from "modules/photos/facade";
import React from "react";
import {findDOMNode} from "react-dom";
import {connect, DispatchProp} from "react-redux";
import "./index.less";

interface Props extends DispatchProp {
  search: string;
  showComment: boolean;
  dataSource: ItemDetail | undefined;
}

interface State {
  moreDetail: boolean;
}

class Component extends React.PureComponent<Props, State> {
  public static getDerivedStateFromProps(nextProps: Props, prevState: State): State | null {
    if (!nextProps.dataSource && prevState.moreDetail) {
      return {moreDetail: false};
    }
    return null;
  }
  public state: State = {
    moreDetail: false,
  };

  private onClose = () => {
    this.props.dispatch(routerActions.push(toUrl(ModuleNames.photos, "Main", {itemId: undefined}, this.props.search)));
  };
  private closeComment = () => {
    this.props.dispatch(thisModule.actions.showComment(false));
  };
  private showComment = () => {
    this.props.dispatch(thisModule.actions.showComment(true));
  };
  private moreRemark = () => {
    this.setState({moreDetail: !this.state.moreDetail});
  };

  public render() {
    const {dataSource, showComment} = this.props;
    const {moreDetail} = this.state;
    if (dataSource) {
      return (
        <div className={`${ModuleNames.photos}-Details g-details g-doc-width g-modal g-enter-in`}>
          <div className="subject">
            <h2>{dataSource.title}</h2>
            <Icon size="md" className="close-button" type="cross-circle" onClick={this.onClose} />
          </div>
          <div className={"remark" + (moreDetail ? " on" : "")} onClick={this.moreRemark}>
            {dataSource.remark}
          </div>
          <div className="content">
            <Carousel className="player" autoplay={false} infinite={true}>
              {dataSource.picList.map(url => (
                <div className="g-pre-img" key={url}>
                  <div className="pic" style={{backgroundImage: `url(${url})`}} />
                </div>
              ))}
            </Carousel>
          </div>

          <div className="comment-bar" onClick={this.showComment}>
            <div>
              <i className="iconfont icon-collection_fill" />
              <br />
              {dataSource.hot}
            </div>
            <div>
              <i className="iconfont icon-xiaoxi" />
              <br />
              {dataSource.comments}
            </div>
          </div>
          <div className={"comment" + (showComment ? " on" : "")}>
            <div className="mask" onClick={this.closeComment} />
            <div className="dialog">sdfsd</div>
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
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    search: state.router.location.search,
    showComment: state.photos.showComment,
    dataSource: state.photos.itemDetail,
  };
};

export default connect(mapStateToProps)(Component);
