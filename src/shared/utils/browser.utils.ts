import { isBrowser } from "./env.utils";

export interface CopyToClipboardOptions {
  successMessage?: string;
  errorMessage?: string;
}

export interface CopyToClipboardResult {
  success: boolean;
  error?: string;
}

// Sao chép văn bản vào clipboard, hỗ trợ fallback bằng execCommand
export async function copyToClipboard(
  text: string,
  options?: CopyToClipboardOptions,
): Promise<CopyToClipboardResult> {
  const { successMessage } = options ?? {};

  if (!isBrowser()) {
    return { success: false, error: "Not in browser environment" };
  }

  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      if (successMessage) {
        console.log(successMessage);
      }
      return { success: true };
    }
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "-9999px";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const success = document.execCommand("copy");
    document.body.removeChild(textarea);
    if (success) {
      if (successMessage) {
        console.log(successMessage);
      }
      return { success: true };
    }
    throw new Error("execCommand failed");
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    if (options?.errorMessage) {
      console.error(options.errorMessage);
    }
    return { success: false, error: errorMsg };
  }
}

// Lấy giá trị tham số URL theo key
export function getUrlParam(key: string, url?: string): string | null {
  const searchUrl = url ?? (isBrowser() ? window.location.href : "");
  const params = new URLSearchParams(searchUrl.split("?")[1] ?? "");
  return params.get(key);
}

// Chuyển toàn bộ query string thành object
export function getUrlParamsAsObject(url?: string): Record<string, string> {
  const searchUrl = url ?? (isBrowser() ? window.location.href : "");
  const params = new URLSearchParams(searchUrl.split("?")[1] ?? "");
  const result: Record<string, string> = {};

  params.forEach((value, key) => {
    result[key] = value;
  });

  return result;
}

// Xây dựng URL từ base và object params, hỗ trợ mảng
export function buildUrl(
  baseUrl: string,
  params: Record<string, unknown>,
): string {
  const url = new URL(
    baseUrl,
    isBrowser() ? window.location.origin : "http://localhost",
  );
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        url.searchParams.set(key, value.join(","));
      } else {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

// Cập nhật tham số URL (xóa nếu value = null)
export function updateUrlParams(
  updates: Record<string, string | null>,
  url?: string,
): string {
  const currentUrl = url ?? (isBrowser() ? window.location.href : "");
  try {
    const urlObj = new URL(currentUrl);
    for (const [key, value] of Object.entries(updates)) {
      if (value === null) {
        urlObj.searchParams.delete(key);
      } else {
        urlObj.searchParams.set(key, value);
      }
    }
    return urlObj.toString();
  } catch {
    return currentUrl;
  }
}

// Cuộn lên đầu trang
export function scrollToTop(options?: ScrollToOptions): void {
  if (!isBrowser()) return;
  const { behavior = "smooth", top = 0 } = options ?? {};
  window.scrollTo({
    top,
    left: 0,
    behavior,
  });
}

// Cuộn đến một phần tử trên trang (có thể offset)
export function scrollToElement(
  selector: string | Element,
  options?: ScrollToOptions & { offset?: number },
): void {
  if (!isBrowser()) return;
  const { offset = 0, ...scrollOptions } = options ?? {};
  const element =
    typeof selector === "string" ? document.querySelector(selector) : selector;
  if (element) {
    const top =
      element.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({
      top,
      left: 0,
      ...scrollOptions,
    });
  }
}

// Cuộn xuống cuối trang
export function scrollToBottom(options?: ScrollToOptions): void {
  if (!isBrowser()) return;
  const { behavior = "smooth" } = options ?? {};
  window.scrollTo({
    top: document.body.scrollHeight,
    left: 0,
    behavior,
  });
}

// Kiểm tra đã cuộn đến cuối trang chưa (có ngưỡng)
export function isScrolledToBottom(threshold = 0): boolean {
  if (!isBrowser()) return false;
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  return scrollHeight - scrollTop - clientHeight <= threshold;
}

export interface CookieOptions {
  expires?: number | Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: "Strict" | "Lax" | "None";
}

// Đọc cookie theo tên
export function getCookie(name: string): string | null {
  if (!isBrowser()) return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

// Ghi cookie với các tùy chọn (expires, path, domain, secure, sameSite)
export function setCookie(
  name: string,
  value: string,
  options?: CookieOptions,
): void {
  if (!isBrowser()) return;
  const {
    expires,
    path = "/",
    domain,
    secure = true,
    sameSite = "Lax",
  } = options ?? {};
  let cookieStr = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
  if (expires instanceof Date) {
    cookieStr += `; expires=${expires.toUTCString()}`;
  } else if (typeof expires === "number") {
    const date = new Date();
    date.setTime(date.getTime() + expires * 24 * 60 * 60 * 1000);
    cookieStr += `; expires=${date.toUTCString()}`;
  }
  if (path) cookieStr += `; path=${path}`;
  if (domain) cookieStr += `; domain=${domain}`;
  if (secure) cookieStr += "; Secure";
  cookieStr += `; SameSite=${sameSite}`;
  document.cookie = cookieStr;
}

// Xóa cookie
export function deleteCookie(
  name: string,
  options?: { path?: string; domain?: string },
): void {
  if (!isBrowser()) return;
  const { path = "/", domain } = options ?? {};
  const expires = new Date(0).toUTCString();
  let cookieStr = `${encodeURIComponent(name)}=; expires=${expires}`;
  if (path) cookieStr += `; path=${path}`;
  if (domain) cookieStr += `; domain=${domain}`;
  document.cookie = cookieStr;
}

// Kiểm tra trạng thái online/offline của trình duyệt
export function isOnline(): boolean {
  if (!isBrowser()) return true;
  return navigator.onLine;
}

// Lấy hash hiện tại của URL (phần sau #)
export function getCurrentHash(): string {
  if (!isBrowser()) return "";
  return window.location.hash;
}

// Tải lại trang hiện tại
export function reloadPage(): void {
  if (!isBrowser()) return;
  window.location.reload();
}

// Kiểm tra tab hiện tại có đang active không
export function isTabActive(): boolean {
  if (!isBrowser()) return true;
  return document.visibilityState === "visible";
}

// Kiểm tra cửa sổ trình duyệt có đang được focus không
export function isWindowFocused(): boolean {
  if (!isBrowser()) return true;
  return document.hasFocus();
}

// Chờ cho đến khi tab trở thành active
export async function waitForActive(): Promise<void> {
  if (!isBrowser()) return;
  if (document.visibilityState === "visible") return;
  return new Promise((resolve) => {
    const handler = (): void => {
      if (document.visibilityState === "visible") {
        document.removeEventListener("visibilitychange", handler);
        resolve();
      }
    };
    document.addEventListener("visibilitychange", handler);
  });
}

// Lấy múi giờ của trình duyệt (VD: Asia/Ho_Chi_Minh)
export function getTimezone(): string {
  if (!isBrowser()) return "UTC";
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}
