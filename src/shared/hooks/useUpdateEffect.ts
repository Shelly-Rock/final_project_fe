// useEffect bỏ qua lần render đầu tiên. Chỉ chạy khi dependencies thay đổi
import { useSyncExternalStore } from "react";

function createUpdateEffectStore() {
  let isFirst = true;
  const listeners = new Set<() => void>();

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  const getSnapshot = () => isFirst;
  const getServerSnapshot = () => true;

  const consumeFirst = () => {
    if (isFirst) {
      isFirst = false;
      listeners.forEach((l) => l());
    }
  };

  const reset = () => {
    isFirst = true;
    listeners.forEach((l) => l());
  };

  return { subscribe, getSnapshot, getServerSnapshot, consumeFirst, reset };
}

type EffectCallback = () => void | (() => void);

export function useUpdateEffect(
  effect: EffectCallback,
  dependencies: unknown[],
) {
  const store = createUpdateEffectStore();

  const isFirst = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );

  if (isFirst) {
    store.consumeFirst();
  } else {
    effect();
  }

  void dependencies;
}
