import {StartupPageConfig, StartupStep} from "entity/global";
import {RootState} from "modules";
import thisModule from "modules/app/facade";
import {ModuleNames} from "modules/names";
import * as React from "react";
import {connect, DispatchProp} from "react-redux";
import "./index.less";

interface Props extends DispatchProp {
  startupStep: StartupStep;
  className: string;
  config: StartupPageConfig;
}

let nid: NodeJS.Timeout;

class Component extends React.PureComponent<Props> {
  private timer: HTMLSpanElement;

  public onCountEnd = () => {
    if (nid) {
      clearInterval(nid);
    }
    console.log(thisModule.actions);
    this.props.dispatch(thisModule.actions.putStartup(StartupStep.startupCountEnd));
    setTimeout(() => {
      this.props.dispatch(thisModule.actions.putStartup(StartupStep.startupAnimateEnd));
    }, 1000);
  };
  public render() {
    const {className} = this.props;
    const {extAdvertUrl, imageUrl, times} = this.props.config;
    const linkPops = extAdvertUrl ? {target: "_blank", href: extAdvertUrl} : {};

    return (
      <div className={`${ModuleNames.app}-Welcome g-doc-width ${className}`} style={{backgroundImage: `url(${imageUrl})`}}>
        <a className="link" {...linkPops} />
        <div
          className="count"
          onClick={() => {
            this.onCountEnd();
          }}
        >
          <i className="iconfont icon-clock_fill" />
          跳过:
          <em
            className="times"
            ref={node => {
              this.timer = node;
            }}
          >
            {times}
          </em>
        </div>
      </div>
    );
  }

  public componentDidMount() {
    const initLoading = document.getElementById("g-init-loading");
    if (initLoading) {
      initLoading.parentNode.removeChild(initLoading);
      let {times} = this.props.config;
      const el = this.timer;
      nid = setInterval(() => {
        if (times > 0) {
          times--;
          el.innerHTML = times + "";
        } else {
          this.onCountEnd();
        }
      }, 1000);
    }
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    startupStep: state.app.startupStep,
    config: state.app.projectConfig.startupPage,
  };
};

export default connect(mapStateToProps)(Component);
