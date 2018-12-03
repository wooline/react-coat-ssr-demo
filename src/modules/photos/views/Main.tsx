import {ListData} from "entity/photo";
import {RootState} from "modules";
import thisModule from "modules/photos/facade";
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
      <div id="photo">
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
  const model = state.photos;
  return {
    listData: model.listData,
  };
};

export default connect(mapStateToProps)(Component);
