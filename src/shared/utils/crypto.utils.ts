import { isBrowser } from "./env.utils";

// Mã hóa chuỗi thành base64 (hỗ trợ cả browser và Node.js, xử lý Unicode)
export function base64Encode(str: string): string {
  if (isBrowser()) {
    return btoa(unescape(encodeURIComponent(str)));
  }
  return Buffer.from(str).toString("base64");
}

// Giải mã base64 thành chuỗi gốc (hỗ trợ Unicode)
export function base64Decode(encoded: string): string {
  if (isBrowser()) {
    return decodeURIComponent(escape(atob(encoded)));
  }
  return Buffer.from(encoded, "base64").toString("utf-8");
}

const CHARSETS = {
  alphanumeric:
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
};

// Tạo chuỗi ngẫu nhiên với độ dài và bộ ký tự tùy chọn
export function randomString(
  length: number,
  charset: string = CHARSETS.alphanumeric,
): string {
  let result = "";
  const charsetLength = charset.length;
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charsetLength);
    result += charset[randomIndex];
  }
  return result;
}

// Tạo UUID (chuẩn v4, dùng crypto.randomUUID nếu có, fallback bằng Math.random)
export function uuid(): string {
  if (isBrowser() && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0;
    const value = char === "x" ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}
