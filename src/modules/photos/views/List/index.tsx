import {mergeSearch, toUrl} from "common/routers";
import Icon, {IconClass} from "components/Icon";
import LinkButton from "components/LinkButton";
import Pagination from "components/Pagination";
import {ListData, SearchData} from "entity/photo";
import {RootState} from "modules";
import {defaultSearch as commentsDefaultSearch} from "modules/comments/facade";
import {ModuleNames} from "modules/names";
import * as React from "react";
import {connect, DispatchProp} from "react-redux";
import {defaultSearch} from "../../facade";
import "./index.less";

interface Props extends DispatchProp {
  searchData: Exclude<SearchData, undefined>;
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
      searchData,
      listData: {items, summary},
    } = this.props;

    if (items) {
      const itemBaseUrl = toUrl(
        ModuleNames.comments,
        "List",
        {type: ModuleNames.photos, typeId: "---"},
        {
          [ModuleNames.photos]: {search: mergeSearch(searchData.search || {}, defaultSearch)},
          [ModuleNames.comments]: {search: mergeSearch({articleId: "---"}, commentsDefaultSearch)},
        }
      );
      return (
        <div className={`${ModuleNames.photos}-List g-pic-list`}>
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
                baseUrl={toUrl(ModuleNames.photos, "List", {}, {[ModuleNames.photos]: {search: mergeSearch({...searchData.search, page: NaN}, defaultSearch)}})}
                page={summary.page}
                totalPages={summary.totalPages}
              />
            </div>
          )}
        </div>
      );
    } else {
      return null;
    }
  }
}

const mapStateToProps = (state: RootState) => {
  const model = state.photos;
  return {
    listData: model.listData,
    searchData: model.searchData || {},
  };
};

export default connect(mapStateToProps)(Component);
