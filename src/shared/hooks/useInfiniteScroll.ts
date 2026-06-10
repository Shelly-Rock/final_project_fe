// Load dữ liệu vô hạn khi cuộn đến cuối. Dùng IntersectionObserver, trả về sentinelRef
import { useCallback, useEffect, useRef } from "react";

interface UseInfiniteScrollOptions {
  threshold?: number;
  rootMargin?: string;
  hasMore: boolean | (() => boolean);
  onLoadMore: () => Promise<void>;
  enabled?: boolean;
}

export function useInfiniteScroll({
  threshold = 0.1,
  rootMargin = "100px",
  hasMore,
  onLoadMore,
  enabled = true,
}: UseInfiniteScrollOptions) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);

  const handleIntersect = useCallback(
    async ([entry]: IntersectionObserverEntry[]) => {
      if (!entry.isIntersecting || !enabled) return;

      const more = typeof hasMore === "function" ? hasMore() : hasMore;
      if (!more || loadingRef.current) return;

      loadingRef.current = true;
      try {
        await onLoadMore();
      } finally {
        loadingRef.current = false;
      }
    },
    [enabled, hasMore, onLoadMore],
  );

  useEffect(() => {
    if (!enabled) return;

    observerRef.current = new IntersectionObserver(handleIntersect, {
      threshold,
      rootMargin,
    });

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [handleIntersect, threshold, rootMargin, enabled]);

  const setSentinelRef = useCallback((node: HTMLDivElement | null) => {
    if (observerRef.current && sentinelRef.current) {
      observerRef.current.unobserve(sentinelRef.current);
    }
    sentinelRef.current = node;
    if (node && observerRef.current) {
      observerRef.current.observe(node);
    }
  }, []);

  return { sentinelRef: setSentinelRef };
}
