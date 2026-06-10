// Sao chép nông (shallow copy) object hoặc array
export function clone<T extends object>(obj: T): T {
  if (obj === null || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return [...obj] as unknown as T;
  return { ...obj };
}

// Sao chép sâu (deep clone) object, xử lý nested objects và arrays
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(deepClone) as unknown as T;

  const cloned = {} as T;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      (cloned as Record<string, unknown>)[key] = deepClone(
        (obj as Record<string, unknown>)[key],
      );
    }
  }
  return cloned;
}

// Sao chép sâu nâng cao: hỗ trợ Date, RegExp, Map, Set
export function deepCloneExtended<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") return obj;

  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
  if (obj instanceof RegExp)
    return new RegExp(obj.source, obj.flags) as unknown as T;
  if (obj instanceof Map) {
    const map = new Map();
    obj.forEach((val, key) =>
      map.set(deepCloneExtended(key), deepCloneExtended(val)),
    );
    return map as unknown as T;
  }
  if (obj instanceof Set) {
    const set = new Set();
    obj.forEach((val) => set.add(deepCloneExtended(val)));
    return set as unknown as T;
  }
  if (Array.isArray(obj)) return obj.map(deepCloneExtended) as unknown as T;
  const cloned = {} as Record<string, unknown>;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = deepCloneExtended((obj as Record<string, unknown>)[key]);
    }
  }
  return cloned as T;
}

// Chọn một số key từ object
export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: readonly K[],
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
}

// Chọn các key thỏa mãn điều kiện predicate
export function pickBy<T extends object>(
  obj: T,
  predicate: (value: T[keyof T], key: keyof T) => boolean,
): Partial<T> {
  const result = {} as Partial<T>;
  for (const key in obj) {
    if (
      Object.prototype.hasOwnProperty.call(obj, key) &&
      predicate(obj[key], key)
    ) {
      (result as Record<keyof T, T[keyof T]>)[key] = obj[key];
    }
  }
  return result;
}

// Loại bỏ một số key khỏi object
export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: readonly K[],
): Omit<T, K> {
  const rest = { ...obj } as Partial<Record<K, T[K]>> & Omit<T, K>;
  for (const key of keys) {
    delete (rest as Record<string, unknown>)[String(key)];
  }
  return rest as Omit<T, K>;
}

// Loại bỏ các key thỏa mãn điều kiện predicate
export function omitBy<T extends object>(
  obj: T,
  predicate: (value: T[keyof T], key: keyof T) => boolean,
): Partial<T> {
  const result = {} as Partial<T>;
  for (const key in obj) {
    if (
      Object.prototype.hasOwnProperty.call(obj, key) &&
      !predicate(obj[key], key)
    ) {
      (result as Record<keyof T, T[keyof T]>)[key] = obj[key];
    }
  }
  return result;
}

// Lấy giá trị theo đường dẫn (VD: get(obj, 'a.b.c'))
export function get<T = unknown>(
  obj: unknown,
  path: string | string[],
  defaultValue?: T,
): T {
  const keys = Array.isArray(path) ? path : path.split(".");
  let current: unknown = obj;

  for (const key of keys) {
    if (current === null || current === undefined) {
      return defaultValue as T;
    }

    if (typeof current !== "object") {
      return defaultValue as T;
    }

    current = (current as Record<string, unknown>)[key];
  }

  return (current as T) ?? (defaultValue as T);
}

// Gán giá trị theo đường dẫn (tạo object trung gian nếu chưa có)
export function set<T extends object>(
  obj: T,
  path: string | string[],
  value: unknown,
): T {
  const keys = Array.isArray(path) ? path : path.split(".");

  if (keys.length === 0) {
    return value as T;
  }

  const cloneObj = Array.isArray(obj) ? [...obj] : { ...obj };

  let current: Record<string, unknown> = cloneObj as Record<string, unknown>;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const nextValue = current[key];

    if (nextValue === null || nextValue === undefined) {
      current[key] = {};
    } else if (typeof nextValue !== "object") {
      current[key] = {};
    } else if (Array.isArray(nextValue)) {
      current[key] = [...nextValue];
    } else {
      current[key] = { ...nextValue };
    }

    current = current[key] as Record<string, unknown>;
  }

  const lastKey = keys[keys.length - 1];
  current[lastKey] = value;

  return cloneObj as T;
}

// Xóa giá trị theo đường dẫn (trả về object mới)
export function del<T extends object>(obj: T, path: string | string[]): T {
  const keys = Array.isArray(path) ? path : path.split(".");
  if (keys.length === 0) {
    return obj;
  }
  if (keys.length === 1) {
    return omit(obj, [keys[0] as keyof T]) as T;
  }
  const cloneObj = (Array.isArray(obj) ? [...obj] : { ...obj }) as Record<
    string,
    unknown
  >;
  let current: Record<string, unknown> = cloneObj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const nextValue = current[key];
    if (nextValue === null || nextValue === undefined) {
      return obj;
    }
    if (Array.isArray(nextValue)) {
      current[key] = [...nextValue];
    } else if (typeof nextValue === "object") {
      current[key] = { ...(nextValue as Record<string, unknown>) };
    } else {
      return obj;
    }
    current = current[key] as Record<string, unknown>;
  }
  const lastKey = keys[keys.length - 1];
  delete current[lastKey];

  return cloneObj as T;
}

// Kiểm tra đường dẫn có tồn tại trong object không
export function has(obj: unknown, path: string | string[]): boolean {
  const keys = Array.isArray(path) ? path : path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current === null || current === undefined) {
      return false;
    }
    if (typeof current !== "object") {
      return false;
    }
    current = (current as Record<string, unknown>)[key];
  }
  return current !== undefined;
}

// Gộp nông (shallow merge) nhiều object
export function merge<T extends object>(
  target: T,
  ...sources: Partial<T>[]
): T {
  const result = { ...target };

  for (const source of sources) {
    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        (result as Record<keyof T, unknown>)[key] = source[key] as T[keyof T];
      }
    }
  }

  return result;
}

// Gộp sâu (deep merge) nhiều object
export function deepMerge<T extends object>(
  target: T,
  ...sources: Partial<T>[]
): T {
  const result = deepClone(target) as Record<string, unknown>;
  for (const source of sources) {
    const clonedSource = deepClone(source) as Record<string, unknown>;
    for (const key in clonedSource) {
      if (Object.prototype.hasOwnProperty.call(clonedSource, key)) {
        const sourceValue = clonedSource[key];
        const targetValue = result[key];
        if (
          sourceValue !== null &&
          typeof sourceValue === "object" &&
          !Array.isArray(sourceValue) &&
          targetValue !== null &&
          typeof targetValue === "object" &&
          !Array.isArray(targetValue)
        ) {
          result[key] = deepMerge(targetValue as object, sourceValue as object);
        } else {
          result[key] = sourceValue;
        }
      }
    }
  }

  return result as T;
}

// Gộp mảng (hợp nhất các phần tử, loại bỏ trùng lặp)
export function mergeArrays<T>(target: T[], ...sources: T[][]): T[] {
  const merged = [...target, ...sources.flat()];
  return [...new Set(merged)];
}

// Chuyển object thành mảng các cặp [key, value]
export function toEntries<T extends object>(
  obj: T,
): Array<[keyof T, T[keyof T]]> {
  return Object.entries(obj) as Array<[keyof T, T[keyof T]]>;
}

// Lấy mảng các key của object
export function toKeys<T extends object>(obj: T): Array<keyof T> {
  return Object.keys(obj) as Array<keyof T>;
}

// Lấy mảng các value của object
export function toValues<T extends object>(obj: T): Array<T[keyof T]> {
  return Object.values(obj) as Array<T[keyof T]>;
}

// Biến đổi key của object (map keys)
export function mapKeys<T extends object, K extends string>(
  obj: T,
  mapper: (key: keyof T, value: T[keyof T]) => K,
): Record<K, T[keyof T]> {
  const result = {} as Record<K, T[keyof T]>;

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const newKey = mapper(key as keyof T, obj[key]);
      result[newKey] = obj[key];
    }
  }

  return result;
}

// Biến đổi value của object (map values)
export function mapValues<T extends object, R>(
  obj: T,
  mapper: (value: T[keyof T], key: keyof T) => R,
): Record<keyof T, R> {
  const result = {} as Record<keyof T, R>;

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = mapper(obj[key], key);
    }
  }

  return result;
}

// Đảo ngược key-value (value phải là string hoặc number)
export function invert<T extends Record<string, string | number>>(
  obj: T,
): Record<T[keyof T], keyof T> {
  const result = {} as Record<string, keyof T>;

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      (result as Record<string, keyof T>)[String(value)] = key;
    }
  }

  return result as Record<T[keyof T], keyof T>;
}

// So sánh nông (shallow) hai object
export function isEqual<T extends object>(a: T, b: T): boolean {
  if (a === b) return true;

  if (
    typeof a !== "object" ||
    a === null ||
    typeof b !== "object" ||
    b === null
  ) {
    return false;
  }
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  return keysA.every((key) =>
    Object.is(
      (a as Record<string, unknown>)[key],
      (b as Record<string, unknown>)[key],
    ),
  );
}

// So sánh sâu (deep) hai object
export function isDeepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (
    typeof a !== "object" ||
    a === null ||
    typeof b !== "object" ||
    b === null
  ) {
    return false;
  }
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, i) => isDeepEqual(item, b[i]));
  }
  const keysA = Object.keys(a as object);
  const keysB = Object.keys(b as object);
  if (keysA.length !== keysB.length) return false;
  return keysA.every((key) =>
    isDeepEqual(
      (a as Record<string, unknown>)[key],
      (b as Record<string, unknown>)[key],
    ),
  );
}

// Kiểm tra object có rỗng không (không có key nào)
export function isEmpty(obj: object): boolean {
  if (obj === null || obj === undefined) return true;
  if (Array.isArray(obj)) return obj.length === 0;
  return Object.keys(obj).length === 0;
}

// Kiểm tra object không rỗng
export function isNotEmpty(obj: object): boolean {
  return !isEmpty(obj);
}

// Làm phẳng object (flatten) thành object 1 cấp với key là đường dẫn
export function flatten<T extends object>(
  obj: T,
  separator = ".",
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  function flattenRecursive(current: unknown, prefix: string): void {
    if (current === null || current === undefined) {
      result[prefix] = current;
      return;
    }
    if (typeof current !== "object" || Array.isArray(current)) {
      result[prefix] = current;
      return;
    }
    for (const key in current) {
      if (Object.prototype.hasOwnProperty.call(current, key)) {
        const newKey = prefix ? `${prefix}${separator}${key}` : key;
        flattenRecursive((current as Record<string, unknown>)[key], newKey);
      }
    }
  }
  flattenRecursive(obj, "");
  return result;
}

// Phục hồi object đã bị flatten (ngược lại với flatten)
export function unflatten<T extends object>(
  obj: Record<string, unknown>,
  separator = ".",
): T {
  const result: Record<string, unknown> = {};
  for (const path in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, path)) continue;
    const value = obj[path];
    const keys = path.split(separator);
    let current = result;
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!(key in current)) {
        current[key] = {};
      }
      current = current[key] as Record<string, unknown>;
    }
    current[keys[keys.length - 1]] = value;
  }
  return result as T;
}

// Lấy tất cả các đường dẫn trong object
export function getPaths(obj: unknown, parentPath = ""): string[] {
  if (obj === null || obj === undefined || typeof obj !== "object") {
    return parentPath ? [parentPath] : [];
  }
  const paths: string[] = [];
  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      const currentPath = parentPath ? `${parentPath}[${index}]` : `[${index}]`;
      paths.push(...getPaths(item, currentPath));
    });
  } else {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const currentPath = parentPath ? `${parentPath}.${key}` : key;
        paths.push(
          ...getPaths((obj as Record<string, unknown>)[key], currentPath),
        );
      }
    }
  }
  return paths.length > 0 ? paths : [parentPath || "."];
}

// Lấy số lượng key của object hoặc độ dài array
export function size(obj: object): number {
  if (Array.isArray(obj)) return obj.length;
  return Object.keys(obj).length;
}

// Lấy giá trị ngẫu nhiên từ object
export function randomProperty<T>(obj: Record<string, T>): T | undefined {
  const keys = Object.keys(obj);
  if (keys.length === 0) return undefined;
  return obj[keys[Math.floor(Math.random() * keys.length)]];
}

// Lấy key ngẫu nhiên từ object
export function randomKey<T extends object>(obj: T): keyof T | undefined {
  const keys = Object.keys(obj);
  if (keys.length === 0) return undefined;
  return keys[Math.floor(Math.random() * keys.length)] as keyof T;
}

// Biến đổi toàn bộ object (cả key và value) thông qua transformer
export function transform<T extends object, R>(
  obj: T,
  transformer: (value: T[keyof T], key: keyof T, obj: T) => R,
): Record<keyof T, R> {
  const result = {} as Record<keyof T, R>;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = transformer(obj[key], key, obj);
    }
  }
  return result;
}

// Tạo object từ hai mảng keys và values
export function fromEntries<K extends string | number, V>(
  keys: readonly K[],
  values: readonly V[],
): Record<K, V> {
  const result = {} as Record<K, V>;
  const minLen = Math.min(keys.length, values.length);
  for (let i = 0; i < minLen; i++) {
    result[keys[i]] = values[i];
  }
  return result;
}

// Tạo object từ mảng các cặp [key, value] (generic)
export function fromEntriesGeneric<T extends Record<string, unknown>>(
  entries: Array<[keyof T, T[keyof T]]>,
): T {
  return Object.fromEntries(entries) as T;
}
