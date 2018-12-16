import {Button} from "antd-mobile";
import {linkTo} from "common/routers";
import {reference} from "common/utils";
import * as React from "react";
import {AnchorHTMLAttributes} from "react";
import {DispatchProp} from "react-redux";

reference(Button);

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement>, DispatchProp {}

const Component = (props: Props) => {
  const {dispatch, ...others} = props;
  return (
    <a {...others} onClick={e => linkTo(e, dispatch)} role="button">
      {props.children}
    </a>
  );
};
export default Component;
