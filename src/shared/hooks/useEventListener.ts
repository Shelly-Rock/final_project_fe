// Đăng ký event listener generic cho window, document, hoặc element. Tự động cleanup
import { useEffect, useRef } from "react";

type EventMap = HTMLElementEventMap & WindowEventMap & DocumentEventMap;

export function useEventListener<K extends keyof EventMap>(
  event: K,
  handler: (event: EventMap[K]) => void,
  target: HTMLElement | Window | Document | null = typeof window !== "undefined"
    ? window
    : null,
  options?: AddEventListenerOptions,
) {
  const savedHandler = useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!target) return;

    const listener = (event: Event) =>
      savedHandler.current(event as EventMap[K]);
    target.addEventListener(event, listener, options);

    return () => target.removeEventListener(event, listener, options);
  }, [event, target, options]);
}
