import {toPath, toUrl} from "common/routers";
import Icon, {IconClass} from "components/Icon";
import LinkButton from "components/LinkButton";
import Pagination from "components/Pagination";
import Search from "components/Search";
import {routerActions} from "connected-react-router";
import {ListItem, ListSearch, ListSummary} from "entity/photo";
import {RootState} from "modules";
import {ModuleNames} from "modules/names";
import * as React from "react";
import {connect, DispatchProp} from "react-redux";
import "./index.less";

interface Props extends DispatchProp {
  showSearch: boolean;
  pathname: string;
  search: string;
  listSearch: ListSearch;
  listItems: ListItem[] | undefined;
  listSummary: ListSummary;
}

let scrollTop = 0;

class Component extends React.PureComponent<Props> {
  private scroll = () => {
    window.scrollTo(0, scrollTop);
    scrollTop = 0;
  };
  private onItemClick = () => {
    scrollTop = window.pageYOffset;
  };
  private onSearch = (title: string) => {
    const {dispatch, pathname} = this.props;
    dispatch(routerActions.push(toUrl(pathname, {[ModuleNames.photos]: {search: {title}}})));
  };
  public componentDidMount() {
    this.scroll();
  }
  public componentDidUpdate() {
    this.scroll();
  }

  public render() {
    const {dispatch, showSearch, pathname, search, listSearch, listItems, listSummary} = this.props;

    if (listItems) {
      const itemBaseUrl = toUrl(toPath(ModuleNames.comments, "List", {type: ModuleNames.photos, typeId: "---"}), {
        [ModuleNames.comments]: {search: {articleId: "---"}},
      });
      return (
        <div className={`${ModuleNames.photos}-List g-pic-list`}>
          <Search onSearch={this.onSearch} pathname={pathname} search={search} visible={showSearch || listSearch.title !== null} dispatch={dispatch} />
          <div className="list-items">
            {listItems.map(item => (
              <LinkButton onClick={this.onItemClick} dispatch={dispatch} href={itemBaseUrl.replace(/---/g, item.id)} key={item.id} className="g-pre-img">
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
              <Pagination dispatch={dispatch} baseUrl={toUrl(pathname, {[ModuleNames.photos]: {search: {...listSearch, page: NaN}}})} page={listSummary.page} totalPages={listSummary.totalPages} />
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
    showSearch: state.app.hashData.showSearch,
    pathname: state.router.location.pathname,
    search: state.router.location.search,
    listSearch: model.searchData.search,
    listItems: model.listItems,
    listSummary: model.listSummary,
  };
};

export default connect(mapStateToProps)(Component);
