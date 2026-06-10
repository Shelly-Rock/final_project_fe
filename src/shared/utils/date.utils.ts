import { isValidDateFormat } from "./validation.utils";

export type DateFormat =
  | "YYYY-MM-DD"
  | "DD-MM-YYYY"
  | "MM-DD-YYYY"
  | "YYYY/MM/DD"
  | "DD/MM/YYYY"
  | "MM/DD/YYYY"
  | "YYYY-MM-DD HH:mm:ss"
  | "DD-MM-YYYY HH:mm:ss"
  | "YYYY-MM-DDTHH:mm:ss"
  | "HH:mm:ss"
  | "HH:mm"
  | "MMM DD, YYYY"
  | "DD MMM YYYY"
  | "MMM YYYY"
  | "YYYY";

export type TimeAgoUnit =
  | "second"
  | "minute"
  | "hour"
  | "day"
  | "week"
  | "month"
  | "year";

export interface TimeAgoOptions {
  showUnit?: boolean;
  showValue?: boolean;
  shortFormat?: boolean;
}

// Định dạng ngày theo mẫu chỉ định, hỗ trợ nhiều format và locale
export function formatDate(
  date: Date | string | number,
  format: DateFormat = "YYYY-MM-DD",
  locale?: string,
): string {
  const d = toDate(date);
  if (!d) return "";

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");

  switch (format) {
    case "YYYY-MM-DD":
      return `${year}-${month}-${day}`;
    case "DD-MM-YYYY":
      return `${day}-${month}-${year}`;
    case "MM-DD-YYYY":
      return `${month}-${day}-${year}`;
    case "YYYY/MM/DD":
      return `${year}/${month}/${day}`;
    case "DD/MM/YYYY":
      return `${day}/${month}/${year}`;
    case "MM/DD/YYYY":
      return `${month}/${day}/${year}`;
    case "YYYY-MM-DD HH:mm:ss":
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    case "DD-MM-YYYY HH:mm:ss":
      return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    case "YYYY-MM-DDTHH:mm:ss":
      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    case "HH:mm:ss":
      return `${hours}:${minutes}:${seconds}`;
    case "HH:mm":
      return `${hours}:${minutes}`;
    case "MMM DD, YYYY":
      return `${getMonthName(d, locale)} ${day}, ${year}`;
    case "DD MMM YYYY":
      return `${day} ${getMonthName(d, locale)} ${year}`;
    case "MMM YYYY":
      return `${getMonthName(d, locale)} ${year}`;
    case "YYYY":
      return `${year}`;
    default:
      return `${year}-${month}-${day}`;
  }
}

// Định dạng ngày tương đối (VD: "5 phút trước" / "sau 2 ngày")
export function formatDateRelative(
  date: Date | string | number,
  locale?: string,
): string {
  const d = toDate(date);
  if (!d) return "";
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSeconds = Math.abs(Math.floor(diffMs / 1000));
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const timeAgo = getTimeAgoUnits(
    diffMs,
    diffSeconds,
    diffMinutes,
    diffHours,
    diffDays,
    locale,
  );
  const isFuture = diffMs < 0;
  if (isFuture) {
    return locale?.startsWith("vi") ? `sau ${timeAgo}` : `in ${timeAgo}`;
  }
  return locale?.startsWith("vi") ? `${timeAgo} trước` : `${timeAgo} ago`;
}

// Tính khoảng thời gian (VD: "5 minutes", "2 days") với tùy chọn rút gọn
export function timeAgo(
  date: Date | string | number,
  options?: TimeAgoOptions,
): string {
  const d = toDate(date);
  if (!d) return "";
  const { showUnit = true, shortFormat = false } = options ?? {};
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const absDiffMs = Math.abs(diffMs);
  const absDiffSeconds = Math.floor(absDiffMs / 1000);
  const absDiffMinutes = Math.floor(absDiffSeconds / 60);
  const absDiffHours = Math.floor(absDiffMinutes / 60);
  const absDiffDays = Math.floor(absDiffHours / 24);
  let unit: TimeAgoUnit;
  let value: number;

  if (absDiffSeconds < 60) {
    unit = "second";
    value = absDiffSeconds;
  } else if (absDiffMinutes < 60) {
    unit = "minute";
    value = absDiffMinutes;
  } else if (absDiffHours < 24) {
    unit = "hour";
    value = absDiffHours;
  } else if (absDiffDays < 7) {
    unit = "day";
    value = absDiffDays;
  } else if (absDiffDays < 30) {
    unit = "week";
    value = Math.floor(absDiffDays / 7);
  } else if (absDiffDays < 365) {
    unit = "month";
    value = Math.floor(absDiffDays / 30);
  } else {
    unit = "year";
    value = Math.floor(absDiffDays / 365);
  }

  const unitText = shortFormat
    ? getUnitShort(unit)
    : getUnitText(unit, value, showUnit);
  return `${value} ${unitText}`.trim();
}

// Chuyển đổi đầu vào thành đối tượng Date (hỗ trợ Date, string, number)
export function toDate(
  value: Date | string | number | null | undefined,
): Date | null {
  if (!value) return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

// Chuyển đổi thành timestamp (ms)
export function toTimestamp(date: Date | string | number): number {
  const d = toDate(date);
  return d ? d.getTime() : 0;
}

// Chuyển đổi thành chuỗi ISO 8601
export function toISOString(date: Date | string | number): string {
  const d = toDate(date);
  return d ? d.toISOString() : "";
}

// Chuyển đổi thành Unix timestamp (giây)
export function toUnixTimestamp(date: Date | string | number): number {
  return Math.floor(toTimestamp(date) / 1000);
}

// Kiểm tra có phải ngày hôm nay không
export function isToday(date: Date | string | number): boolean {
  const d = toDate(date);
  if (!d) return false;

  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
}

// Kiểm tra có phải ngày hôm qua không
export function isYesterday(date: Date | string | number): boolean {
  const d = toDate(date);
  if (!d) return false;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear()
  );
}

// Kiểm tra có phải ngày mai không
export function isTomorrow(date: Date | string | number): boolean {
  const d = toDate(date);
  if (!d) return false;
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return (
    d.getDate() === tomorrow.getDate() &&
    d.getMonth() === tomorrow.getMonth() &&
    d.getFullYear() === tomorrow.getFullYear()
  );
}

// Kiểm tra hai ngày có cùng ngày không
export function isSameDay(
  date1: Date | string | number,
  date2: Date | string | number,
): boolean {
  const d1 = toDate(date1);
  const d2 = toDate(date2);
  if (!d1 || !d2) return false;
  return (
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  );
}

// Kiểm tra hai ngày có cùng tuần không
export function isSameWeek(
  date1: Date | string | number,
  date2: Date | string | number,
): boolean {
  const d1 = toDate(date1);
  const d2 = toDate(date2);
  if (!d1 || !d2) return false;
  const diff = Math.abs(d1.getTime() - d2.getTime());
  return diff < 7 * 24 * 60 * 60 * 1000 && d1.getDay() === d2.getDay();
}

// Kiểm tra hai ngày có cùng tháng không
export function isSameMonth(
  date1: Date | string | number,
  date2: Date | string | number,
): boolean {
  const d1 = toDate(date1);
  const d2 = toDate(date2);
  if (!d1 || !d2) return false;
  return (
    d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear()
  );
}

// Kiểm tra hai ngày có cùng năm không
export function isSameYear(
  date1: Date | string | number,
  date2: Date | string | number,
): boolean {
  const d1 = toDate(date1);
  const d2 = toDate(date2);

  if (!d1 || !d2) return false;

  return d1.getFullYear() === d2.getFullYear();
}

// Kiểm tra date1 có trước date2 không
export function isBefore(
  date1: Date | string | number,
  date2: Date | string | number,
): boolean {
  const d1 = toDate(date1);
  const d2 = toDate(date2);

  if (!d1 || !d2) return false;
  return d1.getTime() < d2.getTime();
}

// Kiểm tra date1 có sau date2 không
export function isAfter(
  date1: Date | string | number,
  date2: Date | string | number,
): boolean {
  const d1 = toDate(date1);
  const d2 = toDate(date2);
  if (!d1 || !d2) return false;
  return d1.getTime() > d2.getTime();
}

// Kiểm tra hai ngày có bằng nhau không
export function isEqual(
  date1: Date | string | number,
  date2: Date | string | number,
): boolean {
  const d1 = toDate(date1);
  const d2 = toDate(date2);

  if (!d1 || !d2) return false;
  return d1.getTime() === d2.getTime();
}

// Tính số ngày giữa hai mốc
export function getDaysBetween(
  date1: Date | string | number,
  date2: Date | string | number,
): number {
  const d1 = toDate(date1);
  const d2 = toDate(date2);
  if (!d1 || !d2) return 0;
  const diffMs = Math.abs(d2.getTime() - d1.getTime());
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

// Tính số giờ giữa hai mốc
export function getHoursBetween(
  date1: Date | string | number,
  date2: Date | string | number,
): number {
  const d1 = toDate(date1);
  const d2 = toDate(date2);
  if (!d1 || !d2) return 0;
  const diffMs = Math.abs(d2.getTime() - d1.getTime());
  return diffMs / (1000 * 60 * 60);
}

// Tính số phút giữa hai mốc
export function getMinutesBetween(
  date1: Date | string | number,
  date2: Date | string | number,
): number {
  const d1 = toDate(date1);
  const d2 = toDate(date2);
  if (!d1 || !d2) return 0;
  const diffMs = Math.abs(d2.getTime() - d1.getTime());
  return diffMs / (1000 * 60);
}

// Lấy chênh lệch thời gian (ms) = date2 - date1
export function getTimeDiff(
  date1: Date | string | number,
  date2: Date | string | number,
): number {
  const d1 = toDate(date1);
  const d2 = toDate(date2);
  if (!d1 || !d2) return 0;
  return d2.getTime() - d1.getTime();
}

// Cộng thêm số ngày
export function addDays(
  date: Date | string | number,
  days: number,
): Date | null {
  const d = toDate(date);
  if (!d) return null;

  const result = new Date(d);
  result.setDate(result.getDate() + days);
  return result;
}

// Cộng thêm số tháng
export function addMonths(
  date: Date | string | number,
  months: number,
): Date | null {
  const d = toDate(date);
  if (!d) return null;
  const result = new Date(d);
  result.setMonth(result.getMonth() + months);
  return result;
}

// Cộng thêm số năm
export function addYears(
  date: Date | string | number,
  years: number,
): Date | null {
  const d = toDate(date);
  if (!d) return null;

  const result = new Date(d);
  result.setFullYear(result.getFullYear() + years);
  return result;
}

// Trừ đi số ngày
export function subtractDays(
  date: Date | string | number,
  days: number,
): Date | null {
  return addDays(date, -days);
}

// Trừ đi số tháng
export function subtractMonths(
  date: Date | string | number,
  months: number,
): Date | null {
  return addMonths(date, -months);
}

// Trừ đi số năm
export function subtractYears(
  date: Date | string | number,
  years: number,
): Date | null {
  return addYears(date, -years);
}

// Lấy đầu ngày (00:00:00.000)
export function startOfDay(date: Date | string | number): Date | null {
  const d = toDate(date);
  if (!d) return null;
  const result = new Date(d);
  result.setHours(0, 0, 0, 0);
  return result;
}

// Lấy cuối ngày (23:59:59.999)
export function endOfDay(date: Date | string | number): Date | null {
  const d = toDate(date);
  if (!d) return null;
  const result = new Date(d);
  result.setHours(23, 59, 59, 999);
  return result;
}

// Lấy đầu tuần (Thứ 2, 00:00:00.000)
export function startOfWeek(date: Date | string | number): Date | null {
  const d = toDate(date);
  if (!d) return null;
  const result = new Date(d);
  const day = result.getDay();
  const diff = day === 0 ? 6 : day - 1;
  result.setDate(result.getDate() - diff);
  result.setHours(0, 0, 0, 0);
  return result;
}

// Lấy cuối tuần (Chủ nhật, 23:59:59.999)
export function endOfWeek(date: Date | string | number): Date | null {
  const d = toDate(date);
  if (!d) return null;
  const result = new Date(d);
  const day = result.getDay();
  const diff = day === 0 ? 0 : 7 - day;
  result.setDate(result.getDate() + diff);
  result.setHours(23, 59, 59, 999);
  return result;
}

// Lấy đầu tháng (ngày 1, 00:00:00.000)
export function startOfMonth(date: Date | string | number): Date | null {
  const d = toDate(date);
  if (!d) return null;
  const result = new Date(d);
  result.setDate(1);
  result.setHours(0, 0, 0, 0);
  return result;
}

// Lấy cuối tháng (ngày cuối, 23:59:59.999)
export function endOfMonth(date: Date | string | number): Date | null {
  const d = toDate(date);
  if (!d) return null;
  const result = new Date(d);
  result.setMonth(result.getMonth() + 1);
  result.setDate(0);
  result.setHours(23, 59, 59, 999);
  return result;
}

// Lấy đầu năm (ngày 1/1, 00:00:00.000)
export function startOfYear(date: Date | string | number): Date | null {
  const d = toDate(date);
  if (!d) return null;
  const result = new Date(d);
  result.setMonth(0);
  result.setDate(1);
  result.setHours(0, 0, 0, 0);
  return result;
}

// Lấy cuối năm (ngày 31/12, 23:59:59.999)
export function endOfYear(date: Date | string | number): Date | null {
  const d = toDate(date);
  if (!d) return null;

  const result = new Date(d);
  result.setMonth(11);
  result.setDate(31);
  result.setHours(23, 59, 59, 999);
  return result;
}

// Lấy số ngày trong tháng
export function getDaysInMonth(date: Date | string | number): number {
  const d = toDate(date);
  if (!d) return 0;

  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}

// Lấy số tuần trong năm (theo ISO)
export function getWeekNumber(date: Date | string | number): number {
  const d = toDate(date);
  if (!d) return 0;

  const firstDayOfYear = new Date(d.getFullYear(), 0, 1);
  const pastDaysOfYear = (d.getTime() - firstDayOfYear.getTime()) / 86400000;

  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

// Lấy quý trong năm (1-4)
export function getQuarter(date: Date | string | number): number {
  const d = toDate(date);
  if (!d) return 0;

  return Math.ceil((d.getMonth() + 1) / 3);
}

// Lấy thứ trong tuần (0 = Chủ nhật, 6 = Thứ 7)
export function getDayOfWeek(date: Date | string | number): number {
  const d = toDate(date);
  if (!d) return -1;

  return d.getDay();
}

// Tính pha mặt trăng (0-14, 0 = trăng non)
export function getMoonPhase(date: Date | string | number): number {
  const d = toDate(date);
  if (!d) return 0;

  const knownNewMoon = new Date(2000, 0, 6, 18, 14, 0);
  const lunarCycle = 29.53058867;
  const daysSince = (d.getTime() - knownNewMoon.getTime()) / 86400000;
  return Math.round(((daysSince % lunarCycle) / lunarCycle) * 15) % 15;
}

// Kiểm tra ngày có nằm trong khoảng [start, end] không
export function isInRange(
  date: Date | string | number,
  start: Date | string | number,
  end: Date | string | number,
): boolean {
  const d = toDate(date);
  const s = toDate(start);
  const e = toDate(end);

  if (!d || !s || !e) return false;
  return d.getTime() >= s.getTime() && d.getTime() <= e.getTime();
}

// Kiểm tra ngày có nằm trong tuần hiện tại không
export function isInCurrentWeek(date: Date | string | number): boolean {
  const d = toDate(date);
  if (!d) return false;
  const now = new Date();
  const start = startOfWeek(now);
  const end = endOfWeek(now);
  if (!start || !end) return false;
  return d >= start && d <= end;
}

// Kiểm tra có phải ngày trong tuần (Thứ 2 - Thứ 6) không
export function isWeekday(date: Date | string | number): boolean {
  const d = toDate(date);
  if (!d) return false;
  const day = d.getDay();
  return day !== 0 && day !== 6;
}

// Kiểm tra có phải cuối tuần (Thứ 7, Chủ nhật) không
export function isWeekend(date: Date | string | number): boolean {
  const d = toDate(date);
  if (!d) return false;
  const day = d.getDay();
  return day === 0 || day === 6;
}

// Đếm số ngày làm việc (Thứ 2 - Thứ 6) giữa hai mốc
export function getBusinessDaysBetween(
  date1: Date | string | number,
  date2: Date | string | number,
): number {
  let count = 0;
  let current = toDate(date1);
  const end = toDate(date2);
  if (!current || !end) return 0;
  const startTime = current.getTime();
  const endTime = end.getTime();
  const step = startTime <= endTime ? 1 : -1;
  while (
    step > 0 ? current.getTime() <= endTime : current.getTime() >= endTime
  ) {
    if (isWeekday(current)) count++;
    current = addDays(current, step)!;
  }
  return count;
}

// Phân tích chuỗi ngày (có kiểm tra định dạng hợp lệ)
export function parseDate(value: string): Date | null {
  return isValidDateFormat(value) ? new Date(value) : null;
}

// Phân tích chuỗi ISO 8601 thành Date
export function parseISODate(value: string): Date | null {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

// Phân tích Unix timestamp (giây) thành Date
export function parseUnixTimestamp(timestamp: number): Date | null {
  const d = new Date(timestamp * 1000);
  return Number.isNaN(d.getTime()) ? null : d;
}

// Phân tích Unix timestamp (ms) thành Date
export function parseUnixTimestampMs(timestamp: number): Date | null {
  const d = new Date(timestamp);
  return Number.isNaN(d.getTime()) ? null : d;
}

// Lấy tên tháng đầy đủ (VD: Tháng 1, January)
export function getMonthName(
  date: Date | string | number,
  locale?: string,
): string {
  const d = toDate(date);
  if (!d) return "";

  return d.toLocaleDateString(locale ?? "vi-VN", { month: "long" });
}

// Lấy tên tháng viết tắt (VD: Thg 1, Jan)
export function getMonthShortName(
  date: Date | string | number,
  locale?: string,
): string {
  const d = toDate(date);
  if (!d) return "";

  return d.toLocaleDateString(locale ?? "vi-VN", { month: "short" });
}

// Lấy tên ngày trong tuần đầy đủ (VD: Thứ Hai, Monday)
export function getDayName(
  date: Date | string | number,
  locale?: string,
): string {
  const d = toDate(date);
  if (!d) return "";

  return d.toLocaleDateString(locale ?? "vi-VN", { weekday: "long" });
}

// Lấy tên ngày trong tuần viết tắt (VD: Th 2, Mon)
export function getDayShortName(
  date: Date | string | number,
  locale?: string,
): string {
  const d = toDate(date);
  if (!d) return "";

  return d.toLocaleDateString(locale ?? "vi-VN", { weekday: "short" });
}

// Lấy danh sách tất cả các ngày trong tháng
export function getDatesInMonth(year: number, month: number): Date[] {
  const result: Date[] = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let day = 1; day <= daysInMonth; day++) {
    result.push(new Date(year, month, day));
  }
  return result;
}

// Lấy danh sách các ngày trong tuần (Thứ 2 -> Chủ nhật)
export function getDatesInWeek(date: Date | string | number): Date[] {
  const d = toDate(date);
  if (!d) return [];
  const start = startOfWeek(d);
  if (!start) return [];
  return Array.from({ length: 7 }, (_, i) => addDays(start, i)!);
}

// Lấy khoảng đầu tuần - cuối tuần
export function getWeekRange(
  date: Date | string | number,
): { start: Date; end: Date } | null {
  const d = toDate(date);
  if (!d) return null;
  const start = startOfWeek(d);
  const end = endOfWeek(d);
  if (!start || !end) return null;
  return { start, end };
}

// Lấy khoảng đầu tháng - cuối tháng
export function getMonthRange(
  date: Date | string | number,
): { start: Date; end: Date } | null {
  const d = toDate(date);
  if (!d) return null;
  const start = startOfMonth(d);
  const end = endOfMonth(d);
  if (!start || !end) return null;
  return { start, end };
}

// Hàm nội bộ: Lấy chuỗi đơn vị thời gian cho formatDateRelative
function getTimeAgoUnits(
  diffMs: number,
  diffSeconds: number,
  diffMinutes: number,
  diffHours: number,
  diffDays: number,
  locale?: string,
): string {
  const isVn = locale?.startsWith("vi");
  if (diffSeconds < 5) {
    return isVn ? "vài giây" : "a few seconds";
  }
  if (diffSeconds < 60) {
    return `${diffSeconds} ${isVn ? "giây" : "seconds"}`;
  }
  if (diffMinutes < 60) {
    return `${diffMinutes} ${isVn ? "phút" : "minutes"}`;
  }
  if (diffHours < 24) {
    return `${diffHours} ${isVn ? "giờ" : "hours"}`;
  }
  if (diffDays < 7) {
    return `${diffDays} ${isVn ? "ngày" : "days"}`;
  }
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} ${isVn ? "tuần" : "weeks"}`;
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} ${isVn ? "tháng" : "months"}`;
  }

  const years = Math.floor(diffDays / 365);
  return `${years} ${isVn ? "năm" : "years"}`;
}

// Hàm nội bộ: Lấy text đơn vị thời gian (số nhiều/số ít)
function getUnitText(
  unit: TimeAgoUnit,
  value: number,
  plural: boolean,
): string {
  if (!plural || value === 1) {
    switch (unit) {
      case "second":
        return "second";
      case "minute":
        return "minute";
      case "hour":
        return "hour";
      case "day":
        return "day";
      case "week":
        return "week";
      case "month":
        return "month";
      case "year":
        return "year";
    }
  }

  switch (unit) {
    case "second":
      return "seconds";
    case "minute":
      return "minutes";
    case "hour":
      return "hours";
    case "day":
      return "days";
    case "week":
      return "weeks";
    case "month":
      return "months";
    case "year":
      return "years";
  }
}

// Hàm nội bộ: Lấy ký tự viết tắt của đơn vị thời gian
function getUnitShort(unit: TimeAgoUnit): string {
  switch (unit) {
    case "second":
      return "s";
    case "minute":
      return "m";
    case "hour":
      return "h";
    case "day":
      return "d";
    case "week":
      return "w";
    case "month":
      return "mo";
    case "year":
      return "y";
    default:
      return "";
  }
}
