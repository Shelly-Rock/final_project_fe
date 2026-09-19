// Performance optimization utilities for notification management

/**
 * Debounce function to prevent excessive API calls during user input
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return function (...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function for scroll/resize events
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Memoization decorator for expensive computations
 */
export function memoize<T extends (...args: unknown[]) => unknown>(fn: T): T {
  const cache = new Map<string, unknown>();
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key) as ReturnType<T>;
    }
    const result = fn(...args) as ReturnType<T>;
    cache.set(key, result);
    return result;
  }) as T;
}

/**
 * Virtual scrolling helper for large lists
 */
export function calculateVisibleRange(
  scrollTop: number,
  containerHeight: number,
  itemHeight: number,
  totalItems: number,
): { start: number; end: number } {
  const start = Math.floor(scrollTop / itemHeight);
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const end = Math.min(start + visibleCount + 1, totalItems);
  return { start, end };
}

/**
 * Lazy load images with intersection observer
 */
export function setupLazyImageLoading(): void {
  if (!("IntersectionObserver" in window)) {
    return;
  }

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        img.src = img.dataset.src || "";
        img.classList.remove("lazy");
        imageObserver.unobserve(img);
      }
    });
  });

  document.querySelectorAll("img.lazy").forEach((img) => {
    imageObserver.observe(img);
  });
}

/**
 * Performance monitoring utilities
 */
export const performanceMonitor = {
  // Mark operation start
  start: (label: string) => {
    performance.mark(`${label}-start`);
  },

  // Mark operation end and measure
  end: (label: string) => {
    performance.mark(`${label}-end`);
    try {
      performance.measure(label, `${label}-start`, `${label}-end`);
      const measure = performance.getEntriesByName(label)[0];
      if (measure) {
        console.log(`⏱️ ${label}: ${measure.duration.toFixed(2)}ms`);
      }
    } catch (error) {
      console.error(`Failed to measure ${label}:`, error);
    }
  },

  // Get memory usage (if available)
  getMemory: () => {
    const memory = (
      performance as typeof performance & {
        memory?: {
          usedJSHeapSize: number;
          totalJSHeapSize: number;
          jsHeapSizeLimit: number;
        };
      }
    ).memory;

    if (memory) {
      return {
        usedJSHeapSize: `${(memory.usedJSHeapSize / 1048576).toFixed(2)}MB`,
        totalJSHeapSize: `${(memory.totalJSHeapSize / 1048576).toFixed(2)}MB`,
        jsHeapSizeLimit: `${(memory.jsHeapSizeLimit / 1048576).toFixed(2)}MB`,
      };
    }
    return null;
  },
};

/**
 * Request batching for multiple API calls
 */
export class RequestBatcher {
  private queue: Map<string, unknown[]> = new Map();
  private timers: Map<string, NodeJS.Timeout> = new Map();
  private batchSize: number = 50;
  private batchDelay: number = 100;

  constructor(batchSize: number = 50, batchDelay: number = 100) {
    this.batchSize = batchSize;
    this.batchDelay = batchDelay;
  }

  add(key: string, item: unknown): void {
    if (!this.queue.has(key)) {
      this.queue.set(key, []);
    }

    const batch = this.queue.get(key)!;
    batch.push(item);

    // Clear existing timer
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key)!);
    }

    // Process immediately if batch size reached
    if (batch.length >= this.batchSize) {
      this.flush(key);
    } else {
      // Otherwise schedule for later
      const timer = setTimeout(() => this.flush(key), this.batchDelay);
      this.timers.set(key, timer);
    }
  }

  private flush(key: string): void {
    const batch = this.queue.get(key);
    if (!batch || batch.length === 0) return;

    // Process batch here
    console.log(`Processing batch for ${key}:`, batch);

    // Clear queue and timer
    this.queue.delete(key);
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key)!);
      this.timers.delete(key);
    }
  }
}

/**
 * Cache management utility
 */
export class CacheManager {
  private cache: Map<string, { data: unknown; timestamp: number }> = new Map();
  private ttl: number; // milliseconds

  constructor(ttl: number = 5 * 60 * 1000) {
    // 5 minutes default
    this.ttl = ttl;
  }

  set(key: string, data: unknown): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  get(key: string): unknown | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  clear(): void {
    this.cache.clear();
  }

  clearExpired(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > this.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

export default performanceMonitor;
