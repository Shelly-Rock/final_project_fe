// Kiểm tra phần tử có nằm trong viewport không (hỗ trợ partially và tolerance)
export function isElementInViewport(
  element: Element,
  options?: {
    partially?: boolean;
    tolerance?: number;
  },
): boolean {
  const { partially = false, tolerance = 0 } = options ?? {};
  const rect = element.getBoundingClientRect();

  if (partially) {
    return (
      rect.top < window.innerHeight + tolerance &&
      rect.bottom > -tolerance &&
      rect.left < window.innerWidth + tolerance &&
      rect.right > -tolerance
    );
  }

  return (
    rect.top >= -tolerance &&
    rect.left >= -tolerance &&
    rect.bottom <= window.innerHeight + tolerance &&
    rect.right <= window.innerWidth + tolerance
  );
}

// Kiểm tra phần tử có đang hiển thị (không bị ẩn qua CSS) không
export function isElementVisible(element: Element): boolean {
  let current: Element | null = element;
  while (current) {
    const style = window.getComputedStyle(current);
    if (
      style.display === "none" ||
      style.visibility === "hidden" ||
      style.visibility === "collapse" ||
      style.opacity === "0"
    ) {
      return false;
    }
    current = current.parentElement;
  }
  return true;
}

// Kiểm tra phần tử có đang được kích hoạt (không bị disabled) không
export function isElementEnabled(element: Element): boolean {
  return !(
    element instanceof HTMLElement &&
    "disabled" in element &&
    element.disabled
  );
}

// ==================== POSITION & DIMENSIONS ====================

// Lấy vị trí và kích thước của phần tử so với viewport
export function getElementPosition(element: Element): {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
  x: number;
  y: number;
} {
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top,
    left: rect.left,
    right: rect.right,
    bottom: rect.bottom,
    width: rect.width,
    height: rect.height,
    x: rect.x,
    y: rect.y,
  };
}

// Lấy vị trí của phần tử so với toàn bộ tài liệu (kể cả đã cuộn)
export function getElementPositionRelativeToDocument(element: Element): {
  top: number;
  left: number;
  width: number;
  height: number;
} {
  const rect = element.getBoundingClientRect();
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  return {
    top: rect.top + scrollTop,
    left: rect.left + scrollLeft,
    width: rect.width,
    height: rect.height,
  };
}

// Lấy tọa độ tâm của phần tử
export function getElementCenter(element: Element): { x: number; y: number } {
  const rect = element.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}

// Lấy kích thước đầy đủ của phần tử (bao gồm cả scroll, padding, border)
export function getDimensions(element: Element): {
  width: number;
  height: number;
  innerWidth: number;
  innerHeight: number;
  outerWidth: number;
  outerHeight: number;
  scrollWidth: number;
  scrollHeight: number;
} {
  const rect = element.getBoundingClientRect();
  const computedStyle = window.getComputedStyle(element);
  return {
    width: rect.width,
    height: rect.height,
    innerWidth: parseFloat(computedStyle.width),
    innerHeight: parseFloat(computedStyle.height),
    outerWidth:
      parseFloat(computedStyle.width) +
      parseFloat(computedStyle.paddingLeft) +
      parseFloat(computedStyle.paddingRight) +
      parseFloat(computedStyle.borderLeftWidth) +
      parseFloat(computedStyle.borderRightWidth),
    outerHeight:
      parseFloat(computedStyle.height) +
      parseFloat(computedStyle.paddingTop) +
      parseFloat(computedStyle.paddingBottom) +
      parseFloat(computedStyle.borderTopWidth) +
      parseFloat(computedStyle.borderBottomWidth),
    scrollWidth: element.scrollWidth,
    scrollHeight: element.scrollHeight,
  };
}

let cachedScrollbarWidth: number | null = null;

// Lấy chiều rộng của thanh cuộn trình duyệt
export function getScrollbarWidth(): number {
  if (cachedScrollbarWidth !== null) return cachedScrollbarWidth;
  const outer = document.createElement("div");
  outer.style.visibility = "hidden";
  outer.style.overflow = "scroll";
  document.body.appendChild(outer);
  const inner = document.createElement("div");
  outer.appendChild(inner);
  cachedScrollbarWidth = outer.offsetWidth - inner.offsetWidth;
  outer.parentNode?.removeChild(outer);
  return cachedScrollbarWidth;
}

// ==================== SCROLLING ====================

// Cuộn đến phần tử với khoảng cách offset (bù từ trên xuống)
export function scrollIntoViewWithOffset(
  element: Element,
  offset: number = 0,
  options?: ScrollToOptions,
): void {
  const rect = element.getBoundingClientRect();
  const scrollTop = window.pageYOffset + rect.top - offset;
  window.scrollTo({
    top: scrollTop,
    left: window.pageXOffset,
    behavior: options?.behavior ?? "smooth",
  });
}

// Cuộn phần tử con lên đầu của container
export function scrollElementToTop(
  element: Element,
  container: Element,
  offset: number = 0,
): void {
  const elementRect = element.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  const scrollTop =
    elementRect.top - containerRect.top + container.scrollTop - offset;
  container.scrollTo({
    top: scrollTop,
    behavior: "smooth",
  });
}

// Đăng ký sự kiện, trả về hàm hủy đăng ký
export function on<K extends keyof HTMLElementEventMap>(
  element: Element | Window | Document,
  event: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  options?: AddEventListenerOptions,
): () => void {
  element.addEventListener(event, handler as EventListener, options);
  return () => {
    element.removeEventListener(event, handler as EventListener, options);
  };
}

// Đăng ký sự kiện chỉ chạy một lần duy nhất
export function once<K extends keyof HTMLElementEventMap>(
  element: Element | Window | Document,
  event: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  options?: AddEventListenerOptions,
): void {
  const wrappedHandler = (e: HTMLElementEventMap[K]): void => {
    handler(e);
    element.removeEventListener(
      event,
      wrappedHandler as EventListener,
      options,
    );
  };
  element.addEventListener(event, wrappedHandler as EventListener, options);
}

// Ủy quyền sự kiện (event delegation), áp dụng cho phần tử con khớp selector
export function delegate<T extends Element>(
  parent: Element,
  selector: string,
  event: string,
  handler: (event: Event, target: T) => void,
): () => void {
  const wrappedHandler = (event: Event): void => {
    const target = (event.target as Element).closest(selector) as T | null;
    if (target && parent.contains(target)) {
      handler(event, target);
    }
  };
  parent.addEventListener(event, wrappedHandler);
  return () => {
    parent.removeEventListener(event, wrappedHandler);
  };
}

// Hiệu ứng fade in (hiện dần)
export function fadeIn(
  element: Element | HTMLElement,
  duration: number = 300,
): Promise<void> {
  return new Promise((resolve) => {
    const el = element as HTMLElement;
    el.style.opacity = "0";
    el.style.display = "";
    const animation = el.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration,
      easing: "ease-out",
    });
    animation.onfinish = () => {
      el.style.opacity = "";
      resolve();
    };
  });
}

// Hiệu ứng fade out (mờ dần và ẩn)
export function fadeOut(
  element: HTMLElement,
  duration: number = 300,
): Promise<void> {
  return new Promise((resolve) => {
    element.style.opacity = "1";
    const animation = element.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration,
      easing: "ease-out",
    });
    animation.onfinish = () => {
      element.style.display = "none";
      element.style.opacity = "";
      resolve();
    };
  });
}

// Hiệu ứng slide in (trượt vào từ 4 hướng)
export function slideIn(
  element: HTMLElement,
  direction: "top" | "bottom" | "left" | "right" = "top",
  duration: number = 300,
): Promise<void> {
  return new Promise((resolve) => {
    const translations: Record<string, string> = {
      top: "-100%",
      bottom: "100%",
      left: "-100%",
      right: "100%",
    };
    const axis = direction === "top" || direction === "bottom" ? "Y" : "X";
    element.style.transform = `translate${axis}(${translations[direction]})`;
    element.style.display = "";
    const animation = element.animate(
      [
        { transform: `translate${axis}(${translations[direction]})` },
        { transform: "translate(0, 0)" },
      ],
      { duration, easing: "ease-out" },
    );
    animation.onfinish = () => {
      element.style.transform = "";
      resolve();
    };
  });
}

// Hiệu ứng slide out (trượt ra và ẩn)
export function slideOut(
  element: HTMLElement,
  direction: "top" | "bottom" | "left" | "right" = "top",
  duration: number = 300,
): Promise<void> {
  return new Promise((resolve) => {
    const translations: Record<string, string> = {
      top: "-100%",
      bottom: "100%",
      left: "-100%",
      right: "100%",
    };
    const axis = direction === "top" || direction === "bottom" ? "Y" : "X";
    const animation = element.animate(
      [
        { transform: "translate(0, 0)" },
        { transform: `translate${axis}(${translations[direction]})` },
      ],
      { duration, easing: "ease-out" },
    );
    animation.onfinish = () => {
      element.style.display = "none";
      element.style.transform = "";
      resolve();
    };
  });
}

// Kiểm tra phần tử có tồn tại trong DOM không
export function isInDOM(element: Element): boolean {
  return document.body.contains(element);
}

// Chờ một phần tử xuất hiện trong DOM (dùng MutationObserver)
export function waitForElementInDOM(
  selector: string,
  timeout: number = 5000,
): Promise<Element | null> {
  return new Promise((resolve) => {
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }
    const observer = new MutationObserver(() => {
      const el = document.querySelector(selector);
      if (el) {
        observer.disconnect();
        resolve(el);
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
    setTimeout(() => {
      observer.disconnect();
      resolve(null);
    }, timeout);
  });
}

// Lấy tất cả các phần tử có thể focus được trong container
export function getFocusableElements(container: Element): HTMLElement[] {
  const selector = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
  ].join(",");
  return Array.from(container.querySelectorAll<HTMLElement>(selector));
}

// Di chuyển focus đến phần tử tiếp theo hoặc trước đó trong container
export function moveFocus(
  container: Element,
  direction: "next" | "previous",
): void {
  const focusable = getFocusableElements(container);
  if (focusable.length === 0) return;
  const focused = document.activeElement as HTMLElement;
  const currentIndex = focusable.indexOf(focused);
  let nextIndex: number;
  if (direction === "next") {
    nextIndex = currentIndex < focusable.length - 1 ? currentIndex + 1 : 0;
  } else {
    nextIndex = currentIndex > 0 ? currentIndex - 1 : focusable.length - 1;
  }
  focusable[nextIndex]?.focus();
}

// Chọn toàn bộ văn bản trong input hoặc textarea
export function selectText(
  element: HTMLInputElement | HTMLTextAreaElement,
): void {
  element.select();
  element.setSelectionRange(0, element.value.length);
}
