import {ListItem} from "entity/video";
import {RootState} from "modules";
import {ModuleNames} from "modules/names";
import * as React from "react";
import {connect, DispatchProp} from "react-redux";

interface Props extends DispatchProp {
  listItems: ListItem[];
}

class Component extends React.PureComponent<Props> {
  public render() {
    const {listItems} = this.props;
    return listItems ? (
      <div id={ModuleNames.videos}>
        <ul>
          {listItems.map(item => (
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
    listItems: model.listItems,
  };
};

export default connect(mapStateToProps)(Component);
