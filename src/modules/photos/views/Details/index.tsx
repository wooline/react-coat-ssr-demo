import {Carousel, Icon} from "antd-mobile";
import {routerActions} from "connected-react-router";
import RootState from "core/RootState";
import {ItemDetail} from "entity/photo";
import {Actions} from "entity/media";
import thisModule from "modules/photos";
import commentsViews from "modules/comments/views";
import React from "react";
import {stringifyQuery} from "utils";
import {findDOMNode} from "react-dom";
import {connect, DispatchProp} from "react-redux";
import "./index.less";

interface Props extends DispatchProp {
  showComment: boolean;
  dataSource: ItemDetail;
}

interface State {
  moreDetail: boolean;
  maxSize: [number, number];
}

class Component extends React.PureComponent<Props, State> {
  state: State = {
    moreDetail: false,
    maxSize: null,
  };
  player: HTMLDivElement;
  onClose = () => {
    this.props.dispatch(routerActions.push(stringifyQuery<Actions>("media", null)));
  };
  closeComment = () => {
    this.props.dispatch(thisModule.actions.showComment(false));
  };
  showComment = () => {
    this.props.dispatch(thisModule.actions.showComment(true));
  };
  moreRemark = () => {
    this.setState({moreDetail: !this.state.moreDetail});
  };
  onUpgradeVip = () => {
    this.props.dispatch(routerActions.push("/support"));
  };
  componentWillReceiveProps(nextProps: Props) {
    if (!nextProps.dataSource) {
      this.setState({maxSize: null, moreDetail: false});
    }
  }
  public render() {
    const {dataSource, showComment} = this.props;
    const {maxSize, moreDetail} = this.state;
    if (dataSource) {
      return (
        <div className="g-detail photos-Detail max-width g-modal g-enter-in">
          <div className="subject">{dataSource.title}</div>
          <Icon size="md" className="close-button" type="cross-circle" onClick={this.onClose} />
          <div className={"g-remark" + (moreDetail ? " on" : "")} onClick={this.moreRemark}>
            {dataSource.remark}
          </div>
          <div className="comment-bar" onClick={this.showComment}>
            <div>
              <i className="iconfont icon-collection_fill" />
              <br />
              {dataSource.clickCount}
            </div>
            <div>
              <i className="iconfont icon-xiaoxi" />
              <br />
              {dataSource.commentCount}
            </div>
          </div>
          <div className={"comment" + (showComment ? " on" : "")}>
            <div className="mask" onClick={this.closeComment} />
            <div className="dialog">
              <commentsViews.Main />
            </div>
          </div>
          <div
            className="bd"
            ref={el => {
              this.player = el;
            }}
          >
            {dataSource.imagelist && maxSize && dataSource.imagelist.length ? (
              <Carousel className="player" autoplay={false} infinite>
                {dataSource.imagelist.map(item => (
                  <div className="item" key={item.imageUrl} style={{width: maxSize[0] - 1, height: maxSize[1]}}>
                    <a href={item.imageUrl} target="_blank" className="img" style={{backgroundImage: `url(${item.imageUrl})`}} />
                  </div>
                ))}
              </Carousel>
            ) : (
              <div className="player">
                <div className="msg" onClick={this.onUpgradeVip}>
                  {dataSource.imagelist ? "未上传图片" : "请升级VIP会员"}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
  componentDidUpdate() {
    const dom = findDOMNode(this) as HTMLElement;
    if (dom && dom.className.indexOf("g-enter-in") > -1) {
      setTimeout(() => {
        dom.className = dom.className.replace("g-enter-in", "");
      }, 0);
    }
    if (!this.state.maxSize && this.player) {
      this.setState({maxSize: [this.player.offsetWidth, this.player.offsetHeight - 4]});
    }
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    showComment: state.project.photos.actions.comment,
    dataSource: state.project.photos.curItem,
  };
};

export default connect(mapStateToProps)(Component);

// <img className="imgItem g-preImg g-listImg" src={item.imageUrl} alt="" />
