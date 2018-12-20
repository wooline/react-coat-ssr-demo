import {mergeSearch, replaceQuery, toUrl} from "common/routers";
import LinkButton from "components/LinkButton";
import Pagination from "components/Pagination";
import {ListData, PathData} from "entity/comment";
import {RootRouter, RootState} from "modules";
import {ModuleNames} from "modules/names";
import * as React from "react";
import {findDOMNode} from "react-dom";
import {connect, DispatchProp} from "react-redux";
import {defaultSearch} from "../../facade";
import "./index.less";

interface Props extends DispatchProp {
  rootRouter: RootRouter;
  pathData: PathData;
  listData: ListData;
}
let scrollTop = 0;
class Component extends React.PureComponent<Props> {
  public componentWillUnmount() {
    const dom = findDOMNode(this) as HTMLElement;
    scrollTop = dom ? (dom.parentNode as HTMLDivElement).scrollTop : 0;
  }
  public componentDidMount() {
    const dom = findDOMNode(this) as HTMLElement;
    if (dom) {
      (dom.parentNode as HTMLDivElement).scrollTop = scrollTop;
    }
  }
  public render() {
    const {
      dispatch,
      rootRouter,
      listData: {items, summary, search},
      pathData: {type, typeId},
    } = this.props;

    if (items) {
      const itemBaseUrl = toUrl(ModuleNames.comments, "Details", {type, typeId, itemId: "---"}, rootRouter.location.search);
      return (
        <div className={`${ModuleNames.comments}-List`}>
          <div className="list-header">
            <LinkButton
              dispatch={dispatch}
              href={replaceQuery(rootRouter, ModuleNames.comments, {search: mergeSearch({...search, page: 1, isNewest: false}, defaultSearch)})}
              className={search.isNewest ? "" : "on"}
            >
              最热
            </LinkButton>
            <LinkButton
              dispatch={dispatch}
              href={replaceQuery(rootRouter, ModuleNames.comments, {search: mergeSearch({...search, page: 1, isNewest: true}, defaultSearch)})}
              className={search.isNewest ? "on" : ""}
            >
              最新
            </LinkButton>
          </div>
          <div className="list-items">
            {items.map(item => (
              <LinkButton dispatch={dispatch} href={itemBaseUrl.replace(/---/g, item.id)} className="g-border-top" key={item.id}>
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
      );
    } else {
      return null;
    }
  }
}

const mapStateToProps = (state: RootState) => {
  const model = state.comments;
  return {
    rootRouter: state.router,
    listData: model.listData,
    pathData: model.pathData,
  };
};

export default connect(mapStateToProps)(Component);
