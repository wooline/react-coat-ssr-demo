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
      <div className="loading-icon">
        <div />
      </div>
      <div className="wrap">
        <div />
      </div>
    </div>
  ) : null;
};
export default Component;
