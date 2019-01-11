import {Modal} from "antd-mobile";
import {reference} from "common/utils";
import React, {CSSProperties} from "react";
import {findDOMNode} from "react-dom";
import "./index.less";

reference(Modal);
export interface Props {
  closable: boolean;
  onClose: () => void;
  style?: CSSProperties;
  visible: boolean;
  title: string;
}

class Component extends React.PureComponent<Props, {}> {
  public render() {
    const {title, visible, style, closable} = this.props;
    return visible ? (
      <div className="comp-Modal g-doc-width g-modal g-enter-in">
        <div className="mask" onClick={this.props.onClose} />
        <div className="dialog" style={style}>
          {closable && (
            <button className="am-modal-close" onClick={this.props.onClose}>
              <span className="am-modal-close-x" />
            </button>
          )}
          <div className="title">{title}</div>

          <div>{this.props.children}</div>
        </div>
      </div>
    ) : null;
  }
  public componentDidUpdate() {
    const dom = findDOMNode(this) as HTMLElement;
    if (dom && dom.className.indexOf("g-enter-in") > -1) {
      setTimeout(() => {
        dom.className = dom.className.replace("g-enter-in", "");
      }, 0);
    }
  }
}

export default Component;
