// Accessibility utilities for WCAG 2.1 compliance

/**
 * ARIA labels and descriptions for common notification patterns
 */
export const A11Y_LABELS = {
  // Buttons
  SEND_NOTIFICATION: "Gửi thông báo đến tất cả người dùng được chọn",
  SCHEDULE_NOTIFICATION: "Lên lịch gửi thông báo vào thời gian xác định",
  PREVIEW_NOTIFICATION: "Xem trước thông báo trước khi gửi",
  DELETE_NOTIFICATION: "Xóa thông báo này",
  MARK_AS_READ: "Đánh dấu thông báo này đã đọc",
  MARK_ALL_AS_READ: "Đánh dấu tất cả thông báo đã đọc",
  EDIT_DRAFT: "Chỉnh sửa bản nháp thông báo",
  EXPORT_NOTIFICATIONS: "Xuất danh sách thông báo ra file",

  // Sections
  NOTIFICATION_LIST: "Danh sách thông báo",
  FILTER_OPTIONS: "Tùy chọn lọc thông báo",
  STATISTICS: "Thống kê và số liệu",
  COMPOSE_FORM: "Biểu mẫu soạn thông báo",

  // Status indicators
  UNREAD: "Thông báo chưa đọc",
  READ: "Thông báo đã đọc",
  URGENT: "Thông báo khẩn cấp",
  SCHEDULED: "Thông báo lên lịch",
};

/**
 * Generate ARIA labels based on notification properties
 */
export function generateNotificationAriaLabel(notification: {
  title: string;
  type: string;
  isRead?: boolean;
  createdAt?: string;
}): string {
  const status = notification.isRead ? "đã đọc" : "chưa đọc";
  const type = notification.type.toLowerCase();
  return `${notification.title}, loại ${type}, ${status}`;
}

/**
 * Announce dynamic content to screen readers using ARIA live regions
 */
export function announceToScreenReader(
  message: string,
  priority: "polite" | "assertive" = "polite"
): void {
  const announcement = document.createElement("div");
  announcement.setAttribute("role", "status");
  announcement.setAttribute("aria-live", priority);
  announcement.setAttribute("aria-atomic", "true");
  announcement.className = "sr-only"; // Visually hidden but readable by screen readers
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 3000);
}

/**
 * Manage focus for modals and overlays
 */
export class FocusManager {
  private previousFocus: HTMLElement | null = null;
  private focusTrap: HTMLElement | null = null;

  /**
   * Set focus trap for modal dialogs
   */
  setFocusTrap(element: HTMLElement): void {
    this.previousFocus = document.activeElement as HTMLElement;
    this.focusTrap = element;

    const focusableElements = this.getFocusableElements(element);
    if (focusableElements.length === 0) return;

    // Focus first element
    focusableElements[0].focus();

    // Add keyboard event listener
    element.addEventListener("keydown", this.handleTabKey.bind(this));
  }

  /**
   * Handle Tab key for focus trapping
   */
  private handleTabKey(event: KeyboardEvent): void {
    if (event.key !== "Tab") return;

    const focusableElements = this.getFocusableElements(
      this.focusTrap || document.body
    );
    if (focusableElements.length === 0) return;

    const currentIndex = focusableElements.indexOf(
      document.activeElement as HTMLElement
    );
    let nextIndex: number;

    if (event.shiftKey) {
      // Shift + Tab
      nextIndex = currentIndex === 0 ? focusableElements.length - 1 : currentIndex - 1;
    } else {
      // Tab
      nextIndex = currentIndex === focusableElements.length - 1 ? 0 : currentIndex + 1;
    }

    event.preventDefault();
    focusableElements[nextIndex].focus();
  }

  /**
   * Restore focus to previous element
   */
  restoreFocus(): void {
    if (this.previousFocus && this.previousFocus.focus) {
      this.previousFocus.focus();
    }
  }

  /**
   * Get all focusable elements within container
   */
  private getFocusableElements(container: HTMLElement): HTMLElement[] {
    const selector = [
      "a[href]",
      "button:not([disabled])",
      "textarea:not([disabled])",
      "input[type='text']:not([disabled])",
      "input[type='radio']:not([disabled])",
      "input[type='checkbox']:not([disabled])",
      "select:not([disabled])",
      "[tabindex]:not([tabindex='-1'])",
    ].join(",");

    return Array.from(container.querySelectorAll(selector));
  }
}

/**
 * Color contrast validator for WCAG AA compliance
 */
export const contrastValidator = {
  /**
   * Calculate relative luminance of a color
   */
  getLuminance(color: string): number {
    const rgb = this.hexToRgb(color);
    if (!rgb) return 0;

    const [r, g, b] = rgb.map((c) => {
      const srgb = c / 255;
      return srgb <= 0.03928
        ? srgb / 12.92
        : Math.pow((srgb + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  },

  /**
   * Convert hex color to RGB
   */
  hexToRgb(hex: string): [number, number, number] | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [
          parseInt(result[1], 16),
          parseInt(result[2], 16),
          parseInt(result[3], 16),
        ]
      : null;
  },

  /**
   * Calculate contrast ratio between two colors
   */
  getContrastRatio(color1: string, color2: string): number {
    const lum1 = this.getLuminance(color1);
    const lum2 = this.getLuminance(color2);
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);

    return (lighter + 0.05) / (darker + 0.05);
  },

  /**
   * Check if contrast meets WCAG AA standard (4.5:1 for normal text, 3:1 for large text)
   */
  meetsWCAGAA(color1: string, color2: string, isLargeText: boolean = false): boolean {
    const ratio = this.getContrastRatio(color1, color2);
    return isLargeText ? ratio >= 3 : ratio >= 4.5;
  },

  /**
   * Check if contrast meets WCAG AAA standard (7:1 for normal text, 4.5:1 for large text)
   */
  meetsWCAGAAA(
    color1: string,
    color2: string,
    isLargeText: boolean = false
  ): boolean {
    const ratio = this.getContrastRatio(color1, color2);
    return isLargeText ? ratio >= 4.5 : ratio >= 7;
  },
};

/**
 * Keyboard navigation helper
 */
export const keyboardNavigation = {
  /**
   * Handle arrow key navigation in lists
   */
  handleArrowKeyNavigation(
    event: KeyboardEvent,
    items: HTMLElement[],
    currentIndex: number
  ): number {
    let newIndex = currentIndex;

    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      newIndex = Math.min(currentIndex + 1, items.length - 1);
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      newIndex = Math.max(currentIndex - 1, 0);
    } else if (event.key === "Home") {
      newIndex = 0;
    } else if (event.key === "End") {
      newIndex = items.length - 1;
    }

    if (newIndex !== currentIndex) {
      event.preventDefault();
      items[newIndex]?.focus();
    }

    return newIndex;
  },

  /**
   * Check if keyboard event is an activation key (Enter or Space)
   */
  isActivationKey(event: KeyboardEvent): boolean {
    return event.key === "Enter" || event.key === " ";
  },

  /**
   * Check if escape key was pressed
   */
  isEscapeKey(event: KeyboardEvent): boolean {
    return event.key === "Escape";
  },
};

/**
 * Semantic HTML validators
 */
export const semanticValidator = {
  /**
   * Check if heading hierarchy is correct
   */
  validateHeadingHierarchy(): { valid: boolean; issues: string[] } {
    const headings = Array.from(document.querySelectorAll("h1, h2, h3, h4, h5, h6"));
    const issues: string[] = [];
    let lastLevel = 1;

    for (const heading of headings) {
      const currentLevel = parseInt(heading.tagName[1]);
      if (currentLevel > lastLevel + 1) {
        issues.push(
          `Skipped heading level: ${heading.textContent} (from h${lastLevel} to h${currentLevel})`
        );
      }
      lastLevel = currentLevel;
    }

    return {
      valid: issues.length === 0,
      issues,
    };
  },

  /**
   * Check if all images have alt text
   */
  validateImageAltText(): { valid: boolean; issues: string[] } {
    const images = Array.from(document.querySelectorAll("img"));
    const issues: string[] = [];

    for (const img of images) {
      if (!img.alt || img.alt.trim() === "") {
        issues.push(`Image missing alt text: ${img.src}`);
      }
    }

    return {
      valid: issues.length === 0,
      issues,
    };
  },

  /**
   * Check if form labels are associated with inputs
   */
  validateFormLabels(): { valid: boolean; issues: string[] } {
    const inputs = Array.from(document.querySelectorAll("input, textarea, select"));
    const issues: string[] = [];

    for (const input of inputs) {
      const element = input as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
      if (element.id) {
        const label = document.querySelector(`label[for="${element.id}"]`);
        if (!label) {
          issues.push(`Input #${element.id} has no associated label`);
        }
      } else {
        issues.push(`Input ${element.name || "unnamed"} has no id attribute`);
      }
    }

    return {
      valid: issues.length === 0,
      issues,
    };
  },
};

/**
 * Run comprehensive accessibility audit
 */
export function runAccessibilityAudit(): {
  headings: { valid: boolean; issues: string[] };
  images: { valid: boolean; issues: string[] };
  forms: { valid: boolean; issues: string[] };
  overallValid: boolean;
} {
  const results = {
    headings: semanticValidator.validateHeadingHierarchy(),
    images: semanticValidator.validateImageAltText(),
    forms: semanticValidator.validateFormLabels(),
    overallValid: false,
  };

  results.overallValid =
    results.headings.valid && results.images.valid && results.forms.valid;

  if (!results.overallValid) {
    console.warn("🔍 Accessibility issues found:", results);
  } else {
    console.log("✅ All accessibility checks passed!");
  }

  return results;
}

export default {
  A11Y_LABELS,
  generateNotificationAriaLabel,
  announceToScreenReader,
  FocusManager,
  contrastValidator,
  keyboardNavigation,
  semanticValidator,
  runAccessibilityAudit,
};
