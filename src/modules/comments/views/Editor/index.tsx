import {Button, InputItem, Toast} from "antd-mobile";
import {RCForm} from "entity/common";
import {RootState} from "modules";
import thisModule from "modules/comments/facade";
import {ModuleNames} from "modules/names";
import {createForm} from "rc-form";
import React from "react";
import {connect, DispatchProp} from "react-redux";
import "./index.less";

interface Props extends DispatchProp, RCForm {}

class Component extends React.PureComponent<Props> {
  private onSubmit = () => {
    const {validateFields, getFieldError} = this.props.form;
    validateFields<{content: string}>((errors, values) => {
      if (!errors) {
        const {content} = values;
        this.props.dispatch(thisModule.actions.getItemDetail(content)); // df
      } else {
        const errorField = Object.keys(errors)[0];
        const message = getFieldError(errorField).join(", ");
        Toast.fail(message, 3);
      }
    });
  };
  public render() {
    const {getFieldProps} = this.props.form;
    const content = getFieldProps("content", {
      initialValue: "",
      rules: [
        {
          required: true,
          message: "请输入您想说的话！",
        },
      ],
    });
    return (
      <div className={`${ModuleNames.photos}-Editor`}>
        <div className="input">
          <InputItem placeholder="我来说两句..." {...content} />
        </div>
        <div className="con">
          <Button type="primary" onClick={this.onSubmit}>
            提交
          </Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {};
};

export default connect(mapStateToProps)(createForm()(Component));
