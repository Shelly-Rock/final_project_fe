// Logic phân trang: next, prev, goToPage, setPageSize, canGoNext, canGoPrev
import { useCallback, useState } from "react";

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

export interface UsePaginationReturn {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  canGoNext: boolean;
  canGoPrev: boolean;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
  setPageSize: (size: number) => void;
}

export function usePagination(
  initialState: Partial<PaginationState> = {},
): UsePaginationReturn {
  const [page, setPage] = useState(initialState.page ?? 1);
  const [pageSize, setPageSizeState] = useState(initialState.pageSize ?? 10);
  const [total] = useState(initialState.total ?? 0);

  const totalPages = Math.ceil(total / pageSize);

  const nextPage = useCallback(() => {
    setPage((p) => Math.min(p + 1, totalPages));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setPage((p) => Math.max(p - 1, 1));
  }, []);

  const goToPage = useCallback(
    (targetPage: number) => {
      setPage(Math.max(1, Math.min(targetPage, totalPages)));
    },
    [totalPages],
  );

  const setPageSize = useCallback((size: number) => {
    setPageSizeState(size);
    setPage(1);
  }, []);

  return {
    page,
    pageSize,
    total,
    totalPages,
    canGoNext: page < totalPages,
    canGoPrev: page > 1,
    nextPage,
    prevPage,
    goToPage,
    setPageSize,
  };
}
