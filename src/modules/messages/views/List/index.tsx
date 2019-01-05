import {toUrl} from "common/routers";
import Pagination from "components/Pagination";
import Search from "components/Search";
import {routerActions} from "connected-react-router";
import {ListItem, ListSearch, ListSummary} from "entity/message";
import {RootState} from "modules";
import {ModuleNames} from "modules/names";
import * as React from "react";
import {connect, DispatchProp} from "react-redux";
import "./index.less";

interface Props extends DispatchProp {
  showSearch: boolean;
  pathname: string;
  listSearch: ListSearch | undefined;
  listItems: ListItem[] | undefined;
  listSummary: ListSummary | undefined;
}

class Component extends React.PureComponent<Props> {
  private onSearch = (title: string) => {
    const {dispatch, pathname} = this.props;
    dispatch(routerActions.push(toUrl(pathname, {[ModuleNames.messages]: {search: {title}}})));
  };
  private onSearchClose = () => {
    const {dispatch, pathname} = this.props;
    dispatch(routerActions.push(toUrl(pathname, {[ModuleNames.app]: {showSearch: false}, [ModuleNames.messages]: {search: {title: null}}})));
    /* if (this.props.listSearch!.title) {
      dispatch(routerActions.push(toUrl(pathname, {[ModuleNames.app]: {showSearch: false}, [ModuleNames.messages]: {search: {title: null}}})));
    } else {
      dispatch(routerActions.push(toUrl(pathname, search, {[ModuleNames.app]: {showSearch: false}})));
    } */
  };

  public render() {
    const {dispatch, showSearch, pathname, listSearch, listItems, listSummary} = this.props;

    if (listItems && listSearch) {
      return (
        <div className={`${ModuleNames.messages}-List`}>
          <Search value={listSearch.title || ""} onClose={this.onSearchClose} onSearch={this.onSearch} visible={showSearch || listSearch.title !== null} />
          <div className="list-items">
            {listItems.map(item => (
              <div key={item.id}>
                <div className="author">{item.author}</div>
                <div className="date">{item.date.toUTCString()}</div>
                <div className="content">{item.content}</div>
              </div>
            ))}
          </div>
          {listSummary && (
            <div className="g-pagination">
              <Pagination dispatch={dispatch} baseUrl={toUrl(pathname, {[ModuleNames.messages]: {search: {...listSearch, page: NaN}}})} page={listSummary.page} totalPages={listSummary.totalPages} />
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
  const model = state.messages;
  return {
    showSearch: Boolean(state.app.showSearch),
    pathname: state.router.location.pathname,
    listSearch: model.listSearch,
    listItems: model.listItems,
    listSummary: model.listSummary,
  };
};

export default connect(mapStateToProps)(Component);
