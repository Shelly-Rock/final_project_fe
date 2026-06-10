export type StorageType = "local" | "session";

export function isStorageAvailable(type: StorageType): boolean {
  if (typeof window === "undefined") return false;

  try {
    const storage = window[`${type}Storage`];
    const testKey = "__storage_test__";
    storage.setItem(testKey, testKey);
    storage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

// Lấy storage instance (nội bộ)
function getStorage(type: StorageType): Storage | null {
  if (typeof window === "undefined") return null;
  return window[`${type}Storage`] ?? null;
}

// Lấy item từ storage với type safety
export function getItem<T>(key: string, type: StorageType = "local"): T | null {
  const storage = getStorage(type);
  if (!storage) return null;

  try {
    const item = storage.getItem(key);
    if (item === null) return null;

    return JSON.parse(item) as T;
  } catch {
    // Nếu parse fails, có thể là string thuần
    const item = storage.getItem(key);
    return (item as T) ?? null;
  }
}

// Ghi item vào storage với type safety
export function setItem<T>(
  key: string,
  value: T,
  type: StorageType = "local",
): boolean {
  const storage = getStorage(type);
  if (!storage) return false;

  try {
    const serialized = JSON.stringify(value);
    storage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.error("Storage setItem error:", error);
    return false;
  }
}

// Xóa item khỏi storage
export function removeItem(key: string, type: StorageType = "local"): boolean {
  const storage = getStorage(type);
  if (!storage) return false;

  try {
    storage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

// Xóa toàn bộ storage
export function clear(type: StorageType = "local"): boolean {
  const storage = getStorage(type);
  if (!storage) return false;

  try {
    storage.clear();
    return true;
  } catch {
    return false;
  }
}

// Lấy tất cả key trong storage
export function getAllKeys(type: StorageType = "local"): string[] {
  const storage = getStorage(type);
  if (!storage) return [];

  try {
    return Object.keys(storage);
  } catch {
    return [];
  }
}

// Kiểm tra key có tồn tại không
export function hasKey(key: string, type: StorageType = "local"): boolean {
  const storage = getStorage(type);
  if (!storage) return false;

  return storage.getItem(key) !== null;
}

// Lấy dung lượng storage gần đúng (bytes)
export function getStorageSize(type: StorageType = "local"): number {
  const storage = getStorage(type);
  if (!storage) return 0;

  try {
    let size = 0;
    for (const key in storage) {
      if (Object.prototype.hasOwnProperty.call(storage, key)) {
        size += (storage.getItem(key)?.length ?? 0) * 2; // UTF-16
      }
    }
    return size;
  } catch {
    return 0;
  }
}

export interface StorageItem<T> {
  value: T;
  expiry: number | null;
}
// Ghi item kèm thời gian sống (ms)
export function setWithExpiry<T>(
  key: string,
  value: T,
  expiryMs: number,
  type: StorageType = "local",
): boolean {
  const storage = getStorage(type);
  if (!storage) return false;

  try {
    const item: StorageItem<T> = {
      value,
      expiry: Date.now() + expiryMs,
    };
    storage.setItem(key, JSON.stringify(item));
    return true;
  } catch (error) {
    console.error("Storage setWithExpiry error:", error);
    return false;
  }
}

// Lấy item, tự động xóa nếu hết hạn
export function getWithExpiry<T>(
  key: string,
  type: StorageType = "local",
): T | null {
  const storage = getStorage(type);
  if (!storage) return null;

  try {
    const itemStr = storage.getItem(key);
    if (itemStr === null) return null;

    const item = JSON.parse(itemStr) as StorageItem<T>;

    // Kiểm tra hết hạn
    if (item.expiry !== null && Date.now() > item.expiry) {
      storage.removeItem(key);
      return null;
    }

    return item.value;
  } catch {
    const item = storage.getItem(key);
    return (item as T) ?? null;
  }
}

// Ghi item với ngày hết hạn cụ thể
export function setWithExpiryDate<T>(
  key: string,
  value: T,
  expiryDate: Date,
  type: StorageType = "local",
): boolean {
  return setWithExpiry(key, value, expiryDate.getTime() - Date.now(), type);
}

// Lấy thời gian còn lại của key (ms)
export function getTimeRemaining(
  key: string,
  type: StorageType = "local",
): number | null {
  const storage = getStorage(type);
  if (!storage) return null;

  try {
    const itemStr = storage.getItem(key);
    if (itemStr === null) return null;

    const item = JSON.parse(itemStr) as StorageItem<unknown>;
    if (item.expiry === null) return null;

    const remaining = item.expiry - Date.now();
    return Math.max(0, remaining);
  } catch {
    return null;
  }
}
// Lấy hoặc tạo mới (lazy initialization)
export function getOrSet<T>(
  key: string,
  factory: () => T,
  type: StorageType = "local",
): T {
  const existing = getItem<T>(key, type);
  if (existing !== null) return existing;

  const value = factory();
  setItem(key, value, type);
  return value;
}

// Lấy hoặc tạo mới có expiry
export function getOrSetWithExpiry<T>(
  key: string,
  factory: () => T,
  expiryMs: number,
  type: StorageType = "local",
): T {
  const existing = getWithExpiry<T>(key, type);
  if (existing !== null) return existing;

  const value = factory();
  setWithExpiry(key, value, expiryMs, type);
  return value;
}

// Cập nhật giá trị bằng updater function (immutable)
export function updateItem<T>(
  key: string,
  updater: (current: T | null) => T,
  type: StorageType = "local",
): T {
  const current = getItem<T>(key, type);
  const updated = updater(current);
  setItem(key, updated, type);
  return updated;
}

// Gộp object vào storage item
export function mergeItem<T extends object>(
  key: string,
  updates: Partial<T>,
  type: StorageType = "local",
): T {
  const current = getItem<T>(key, type) ?? ({} as T);
  const merged = { ...current, ...updates };
  setItem(key, merged, type);
  return merged;
}

// ============================================
// THAO TÁC HÀNG LOẠT (BULK)
// ============================================

// Ghi nhiều item cùng lúc
export function setMultiple<T extends Record<string, unknown>>(
  items: T,
  type: StorageType = "local",
): Record<keyof T, boolean> {
  const results = {} as Record<keyof T, boolean>;

  for (const key in items) {
    results[key] = setItem(key, items[key], type);
  }

  return results;
}

// Lấy nhiều item cùng lúc
export function getMultiple<T extends string>(
  keys: readonly T[],
  type: StorageType = "local",
): Record<T, unknown> {
  const result = {} as Record<T, unknown>;

  for (const key of keys) {
    result[key] = getItem(key, type);
  }

  return result;
}

// Xóa nhiều item cùng lúc
export function removeMultiple(
  keys: readonly string[],
  type: StorageType = "local",
): void {
  for (const key of keys) {
    removeItem(key, type);
  }
}

// Xóa tất cả item có prefix khớp
export function clearByPrefix(
  prefix: string,
  type: StorageType = "local",
): number {
  const storage = getStorage(type);
  if (!storage) return 0;

  let count = 0;
  const keysToRemove: string[] = [];

  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    if (key?.startsWith(prefix)) {
      keysToRemove.push(key);
    }
  }

  for (const key of keysToRemove) {
    storage.removeItem(key);
    count++;
  }

  return count;
}

// Parse JSON an toàn với fallback
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

// Stringify JSON an toàn
export function safeJsonStringify<T>(value: T, space?: number): string | null {
  try {
    return JSON.stringify(value, null, space);
  } catch {
    return null;
  }
}

// Lưu với TTL (giây)
export function setWithTTL<T>(
  key: string,
  value: T,
  ttlSeconds: number,
  type: StorageType = "local",
): boolean {
  return setWithExpiry(key, value, ttlSeconds * 1000, type);
}

// Lấy với TTL
export function getWithTTL<T>(
  key: string,
  type: StorageType = "local",
): T | null {
  return getWithExpiry<T>(key, type);
}

export interface NamespacedStorage {
  get: <T>(key: string) => T | null;
  set: <T>(key: string, value: T) => boolean;
  remove: (key: string) => boolean;
  has: (key: string) => boolean;
  clear: () => void;
  keys: () => string[];
}
// Tạo storage instance có namespace riêng
export function createNamespaceStorage(
  namespace: string,
  type: StorageType = "local",
): NamespacedStorage {
  const prefix = `${namespace}:`;

  return {
    get: <T>(key: string) => getItem<T>(`${prefix}${key}`, type),
    set: <T>(key: string, value: T) => setItem(`${prefix}${key}`, value, type),
    remove: (key: string) => removeItem(`${prefix}${key}`, type),
    has: (key: string) => hasKey(`${prefix}${key}`, type),
    clear: () => clearByPrefix(prefix, type),
    keys: () => {
      const allKeys = getAllKeys(type);
      return allKeys
        .filter((k) => k.startsWith(prefix))
        .map((k) => k.replace(prefix, ""));
    },
  };
}

type StorageEventCallback = (event: StorageEvent) => void;
const listeners = new Map<string, Set<StorageEventCallback>>();
// Lắng nghe thay đổi storage từ tab khác
export function addStorageListener(
  key: string,
  callback: StorageEventCallback,
  type: StorageType = "local",
): () => void {
  if (typeof window === "undefined") return () => {};
  const storageKey = `${type}:${key}`;
  if (!listeners.has(storageKey)) {
    listeners.set(storageKey, new Set());

    const handler = (event: StorageEvent) => {
      if (event.key === key && event.storageArea === window[`${type}Storage`]) {
        const callbacks = listeners.get(storageKey);
        callbacks?.forEach((cb) => cb(event));
      }
    };
    window.addEventListener("storage", handler);
  }
  listeners.get(storageKey)?.add(callback);
  return () => {
    listeners.get(storageKey)?.delete(callback);
    if (listeners.get(storageKey)?.size === 0) {
      listeners.delete(storageKey);
    }
  };
}

// Phát sóng thay đổi storage (để đồng bộ trong cùng tab)
export function broadcastStorageChange(
  key: string,
  value: unknown,
  type: StorageType = "local",
): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(`storage:${type}:${key}`, {
      detail: { key, value },
    }),
  );
  setItem(key, value, type);
}
