import {Button, InputItem, List, Toast} from "antd-mobile";
import {RCForm} from "entity/common";
import {LoginRequest} from "entity/session";
import {RootRouter, RootState} from "modules";
import thisModule from "modules/app/facade";
import {createForm} from "rc-form";
import * as React from "react";
import {connect, DispatchProp} from "react-redux";
import "./index.less";

interface Props extends RCForm, DispatchProp {
  pathname: string;
  searchData: RootRouter["searchData"];
}

class Component extends React.PureComponent<Props> {
  private onSubmit = () => {
    const {validateFields, getFieldError} = this.props.form;
    validateFields((errors, values: LoginRequest) => {
      if (!errors) {
        this.props.dispatch(thisModule.actions.login(values));
      } else {
        const errorField = Object.keys(errors)[0];
        const message = getFieldError(errorField).join(", ");
        Toast.info(message, 3);
      }
    });
  };

  public render() {
    const {
      form: {getFieldProps},
    } = this.props;

    const usernameDecorator = getFieldProps("username", {
      initialValue: "",
      rules: [
        {
          required: true,
          message: "请输入用户名！",
        },
      ],
    });
    const passwordDecorator = getFieldProps("password", {
      initialValue: "",
      rules: [
        {
          required: true,
          message: "请输入密码！",
        },
      ],
    });
    return (
      <div className="app-LoginPop">
        <List className="bd">
          <InputItem {...usernameDecorator} clear={true} placeholder="用户名" />
          <InputItem {...passwordDecorator} clear={true} placeholder="密码" type="password" />
        </List>
        <div className="ft">
          <Button type="primary" onClick={this.onSubmit}>
            登录
          </Button>
          <div className="links">
            <span>+ 注册新会员</span>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  const {pathname} = state.router.location;
  return {
    pathname,
    searchData: state.router.searchData,
  };
};

export default connect(mapStateToProps)(createForm()(Component));
