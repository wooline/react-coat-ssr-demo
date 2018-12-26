import {toPath, toUrl} from "common/routers";
import LinkButton from "components/LinkButton";
import Pagination from "components/Pagination";
import {ListItem, ListSearch, ListSummary, PathData} from "entity/comment";
import {RootState, RouterData} from "modules";
import {ModuleNames} from "modules/names";
import * as React from "react";
import {findDOMNode} from "react-dom";
import {connect, DispatchProp} from "react-redux";
import "./index.less";

interface Props extends DispatchProp {
  pathname: string;
  pathData: PathData;
  searchData: RouterData["searchData"];
  listSearch: ListSearch;
  listItems: ListItem[] | undefined;
  listSummary: ListSummary | undefined;
}
let scrollTop = NaN;
class Component extends React.PureComponent<Props> {
  private scroll = () => {
    const dom = findDOMNode(this) as HTMLElement;
    if (dom) {
      (dom.parentNode as HTMLDivElement).scrollTop = scrollTop;
      scrollTop = 0;
    }
  };
  private onItemClick = () => {
    const dom = findDOMNode(this) as HTMLElement;
    scrollTop = (dom.parentNode as HTMLDivElement).scrollTop;
  };
  public componentDidUpdate() {
    this.scroll();
  }
  public componentDidMount() {
    this.scroll();
  }
  public render() {
    const {
      dispatch,
      pathData: {type, typeId},
      searchData,
      pathname,
      listSearch,
      listItems,
      listSummary,
    } = this.props;
    if (listItems) {
      const itemBaseUrl = toUrl(toPath(ModuleNames.comments, "Details", {type, typeId, itemId: "---"}), {...searchData, [ModuleNames.comments]: {}});
      return (
        <div className={`${ModuleNames.comments}-List`}>
          <div className="list-header">
            <LinkButton
              dispatch={dispatch}
              href={toUrl(pathname, {...searchData, [ModuleNames.comments]: {search: {...listSearch, page: 1, isNewest: false}}})}
              className={listSearch.isNewest ? "" : "on"}
            >
              最热
            </LinkButton>
            <LinkButton
              dispatch={dispatch}
              href={toUrl(pathname, {...searchData, [ModuleNames.comments]: {search: {...listSearch, page: 1, isNewest: true}}})}
              className={listSearch.isNewest ? "on" : ""}
            >
              最新
            </LinkButton>
          </div>
          <div className="list-items">
            {listItems.map(item => (
              <LinkButton onClick={this.onItemClick} dispatch={dispatch} href={itemBaseUrl.replace(/---/g, item.id)} className="g-border-top" key={item.id}>
                <div className="avatar" style={{backgroundImage: `url(${item.avatarUrl})`}} />
                <div className="user">
                  {item.username}
                  <span className="date">{item.createdTime}</span>
                </div>
                <div className="content">{item.content}</div>
                <span className="reply">
                  <span className="act">回复</span>({item.replies})
                </span>
              </LinkButton>
            ))}
          </div>
          {listSummary && (
            <div className="g-pagination">
              <Pagination
                dispatch={dispatch}
                baseUrl={toUrl(pathname, {...searchData, [ModuleNames.comments]: {search: {...listSearch, page: NaN}}})}
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
  const model = state.comments;
  const {
    pathData,
    searchData,
    location: {pathname},
  } = state.router;
  return {
    pathname,
    searchData,
    pathData: pathData[ModuleNames.comments]!,
    listSearch: model.listSearch,
    listItems: model.listItems,
    listSummary: model.listSummary,
  };
};

export default connect(mapStateToProps)(Component);
