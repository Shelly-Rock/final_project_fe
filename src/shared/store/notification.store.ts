import { create } from "zustand";
import { INotification } from "@/shared/types/notification.types";
import { notificationApi } from "@/shared/services/api/notification.api";

interface NotificationState {
  notifications: INotification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;

  fetchNotifications: (skip?: number, take?: number) => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAsRead: (notificationIds: number[]) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: number) => Promise<void>;
  deleteAllNotifications: () => Promise<void>;
  addNotification: (notification: INotification) => void;
  reset: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  fetchNotifications: async (skip = 0, take = 10) => {
    set({ isLoading: true, error: null });
    try {
      const response = await notificationApi.getNotifications({ skip, take });
      set({
        notifications: response.notifications,
        unreadCount: response.unreadCount,
        isLoading: false,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch notifications";
      set({ error: message, isLoading: false });
    }
  },

  fetchUnreadCount: async () => {
    try {
      const response = await notificationApi.getUnreadCount();
      set({ unreadCount: response.unreadCount });
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    }
  },

  markAsRead: async (notificationIds: number[]) => {
    try {
      await notificationApi.markAsRead(notificationIds);
      set((state) => ({
        notifications: state.notifications.map((n) =>
          notificationIds.includes(n.id) ? { ...n, isRead: true } : n,
        ),
        unreadCount: Math.max(0, state.unreadCount - notificationIds.length),
      }));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to mark as read";
      set({ error: message });
    }
  },

  markAllAsRead: async () => {
    try {
      await notificationApi.markAllAsRead();
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        unreadCount: 0,
      }));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to mark all as read";
      set({ error: message });
    }
  },

  deleteNotification: async (notificationId: number) => {
    try {
      await notificationApi.deleteNotification(notificationId);
      set((state) => {
        const notification = state.notifications.find(
          (n) => n.id === notificationId,
        );
        return {
          notifications: state.notifications.filter(
            (n) => n.id !== notificationId,
          ),
          unreadCount:
            state.unreadCount - (notification && !notification.isRead ? 1 : 0),
        };
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to delete notification";
      set({ error: message });
    }
  },

  deleteAllNotifications: async () => {
    try {
      await notificationApi.deleteAllNotifications();
      set({ notifications: [], unreadCount: 0 });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to delete all notifications";
      set({ error: message });
    }
  },

  addNotification: (notification: INotification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },

  reset: () => {
    set({ notifications: [], unreadCount: 0, error: null, isLoading: false });
  },
}));
