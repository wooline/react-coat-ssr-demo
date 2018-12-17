import {mergeSearch, replaceQuery} from "common/routers";
import Pagination from "components/Pagination";
import {ListData} from "entity/comment";
import {RootRouter, RootState} from "modules";
import {ModuleNames} from "modules/names";
import * as React from "react";
import {connect, DispatchProp} from "react-redux";
import {defaultSearch} from "../facade";
import Editor from "./Editor";
import "./Main.less";

interface Props extends DispatchProp {
  rootRouter: RootRouter;
  listData: ListData;
}

class Component extends React.PureComponent<Props> {
  public render() {
    const {
      dispatch,
      rootRouter,
      listData: {items, summary, search},
    } = this.props;

    return items ? (
      <div className={`${ModuleNames.comments}`}>
        <div className="wrap">
          <div className="list-header">
            <a href="" className="on">
              最新
            </a>
            <a href="">最热</a>
          </div>
          <div className="list-items">
            {items.map(item => (
              <div className="g-border-top" key={item.id}>
                <div className="avatar" style={{backgroundImage: `url(${item.avatarUrl})`}} />
                <div className="user">
                  {item.username}
                  <span className="date">{item.createdTime}</span>
                </div>
                <div className="content">{item.content}</div>
                <span className="reply">
                  <span className="act">回复</span>({item.replies})
                </span>
              </div>
            ))}
          </div>
          {summary && (
            <div className="g-pagination">
              <Pagination
                dispatch={dispatch}
                baseUrl={replaceQuery(rootRouter, ModuleNames.comments, {search: mergeSearch({...search, page: NaN}, defaultSearch)})}
                page={summary.page}
                totalPages={summary.totalPages}
              />
            </div>
          )}
        </div>
        <Editor />
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
