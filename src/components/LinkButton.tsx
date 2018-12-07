import {Button} from "antd-mobile";
import {reference} from "common/utils";
import * as React from "react";
import {AnchorHTMLAttributes} from "react";

reference(Button);

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {}

const Component = (props: Props) => {
  const {className, ...others} = props;
  return <a {...others} role="button" className={`am-button ${className}`} />;
};
export default Component;
