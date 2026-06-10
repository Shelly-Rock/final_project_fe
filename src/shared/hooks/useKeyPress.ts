// Theo dõi phím được nhấn. Dùng cho phím tắt, ESC đóng modal, Enter submit form
import { useEffect, useMemo } from "react";
import { useSyncExternalStore } from "react";

function createKeyPressStore(
  keys: readonly string[],
  handler?: (event: KeyboardEvent) => void,
) {
  let pressedKey: string | null = null;
  const listeners = new Set<() => void>();

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  const getSnapshot = () => pressedKey;
  const getServerSnapshot = () => null;

  const handleKeyDown = (event: Event) => {
    const ke = event as KeyboardEvent;
    if (keys.includes(ke.key)) {
      pressedKey = ke.key;
      listeners.forEach((l) => l());
      handler?.(ke);
    }
  };

  const handleKeyUp = (event: Event) => {
    const ke = event as KeyboardEvent;
    if (keys.includes(ke.key)) {
      pressedKey = null;
      listeners.forEach((l) => l());
    }
  };

  const attach = (target: Window | HTMLElement) => {
    target.addEventListener("keydown", handleKeyDown);
    target.addEventListener("keyup", handleKeyUp);
  };

  const detach = (target: Window | HTMLElement) => {
    target.removeEventListener("keydown", handleKeyDown);
    target.removeEventListener("keyup", handleKeyUp);
  };

  return { subscribe, getSnapshot, getServerSnapshot, attach, detach };
}

export function useKeyPress(
  targetKey: string | string[],
  handler?: (event: KeyboardEvent) => void,
  options: { eventTarget?: HTMLElement | Window } = {},
) {
  const keys = useMemo(
    () => (Array.isArray(targetKey) ? targetKey : [targetKey]),
    [targetKey],
  );

  const store = useMemo(
    () => createKeyPressStore(keys, handler),
    [keys, handler],
  );

  const pressedKey = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );

  const target =
    options.eventTarget ?? (typeof window !== "undefined" ? window : null);

  useEffect(() => {
    if (!target) return;
    store.attach(target);
    return () => store.detach(target);
  }, [target, store]);

  return pressedKey;
}
