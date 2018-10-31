export interface PhotoListItem {
  title: string;
  commentCount: number;
  imageCount: number;
  coverUrl: string;
  createTimeDesc: string;
  clickCount: number;
  remark?: string;
}
export interface PhotoList {
  list: PhotoListItem[];
}
export interface PhotoListFilter {
  title: string;
}
