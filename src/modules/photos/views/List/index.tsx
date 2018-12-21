import {replaceQuery, toUrl} from "common/routers";
import Icon, {IconClass} from "components/Icon";
import LinkButton from "components/LinkButton";
import Pagination from "components/Pagination";
import {ListItem, ListSearch, ListSummary} from "entity/photo";
import {RootState, RouterData} from "modules";
import {defSearch as commentsDefSearch} from "modules/comments/facade";
import {ModuleNames} from "modules/names";
import * as React from "react";
import {connect, DispatchProp} from "react-redux";
import "./index.less";

interface Props extends DispatchProp {
  routerData: RouterData;
  listSearch: ListSearch;
  listItems: ListItem[] | undefined;
  listSummary: ListSummary;
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
    const {dispatch, routerData, listSearch, listItems, listSummary} = this.props;

    if (listItems) {
      const itemBaseUrl = toUrl(
        routerData,
        ModuleNames.comments,
        "List",
        {type: ModuleNames.photos, typeId: "---"},
        {
          [ModuleNames.photos]: {search: null as any, showComment: false},
          [ModuleNames.comments]: {search: {...commentsDefSearch.search, articleId: "---"}},
        }
      );
      return (
        <div className={`${ModuleNames.photos}-List g-pic-list`}>
          <div className="list-items">
            {listItems.map(item => (
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
          {listSummary && (
            <div className="g-pagination">
              <Pagination
                dispatch={dispatch}
                baseUrl={replaceQuery(routerData, {[ModuleNames.photos]: {showComment: false, search: {...listSearch, page: NaN}}})}
                page={listSummary.page}
                totalPages={listSummary.totalPages}
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
    routerData: state.app.routerData,
    listSearch: model.listSearch,
    listItems: model.listItems,
    listSummary: model.listSummary,
  };
};

export default connect(mapStateToProps)(Component);
