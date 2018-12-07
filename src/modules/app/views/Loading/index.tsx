import {Icon} from "antd-mobile";
import * as React from "react";
import {LoadingState} from "react-coat";
import "./index.less";

interface Props {
  loading: LoadingState;
}

const Component = (props: Props) => {
  const {loading} = props;
  return loading === LoadingState.Start || loading === LoadingState.Depth ? (
    <div className={"app-Loading " + loading}>
      <Icon className="loading-icon" type="loading" />
      <div className="wrap" />
    </div>
  ) : null;
};
export default Component;
