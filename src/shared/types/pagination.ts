export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// ---------- Cursor pagination ----------
export interface CursorParams {
  cursor?: string;
  limit?: number; // default: 20, max: 100
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

export interface CursorMeta {
  nextCursor: string | null;
  prevCursor: string | null;
  hasNext: boolean;
  hasPrev: boolean;
}

// ---------- List response wrapper ----------
export interface PaginatedList<T> {
  items: T[];
  meta: PaginationMeta;
}

export interface CursorList<T> {
  items: T[];
  meta: CursorMeta;
}

// ---------- Shorthand ----------
export type PageParam = number;
export type PerPage = 10 | 20 | 50 | 100;

// ---------- Type guard helpers ----------
export type IsOffsetPagination<T> = T extends PaginationParams ? true : false;
export type IsCursorPagination<T> = T extends CursorParams ? true : false;
