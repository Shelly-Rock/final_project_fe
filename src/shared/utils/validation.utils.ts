import { regexPatterns } from "./regex.utils";

// Kiểm tra email hợp lệ
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== "string") return false;
  return regexPatterns.email.test(email.trim());
}

// Validate email kèm thông báo lỗi
export function validateEmail(email: string): {
  valid: boolean;
  error?: string;
} {
  if (!email) {
    return { valid: false, error: "Email là bắt buộc" };
  }
  if (!isValidEmail(email)) {
    return { valid: false, error: "Email không hợp lệ" };
  }
  return { valid: true };
}

// Kiểm tra số điện thoại Việt Nam
export function isValidPhoneVN(phone: string): boolean {
  if (!phone || typeof phone !== "string") return false;
  return regexPatterns.phoneVN.test(phone.replace(/\s/g, ""));
}

// Kiểm tra số điện thoại quốc tế
export function isValidPhoneInternational(phone: string): boolean {
  if (!phone || typeof phone !== "string") return false;
  return regexPatterns.phoneInternational.test(phone.replace(/\s/g, ""));
}

// Validate số điện thoại (tùy chọn bắt buộc/quốc tế)
export function validatePhone(
  phone: string,
  options?: { required?: boolean; international?: boolean },
): { valid: boolean; error?: string } {
  const { required = false, international = false } = options ?? {};

  if (!phone) {
    return required
      ? { valid: false, error: "Số điện thoại là bắt buộc" }
      : { valid: true };
  }

  const isValid = international
    ? isValidPhoneInternational(phone)
    : isValidPhoneVN(phone);

  if (!isValid) {
    return {
      valid: false,
      error: international
        ? "Số điện thoại không hợp lệ"
        : "Số điện thoại Việt Nam không hợp lệ",
    };
  }

  return { valid: true };
}

// Định dạng số điện thoại Việt Nam (VD: 0xxx xxx xxx)
export function formatPhoneVN(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 9 && cleaned.startsWith("3")) {
    return `0${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  return phone;
}

export interface PasswordValidationResult {
  valid: boolean;
  errors: string[];
  score: number;
}

export interface PasswordOptions {
  minLength?: number;
  maxLength?: number;
  requireUppercase?: boolean;
  requireLowercase?: boolean;
  requireNumber?: boolean;
  requireSpecial?: boolean;
  allowSpaces?: boolean;
}

// Validate mật khẩu với nhiều tiêu chí
export function validatePassword(
  password: string,
  options?: PasswordOptions,
): PasswordValidationResult {
  const {
    minLength = 8,
    maxLength = 128,
    requireUppercase = true,
    requireLowercase = true,
    requireNumber = true,
    requireSpecial = true,
    allowSpaces = false,
  } = options ?? {};

  const errors: string[] = [];
  let score = 0;

  if (!password) {
    errors.push("Mật khẩu là bắt buộc");
    return { valid: false, errors, score: 0 };
  }

  // Độ dài
  if (password.length < minLength) {
    errors.push(`Mật khẩu phải có ít nhất ${minLength} ký tự`);
  } else {
    score += 1;
  }

  if (password.length > maxLength) {
    errors.push(`Mật khẩu không được vượt quá ${maxLength} ký tự`);
  }

  // Chữ hoa
  if (requireUppercase && !/[A-Z]/.test(password)) {
    errors.push("Mật khẩu phải chứa ít nhất 1 chữ hoa");
  } else if (/[A-Z]/.test(password)) {
    score += 1;
  }

  // Chữ thường
  if (requireLowercase && !/[a-z]/.test(password)) {
    errors.push("Mật khẩu phải chứa ít nhất 1 chữ thường");
  } else if (/[a-z]/.test(password)) {
    score += 1;
  }

  // Số
  if (requireNumber && !/\d/.test(password)) {
    errors.push("Mật khẩu phải chứa ít nhất 1 số");
  } else if (/\d/.test(password)) {
    score += 1;
  }

  // Ký tự đặc biệt
  if (
    requireSpecial &&
    !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  ) {
    errors.push("Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt");
  } else if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    score += 1;
  }

  // Khoảng trắng
  if (!allowSpaces && /\s/.test(password)) {
    errors.push("Mật khẩu không được chứa khoảng trắng");
  }

  return {
    valid: errors.length === 0,
    errors,
    score: Math.min(4, score),
  };
}

// Đánh giá độ mạnh của mật khẩu
export function getPasswordStrength(
  password: string,
): "weak" | "medium" | "strong" | "very-strong" {
  const result = validatePassword(password);
  if (result.score <= 1) return "weak";
  if (result.score === 2) return "medium";
  if (result.score === 3) return "strong";
  return "very-strong";
}

// Kiểm tra mật khẩu có chứa thông tin người dùng không
export function isPasswordContainingUserInfo(
  password: string,
  userInfo: { username?: string; email?: string; phone?: string },
): boolean {
  const lowerPassword = password.toLowerCase();
  const checks = [
    userInfo.username?.toLowerCase(),
    userInfo.email?.toLowerCase().split("@")[0],
    userInfo.phone,
  ].filter(Boolean);

  return checks.some((info) => info && lowerPassword.includes(info));
}

// Kiểm tra URL hợp lệ
export function isValidUrl(url: string): boolean {
  if (!url || typeof url !== "string") return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Kiểm tra URL với protocol cụ thể
export function isValidUrlWithProtocol(
  url: string,
  protocols: Array<"http" | "https" | "ftp" | "mailto"> = ["http", "https"],
): boolean {
  if (!isValidUrl(url)) return false;
  const { protocol } = new URL(url);
  return protocols.some((p) => protocol === `${p}:`);
}

// Validate URL kèm thông báo
export function validateUrl(url: string): { valid: boolean; error?: string } {
  if (!url) {
    return { valid: false, error: "URL là bắt buộc" };
  }
  if (!isValidUrl(url)) {
    return { valid: false, error: "URL không hợp lệ" };
  }
  return { valid: true };
}

export interface UsernameValidationResult {
  valid: boolean;
  error?: string;
}

// Validate username
export function validateUsername(username: string): UsernameValidationResult {
  if (!username) {
    return { valid: false, error: "Username là bắt buộc" };
  }

  if (username.length < 3) {
    return { valid: false, error: "Username phải có ít nhất 3 ký tự" };
  }

  if (username.length > 20) {
    return { valid: false, error: "Username không được vượt quá 20 ký tự" };
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return {
      valid: false,
      error: "Username chỉ được chứa chữ cái, số, dấu gạch dưới và gạch ngang",
    };
  }

  if (/^[_-]|[_-]$/.test(username)) {
    return {
      valid: false,
      error: "Username không được bắt đầu hoặc kết thúc bằng _ hoặc -",
    };
  }

  return { valid: true };
}

// Kiểm tra username có phải từ dành riêng không
export function isReservedUsername(username: string): boolean {
  const reserved = [
    "admin",
    "root",
    "system",
    "super",
    "moderator",
    "mod",
    "support",
    "help",
    "info",
    "contact",
    "staff",
    "api",
    "app",
    "web",
    "mail",
    "ftp",
    "ssh",
    "null",
    "undefined",
    "true",
    "false",
  ];
  return reserved.includes(username.toLowerCase());
}

// Validate họ tên (hỗ trợ Unicode)
export function validateName(
  name: string,
  options?: { minLength?: number; maxLength?: number },
): {
  valid: boolean;
  error?: string;
} {
  const { minLength = 2, maxLength = 50 } = options ?? {};

  if (!name || !name.trim()) {
    return { valid: false, error: "Họ tên là bắt buộc" };
  }

  const trimmed = name.trim();

  if (trimmed.length < minLength) {
    return { valid: false, error: `Họ tên phải có ít nhất ${minLength} ký tự` };
  }

  if (trimmed.length > maxLength) {
    return {
      valid: false,
      error: `Họ tên không được vượt quá ${maxLength} ký tự`,
    };
  }

  if (!/^[\p{L}\s.]+$/u.test(trimmed)) {
    return { valid: false, error: "Họ tên không hợp lệ" };
  }

  return { valid: true };
}

// Kiểm tra CCCD (căn cước công dân) 12 số
export function isValidCCCD(cccd: string): boolean {
  if (!cccd || typeof cccd !== "string") return false;
  const cleaned = cccd.replace(/\D/g, "");
  return cleaned.length === 12 && /^\d+$/.test(cleaned);
}

// Kiểm tra mã số thuế (10 hoặc 13 số)
export function isValidTaxId(taxId: string): boolean {
  if (!taxId || typeof taxId !== "string") return false;
  const cleaned = taxId.replace(/\D/g, "");
  return (
    (cleaned.length === 10 || cleaned.length === 13) && /^\d+$/.test(cleaned)
  );
}

// Kiểm tra số nguyên dương
export function isPositiveInteger(value: unknown): boolean {
  if (typeof value === "number") {
    return Number.isInteger(value) && value > 0;
  }
  if (typeof value === "string") {
    return /^\d+$/.test(value) && parseInt(value, 10) > 0;
  }
  return false;
}

// Kiểm tra số nằm trong khoảng
export function isInRange(value: number, min: number, max: number): boolean {
  return (
    typeof value === "number" &&
    !Number.isNaN(value) &&
    value >= min &&
    value <= max
  );
}

// Kiểm tra số thập phân hợp lệ (số chữ số thập phân, phần nguyên)
export function isValidDecimal(
  value: string,
  options?: {
    minDecimal?: number;
    maxDecimal?: number;
    integerDigits?: number;
  },
): boolean {
  const { minDecimal = 0, maxDecimal = 2, integerDigits = 10 } = options ?? {};

  const regex = new RegExp(
    `^\\d{1,${integerDigits}}(\\.\\d{${minDecimal},${maxDecimal}})?$`,
  );

  return regex.test(value);
}

// Kiểm tra phần mở rộng file
export function hasValidExtension(
  filename: string,
  allowedExtensions: string[],
): boolean {
  const ext = filename.split(".").pop()?.toLowerCase();
  return ext
    ? allowedExtensions
        .map((e) => e.toLowerCase().replace(/^\./, ""))
        .includes(ext)
    : false;
}

// Kiểm tra MIME type (hỗ trợ wildcard VD: image/*)
export function isValidMimeType(
  mimeType: string,
  allowedTypes: string[],
): boolean {
  return allowedTypes.some((type) => {
    if (type.endsWith("/*")) {
      return mimeType.startsWith(type.slice(0, -1));
    }
    return mimeType === type;
  });
}

// Kiểm tra kích thước file (MB)
export function isValidFileSize(
  fileSizeInBytes: number,
  maxSizeInMB: number,
): boolean {
  const maxBytes = maxSizeInMB * 1024 * 1024;
  return fileSizeInBytes > 0 && fileSizeInBytes <= maxBytes;
}

export type ValidationRule<T = string> = {
  validate: (value: T) => boolean;
  message: string;
};

export type ValidationSchema = Record<string, ValidationRule[]>;

// Validate một field với các rules
export function validateField<T>(
  value: T,
  rules: ValidationRule<T>[],
): { valid: boolean; error?: string } {
  for (const rule of rules) {
    if (!rule.validate(value)) {
      return { valid: false, error: rule.message };
    }
  }
  return { valid: true };
}

// Validate toàn bộ form theo schema
export function validateForm<T extends Record<string, unknown>>(
  data: T,
  schema: ValidationSchema,
): { valid: boolean; errors: Partial<Record<keyof T, string>> } {
  const errors: Partial<Record<keyof T, string>> = {};
  let valid = true;

  for (const field in schema) {
    const rules = schema[field];
    const result = validateField(data[field] as string, rules);
    if (!result.valid && result.error) {
      errors[field as keyof T] = result.error;
      valid = false;
    }
  }

  return { valid, errors };
}

// Rule: bắt buộc nhập
export function required(message = "Trường này là bắt buộc"): ValidationRule {
  return {
    validate: (value: unknown) => {
      if (typeof value === "string") return value.trim().length > 0;
      if (typeof value === "number") return true;
      return value !== null && value !== undefined;
    },
    message,
  };
}

// Rule: độ dài tối thiểu (chuỗi)
export function minLength(
  length: number,
  message?: string,
): ValidationRule<string> {
  return {
    validate: (value: string) => value.length >= length,
    message: message ?? `Ít nhất ${length} ký tự`,
  };
}

// Rule: độ dài tối đa (chuỗi)
export function maxLength(
  length: number,
  message?: string,
): ValidationRule<string> {
  return {
    validate: (value: string) => value.length <= length,
    message: message ?? `Không vượt quá ${length} ký tự`,
  };
}

// Rule: pattern regex
export function pattern(
  regex: RegExp,
  message: string,
): ValidationRule<string> {
  return {
    validate: (value: string) => regex.test(value),
    message,
  };
}

// Kiểm tra IPv4
export function isValidIPv4(ip: string): boolean {
  const parts = ip.split(".");
  if (parts.length !== 4) return false;

  return parts.every((part) => {
    const num = parseInt(part, 10);
    return /^\d+$/.test(part) && num >= 0 && num <= 255 && part === String(num);
  });
}

// Kiểm tra IPv6
export function isValidIPv6(ip: string): boolean {
  const parts = ip.split(":");
  if (parts.length !== 8) return false;

  const hexPattern = /^[0-9a-fA-F]{1,4}$/;
  return parts.every((part) => hexPattern.test(part));
}

// Kiểm tra định dạng ngày YYYY-MM-DD
export function isValidDateFormat(dateStr: string): boolean {
  if (!/\d{4}-\d{2}-\d{2}/.test(dateStr)) return false;
  const date = new Date(dateStr);
  return !Number.isNaN(date.getTime());
}

// Kiểm tra khoảng ngày
export function isValidDateRange(
  date: Date,
  minDate?: Date,
  maxDate?: Date,
): boolean {
  if (minDate && date < minDate) return false;
  if (maxDate && date > maxDate) return false;
  return true;
}

// Kiểm tra năm nhuận
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

// Kiểm tra giá trị rỗng (null, undefined, string rỗng, array rỗng, object rỗng)
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
}

// Kiểm tra JSON hợp lệ
export function isValidJSON(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

// Kiểm tra mã màu hex
export function isValidHexColor(color: string): boolean {
  return /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(color);
}

// Kiểm tra số thẻ tín dụng (thuật toán Luhn)
export function isValidCreditCard(cardNumber: string): boolean {
  const cleaned = cardNumber.replace(/\D/g, "");
  if (cleaned.length < 13 || cleaned.length > 19) return false;

  let sum = 0;
  let isEven = false;
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    isEven = !isEven;
  }
  return sum % 10 === 0;
}
