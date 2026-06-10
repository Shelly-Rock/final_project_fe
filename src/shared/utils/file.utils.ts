// Định dạng kích thước file (B, KB, MB...) với số thập phân và locale tùy chọn
export function formatFileSize(
  bytes: number,
  options?: {
    decimals?: number;
    locale?: string;
  },
): string {
  const { decimals = 2, locale } = options ?? {};

  if (bytes === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const base = 1024;

  const unitIndex = Math.floor(Math.log(bytes) / Math.log(base));
  const value = bytes / Math.pow(base, unitIndex);

  const formatted = value.toFixed(decimals);
  const formattedWithLocale = locale
    ? parseFloat(formatted).toLocaleString(locale)
    : formatted;

  return `${formattedWithLocale} ${units[unitIndex]}`;
}

// Phân tích chuỗi kích thước (VD: "1.5 MB") thành số byte
export function parseFileSize(sizeString: string): number {
  const match = sizeString.match(/^([\d.]+)\s*(B|KB|MB|GB|TB|PB|EB|ZB|YB)?$/i);
  if (!match) return 0;
  const value = parseFloat(match[1]);
  const unit = (match[2] ?? "B").toUpperCase();
  const units: Record<string, number> = {
    B: 1,
    KB: 1024,
    MB: 1024 * 1024,
    GB: 1024 * 1024 * 1024,
    TB: 1024 * 1024 * 1024 * 1024,
    PB: 1024 * 1024 * 1024 * 1024 * 1024,
    EB: 1024 * 1024 * 1024 * 1024 * 1024 * 1024,
    ZB: 1024 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024,
    YB: 1024 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024,
  };

  return value * (units[unit] ?? 1);
}

// Kiểm tra kích thước file có hợp lệ (không quá maxSizeMB) không
export function isValidFileSize(bytes: number, maxSizeMB: number): boolean {
  const maxBytes = maxSizeMB * 1024 * 1024;
  return bytes > 0 && bytes <= maxBytes;
}

// Lấy MIME type của file
export function getMimeType(file: File | Blob): string {
  return file.type;
}

// Kiểm tra có phải file ảnh không
export function isImage(file: File | Blob): boolean {
  return file.type.startsWith("image/");
}

// Kiểm tra có phải file video không
export function isVideo(file: File | Blob): boolean {
  return file.type.startsWith("video/");
}

// Kiểm tra có phải file audio không
export function isAudio(file: File | Blob): boolean {
  return file.type.startsWith("audio/");
}

// Kiểm tra có phải file PDF không
export function isPdf(file: File | Blob): boolean {
  return file.type === "application/pdf";
}

// Kiểm tra có phải file tài liệu (Word, Excel, PPT, text, PDF) không
export function isDocument(file: File | Blob): boolean {
  const docTypes = [
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/plain",
    "application/pdf",
  ];

  return docTypes.includes(file.type);
}

// Kiểm tra có phải file nén (zip, rar, tar, gzip, 7z) không
export function isArchive(file: File | Blob): boolean {
  const archiveTypes = [
    "application/zip",
    "application/x-rar-compressed",
    "application/x-tar",
    "application/gzip",
    "application/x-7z-compressed",
  ];

  return archiveTypes.includes(file.type);
}

// Lấy phần mở rộng của tên file (VD: "image.png" -> "png")
export function getFileExtension(filename: string): string {
  const parts = filename.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
}

// Lấy tên file không bao gồm phần mở rộng
export function getFileNameWithoutExtension(filename: string): string {
  const parts = filename.split(".");
  return parts.length > 1 ? parts.slice(0, -1).join(".") : filename;
}

// Kiểm tra file có phần mở rộng nằm trong danh sách cho phép không
export function hasValidExtension(
  filename: string,
  allowedExtensions: string[],
): boolean {
  const ext = getFileExtension(filename);
  return allowedExtensions
    .map((e) => e.toLowerCase().replace(/^\./, ""))
    .includes(ext);
}

// Xác định loại icon dựa trên MIME type (image, video, pdf, doc, sheet, slide...)
export function getFileIconType(mimeType: string): string {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "audio";
  if (mimeType === "application/pdf") return "pdf";
  if (mimeType.includes("word") || mimeType.includes("document")) return "doc";
  if (mimeType.includes("excel") || mimeType.includes("spreadsheet"))
    return "sheet";
  if (mimeType.includes("powerpoint") || mimeType.includes("presentation"))
    return "slide";
  if (mimeType.startsWith("text/")) return "text";
  if (
    mimeType.includes("zip") ||
    mimeType.includes("rar") ||
    mimeType.includes("tar")
  )
    return "archive";
  return "file";
}

// Chuyển file thành Base64 (bao gồm data URL prefix)
export function fileToBase64(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file as Base64"));
    };

    reader.readAsDataURL(file);
  });
}

// Chuyển file thành Base64 (chỉ lấy phần dữ liệu, không có prefix)
export function fileToBase64Data(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      resolve(base64);
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file as Base64"));
    };

    reader.readAsDataURL(file);
  });
}

// Chuyển Base64 thành Blob
export function base64ToBlob(base64: string, mimeType?: string): Blob | null {
  try {
    const base64Data = base64.includes(",") ? base64.split(",")[1] : base64;
    const mime = mimeType ?? "application/octet-stream";

    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mime });
  } catch {
    return null;
  }
}

// Chuyển Base64 thành File
export function base64ToFile(
  base64: string,
  filename: string,
  mimeType?: string,
): File | null {
  const blob = base64ToBlob(base64, mimeType);
  if (!blob) return null;

  return new File([blob], filename, {
    type: mimeType ?? "application/octet-stream",
  });
}

// Đọc file dưới dạng text
export function readFileAsText(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result as string);
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file as text"));
    };

    reader.readAsText(file);
  });
}

// Đọc file dưới dạng ArrayBuffer
export function readFileAsArrayBuffer(file: File | Blob): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result as ArrayBuffer);
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file as ArrayBuffer"));
    };

    reader.readAsArrayBuffer(file);
  });
}

// Lấy kích thước (width, height) của ảnh
export function getImageDimensions(
  file: File,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    if (!isImage(file)) {
      reject(new Error("File is not an image"));
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.width, height: img.height });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
}

// Tải xuống file từ Blob
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  downloadUrl(url, filename);
  URL.revokeObjectURL(url);
}

// Tải xuống file từ URL
export function downloadUrl(url: string, filename: string): void {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Tải xuống nội dung text dưới dạng file
export function downloadText(
  text: string,
  filename: string,
  mimeType = "text/plain",
): void {
  const blob = new Blob([text], { type: mimeType });
  downloadBlob(blob, filename);
}

// Tải xuống file từ Base64
export function downloadBase64(
  base64: string,
  filename: string,
  mimeType?: string,
): void {
  const blob = base64ToBlob(base64, mimeType);
  if (blob) {
    downloadBlob(blob, filename);
  }
}

// Tải xuống dữ liệu JSON dưới dạng file
export function downloadJson(data: unknown, filename: string): void {
  const json = JSON.stringify(data, null, 2);
  downloadText(json, filename, "application/json");
}

export interface UploadOptions {
  accept?: string;
  multiple?: boolean;
  maxSizeMB?: number;
  allowedExtensions?: string[];
}

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

// Kiểm tra tính hợp lệ của file (kích thước, phần mở rộng, MIME type)
export function validateFile(
  file: File,
  options?: {
    maxSizeMB?: number;
    allowedExtensions?: string[];
    allowedMimeTypes?: string[];
  },
): FileValidationResult {
  const { maxSizeMB, allowedExtensions, allowedMimeTypes } = options ?? {};
  if (maxSizeMB) {
    if (!isValidFileSize(file.size, maxSizeMB)) {
      return {
        valid: false,
        error: `File size exceeds maximum of ${maxSizeMB}MB`,
      };
    }
  }
  if (allowedExtensions && allowedExtensions.length > 0) {
    if (!hasValidExtension(file.name, allowedExtensions)) {
      return {
        valid: false,
        error: `File extension not allowed. Allowed: ${allowedExtensions.join(", ")}`,
      };
    }
  }
  if (allowedMimeTypes && allowedMimeTypes.length > 0) {
    const mimeMatch = allowedMimeTypes.some((type) => {
      if (type.endsWith("/*")) {
        return file.type.startsWith(type.slice(0, -1));
      }
      return file.type === type;
    });
    if (!mimeMatch) {
      return {
        valid: false,
        error: `File type not allowed. Allowed: ${allowedMimeTypes.join(", ")}`,
      };
    }
  }
  return { valid: true };
}

// Tạo hàm mở hộp thoại chọn file và xử lý khi chọn
export function createFileInput(
  onSelect: (files: File[]) => void,
  options?: UploadOptions,
): () => void {
  return () => {
    const input = document.createElement("input");
    input.type = "file";
    if (options?.multiple) {
      input.multiple = true;
    }
    if (options?.accept) {
      input.accept = options.accept;
    }
    input.onchange = (event) => {
      const target = event.target as HTMLInputElement;
      const files = Array.from(target.files ?? []);
      const validFiles = options
        ? files.filter(
            (file) =>
              validateFile(file, {
                maxSizeMB: options.maxSizeMB,
                allowedExtensions: options.allowedExtensions,
              }).valid,
          )
        : files;
      if (validFiles.length > 0) {
        onSelect(validFiles);
      }
    };
    input.click();
  };
}

// Nén ảnh (giảm kích thước, thay đổi chất lượng)
export async function compressImage(
  file: File,
  options?: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    mimeType?: "image/jpeg" | "image/png" | "image/webp";
  },
): Promise<File> {
  if (!isImage(file)) {
    throw new Error("File is not an image");
  }
  const {
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.8,
    mimeType = "image/jpeg",
  } = options ?? {};
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Failed to compress image"));
            return;
          }
          const compressedFile = new File(
            [blob],
            getFileNameWithoutExtension(file.name) +
              "." +
              mimeType.split("/")[1],
            { type: mimeType },
          );
          resolve(compressedFile);
        },
        mimeType,
        quality,
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
}

// Thay đổi kích thước ảnh (resize) theo chiều rộng và cao cụ thể
export async function resizeImage(
  file: File,
  width: number,
  height: number,
): Promise<File> {
  if (!isImage(file)) {
    throw new Error("File is not an image");
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Failed to resize image"));
            return;
          }

          const resizedFile = new File([blob], file.name, { type: file.type });

          resolve(resizedFile);
        },
        file.type,
        0.92,
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
}

// Lấy tên icon Material (dùng cho UI) dựa trên loại file
export function getFileIcon(file: File): string {
  const type = getFileIconType(file.type);
  const icons: Record<string, string> = {
    image: "image",
    video: "video",
    audio: "audio",
    pdf: "picture_as_pdf",
    doc: "description",
    sheet: "table_chart",
    slide: "slideshow",
    text: "article",
    archive: "folder_zip",
    file: "insert_drive_file",
  };

  return icons[type] ?? icons.file;
}

// Lấy màu sắc đại diện cho loại file (dùng cho UI)
export function getFileColor(file: File): string {
  const type = getFileIconType(file.type);
  const colors: Record<string, string> = {
    image: "#e91e63",
    video: "#9c27b0",
    audio: "#ff5722",
    pdf: "#f44336",
    doc: "#2196f3",
    sheet: "#4caf50",
    slide: "#ff9800",
    text: "#607d8b",
    archive: "#795548",
    file: "#9e9e9e",
  };
  return colors[type] ?? colors.file;
}
