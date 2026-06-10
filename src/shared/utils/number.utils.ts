// Tạo số nguyên ngẫu nhiên trong khoảng [min, max]
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Tạo số thực ngẫu nhiên trong khoảng [min, max), có thể chỉ định số chữ số thập phân
export function randomFloat(
  min: number,
  max: number,
  decimals?: number,
): number {
  const value = Math.random() * (max - min) + min;
  return decimals !== undefined ? roundFloat(value, decimals) : value;
}

// Giới hạn giá trị trong khoảng [min, max]
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// Làm tròn số đến số chữ số thập phân chỉ định
export function roundFloat(value: number, decimals = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

// Làm tròn xuống (floor) đến số chữ số thập phân chỉ định
export function floorFloat(value: number, decimals = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.floor(value * factor) / factor;
}

// Làm tròn lên (ceil) đến số chữ số thập phân chỉ định
export function ceilFloat(value: number, decimals = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.ceil(value * factor) / factor;
}

// Lấy dấu của số (-1, 0, 1)
export function sign(value: number): -1 | 0 | 1 {
  if (value < 0) return -1;
  if (value > 0) return 1;
  return 0;
}

// Tính phần trăm của value so với total
export function percentage(value: number, total: number, decimals = 2): number {
  if (total === 0) return 0;
  return roundFloat((value / total) * 100, decimals);
}

// Định dạng phần trăm thành chuỗi kèm dấu %
export function percentageFormatted(
  value: number,
  total: number,
  decimals = 1,
): string {
  return `${percentage(value, total, decimals)}%`;
}

// Tính giá trị gốc từ phần trăm (VD: 20% của 100 = 20)
export function fromPercentage(percent: number, total: number): number {
  return (percent / 100) * total;
}

// Tính phần trăm thay đổi giữa giá trị cũ và mới
export function percentageChange(
  oldValue: number,
  newValue: number,
  decimals = 2,
): number {
  if (oldValue === 0) return newValue === 0 ? 0 : 100;
  return roundFloat(
    ((newValue - oldValue) / Math.abs(oldValue)) * 100,
    decimals,
  );
}

// Kiểm tra giá trị có nằm trong dung sai (tolerance) so với target không
export function isWithinPercentage(
  value: number,
  target: number,
  tolerance: number,
): boolean {
  return Math.abs(value - target) <= tolerance;
}

// Định dạng số với dấu phân cách hàng nghìn, thập phân, tiền tố/hậu tố
export function formatNumber(
  value: number,
  options?: {
    decimals?: number;
    decimalSeparator?: string;
    thousandSeparator?: string;
    prefix?: string;
    suffix?: string;
  },
): string {
  const {
    decimals = 0,
    decimalSeparator = ".",
    thousandSeparator = ",",
    prefix = "",
    suffix = "",
  } = options ?? {};

  const [integerPart, decimalPart] = String(value.toFixed(decimals)).split(".");

  const formattedInteger = integerPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    thousandSeparator,
  );

  const formatted = decimalPart
    ? `${formattedInteger}${decimalSeparator}${decimalPart}`
    : formattedInteger;

  return `${prefix}${formatted}${suffix}`;
}

// Rút gọn số lớn (VD: 1500 -> 1.5K, 2.5M...)
export function shortenNumber(
  value: number,
  options?: {
    decimals?: number;
    threshold?: number;
    units?: string[];
  },
): string {
  const {
    decimals = 1,
    threshold = 1000,
    units = ["", "K", "M", "B", "T", "Q"],
  } = options ?? {};
  if (Math.abs(value) < threshold) {
    return formatNumber(value, { decimals: 0 });
  }
  let unitIndex = 0;
  let scaledValue = value;
  while (Math.abs(scaledValue) >= threshold && unitIndex < units.length - 1) {
    scaledValue /= threshold;
    unitIndex++;
  }
  const formatted = roundFloat(scaledValue, decimals);
  const formattedStr = formatNumber(formatted, { decimals });

  return `${formattedStr}${units[unitIndex]}`;
}

// Định dạng tiền tệ Việt Nam (VNĐ)
export function formatCurrencyVND(
  value: number,
  options?: {
    showSymbol?: boolean;
    decimals?: number;
  },
): string {
  const { showSymbol = true, decimals = 0 } = options ?? {};
  const formatted = formatNumber(value, {
    decimals,
    thousandSeparator: ".",
    decimalSeparator: ",",
  });

  return showSymbol ? `${formatted} ₫` : formatted;
}

// Định dạng số điện thoại theo các chuẩn (VN, US, quốc tế)
export function formatPhoneNumber(
  phone: string,
  format: "VN" | "US" | "INTL" = "VN",
): string {
  const cleaned = phone.replace(/\D/g, "");
  if (format === "VN") {
    if (cleaned.length === 9 && cleaned.startsWith("3")) {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
    }
    if (cleaned.length === 10) {
      return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
    }
  }
  if (format === "US") {
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
  }
  if (format === "INTL") {
    return `+${cleaned}`;
  }

  return phone;
}

// Chuyển chuỗi thành số (loại bỏ ký tự không phải số)
export function parseNumber(value: string): number {
  const cleaned = value.replace(/[^\d.-]/g, "");
  const parsed = parseFloat(cleaned);
  return Number.isNaN(parsed) ? 0 : parsed;
}

// Phân tích số đã được định dạng (có dấu phân cách) thành số
export function parseFormattedNumber(
  value: string,
  options?: {
    thousandSeparator?: string;
    decimalSeparator?: string;
  },
): number {
  const { thousandSeparator = ",", decimalSeparator = "." } = options ?? {};
  let cleaned = value.trim();
  cleaned = cleaned.replace(/[^\d.,\-]/g, "");
  const isNegative = cleaned.startsWith("-") || cleaned.startsWith("(");
  cleaned = cleaned.replace(/[-\(\)]/g, "");
  if (decimalSeparator !== ".") {
    cleaned = cleaned.replace(decimalSeparator, ".");
  }
  cleaned = cleaned.replace(new RegExp(`\\${thousandSeparator}`, "g"), "");

  const parsed = parseFloat(cleaned);
  return isNegative ? -parsed : parsed;
}

// Tạo mảng số trong khoảng [start, end] với bước step
export function numericRange(start: number, end: number, step = 1): number[] {
  const result: number[] = [];

  if (step === 0) return result;

  if (step > 0) {
    for (let i = start; i <= end; i += step) {
      result.push(i);
    }
  } else {
    for (let i = start; i >= end; i += step) {
      result.push(i);
    }
  }

  return result;
}

// Chia khoảng [min, max] thành intervals phần bằng nhau
export function divideRange(
  min: number,
  max: number,
  intervals: number,
): Array<{ start: number; end: number }> {
  if (intervals <= 0) return [];
  if (min >= max) return [];

  const step = (max - min) / intervals;
  const result: Array<{ start: number; end: number }> = [];

  for (let i = 0; i < intervals; i++) {
    result.push({
      start: min + i * step,
      end: min + (i + 1) * step,
    });
  }

  return result;
}

// Kiểm tra giá trị có nằm trong khoảng đóng [min, max] không
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

// Kiểm tra giá trị có nằm trong khoảng mở (min, max) không
export function isInOpenRange(
  value: number,
  min: number,
  max: number,
): boolean {
  return value > min && value < max;
}

// Tìm ước số chung lớn nhất (GCD) của 2 số
export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);

  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }

  return a;
}

// Tìm bội số chung nhỏ nhất (LCM) của 2 số
export function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

// Tìm GCD của nhiều số
export function gcdMultiple(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  if (numbers.length === 1) return Math.abs(numbers[0]);

  return numbers.reduce((acc, num) => gcd(acc, num));
}

// Tìm LCM của nhiều số
export function lcmMultiple(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  if (numbers.length === 1) return Math.abs(numbers[0]);

  return numbers.reduce((acc, num) => lcm(acc, num));
}

// Tính giai thừa (n!)
export function factorial(n: number): number {
  if (n < 0) return 0;
  if (n <= 1) return 1;

  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

// Tính số Fibonacci thứ n (không dùng memo)
export function fibonacci(n: number): number {
  if (n <= 0) return 0;
  if (n === 1) return 1;

  let a = 0;
  let b = 1;

  for (let i = 2; i <= n; i++) {
    [a, b] = [b, a + b];
  }

  return b;
}

// Tính số Fibonacci thứ n (có memoization, tối ưu đệ quy)
export const fibonacciMemo = (() => {
  const cache = new Map<number, number>();

  return function fibonacciCached(n: number): number {
    if (n <= 0) return 0;
    if (n === 1) return 1;
    if (cache.has(n)) return cache.get(n)!;

    const result = fibonacciCached(n - 1) + fibonacciCached(n - 2);
    cache.set(n, result);
    return result;
  };
})();

// Tính khoảng cách Euclid giữa 2 điểm (x1,y1) và (x2,y2)
export function distance(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): number {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

// Tính góc (radian) giữa 2 điểm
export function angle(x1: number, y1: number, x2: number, y2: number): number {
  return Math.atan2(y2 - y1, x2 - x1);
}

// Chuyển đổi độ sang radian
export function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Chuyển đổi radian sang độ
export function toDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

// Kiểm tra hai số có xấp xỉ bằng nhau không (sai số epsilon)
export function isApproximatelyEqual(
  a: number,
  b: number,
  epsilon = 0.0001,
): boolean {
  return Math.abs(a - b) < epsilon;
}

// So sánh hai số với độ chính xác chỉ định (trả về difference)
export function compareWithPrecision(
  a: number,
  b: number,
  decimals = 2,
): number {
  const factor = Math.pow(10, decimals);
  return Math.round(a * factor) - Math.round(b * factor);
}

// Kiểm tra có phải số nguyên không
export function isInteger(value: number): boolean {
  return Number.isInteger(value);
}

// Kiểm tra có phải số thực (không nguyên) không
export function isFloat(value: number): boolean {
  return !Number.isNaN(value) && !Number.isInteger(value);
}

// Tính giá trị trung bình cộng (mean)
export function mean(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return numbers.reduce((a, b) => a + b, 0) / numbers.length;
}

// Tính giá trị trung vị (median)
export function median(numbers: number[]): number {
  if (numbers.length === 0) return 0;

  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

// Tìm yếu vị (mode) - giá trị xuất hiện nhiều nhất
export function mode(numbers: number[]): number[] {
  if (numbers.length === 0) return [];
  const frequencies = new Map<number, number>();
  for (const num of numbers) {
    frequencies.set(num, (frequencies.get(num) ?? 0) + 1);
  }
  let maxFreq = 0;
  for (const freq of frequencies.values()) {
    maxFreq = Math.max(maxFreq, freq);
  }
  const modes: number[] = [];
  for (const [num, freq] of frequencies) {
    if (freq === maxFreq) {
      modes.push(num);
    }
  }
  return modes;
}

// Tính độ lệch chuẩn (standard deviation)
export function standardDeviation(numbers: number[]): number {
  if (numbers.length === 0) return 0;

  const avg = mean(numbers);
  const squareDiffs = numbers.map((value) => Math.pow(value - avg, 2));

  return Math.sqrt(mean(squareDiffs));
}

// Tính phương sai (variance)
export function variance(numbers: number[]): number {
  if (numbers.length === 0) return 0;

  const avg = mean(numbers);
  const squareDiffs = numbers.map((value) => Math.pow(value - avg, 2));

  return mean(squareDiffs);
}

// Kiểm tra số dương (> 0)
export function isPositive(value: number): boolean {
  return value > 0;
}

// Kiểm tra số âm (< 0)
export function isNegative(value: number): boolean {
  return value < 0;
}

// Kiểm tra số chẵn
export function isEven(value: number): boolean {
  return value % 2 === 0;
}

// Kiểm tra số lẻ
export function isOdd(value: number): boolean {
  return value % 2 !== 0;
}

// Kiểm tra có phải số nguyên an toàn (trong khoảng ±2^53 - 1)
export function isSafeInteger(value: number): boolean {
  return Number.isSafeInteger(value);
}

// Kiểm tra có phải số hữu hạn (finite) không
export function isFiniteNumber(value: unknown): boolean {
  return typeof value === "number" && Number.isFinite(value);
}

// Kiểm tra có phải NaN không
export function isNaNValue(value: unknown): boolean {
  return typeof value === "number" && Number.isNaN(value);
}
