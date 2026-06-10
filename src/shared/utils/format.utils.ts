import { isToday, isYesterday, isTomorrow } from "./date.utils";

export type DateFormatLocale = "VN" | "US" | "INTL";

// Định dạng ngày theo locale (VN: dd/mm/yyyy, US: mm/dd/yyyy, INTL: yyyy-mm-dd)
export function formatDateLocale(
  date: Date | string | number,
  locale: DateFormatLocale = "VN",
): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  switch (locale) {
    case "VN":
      return `${day}/${month}/${year}`;
    case "US":
      return `${month}/${day}/${year}`;
    case "INTL":
      return `${year}-${month}-${day}`;
    default:
      return `${day}/${month}/${year}`;
  }
}

// Định dạng ngày giờ đầy đủ (có thể tùy chọn giây, định dạng 12h)
export function formatDateTime(
  date: Date | string | number,
  options?: {
    locale?: DateFormatLocale;
    includeSeconds?: boolean;
    hour12?: boolean;
    separator?: string;
  },
): string {
  const {
    locale = "VN",
    includeSeconds = false,
    hour12 = false,
    separator = " ",
  } = options ?? {};

  const d = new Date(date);
  if (isNaN(d.getTime())) return "";

  const dateStr = formatDateLocale(d, locale);

  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");

  let timeStr = `${hours}:${minutes}`;
  if (includeSeconds) timeStr += `:${seconds}`;
  if (hour12) {
    const h24 = d.getHours();
    const h12 = h24 % 12 || 12;
    const ampm = h24 < 12 ? "AM" : "PM";
    const h12Str = String(h12).padStart(2, "0");
    timeStr = `${h12Str}:${minutes}${separator}${ampm}`;
  }

  return `${dateStr}${separator}${timeStr}`;
}

// Định dạng ngày theo pattern tùy chỉnh (hỗ trợ: yyyy, MM, dd, HH, mm, ss)
export function formatDateCustom(
  date: Date | string | number,
  pattern: string,
): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");

  return pattern
    .replace("yyyy", String(year))
    .replace("MM", month)
    .replace("dd", day)
    .replace("HH", hours)
    .replace("mm", minutes)
    .replace("ss", seconds);
}

// Trả về chuỗi thời gian tương đối (tiếng Việt)
export function timeAgoVN(date: Date | string | number): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";

  const now = Date.now();
  const diffMs = now - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffSec < 60) return "vừa xong";
  if (diffMin < 60) return `${diffMin} phút trước`;
  if (diffHour < 24) return `${diffHour} giờ trước`;
  if (diffDay < 7) return `${diffDay} ngày trước`;
  if (diffWeek < 4) return `${diffWeek} tuần trước`;
  if (diffMonth < 12) return `${diffMonth} tháng trước`;
  return `${diffYear} năm trước`;
}

// Trả về chuỗi thời gian tương đối ngắn gọn (VD: "2h", "3d")
export function timeAgoShort(date: Date | string | number): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";

  const now = Date.now();
  const diffMs = now - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffSec < 60) return "now";
  if (diffMin < 60) return `${diffMin}m`;
  if (diffHour < 24) return `${diffHour}h`;
  if (diffDay < 7) return `${diffDay}d`;
  if (diffWeek < 4) return `${diffWeek}w`;
  if (diffMonth < 12) return `${diffMonth}mo`;
  return `${diffYear}y`;
}

// Trả về ngày với prefix thông minh: "Hôm nay", "Hôm qua", "Ngày mai" hoặc dd/MM/yyyy
export function smartDate(date: Date | string | number): string {
  if (isToday(date)) return "Hôm nay";
  if (isYesterday(date)) return "Hôm qua";
  if (isTomorrow(date)) return "Ngày mai";
  return formatDateLocale(date, "VN");
}

// Lấy thứ trong tuần (tiếng Việt, chuỗi)
export function getDayOfWeekVN(date: Date | string | number): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  const days = [
    "Chủ Nhật",
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
  ];
  return days[d.getDay()];
}

// Lấy thứ trong tuần viết tắt (tiếng Việt)
export function getDayOfWeekShortVN(date: Date | string | number): string {
  if (isToday(date)) return "Hôm nay";
  if (isYesterday(date)) return "Hôm qua";
  if (isTomorrow(date)) return "Ngày mai";

  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  return days[d.getDay()];
}

// Định dạng khoảng thời gian giữa 2 mốc (VD: "2 giờ 30 phút")
export function formatDurationBetween(
  start: Date | string | number,
  end: Date | string | number,
): string {
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return "";

  let diffMs = endDate.getTime() - startDate.getTime();
  if (diffMs < 0) diffMs = -diffMs;

  const totalSeconds = Math.floor(diffMs / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);

  const seconds = totalSeconds % 60;
  const minutes = totalMinutes % 60;
  const hours = totalHours % 24;
  const days = totalDays;

  const parts: string[] = [];
  if (days > 0) parts.push(`${days} ngày`);
  if (hours > 0) parts.push(`${hours} giờ`);
  if (minutes > 0) parts.push(`${minutes} phút`);
  if (seconds > 0 && parts.length === 0) parts.push(`${seconds} giây`);

  return parts.join(" ");
}

// Định dạng khoảng thời gian ngắn từ milliseconds (VD: "2h 30m")
export function formatDurationShort(ms: number): string {
  if (ms < 0) return "0s";

  const totalSeconds = Math.floor(ms / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);

  const seconds = totalSeconds % 60;
  const minutes = totalMinutes % 60;
  const hours = totalHours % 24;
  const days = totalDays;

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

// Cắt chuỗi và thêm suffix (VD: "Xin chào t..." với limit=10)
export function truncateString(
  str: string,
  limit: number,
  suffix = "...",
): string {
  if (!str || str.length <= limit) return str;
  return str.slice(0, limit - suffix.length) + suffix;
}

// Cắt chuỗi theo số từ (word boundary)
export function truncateByWords(
  str: string,
  wordLimit: number,
  suffix = "...",
): string {
  if (!str) return "";
  const words = str.trim().split(/\s+/);
  if (words.length <= wordLimit) return str;
  return words.slice(0, wordLimit).join(" ") + suffix;
}

// Viết hoa chữ cái đầu mỗi từ (VD: "xin chao" -> "Xin Chao")
export function capitalizeWords(str: string): string {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Viết hoa chữ cái đầu tiên (VD: "xin chao" -> "Xin chao")
export function capitalize(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Chuyển chuỗi thành slug (VD: "Xin Chào Thế Giới 2026!" -> "xin-chao-the-gioi-2026")
export function slugify(str: string): string {
  if (!str) return "";
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// Chuyển slug thành title (VD: "xin-chao-the-gioi" -> "Xin Chao The Gioi")
export function unslugify(slug: string): string {
  if (!slug) return "";
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

// Chuẩn hóa khoảng trắng (nhiều space -> 1 space)
export function normalizeWhitespace(str: string): string {
  if (!str) return "";
  return str.trim().replace(/\s+/g, " ");
}

// Xóa tất cả khoảng trắng
export function removeWhitespace(str: string): string {
  if (!str) return "";
  return str.replace(/\s+/g, "");
}

// Escape string để dùng trong template literal hoặc code
export function escapeTemplate(str: string): string {
  if (!str) return "";
  return str.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$/g, "\\$");
}

// Mã hóa HTML entities
export function escapeHtml(str: string): string {
  if (!str) return "";
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return str.replace(/[&<>"']/g, (char) => map[char]);
}

// Giải mã HTML entities
export function unescapeHtml(str: string): string {
  if (!str) return "";
  const map: Record<string, string> = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#039;": "'",
    "&apos;": "'",
  };
  return str.replace(
    /&(?:amp|lt|gt|quot|#039|apos);/g,
    (entity) => map[entity] ?? entity,
  );
}

// Thêm ký tự vào đầu chuỗi cho đủ độ dài
export function padStart(str: string, length: number, char = " "): string {
  return String(str).padStart(length, char);
}

// Thêm ký tự vào cuối chuỗi cho đủ độ dài
export function padEnd(str: string, length: number, char = " "): string {
  return String(str).padEnd(length, char);
}

// Lặp lại chuỗi n lần
export function repeat(str: string, count: number): string {
  return String(str).repeat(Math.max(0, count));
}

// --------------------------
// 3. NAME FORMATTING
// --------------------------

// Rút gọn tên (VD: "Nguyễn Văn An" -> "Nguyễn V. An")
export function abbreviateName(fullName: string): string {
  if (!fullName) return "";
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  const firstName = parts[0];
  const middleName =
    parts.length > 2 ? `${parts[parts.length - 2].charAt(0)}.` : "";
  const lastName = parts[parts.length - 1];
  return [firstName, middleName, lastName].filter(Boolean).join(" ");
}

// Phân tích họ, tên đệm, tên từ chuỗi họ tên đầy đủ
export function parseName(fullName: string): {
  firstName: string;
  middleName: string;
  lastName: string;
} {
  if (!fullName) return { firstName: "", middleName: "", lastName: "" };
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1)
    return { firstName: parts[0], middleName: "", lastName: "" };
  if (parts.length === 2)
    return { firstName: parts[1], middleName: "", lastName: parts[0] };
  return {
    firstName: parts[parts.length - 1],
    middleName: parts.slice(1, parts.length - 1).join(" "),
    lastName: parts[0],
  };
}

// Định dạng tên hiển thị kiểu "Họ, Tên" (VD: "Nguyễn Văn An" -> "Nguyễn, Văn An")
export function formatNameLastFirst(fullName: string): string {
  if (!fullName) return "";
  const { firstName, middleName, lastName } = parseName(fullName);
  if (!lastName) return fullName;
  if (!middleName) return `${lastName}, ${firstName}`;
  return `${lastName}, ${middleName} ${firstName}`;
}

// --------------------------
// 4. MASKING / ANONYMIZATION
// --------------------------

// Che số điện thoại (VD: "0903123456" -> "0903****56")
export function maskPhone(phone: string): string {
  if (!phone || phone.length < 6) return phone;
  const cleaned = phone.replace(/\D/g, "");
  const len = cleaned.length;
  const visibleStart = Math.ceil(len / 4);
  const visibleEnd = Math.floor(len / 4);
  const masked = "*".repeat(len - visibleStart - visibleEnd);
  return `${cleaned.slice(0, visibleStart)}${masked}${cleaned.slice(len - visibleEnd)}`;
}

// Che email (VD: "nguyen.van.an@example.com" -> "ng****n@example.com")
export function maskEmail(email: string): string {
  if (!email || !email.includes("@")) return email;
  const [local, domain] = email.split("@");
  if (local.length <= 2) return email;
  return `${local.charAt(0)}${"*".repeat(local.length - 2)}${local.charAt(local.length - 1)}@${domain}`;
}

// Che số tài khoản / thẻ (VD: "1234567890" -> "****7890")
export function maskNumber(numberStr: string, visibleDigits = 4): string {
  if (!numberStr) return "";
  const cleaned = numberStr.replace(/\D/g, "");
  if (cleaned.length <= visibleDigits) return numberStr;
  const masked = "*".repeat(cleaned.length - visibleDigits);
  return masked + cleaned.slice(-visibleDigits);
}

// Che địa chỉ (giữ đầu và cuối mỗi từ)
export function maskAddress(address: string): string {
  if (!address || address.length <= 10) return address;
  const words = address.split(" ");
  const masked = words.map((word) => {
    if (word.length <= 2) return word;
    return `${word.charAt(0)}${"*".repeat(word.length - 2)}${word.charAt(word.length - 1)}`;
  });
  return masked.join(" ");
}

// --------------------------
// 5. MISC FORMATTING
// --------------------------

// Định dạng số thứ tự tiếng Anh (VD: 1 -> "1st", 2 -> "2nd")
export function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return `${n}${s[(v - 20) % 10] ?? s[v] ?? s[0]}`;
}

// Định dạng số thứ tự tiếng Việt (VD: 1 -> "thứ 1")
export function ordinalVN(n: number): string {
  return `thứ ${n}`;
}

// Chuyển camelCase thành kebab-case
export function camelToKebab(str: string): string {
  if (!str) return "";
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

// Chuyển camelCase thành snake_case
export function camelToSnake(str: string): string {
  if (!str) return "";
  return str.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
}

// Chuyển kebab-case hoặc snake_case thành camelCase
export function kebabOrSnakeToCamel(str: string): string {
  if (!str) return "";
  return str.replace(/[-_]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""));
}

// Chuyển kebab-case hoặc snake_case thành PascalCase
export function kebabOrSnakeToPascal(str: string): string {
  if (!str) return "";
  const camel = kebabOrSnakeToCamel(str);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

// Định dạng bytes thành KiB, MiB... (hệ nhị phân)
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";
  if (bytes < 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KiB", "MiB", "GiB", "TiB", "PiB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${Number((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

// Chuyển số thành chữ số La Mã (1-3999)
export function toRoman(num: number): string {
  if (num <= 0 || num > 3999) return String(num);
  const map: Array<[number, string]> = [
    [1000, "M"],
    [900, "CM"],
    [500, "D"],
    [400, "CD"],
    [100, "C"],
    [90, "XC"],
    [50, "L"],
    [40, "XL"],
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];
  let result = "";
  for (const [value, numeral] of map) {
    while (num >= value) {
      result += numeral;
      num -= value;
    }
  }
  return result;
}

// Chuyển chữ số La Mã thành số
export function fromRoman(roman: string): number {
  if (!roman) return 0;
  const map: Record<string, number> = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000,
    IV: 4,
    IX: 9,
    XL: 40,
    XC: 90,
    CD: 400,
    CM: 900,
  };
  let result = 0;
  for (let i = 0; i < roman.length; i++) {
    const current = map[roman[i]];
    const next = map[roman[i + 1]];
    if (next && current < next) {
      result += next - current;
      i++;
    } else {
      result += current;
    }
  }
  return result;
}

// Lấy chữ cái đầu từ tên (tạo avatar)
export function getInitials(name: string, maxChars = 2): string {
  if (!name) return "";
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0].charAt(0).toUpperCase();
  return words
    .slice(0, maxChars)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");
}

// Làm sạch tên file (thay thế ký tự đặc biệt bằng dấu gạch ngang)
export function sanitizeFilename(filename: string): string {
  if (!filename) return "";
  return filename
    .replace(/[<>:"/\\|?*]/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase()
    .trim();
}

// Định dạng chuỗi version (major.minor.patch)
export function formatVersion(
  major: number,
  minor: number,
  patch: number,
): string {
  return `${major}.${minor}.${patch}`;
}

// Chuyển camelCase thành Title Case (VD: "helloWorld" -> "Hello World")
export function camelToTitle(str: string): string {
  if (!str) return "";
  return str
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (s) => s.toUpperCase());
}
