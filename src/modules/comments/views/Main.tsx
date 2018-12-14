import {mergeSearch, replaceQuery} from "common/routers";
import Pagination from "components/Pagination";
import {routerActions} from "connected-react-router";
import {ListData} from "entity/comment";
import {RootRouter, RootState} from "modules";
import {ModuleNames} from "modules/names";
import * as React from "react";
import {connect, DispatchProp} from "react-redux";
import {defaultSearch} from "../model";

interface Props extends DispatchProp {
  rootRouter: RootRouter;
  listData: ListData;
}

class Component extends React.PureComponent<Props> {
  private onPageChange = (url: string) => {
    this.props.dispatch(routerActions.push(url));
  };
  public render() {
    const {
      rootRouter,
      listData: {items, summary, search},
    } = this.props;

    return items ? (
      <div className={`${ModuleNames.comments}`}>
        <div className="list-items">
          {items.map(item => (
            <div key={item.id}>
              <div className="avatar" style={{backgroundImage: `url(${item.avatarUrl})`}} />
              <div className="user">{item.username}</div>
              <div className="content">{item.content}</div>
              <span className="date">{item.createdTime}</span>
            </div>
          ))}
        </div>
        {summary && (
          <div className="pagination">
            <Pagination
              baseUrl={replaceQuery(rootRouter, ModuleNames.comments, {search: mergeSearch({...search, page: NaN}, defaultSearch)})}
              page={summary.page}
              totalPages={summary.totalPages}
              onChange={this.onPageChange}
            />
          </div>
        )}
      </div>
    ) : null;
  }
}

const mapStateToProps = (state: RootState) => {
  const model = state.comments;
  return {
    rootRouter: state.router,
    listData: model.listData,
  };
};

export default connect(mapStateToProps)(Component);
