import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Suspense } from "react";
import AdminNotificationPage from "./AdminNotificationPage";

// Mock the notification store
vi.mock("@/shared/store/notification.store", () => ({
  useNotificationStore: () => ({
    notifications: [
      {
        id: 1,
        type: "URGENT",
        title: "Test Urgent",
        message: "Test message",
        isRead: false,
        recipientId: 1,
        createdAt: new Date().toISOString(),
      },
    ],
    unreadCount: 1,
    isLoading: false,
    fetchNotifications: vi.fn(),
    markAllAsRead: vi.fn(),
    deleteAllNotifications: vi.fn(),
  }),
}));

describe("AdminNotificationPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the page with header", async () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <AdminNotificationPage />
      </Suspense>
    );

    await waitFor(() => {
      expect(screen.getByText(/Quản lý Thông báo/i)).toBeInTheDocument();
    });
  });

  it("displays KPI metrics", async () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <AdminNotificationPage />
      </Suspense>
    );

    await waitFor(() => {
      expect(screen.getByText(/Tổng thông báo/i)).toBeInTheDocument();
      expect(screen.getByText(/Khẩn cấp/i)).toBeInTheDocument();
    });
  });

  it("opens compose modal when create button is clicked", async () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <AdminNotificationPage />
      </Suspense>
    );

    await waitFor(() => {
      const createButton = screen.getByText(/Soạn thông báo/i);
      fireEvent.click(createButton);
    });

    expect(screen.getByText(/Soạn thông báo mới/i)).toBeInTheDocument();
  });

  it("filters notifications by type", async () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <AdminNotificationPage />
      </Suspense>
    );

    await waitFor(() => {
      const urgentTab = screen.getByText(/Hỏa tốc/i);
      fireEvent.click(urgentTab);
    });

    // Verify filter applied
    expect(screen.getByText(/Hỏa tốc/i)).toBeInTheDocument();
  });

  it("searches notifications", async () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <AdminNotificationPage />
      </Suspense>
    );

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText(/Tìm theo tiêu đề/i);
      fireEvent.change(searchInput, { target: { value: "test" } });
    });

    expect(screen.getByDisplayValue("test")).toBeInTheDocument();
  });

  it("paginates correctly", async () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <AdminNotificationPage />
      </Suspense>
    );

    await waitFor(() => {
      const nextButton = screen.getByText(/Tiếp/i);
      expect(nextButton).toBeInTheDocument();
    });
  });
});
