// Quản lý URL query params: get, set, remove, clear. Dùng cho search, filter, paging
import { useCallback } from "react";
import { useSearchParams as useNextSearchParams } from "react-router-dom";

export function useQueryParams() {
  const [searchParams, setSearchParams] = useNextSearchParams();

  const get = useCallback(
    (key: string): string | null => searchParams.get(key),
    [searchParams],
  );

  const getAll = useCallback((): Record<string, string> => {
    const result: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }, [searchParams]);

  const set = useCallback(
    (key: string, value: string | null) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (value === null || value === "") {
          next.delete(key);
        } else {
          next.set(key, value);
        }
        return next;
      });
    },
    [setSearchParams],
  );

  const setMultiple = useCallback(
    (params: Record<string, string | null>) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        Object.entries(params).forEach(([key, value]) => {
          if (value === null || value === "") {
            next.delete(key);
          } else {
            next.set(key, value);
          }
        });
        return next;
      });
    },
    [setSearchParams],
  );

  const remove = useCallback(
    (key: string) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.delete(key);
        return next;
      });
    },
    [setSearchParams],
  );

  const clear = useCallback(() => {
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  return { get, getAll, set, setMultiple, remove, clear, searchParams };
}
