import {ListData} from "entity/video";
import {RootState} from "modules";
import thisModule from "modules/videos/facade";
import * as React from "react";
import {connect, DispatchProp} from "react-redux";

let unmounted: boolean = false;

interface Props extends DispatchProp {
  listData: ListData;
}

class Component extends React.PureComponent<Props> {
  public render() {
    const {items} = this.props.listData;
    return items ? (
      <div id="videos">
        <ul>
          {items.map(item => (
            <li key={item.title}>{item.title}</li>
          ))}
        </ul>
      </div>
    ) : null;
  }
  public componentWillMount() {
    if (unmounted) {
      unmounted = false;
      this.props.dispatch(thisModule.actions.searchList());
    }
  }
  public componentWillUnmount() {
    unmounted = true;
  }
}

const mapStateToProps = (state: RootState) => {
  const model = state.videos;
  return {
    listData: model.listData,
  };
};

export default connect(mapStateToProps)(Component);
