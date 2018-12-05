import {ListData} from "entity/video";
import {RootState} from "modules";
import {ModuleNames} from "modules/names";
import * as React from "react";
import {connect, DispatchProp} from "react-redux";

interface Props extends DispatchProp {
  listData: ListData;
}

class Component extends React.PureComponent<Props> {
  public render() {
    const {items} = this.props.listData;
    return items ? (
      <div id={ModuleNames.videos}>
        <ul>
          {items.map(item => (
            <li key={item.title}>{item.title}</li>
          ))}
        </ul>
      </div>
    ) : null;
  }
}

const mapStateToProps = (state: RootState) => {
  const model = state.videos;
  return {
    listData: model.listData,
  };
};

export default connect(mapStateToProps)(Component);
