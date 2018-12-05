import * as React from "react";

interface Props {
  onChange: (page: number) => void;
  baseUrl: string;
  page: number;
  totalPages: number;
}
export default class Component extends React.PureComponent<Props> {
  private chagePage = (e: React.MouseEvent, toPage: number) => {
    const {totalPages, page, onChange} = this.props;
    e.preventDefault();
    if (toPage < 1) {
      toPage = 1;
    }
    if (toPage > totalPages) {
      toPage = totalPages;
    }
    if (toPage !== page) {
      onChange(toPage);
    }
  };
  public render() {
    const {page, totalPages, baseUrl} = this.props;
    return totalPages ? (
      <div className="comp-Pagination">
        <a onClick={e => this.chagePage(e, page - 1)} href={page > 1 ? baseUrl.replace(/(%22page%22%3A)null/, `$1${page - 1}`) : "#"} className={`prev${page === 1 ? " disabled" : ""}`}>
          上一页
        </a>
        <div className="page">
          <span>{page}</span>/{totalPages}
        </div>
        <a
          onClick={e => this.chagePage(e, page + 1)}
          href={page < totalPages ? baseUrl.replace(/(%22page%22%3A)null/, `$1${page + 1}`) : "#"}
          className={`next${page === totalPages ? " disabled" : ""}`}
        >
          下一页
        </a>
      </div>
    ) : (
      <div className="comp-Pagination">没有更多内容</div>
    );
  }
}
