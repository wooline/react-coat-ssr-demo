import {Button, InputItem, Toast} from "antd-mobile";
import {toUrl} from "common/routers";
import LinkButton from "components/LinkButton";
import {ModuleNames} from "modules/names";
import React, {RefObject} from "react";
import {DispatchProp} from "react-redux";
import "./index.less";

interface Props extends DispatchProp {
  onSearch: (keyword: string) => void;
  visible: boolean;
  pathname: string;
  search: string;
}

class Component extends React.PureComponent<Props> {
  private input: RefObject<InputItem> = React.createRef();
  private onSubmit = () => {
    const keyword: string = this.input.current!.state.value;
    if (!keyword) {
      Toast.info("请输入搜索关键字");
    } else {
      this.props.onSearch(keyword);
    }
  };
  private onClose = () => {};
  public render() {
    const {pathname, search, visible, dispatch} = this.props;
    return (
      <div className={`${visible ? "on " : ""}comp-Search`}>
        <div className="wrap">
          <InputItem clear={true} placeholder="关键字..." ref={this.input as any} />
          <Button size="small" type="primary" onClick={this.onSubmit}>
            搜索
          </Button>
          <LinkButton onClick={this.onClose} className="am-button am-button-small" href={toUrl(pathname, search, {[ModuleNames.app]: {showSearch: false}})} key="0" dispatch={dispatch}>
            取消
          </LinkButton>
        </div>
      </div>
    );
  }
}
export default Component;
