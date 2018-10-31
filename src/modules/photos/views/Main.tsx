import RootState from "core/RootState";
import {PhotoList} from "entity/photo";
import * as React from "react";
import {connect} from "react-redux";

interface Props {
  tableList: PhotoList;
}
class Component extends React.PureComponent<Props> {
  public render() {
    const {tableList} = this.props;
    return (
      tableList && (
        <div id="photo">
          <ul>
            {tableList.list.map((item) => (
              <li key={item.title}>{item.title}</li>
            ))}
          </ul>
        </div>
      )
    );
  }
}

const mapStateToProps = (state: RootState) => {
  const model = state.photos;
  return {
    tableList: model.tableList,
  };
};

export default connect(mapStateToProps)(Component);
