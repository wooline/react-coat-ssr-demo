import {ListData} from "entity/photo";
import {RootState} from "modules";
import * as React from "react";
import {connect} from "react-redux";

interface Props {
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
}

const mapStateToProps = (state: RootState) => {
  const model = state.photos;
  return {
    listData: model.listData,
  };
};

export default connect(mapStateToProps)(Component);
