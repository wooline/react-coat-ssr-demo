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
  private timer?: HTMLSpanElement;
  private img?: HTMLImageElement;

  public onCountEnd = () => {
    if (nid) {
      clearInterval(nid);
    }
    this.props.dispatch(thisModule.actions.putStartup(StartupStep.startupCountEnd));
    setTimeout(() => {
      this.props.dispatch(thisModule.actions.putStartup(StartupStep.startupAnimateEnd));
    }, 1000);
  };
  public render() {
    const {className} = this.props;
    const {linkUrl, imageUrl, times} = this.props.config;
    const linkPops = linkUrl ? {target: "_blank", href: linkUrl} : {};

    return (
      <div className={`${ModuleNames.app}-Welcome g-doc-width g-pre-img ${className}`}>
        <a className="link" {...linkPops} style={{backgroundImage: `url(${imageUrl})`}} />
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
              this.timer = node as HTMLSpanElement;
            }}
          >
            {times}
          </em>
          <img
            ref={node => {
              this.img = node as HTMLImageElement;
            }}
            style={{position: "absolute", width: "1px", height: "1px", visibility: "hidden"}}
            src={imageUrl}
          />
        </div>
      </div>
    );
  }

  public componentDidMount() {
    const initLoading = document.getElementById("g-init-loading");
    if (initLoading) {
      if (this.img!.naturalWidth) {
        this.props.dispatch(thisModule.actions.putStartup(StartupStep.startupImageLoaded));
      } else {
        this.img!.onload = () => {
          this.props.dispatch(thisModule.actions.putStartup(StartupStep.startupImageLoaded));
        };
        this.img!.onerror = () => {
          this.onCountEnd();
        };
      }
      initLoading.parentNode!.removeChild(initLoading);
      let {times} = this.props.config;
      const el = this.timer!;
      nid = setInterval(() => {
        // 防止图片还未载入，倒计时就已经开始
        if (this.props.startupStep !== StartupStep.configLoaded) {
          if (times > 0) {
            times--;
            el.innerHTML = times + "";
          } else {
            this.onCountEnd();
          }
        }
      }, 1000);
    }
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    startupStep: state.app.startupStep,
    config: state.app.projectConfig!.startupPage,
  };
};

export default connect(mapStateToProps)(Component);
