import {Button} from "antd-mobile";
import {PhotoList} from "entity/photo";
import {RootState} from "modules";
import * as React from "react";
import {connect} from "react-redux";
import "./index.less";

interface Props {
  tableList: PhotoList;
}
class Component extends React.PureComponent<Props> {
  public render() {
    const {tableList} = this.props;
    return (
      tableList && (
        <div id="photo">
          <Button>default</Button>
          <div style={{width: 50, height: 50, background: "red"}}>aaa</div>
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
