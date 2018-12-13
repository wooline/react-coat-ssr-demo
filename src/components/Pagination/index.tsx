import LinkButton from "components/LinkButton";
import * as React from "react";
import "./index.less";

interface Props {
  onChange: (url: string) => void;
  baseUrl: string;
  page: number;
  totalPages: number;
}
export default class Component extends React.PureComponent<Props> {
  private chagePage = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    this.props.onChange(e.currentTarget.getAttribute("href") as string);
  };
  public render() {
    const {page, totalPages, baseUrl} = this.props;
    return totalPages ? (
      <div className="comp-Pagination">
        <LinkButton onClick={this.chagePage} href={page > 1 ? baseUrl.replace(/(%22page%22%3A)null/, `$1${page - 1}`) : "#"} className={`am-button-inline prev${page === 1 ? " disabled" : ""}`}>
          上一页
        </LinkButton>
        <div className="page">
          <span className="active">{page}</span>/{totalPages}
        </div>
        <LinkButton
          onClick={this.chagePage}
          href={page < totalPages ? baseUrl.replace(/(%22page%22%3A)null/, `$1${page + 1}`) : "#"}
          className={`am-button-inline next${page === totalPages ? " disabled" : ""}`}
        >
          下一页
        </LinkButton>
      </div>
    ) : (
      <div className="comp-Pagination">没有更多内容</div>
    );
  }
}
