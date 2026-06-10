// Quản lý async state tổng quát: idle/loading/success/error. Dùng cho async operations
import { useSyncExternalStore } from "react";

export type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: Error };

type Listener<T> = (state: AsyncState<T>) => void;

function createAsyncStore<T, P>(asyncFn: (params: P) => Promise<T>, params: P) {
  let state: AsyncState<T> = { status: "idle" };
  const listeners = new Set<Listener<T>>();

  const notify = () => listeners.forEach((l) => l(state));

  const execute = async () => {
    state = { status: "loading" };
    notify();
    try {
      const data = await asyncFn(params);
      state = { status: "success", data };
    } catch (err) {
      state = { status: "error", error: err as Error };
    }
    notify();
  };

  const subscribe = (listener: Listener<T>) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  const getSnapshot = () => state;
  const getServerSnapshot = (): AsyncState<T> => ({ status: "idle" });

  const reset = () => {
    state = { status: "idle" };
    notify();
  };

  return { execute, subscribe, getSnapshot, getServerSnapshot, reset };
}

export function useAsync<T, P = unknown>(
  asyncFunction: (params: P) => Promise<T>,
  params: P,
  options: { skip?: boolean } = {},
): AsyncState<T> & { execute: () => Promise<void>; reset: () => void } {
  const { skip = false } = options;

  const store = createAsyncStore<T, P>(asyncFunction, params);

  const state = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );

  if (!skip) {
    void store.execute();
  }

  return { ...state, execute: store.execute, reset: store.reset };
}
