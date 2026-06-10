// Fetch API đơn giản với loading/error/data state. Hỗ trợ abort request, refetch. Dùng cho API nhỏ
import { useSyncExternalStore } from "react";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface UseFetchOptions extends RequestInit {
  method?: HttpMethod;
  skip?: boolean;
}

type FetchListener<T> = (state: FetchState<T>) => void;

function createFetchStore<T>(
  url: string,
  method: HttpMethod,
  fetchOptions: RequestInit,
) {
  let state: FetchState<T> = { data: null, loading: false, error: null };
  const listeners = new Set<FetchListener<T>>();
  let abortController: AbortController | null = null;

  const notify = () => listeners.forEach((l) => l(state));

  const execute = async () => {
    abortController?.abort();
    abortController = new AbortController();

    state = { data: null, loading: true, error: null };
    notify();

    try {
      const res = await fetch(url, {
        method,
        ...fetchOptions,
        signal: abortController.signal,
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data: T = await res.json();
      state = { data, loading: false, error: null };
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        state = { data: null, loading: false, error: err as Error };
      }
    }
    notify();
  };

  const abort = () => {
    abortController?.abort();
  };

  const subscribe = (listener: FetchListener<T>) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  const getSnapshot = () => state;
  const getServerSnapshot = (): FetchState<T> => ({
    data: null,
    loading: false,
    error: null,
  });

  return { execute, subscribe, getSnapshot, getServerSnapshot, abort };
}

export function useFetch<T = unknown>(
  url: string,
  options: UseFetchOptions = {},
): FetchState<T> & { refetch: () => void } {
  const { method = "GET", skip = false, ...fetchOptions } = options;

  const store = createFetchStore<T>(url, method, fetchOptions);

  const state = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );

  if (!skip) {
    void store.execute();
  }

  return { ...state, refetch: store.execute };
}
