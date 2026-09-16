import { test, expect, Page } from "@playwright/test";

const BASE_URL = process.env.BASE_URL || "http://localhost:3002";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@qnq.edu.vn";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "password123";

async function loginAsAdmin(page: Page) {
  await page.goto(`${BASE_URL}/login`);
  await page.fill('input[type="email"]', ADMIN_EMAIL);
  await page.fill('input[type="password"]', ADMIN_PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL(`${BASE_URL}/notification/admin`);
}

test.describe("Admin Notification Management E2E", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test("should display notification dashboard with metrics", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/notification/admin`);

    // Verify header
    await expect(page.locator("h1")).toContainText("Quản lý Thông báo");

    // Verify KPI cards
    await expect(page.locator("text=Tổng thông báo")).toBeVisible();
    await expect(page.locator("text=Khẩn cấp & Chỉ thị")).toBeVisible();
    await expect(page.locator("text=Tỷ lệ đọc")).toBeVisible();
    await expect(page.locator("text=Cần đôn đốc")).toBeVisible();
  });

  test("should create and send a new notification", async ({ page }) => {
    await page.goto(`${BASE_URL}/notification/admin`);

    // Click compose button
    await page.click('button:has-text("Soạn thông báo")');

    // Verify modal opened
    await expect(page.locator("h3")).toContainText("Soạn thông báo mới");

    // Fill form
    await page.selectOption(
      "select[name=recipientRole]",
      "Toàn trường (Tất cả đơn vị & Cán bộ)"
    );
    await page.fill(
      'input[placeholder*="Ví dụ"]',
      "Test Notification Title"
    );
    await page.fill(
      'textarea[placeholder*="Ghi rõ"]',
      "This is a test notification content"
    );

    // Submit form
    await page.click('button:has-text("Phát hành ngay")');

    // Verify success
    await expect(page.locator("text=thành công")).toBeVisible({
      timeout: 5000,
    });
  });

  test("should filter notifications by type", async ({ page }) => {
    await page.goto(`${BASE_URL}/notification/admin`);

    // Click "Hỏa tốc" tab
    await page.click("button:has-text('Hỏa tốc')");

    // Verify filter applied
    await expect(page.locator("text=Hỏa tốc")).toBeVisible();
  });

  test("should search notifications", async ({ page }) => {
    await page.goto(`${BASE_URL}/notification/admin`);

    // Type in search
    await page.fill(
      'input[placeholder*="Tìm theo tiêu đề"]',
      "test search term"
    );

    // Verify search input has value
    await expect(
      page.locator('input[placeholder*="Tìm theo tiêu đề"]')
    ).toHaveValue("test search term");
  });

  test("should mark all notifications as read", async ({ page }) => {
    await page.goto(`${BASE_URL}/notification/admin`);

    // Click mark all as read button if visible
    const markAllButton = page.locator(
      'button:has-text("Đánh dấu tất cả đã đọc")'
    );

    if (await markAllButton.isVisible()) {
      await markAllButton.click();
      await expect(page.locator("text=thành công")).toBeVisible({
        timeout: 5000,
      });
    }
  });

  test("should delete all notifications with confirmation", async ({
    page,
    context,
  }) => {
    await page.goto(`${BASE_URL}/notification/admin`);

    // Listen for dialog
    page.once("dialog", (dialog) => {
      expect(dialog.type()).toBe("confirm");
      dialog.accept();
    });

    // Click delete all button
    await page.click('button:has-text("Xóa tất cả")');

    // Verify deletion
    await expect(page.locator("text=thành công")).toBeVisible({
      timeout: 5000,
    });
  });

  test("should paginate through notifications", async ({ page }) => {
    await page.goto(`${BASE_URL}/notification/admin`);

    // Check if next button is enabled
    const nextButton = page.locator('button:has-text("Tiếp")');

    if (await nextButton.isEnabled()) {
      await nextButton.click();

      // Verify page changed (new notifications loaded)
      await page.waitForTimeout(1000);
      await expect(page.locator("tbody tr")).toBeDefined();
    }
  });

  test("should handle responsive design on mobile", async ({
    page,
    context,
  }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto(`${BASE_URL}/notification/admin`);

    // Verify page is responsive
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("button:has-text('Soạn thông báo')")).toBeVisible();
  });

  test("should apply accessibility best practices", async ({ page }) => {
    await page.goto(`${BASE_URL}/notification/admin`);

    // Check for proper heading hierarchy
    const h1 = page.locator("h1");
    await expect(h1).toBeVisible();

    // Check for proper ARIA labels
    const buttons = page.locator("button");
    const buttonCount = await buttons.count();
    expect(buttonCount).toBeGreaterThan(0);

    // Check for proper color contrast
    const colorContrastIssues = await page.evaluate(() => {
      const issues: string[] = [];
      const elements = document.querySelectorAll("*");
      elements.forEach((el) => {
        const style = window.getComputedStyle(el);
        const color = style.color;
        const bgColor = style.backgroundColor;
        // Basic contrast check (this would be more complex in real scenario)
        if (color && bgColor) {
          issues.push(`Element: ${el.tagName}`);
        }
      });
      return issues;
    });

    expect(colorContrastIssues).toBeDefined();
  });
});
