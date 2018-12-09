import {Carousel, Icon} from "antd-mobile";
import {ItemDetail} from "entity/photo";
import {RootState} from "modules";
import thisModule from "modules/photos/facade";
import React from "react";
import {findDOMNode} from "react-dom";
import {connect, DispatchProp} from "react-redux";
import "./index.less";

interface Props extends DispatchProp {
  showComment: boolean;
  dataSource: ItemDetail;
}

interface State {
  moreDetail: boolean;
  maxSize: [number, number] | null;
}

class Component extends React.PureComponent<Props, State> {
  public state: State = {
    moreDetail: false,
    maxSize: null,
  };
  private player: HTMLDivElement;
  private onClose = () => {
    // this.props.dispatch(routerActions.push(stringifyQuery<Actions>("media", null)));
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
  public componentWillReceiveProps(nextProps: Props) {
    if (!nextProps.dataSource) {
      this.setState({maxSize: null, moreDetail: false});
    }
  }
  public render() {
    const {dataSource, showComment} = this.props;
    const {maxSize, moreDetail} = this.state;
    if (dataSource) {
      return (
        <div className="g-details photos-Details g-doc-width g-modal g-enter-in">
          <div className="subject">{dataSource.title}</div>
          <Icon size="md" className="close-button" type="cross-circle" onClick={this.onClose} />
          <div className={"g-remark" + (moreDetail ? " on" : "")} onClick={this.moreRemark}>
            {dataSource.remark}
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
          <div
            className="bd"
            ref={el => {
              if (el) {
                this.player = el;
              }
            }}
          >
            {maxSize ? (
              <Carousel className="player" autoplay={false} infinite={true}>
                {dataSource.picList.map(url => (
                  <div className="item" key={url} style={{width: maxSize[0] - 1, height: maxSize[1]}}>
                    <a href={url} target="_blank" className="img" style={{backgroundImage: `url(${url})`}} />
                  </div>
                ))}
              </Carousel>
            ) : null}
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
  public componentDidUpdate() {
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
    showComment: state.photos.showComment,
    dataSource: state.photos.itemDetail,
  };
};

export default connect(mapStateToProps)(Component);
