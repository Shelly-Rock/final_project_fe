export type Primitive = string | number | boolean | null | undefined;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Tạo mảng với độ dài và hàm khởi tạo
export function createArray<T>(
  length: number,
  factory: (index: number) => T,
): T[] {
  return Array.from({ length }, (_, i) => factory(i));
}

// Đệm mảng đến độ dài chỉ định bằng giá trị fillValue
export function padArray<T>(arr: T[], length: number, fillValue: T): T[] {
  if (arr.length >= length) return [...arr];
  return [...arr, ...Array(length - arr.length).fill(fillValue)];
}

// Chia mảng thành các mảng con có kích thước size
export function chunk<T>(array: T[], size: number): T[][] {
  if (size <= 0) {
    throw new Error(`Invalid chunk size: ${size}. Must be > 0`);
  }
  if (!Array.isArray(array)) {
    throw new TypeError("Expected an array");
  }
  if (array.length === 0) return [];

  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

// Chia mảng thành numChunks mảng con gần bằng nhau
export function chunkEqual<T>(array: T[], numChunks: number): T[][] {
  if (numChunks <= 0) {
    throw new Error(`Invalid number of chunks: ${numChunks}. Must be > 0`);
  }
  if (array.length === 0) return [];

  const chunkSize = Math.ceil(array.length / numChunks);
  return chunk(array, chunkSize);
}

// Cắt mảng bằng giá trị separator
export function split<T>(array: T[], separator: T): T[][] {
  const result: T[][] = [];
  let current: T[] = [];

  for (const item of array) {
    if (item === separator) {
      if (current.length > 0) {
        result.push(current);
        current = [];
      }
    } else {
      current.push(item);
    }
  }

  if (current.length > 0) {
    result.push(current);
  }
  return result;
}

// Tìm các giá trị trùng lặp trong mảng
export function duplicates<T>(array: T[]): T[] {
  const seen = new Set<T>();
  const duplicate = new Set<T>();
  for (const item of array) {
    if (seen.has(item)) {
      duplicate.add(item);
    } else {
      seen.add(item);
    }
  }
  return Array.from(duplicate);
}

// Tìm các giá trị trùng lặp dựa trên key selector
export function duplicatesBy<T, K>(
  array: T[],
  keySelector: (item: T) => K,
): T[] {
  const seen = new Map<K, number>();
  const duplicate: T[] = [];

  for (const item of array) {
    const key = keySelector(item);
    const count = seen.get(key) ?? 0;
    if (count === 1) {
      duplicate.push(item);
    }
    seen.set(key, count + 1);
  }
  return duplicate;
}

// Đếm tần suất xuất hiện của các giá trị
export function frequencies<T>(array: T[]): Map<T, number> {
  const map = new Map<T, number>();
  for (const item of array) {
    map.set(item, (map.get(item) ?? 0) + 1);
  }
  return map;
}

// Đếm tần suất dựa trên key selector
export function frequenciesBy<T, K>(
  array: T[],
  keySelector: (item: T) => K,
): Map<K, number> {
  const map = new Map<K, number>();
  for (const item of array) {
    const key = keySelector(item);
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return map;
}

// Di chuyển phần tử từ fromIndex sang toIndex
export function move<T>(array: T[], fromIndex: number, toIndex: number): T[] {
  if (fromIndex < 0 || fromIndex >= array.length) return [...array];
  if (toIndex < 0 || toIndex >= array.length) return [...array];
  if (fromIndex === toIndex) return [...array];

  const result = [...array];
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result;
}

// Di chuyển phần tử lên trên 1 bước
export function moveUp<T>(array: T[], index: number): T[] {
  if (index <= 0) return [...array];
  return move(array, index, index - 1);
}

// Di chuyển phần tử xuống dưới 1 bước
export function moveDown<T>(array: T[], index: number): T[] {
  if (index >= array.length - 1) return [...array];
  return move(array, index, index + 1);
}

// Xoay vòng mảng (times có thể âm hoặc dương)
export function rotate<T>(array: T[], times: number): T[] {
  if (array.length === 0) return [];
  const normalizedTimes =
    ((times % array.length) + array.length) % array.length;
  if (normalizedTimes === 0) return [...array];

  return [...array.slice(normalizedTimes), ...array.slice(0, normalizedTimes)];
}

// Sắp xếp mảng theo nhiều tiêu chí
export function sortByMultiple<T>(
  array: T[],
  comparators: Array<{
    keySelector: (item: T) => unknown;
    direction?: "asc" | "desc";
  }>,
): T[] {
  return [...array].sort((a, b) => {
    for (const { keySelector, direction = "asc" } of comparators) {
      const aVal = keySelector(a) as number | string;
      const bVal = keySelector(b) as number | string;
      if (aVal < bVal) return direction === "asc" ? -1 : 1;
      if (aVal > bVal) return direction === "asc" ? 1 : -1;
    }
    return 0;
  });
}

// Nhóm và đếm số lượng theo key selector
export function groupCount<T, K>(
  array: T[],
  keySelector: (item: T) => K,
): Map<K, number> {
  const map = new Map<K, number>();
  for (const item of array) {
    const key = keySelector(item);
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return map;
}

// Loại bỏ null và undefined
export function filterNullish<T>(array: (T | null | undefined)[]): T[] {
  return array.filter((item): item is T => item !== null && item !== undefined);
}

// Cắt bỏ các phần tử từ đầu và cuối thỏa mãn predicate
export function trimBy<T>(array: T[], predicate: (item: T) => boolean): T[] {
  let start = 0;
  let end = array.length;

  while (start < end && predicate(array[start])) start++;
  while (end > start && predicate(array[end - 1])) end--;

  return array.slice(start, end);
}

// Thêm nếu chưa có, xóa nếu đã có (toggle)
export function toggle<T>(
  array: T[],
  item: T,
  isEqual: (a: T, b: T) => boolean = (a, b) => a === b,
): T[] {
  const exists = array.some((arrItem) => isEqual(arrItem, item));

  if (exists) {
    return array.filter((arrItem) => !isEqual(arrItem, item));
  } else {
    return [...array, item];
  }
}

// Thay thế phần tử tại vị trí index
export function replace<T>(array: T[], index: number, item: T): T[] {
  if (index < 0 || index >= array.length) return [...array];
  const result = [...array];
  result[index] = item;
  return result;
}

// Cập nhật nếu tồn tại, thêm mới nếu chưa có
export function upsert<T>(
  array: T[],
  item: T,
  isEqual: (a: T, b: T) => boolean,
): T[] {
  const index = array.findIndex((existing) => isEqual(existing, item));

  if (index >= 0) {
    return replace(array, index, item);
  } else {
    return [...array, item];
  }
}

// Lấy phần tử đầu tiên hoặc fallback
export function firstOr<T>(array: T[], fallback: T): T {
  return array[0] ?? fallback;
}

// Lấy phần tử cuối cùng hoặc fallback
export function lastOr<T>(array: T[], fallback: T): T {
  return array[array.length - 1] ?? fallback;
}

// Lấy phần tử tại index (hỗ trợ index âm)
export function at<T>(array: T[], index: number): T | undefined {
  const normalizedIndex = index >= 0 ? index : array.length + index;
  return array[normalizedIndex];
}

// Kiểm tra mảng có chứa tất cả các items
export function includesAll<T>(array: T[], items: T[]): boolean {
  return items.every((item) => array.includes(item));
}

// Kiểm tra mảng có chứa bất kỳ items nào
export function includesAny<T>(array: T[], items: T[]): boolean {
  return items.some((item) => array.includes(item));
}

// So sánh 2 mảng bằng nhau (Object.is)
export function arraysEqual<T>(a: T[], b: T[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((item, i) => Object.is(item, b[i]));
}

// So sánh 2 mảng bằng nhau dùng comparator
export function arraysEqualWith<T>(
  a: T[],
  b: T[],
  comparator: (a: T, b: T) => boolean,
): boolean {
  if (a.length !== b.length) return false;
  return a.every((item, i) => comparator(item, b[i]));
}

// Tính tổng các số
export function sum(array: number[]): number {
  return array.reduce((a, b) => a + b, 0);
}

// Tính tổng theo selector
export function sumBy<T>(array: T[], selector: (item: T) => number): number {
  return array.reduce((total, item) => total + selector(item), 0);
}

// Tính giá trị trung bình
export function average(array: number[]): number {
  if (array.length === 0) return 0;
  return sum(array) / array.length;
}

// Tính giá trị trung bình theo selector
export function averageBy<T>(
  array: T[],
  selector: (item: T) => number,
): number {
  if (array.length === 0) return 0;
  return sumBy(array, selector) / array.length;
}

// Tìm giá trị nhỏ nhất (có thể dùng comparator tùy chỉnh)
export function min<T>(
  array: T[],
  comparator?: (a: T, b: T) => number,
): T | undefined {
  if (array.length === 0) return undefined;
  if (!comparator) {
    comparator = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
  }
  return array.reduce((min, current) =>
    comparator(min, current) <= 0 ? min : current,
  );
}

// Tìm giá trị lớn nhất (có thể dùng comparator tùy chỉnh)
export function max<T>(
  array: T[],
  comparator?: (a: T, b: T) => number,
): T | undefined {
  if (array.length === 0) return undefined;
  if (!comparator) {
    comparator = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
  }
  return array.reduce((max, current) =>
    comparator(max, current) >= 0 ? max : current,
  );
}

// Tính median (trung vị)
export function median(array: number[]): number {
  if (array.length === 0) return 0;
  const sorted = [...array].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

// Tìm mode (giá trị xuất hiện nhiều nhất)
export function mode<T>(array: T[]): T | undefined {
  if (array.length === 0) return undefined;
  const freq = frequencies(array);
  let maxCount = 0;
  let modeValue: T | undefined;

  for (const [value, count] of freq) {
    if (count > maxCount) {
      maxCount = count;
      modeValue = value;
    }
  }

  return modeValue;
}

// Tạo cửa sổ trượt kích thước size
export function window<T>(array: T[], size: number): T[][] {
  if (size <= 0 || array.length < size) return [];
  const result: T[][] = [];
  for (let i = 0; i <= array.length - size; i++) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

// Tạo cửa sổ trượt với bước nhảy step
export function windowStep<T>(array: T[], size: number, step: number): T[][] {
  if (size <= 0 || array.length < size) return [];
  const result: T[][] = [];
  for (let i = 0; i <= array.length - size; i += step) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

// Ghép đôi 2 mảng thành mảng tuple
export function zip<T, U>(a: T[], b: U[]): Array<[T, U]> {
  const minLen = Math.min(a.length, b.length);
  return a.slice(0, minLen).map((item, i) => [item, b[i]]);
}

// Ghép đôi và biến đổi bằng hàm fn
export function zipWith<T, U, R>(a: T[], b: U[], fn: (a: T, b: U) => R): R[] {
  const minLen = Math.min(a.length, b.length);
  return a.slice(0, minLen).map((item, i) => fn(item, b[i]));
}

// Zip object
export function zipObject<K extends string | number, V>(
  keys: K[],
  values: V[],
): Record<K, V> {
  const result = {} as Record<K, V>;
  const minLen = Math.min(keys.length, values.length);
  for (let i = 0; i < minLen; i++) {
    result[keys[i]] = values[i];
  }
  return result;
}

// Scan/Reduce với intermediate values
export function scan<T, R>(
  array: T[],
  reducer: (acc: R, curr: T) => R,
  initial: R,
): R[] {
  const result: R[] = [initial];
  let acc = initial;
  for (const item of array) {
    acc = reducer(acc, item);
    result.push(acc);
  }
  return result;
}
