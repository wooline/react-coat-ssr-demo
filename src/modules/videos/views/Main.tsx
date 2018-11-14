import {PhotoList} from "entity/photo";
import {RootState} from "modules";
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
            {tableList.list.map(item => (
              <li>{item.title}</li>
            ))}
          </ul>
        </div>
      )
    );
  }
}

const mapStateToProps = (state: RootState) => {
  const model = state.videos;
  return {
    tableList: model.tableList,
  };
};

export default connect(mapStateToProps)(Component);
