export interface Article {
  id: number;
  title: string;
  author: string;
  category: string;
  datePost: string;
}

export interface Category {
  name: string;
  current: number;
  previous: number;
}
