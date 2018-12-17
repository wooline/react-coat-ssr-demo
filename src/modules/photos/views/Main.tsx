import {mergeSearch, replaceQuery, toUrl} from "common/routers";
import Icon, {IconClass} from "components/Icon";
import LinkButton from "components/LinkButton";
import Pagination from "components/Pagination";
import {ListData} from "entity/photo";
import {RootRouter, RootState} from "modules";
import {defaultSearch as commentsDefaultSearch} from "modules/comments/facade";
import {ModuleNames} from "modules/names";
import * as React from "react";
import {connect, DispatchProp} from "react-redux";
import {defaultSearch} from "../facade";
import "./Main.less";

interface Props extends DispatchProp {
  rootRouter: RootRouter;
  listData: ListData;
}

let scrollTop = 0;

class Component extends React.PureComponent<Props> {
  public componentWillUnmount() {
    scrollTop = window.pageYOffset;
  }
  public componentDidMount() {
    window.scrollTo(0, scrollTop);
  }
  public render() {
    const {
      dispatch,
      rootRouter,
      listData: {items, summary, search},
    } = this.props;

    let itemBaseUrl: string;
    if (items) {
      itemBaseUrl = toUrl(
        ModuleNames.comments,
        "Main",
        {type: ModuleNames.photos, itemId: "---"},
        {...rootRouter.searchData, [ModuleNames.comments]: {search: mergeSearch({articleId: "---"}, commentsDefaultSearch)}}
      );
    }
    return items ? (
      <div className={`${ModuleNames.photos} g-pic-list`}>
        <div className="list-items">
          {items.map(item => (
            <LinkButton dispatch={dispatch} href={itemBaseUrl.replace(/---/g, item.id)} key={item.id} className="g-pre-img">
              <div style={{backgroundImage: `url(${item.coverUrl})`}}>
                <h5 className="title">{item.title}</h5>
                <div className="listImg" />
                <div className="props">
                  <Icon type={IconClass.LOCATION} /> {item.departure}
                  <Icon type={IconClass.HEART} /> {item.type}
                </div>
                <div className="desc">
                  <span className="hot">
                    人气(<strong>{item.hot}</strong>)
                  </span>
                  <em className="price">
                    <span className="unit">￥</span>
                    {item.price}
                  </em>
                </div>
              </div>
            </LinkButton>
          ))}
        </div>
        {summary && (
          <div className="g-pagination">
            <Pagination
              dispatch={dispatch}
              baseUrl={replaceQuery(rootRouter, ModuleNames.photos, {search: mergeSearch({...search, page: NaN}, defaultSearch), showComment: undefined})}
              page={summary.page}
              totalPages={summary.totalPages}
            />
          </div>
        )}
      </div>
    ) : null;
  }
}

const mapStateToProps = (state: RootState) => {
  const model = state.photos;
  return {
    rootRouter: state.router,
    listData: model.listData,
  };
};

export default connect(mapStateToProps)(Component);
