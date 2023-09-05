export interface NewsItem {
  id: number;
  attributes: {
    Title: string;
    Body: string;
    publishedAt: string;
  };
}

export interface StrapiResponse {
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface NewsItemsResponse extends StrapiResponse {
  data: NewsItem[];
}
