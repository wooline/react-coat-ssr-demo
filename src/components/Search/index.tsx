import {Button, InputItem, Toast} from "antd-mobile";
import React from "react";
import "./index.less";

interface Props {
  onClose: () => void;
  onSearch: (keyword: string) => void;
  value: string;
  visible: boolean;
}
interface State {
  props?: Props;
  value: string;
}
class Component extends React.PureComponent<Props, State> {
  public static getDerivedStateFromProps(nextProps: Props, prevState: State): State | null {
    if (nextProps !== prevState.props) {
      return {props: nextProps, value: nextProps.value};
    }
    return null;
  }
  public state: State = {
    value: "",
  };
  private onSubmit = () => {
    const keyword: string = this.state.value;
    if (!keyword) {
      Toast.info("请输入搜索关键字");
    } else {
      this.props.onSearch(keyword);
    }
  };
  private onChange = (value: string) => {
    this.setState({value});
  };
  public render() {
    const {visible} = this.props;
    return (
      <div className={`${visible ? "on " : ""}comp-Search`}>
        <div className="wrap">
          <InputItem clear={true} onChange={this.onChange} placeholder="关键字..." value={this.state.value} />
          <Button size="small" type="primary" onClick={this.onSubmit}>
            搜索
          </Button>
          <Button onClick={this.props.onClose} size="small">
            取消
          </Button>
        </div>
      </div>
    );
  }
}
export default Component;
