// app/lib/types.ts
export interface Author {
  id: string;
  name: string;
  email: string;
}

export interface Article {
  id: string;
  category: string;
  title: string;
  slug: string;
  description: string;
  content_html: string;
  province: string;
  city: string;
  active: boolean;
  thumbnail_url: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
  likes: number;
  comments: number;
  author: Author;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface ArticlesResponse {
  success: boolean;
  data: {
    articles: Article[];
    pagination: Pagination;
  };
}

export interface ArticlesParams {
  page?: string;
  limit?: string;
  category?: string;
  province?: string;
  city?: string;
}
