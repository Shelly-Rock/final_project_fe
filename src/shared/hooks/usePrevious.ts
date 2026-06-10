// Lấy giá trị trước đó của một biến. Dùng để so sánh state cũ và mới
import { useSyncExternalStore } from "react";

function createPreviousStore<T>(initialValue: T) {
  let prev: T | undefined = undefined;
  let current = initialValue;
  let hasSet = false;
  const listeners = new Set<() => void>();

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  const getSnapshot = () => {
    if (!hasSet) return undefined;
    return prev;
  };

  const getServerSnapshot = () => undefined as T | undefined;

  const set = (value: T) => {
    if (hasSet) {
      prev = current;
    }
    hasSet = true;
    current = value;
    listeners.forEach((l) => l());
  };

  return { subscribe, getSnapshot, getServerSnapshot, set };
}

export function usePrevious<T>(value: T): T | undefined {
  const store = createPreviousStore<T>(value);

  const prev = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );

  store.set(value);

  return prev;
}
