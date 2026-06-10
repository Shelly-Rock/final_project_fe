/** Viết hoa chữ cái đầu tiên */
export function capitalize(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/** Viết hoa chữ cái đầu mỗi từ */
export function capitalizeWords(str: string): string {
  if (!str) return "";
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/** Chuyển sang camelCase */
export function toCamelCase(str: string): string {
  if (!str) return "";
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
    .replace(/^./, (s) => s.toLowerCase());
}

/** Chuyển sang PascalCase */
export function toPascalCase(str: string): string {
  if (!str) return "";
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
    .replace(/^./, (s) => s.toUpperCase());
}

/** Chuyển sang snake_case */
export function toSnakeCase(str: string): string {
  if (!str) return "";
  return str
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[-\s]+/g, "_")
    .toLowerCase();
}

/** Chuyển sang kebab-case */
export function toKebabCase(str: string): string {
  if (!str) return "";
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[_\s]+/g, "-")
    .toLowerCase();
}

/** Chuyển sang CONSTANT_CASE */
export function toConstantCase(str: string): string {
  return toSnakeCase(str).toUpperCase();
}

/** Cắt chuỗi với dấu ... ở cuối */
export function truncate(
  str: string,
  maxLength: number,
  suffix: string = "...",
): string {
  if (!str || maxLength <= 0) return "";
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - suffix.length) + suffix;
}

/** Cắt chuỗi với dấu ... ở giữa */
export function truncateMiddle(
  str: string,
  maxLength: number,
  separator: string = "...",
): string {
  if (!str || maxLength <= separator.length) return "";
  if (str.length <= maxLength) return str;

  const charsToShow = maxLength - separator.length;
  const frontChars = Math.ceil(charsToShow / 2);
  const backChars = Math.floor(charsToShow / 2);

  return (
    str.slice(0, frontChars) + separator + str.slice(str.length - backChars)
  );
}

/** Cắt chuỗi theo số từ */
export function truncateWords(
  str: string,
  maxWords: number,
  suffix: string = "...",
): string {
  if (!str || maxWords <= 0) return "";
  const words = str.split(/\s+/);
  if (words.length <= maxWords) return str;
  return words.slice(0, maxWords).join(" ") + suffix;
}

/** Xóa dấu tiếng Việt */
export function removeDiacritics(str: string): string {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

/** Loại bỏ HTML tags */
export function stripHtml(str: string): string {
  if (!str) return "";
  return str.replace(/<[^>]*>/g, "");
}

/** Xóa khoảng trắng dư thừa (chỉ giữ 1 space) */
export function trimAll(str: string): string {
  return str.replace(/\s+/g, " ").trim();
}

/** Chuẩn hóa whitespace */
export function normalizeWhitespace(str: string): string {
  return str.replace(/\s+/g, " ").trim();
}

/** Trim từng dòng */
export function trimLines(str: string): string {
  return str
    .split("\n")
    .map((line) => line.trim())
    .join("\n");
}

/** Xóa tất cả khoảng trắng */
export function removeWhitespace(str: string): string {
  return str.replace(/\s/g, "");
}

/** Xóa newline (thay bằng space) */
export function removeNewlines(str: string): string {
  return str.replace(/\n/g, " ");
}

/** Lấy chữ cái đầu mỗi từ (tối đa maxLength chữ) */
export function getInitials(str: string, maxLength = 2): string {
  if (!str) return "";
  const words = str.trim().split(/\s+/);
  return words
    .slice(0, maxLength)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

/** Lấy tên (từ cuối cùng) */
export function getFirstName(str: string): string {
  if (!str) return "";
  const parts = str.trim().split(/\s+/);
  return parts[parts.length - 1];
}

/** Lấy họ (từ đầu tiên) */
export function getLastName(str: string): string {
  if (!str) return "";
  const parts = str.trim().split(/\s+/);
  return parts[0];
}

/** Lấy mảng các từ */
export function getWords(str: string): string[] {
  if (!str) return [];
  return str.trim().split(/\s+/).filter(Boolean);
}

/** Đếm số từ */
export function countWords(str: string): number {
  return getWords(str).length;
}

/** Đếm số ký tự */
export function countCharacters(str: string, includeSpaces = false): number {
  if (!str) return 0;
  return includeSpaces ? str.length : str.replace(/\s/g, "").length;
}

/** Đếm số dòng */
export function countLines(str: string): number {
  if (!str) return 0;
  return str.split("\n").length;
}

// ==================== REPLACE UTILITIES ====================

/** Thay thế tất cả (dùng split/join thay vì regex) */
export function replaceAll(
  str: string,
  search: string,
  replacement: string,
): string {
  if (!str) return "";
  return str.split(search).join(replacement);
}

/** Thay thế tất cả với regex */
export function replaceAllRegex(
  str: string,
  pattern: RegExp,
  replacement: string,
): string {
  if (!str) return "";
  const flags = pattern.flags.includes("g")
    ? pattern.flags
    : pattern.flags + "g";
  return str.replace(new RegExp(pattern.source, flags), replacement);
}

// ==================== HTML & ENCODE/DECODE ====================

/** Escape HTML (chống XSS) */
export function escapeHtml(str: string): string {
  if (!str) return "";
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return str.replace(/[&<>"']/g, (char) => map[char] || char);
}

/** Unescape HTML */
export function unescapeHtml(str: string): string {
  if (!str) return "";
  const map: Record<string, string> = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
  };
  return str.replace(
    /&(amp|lt|gt|quot|#39);/g,
    (entity) => map[entity] || entity,
  );
}

/** Escape regex đặc biệt characters */
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** URL encode */
export function encodeUri(str: string): string {
  return encodeURIComponent(str);
}

/** URL decode */
export function decodeUri(str: string): string {
  return decodeURIComponent(str);
}

/** Tạo slug từ string */
export function slugify(str: string): string {
  if (!str) return "";
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** Kiểm tra string rỗng (null, undefined, hoặc chỉ spaces) */
export function isEmpty(str: unknown): boolean {
  if (str === null || str === undefined) return true;
  if (typeof str !== "string") return false;
  return str.trim().length === 0;
}

/** Kiểm tra email hợp lệ */
export function isEmail(str: string): boolean {
  if (!str) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
}

/** Kiểm tra URL hợp lệ */
export function isUrl(str: string): boolean {
  if (!str) return false;
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

/** Kiểm tra số (bao gồm số thập phân) */
export function isNumeric(str: string): boolean {
  if (!str) return false;
  return /^-?\d+(\.\d+)?$/.test(str.trim());
}

/** Kiểm tra số nguyên */
export function isInteger(str: string): boolean {
  if (!str) return false;
  return /^-?\d+$/.test(str.trim());
}

/** Kiểm tra số thực */
export function isFloat(str: string): boolean {
  if (!str) return false;
  return /^-?\d+\.\d+$/.test(str.trim());
}

/** Kiểm tra chỉ chứa chữ cái */
export function isAlpha(str: string): boolean {
  if (!str) return false;
  return /^[a-zA-Z]+$/.test(str);
}

/** Kiểm tra chỉ chứa chữ cái và số */
export function isAlphanumeric(str: string): boolean {
  if (!str) return false;
  return /^[a-zA-Z0-9]+$/.test(str);
}

/** Kiểm tra hex color (ví dụ: #FFF, #FFFFFF) */
export function isHexColor(str: string): boolean {
  if (!str) return false;
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(str);
}

/** Kiểm tra chỉ chứa khoảng trắng */
export function isWhitespace(str: string): boolean {
  return /^\s*$/.test(str);
}

/** So sánh không phân biệt hoa thường */
export function equalsIgnoreCase(str1: string, str2: string): boolean {
  return str1.toLowerCase() === str2.toLowerCase();
}

/** So sánh sau khi trim */
export function equalsTrimmed(str1: string, str2: string): boolean {
  return str1.trim() === str2.trim();
}

/** So sánh sau khi trim và lower case */
export function equalsNormalized(str1: string, str2: string): boolean {
  return str1.trim().toLowerCase() === str2.trim().toLowerCase();
}

/** Mask email (ví dụ: us***er@gmail.com) */
export function maskEmail(email: string): string {
  if (!email || !email.includes("@")) return email;
  const [local, domain] = email.split("@");
  if (local.length <= 2) return `${local[0]}***@${domain}`;
  return `${local[0]}${"*".repeat(Math.min(local.length - 2, 8))}${local[local.length - 1]}@${domain}`;
}

/** Mask phone (ví dụ: 098****321) */
export function maskPhone(phone: string): string {
  if (!phone || phone.length < 4) return phone;
  return `${phone.slice(0, 3)}****${phone.slice(-3)}`;
}

/** Mask CCCD/CMND (ví dụ: 079*******123) */
export function maskCCCD(cccd: string): string {
  if (!cccd || cccd.length < 8) return cccd;
  return `${cccd.slice(0, 6)}****${cccd.slice(-4)}`;
}

/** Mask string với số ký tự hiển thị đầu và cuối */
export function maskString(
  str: string,
  visibleStart = 2,
  visibleEnd = 2,
): string {
  if (!str || str.length <= visibleStart + visibleEnd) return str;
  return `${str.slice(0, visibleStart)}${"*".repeat(str.length - visibleStart - visibleEnd)}${str.slice(-visibleEnd)}`;
}

/** Redact thông tin nhạy cảm (email, phone, card, CCCD) */
export function redactSensitive(str: string): string {
  let result = str;
  result = result.replace(
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    "[EMAIL]",
  );
  result = result.replace(/(\+84|0)(3|5|7|8|9)[0-9]{8}/g, "[PHONE]");
  result = result.replace(
    /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g,
    "[CARD]",
  );
  result = result.replace(/\b\d{12}\b/g, "[CCCD]");
  return result;
}

/** Tạo string ngẫu nhiên */
export function randomString(
  length: number,
  options?: { uppercase?: boolean; numbers?: boolean; symbols?: boolean },
): string {
  const { uppercase = true, numbers = true, symbols = false } = options || {};
  let chars = "abcdefghijklmnopqrstuvwxyz";
  if (uppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (numbers) chars += "0123456789";
  if (symbols) chars += "!@#$%^&*";
  return Array.from(
    { length },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join("");
}

/** Join array thành string với separator */
export function join(arr: string[], separator: string = ", "): string {
  return arr.join(separator);
}

/** Kiểm tra chuỗi đối xứng */
export function isPalindrome(
  str: string,
  ignoreCase = true,
  ignoreSpaces = true,
): boolean {
  let cleaned = str;
  if (ignoreSpaces) cleaned = cleaned.replace(/\s/g, "");
  if (ignoreCase) cleaned = cleaned.toLowerCase();
  return cleaned === cleaned.split("").reverse().join("");
}

/** Reverse string */
export function reverse(str: string): string {
  return str.split("").reverse().join("");
}

/** Đếm số ký tự Unicode thực tế (emoji, chữ đặc biệt) */
export function countUnicodeChars(str: string): number {
  return [...str].length;
}
