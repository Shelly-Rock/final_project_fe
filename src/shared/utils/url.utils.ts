export interface ParsedUrl {
  href: string;
  origin: string;
  protocol: string;
  username: string;
  password: string;
  host: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  query: Record<string, string>;
}

// Phân tích URL thành các thành phần (an toàn, không throw lỗi)
export function parseUrl(url: string): ParsedUrl | null {
  try {
    const urlObj = new URL(url);
    const searchParams = urlObj.searchParams;
    const query: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      query[key] = value;
    });
    return {
      href: urlObj.href,
      origin: urlObj.origin,
      protocol: urlObj.protocol,
      username: urlObj.username,
      password: urlObj.password,
      host: urlObj.host,
      hostname: urlObj.hostname,
      port: urlObj.port,
      pathname: urlObj.pathname,
      search: urlObj.search,
      hash: urlObj.hash,
      query,
    };
  } catch {
    return null;
  }
}

// Xây dựng URL từ base và params
export function buildUrl(
  baseUrl: string,
  params?: Record<string, unknown>,
): string {
  try {
    const url = new URL(baseUrl);
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            url.searchParams.set(key, value.join(","));
          } else {
            url.searchParams.set(key, String(value));
          }
        }
      }
    }
    return url.toString();
  } catch {
    return baseUrl;
  }
}

// Lấy domain (hostname) từ URL
export function getDomain(url: string): string | null {
  const parsed = parseUrl(url);
  return parsed?.hostname ?? null;
}

// Lấy subdomain từ URL (VD: api.google.com -> api)
export function getSubdomain(url: string): string | null {
  const domain = getDomain(url);
  if (!domain) return null;

  const parts = domain.split(".");
  if (parts.length > 2) {
    return parts.slice(0, -2).join(".");
  }

  return null;
}

// Lấy root domain (VD: api.google.com -> google.com)
export function getRootDomain(url: string): string | null {
  const domain = getDomain(url);
  if (!domain) return null;

  const parts = domain.split(".");
  if (parts.length >= 2) {
    return parts.slice(-2).join(".");
  }

  return domain;
}

// Lấy protocol (http:, https:)
export function getProtocol(url: string): string | null {
  const parsed = parseUrl(url);
  return parsed?.protocol ?? null;
}

// Lấy port
export function getPort(url: string): string | null {
  const parsed = parseUrl(url);
  return parsed?.port ?? null;
}

// Lấy các segment trong path (VD: /a/b/c -> ['a','b','c'])
export function getPathSegments(url: string): string[] {
  const parsed = parseUrl(url);
  if (!parsed) return [];

  const path = parsed.pathname;
  return path.split("/").filter(Boolean);
}

// Lấy segment cuối cùng của path
export function getLastPathSegment(url: string): string | null {
  const segments = getPathSegments(url);
  return segments[segments.length - 1] ?? null;
}

// Kiểm tra URL tuyệt đối (có protocol)
export function isAbsoluteUrl(url: string): boolean {
  return /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(url);
}

// Kiểm tra URL tương đối
export function isRelativeUrl(url: string): boolean {
  return !isAbsoluteUrl(url);
}

// Nối các segment URL lại với nhau (xử lý dấu / tự động)
export function joinUrl(...segments: string[]): string {
  return segments
    .filter(Boolean)
    .map((segment, index) => {
      let result = segment;
      if (index > 0 && !result.startsWith("/")) {
        result = "/" + result;
      }
      if (index < segments.length - 1 && result.endsWith("/")) {
        result = result.slice(0, -1);
      }
      return result;
    })
    .join("");
}

// Chuẩn hóa URL (xóa dấu // thừa, xóa trailing slash, chuyển lowercase)
export function normalizeUrl(
  url: string,
  options?: {
    removeTrailingSlash?: boolean;
    removeDoubleSlashes?: boolean;
    lowercase?: boolean;
  },
): string {
  const {
    removeTrailingSlash = true,
    removeDoubleSlashes = true,
    lowercase = true,
  } = options ?? {};

  let result = url;

  if (lowercase) {
    result = result.toLowerCase();
  }

  if (removeDoubleSlashes) {
    result = result.replace(/\/\/+/g, "/");
  }

  if (removeTrailingSlash && result.length > 1) {
    result = result.replace(/\/+$/, "");
  }

  return result;
}

// Thêm tham số (có thể trùng lặp)
export function addParam(url: string, key: string, value: string): string {
  try {
    const urlObj = new URL(url);
    urlObj.searchParams.append(key, value);
    return urlObj.toString();
  } catch {
    // Fallback cho relative URL
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
  }
}

// Gán tham số (ghi đè nếu đã tồn tại)
export function setParam(
  url: string,
  key: string,
  value: string | null,
): string {
  try {
    const urlObj = new URL(url);
    if (value === null) {
      urlObj.searchParams.delete(key);
    } else {
      urlObj.searchParams.set(key, value);
    }
    return urlObj.toString();
  } catch {
    const [base, query] = url.split("?");
    const params = new URLSearchParams(query ?? "");
    if (value === null) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    const queryString = params.toString();
    return queryString ? `${base}?${queryString}` : base;
  }
}

// Xóa tham số
export function removeParam(url: string, key: string): string {
  return setParam(url, key, null);
}

// Lấy giá trị tham số
export function getParam(url: string, key: string): string | null {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get(key);
  } catch {
    const query = url.split("?")[1] ?? "";
    const params = new URLSearchParams(query);
    return params.get(key);
  }
}

// Kiểm tra có tham số không
export function hasParam(url: string, key: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.has(key);
  } catch {
    const query = url.split("?")[1] ?? "";
    const params = new URLSearchParams(query);
    return params.has(key);
  }
}

// Lấy tất cả tham số dưới dạng object
export function getParams(url: string): Record<string, string> {
  try {
    const urlObj = new URL(url);
    const result: Record<string, string> = {};
    urlObj.searchParams.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  } catch {
    const query = url.split("?")[1] ?? "";
    const params = new URLSearchParams(query);
    const result: Record<string, string> = {};
    params.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }
}

// Xây dựng query string từ object
export function buildQueryString(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach((v) => searchParams.append(key, String(v)));
      } else {
        searchParams.set(key, String(value));
      }
    }
  }
  return searchParams.toString();
}

// Phân tích query string thành object
export function parseQueryString(queryString: string): Record<string, string> {
  const params = new URLSearchParams(queryString);
  const result: Record<string, string> = {};

  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

// Lấy hash (phần sau #, không bao gồm #)
export function getHash(url: string): string | null {
  const parsed = parseUrl(url);
  return parsed?.hash.replace("#", "") ?? null;
}

// Lấy URL hiện tại (browser only)
export function getCurrentUrl(): string | null {
  if (typeof window === "undefined") return null;
  return window.location.href;
}

// Lấy origin hiện tại (browser only)
export function getCurrentOrigin(): string | null {
  if (typeof window === "undefined") return null;
  return window.location.origin;
}

// Điều hướng đến URL
export function navigate(url: string): void {
  if (typeof window !== "undefined") {
    window.location.href = url;
  }
}

// Thay thế URL hiện tại (không lưu vào history)
export function replaceUrl(url: string): void {
  if (typeof window !== "undefined") {
    window.location.replace(url);
  }
}

// Mở URL trong tab mới (an toàn với noopener)
export function openInNewTab(url: string): void {
  if (typeof window !== "undefined") {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

// Mã hóa component URL (encodeURIComponent)
export function encodeUrl(str: string): string {
  return encodeURIComponent(str);
}

// Giải mã component URL (decodeURIComponent)
export function decodeUrl(str: string): string {
  return decodeURIComponent(str);
}

// Mã hóa toàn bộ URL (encodeURI)
export function encodeFullUrl(url: string): string {
  return encodeURI(url);
}

// Giải mã toàn bộ URL (decodeURI)
export function decodeFullUrl(url: string): string {
  return decodeURI(url);
}

// Kiểm tra URL có an toàn (https/wss)
export function isUrlSecure(url: string): boolean {
  const protocol = getProtocol(url);
  return protocol === "https:" || protocol === "wss:";
}

// Lấy phần mở rộng của file từ URL (VD: .jpg, .png)
export function getExtension(url: string): string | null {
  const path = parseUrl(url)?.pathname ?? url.split("?")[0];
  const lastDot = path.lastIndexOf(".");
  if (lastDot === -1 || lastDot === path.length - 1) {
    return null;
  }
  return path.slice(lastDot + 1).toLowerCase();
}

// Lấy tên file từ URL (VD: /path/to/file.jpg -> file.jpg)
export function getFilename(url: string): string | null {
  const path = parseUrl(url)?.pathname;
  if (!path) return null;
  const parts = path.split("/");
  const lastPart = parts[parts.length - 1];
  if (lastPart.includes(".")) {
    return lastPart;
  }
  return null;
}

// Kiểm tra URL có khớp pattern (hỗ trợ * và ?)
export function urlMatches(url: string, pattern: string): boolean {
  const regexPattern = pattern
    .replace(/\./g, "\\.")
    .replace(/\*/g, ".*")
    .replace(/\?/g, ".");

  const regex = new RegExp(`^${regexPattern}$`, "i");
  return regex.test(url);
}

// Tạo mailto: link
export function createMailtoUrl(options: {
  to: string | string[];
  subject?: string;
  body?: string;
  cc?: string | string[];
  bcc?: string | string[];
}): string {
  const { to, subject, body, cc, bcc } = options;

  const toStr = Array.isArray(to) ? to.join(",") : to;
  const params = new URLSearchParams();

  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  if (cc) params.set("cc", Array.isArray(cc) ? cc.join(",") : cc);
  if (bcc) params.set("bcc", Array.isArray(bcc) ? bcc.join(",") : bcc);

  const queryString = params.toString();
  return `mailto:${toStr}${queryString ? `?${queryString}` : ""}`;
}

// Tạo tel: link
export function createTelUrl(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

// Tạo sms: link
export function createSmsUrl(phone?: string, body?: string): string {
  const params = new URLSearchParams();
  if (body) params.set("body", body);
  const queryString = params.toString();
  const phonePart = phone ? phone.replace(/[^\d+]/g, "") : "";
  return `sms:${phonePart}${queryString ? `?${queryString}` : ""}`;
}
