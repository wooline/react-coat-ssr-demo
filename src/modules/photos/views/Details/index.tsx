import {Carousel, Icon as MIcon} from "antd-mobile";
import {linkTo, replaceQuery, toUrl} from "common/routers";
import Icon, {IconClass} from "components/Icon";
import {ItemDetail} from "entity/photo";
import {RootRouter, RootState} from "modules";
import {ModuleNames} from "modules/names";
import React from "react";
import {findDOMNode} from "react-dom";
import {connect, DispatchProp} from "react-redux";
import "./index.less";

interface Props extends DispatchProp {
  search: string;
  showComment: boolean;
  rootRouter: RootRouter;
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

  private moreRemark = () => {
    this.setState({moreDetail: !this.state.moreDetail});
  };

  public render() {
    const {dataSource, showComment, rootRouter, dispatch} = this.props;
    const {moreDetail} = this.state;
    if (dataSource) {
      return (
        <div className={`${ModuleNames.photos}-Details g-details g-doc-width g-modal g-enter-in`}>
          <div className="subject">
            <h2>{dataSource.title}</h2>
            <a href={toUrl(ModuleNames.photos, "Main", {itemId: undefined}, this.props.search)} onClick={e => linkTo(e, dispatch)} className="close-button">
              <MIcon size="md" type="cross-circle" />
            </a>
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

          <a href={replaceQuery(rootRouter, ModuleNames.photos, {showComment: true}, true)} className="comment-bar" onClick={e => linkTo(e, dispatch)}>
            <span>
              <Icon type={IconClass.HEART} />
              <br />
              {dataSource.hot}
            </span>
            <span>
              <Icon type={IconClass.MESSAGE} />
              <br />
              {dataSource.comments}
            </span>
          </a>
          <div className={"comments" + (showComment ? " on" : "")}>
            <a href={replaceQuery(rootRouter, ModuleNames.photos, {showComment: undefined}, true)} className="mask" onClick={e => linkTo(e, dispatch)} />
            <div className="dialog" style={{height: 200}}>
              sdfsd
            </div>
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
    rootRouter: state.router,
    search: state.router.location.search,
    showComment: Boolean(state.photos.searchData && state.photos.searchData.showComment),
    dataSource: state.photos.itemDetail,
  };
};

export default connect(mapStateToProps)(Component);
