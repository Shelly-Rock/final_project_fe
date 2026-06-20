// ============================================================
// ANT DESIGN THEME — Design tokens aligned with existing palette
// ============================================================
"use client";

import type { ThemeConfig } from "antd";

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: "#2a5bc0",
    colorSuccess: "#1dab60",
    colorWarning: "#e89b33",
    colorError: "#d13b3b",
    colorInfo: "#40b8d4",
    colorBgContainer: "#ffffff",
    colorBgLayout: "#f9fafb",
    colorText: "#111827",
    colorTextSecondary: "#6b7280",
    colorBorder: "#e5e7eb",
    colorBorderSecondary: "#f3f4f6",
    borderRadius: 6,
    fontFamily: '"Geist", "Inter", system-ui, -apple-system, sans-serif',
    fontSize: 14,
    fontSizeHeading1: 36,
    fontSizeHeading2: 30,
    fontSizeHeading3: 24,
    fontSizeHeading4: 20,
    fontSizeHeading5: 16,
    lineHeight: 1.5,
    controlHeight: 40,
    boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    boxShadowSecondary: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  },
  components: {
    Button: {
      borderRadius: 6,
      controlHeight: 40,
      fontWeight: 600,
      primaryShadow: "0 4px 12px rgba(42, 91, 192, 0.35)",
    },
    Card: {
      borderRadius: 8,
      paddingLG: 24,
    },
    Table: {
      borderRadius: 8,
      headerBg: "#f9fafb",
      headerColor: "#111827",
      rowHoverBg: "#f9fafb",
    },
    Input: {
      borderRadius: 6,
      controlHeight: 40,
    },
    Select: {
      borderRadius: 6,
      controlHeight: 40,
    },
    Menu: {
      itemBorderRadius: 6,
      itemSelectedBg: "rgba(42, 91, 192, 0.1)",
      itemSelectedColor: "#2a5bc0",
    },
    Tabs: {
      itemSelectedColor: "#2a5bc0",
      inkBarColor: "#2a5bc0",
    },
    Tag: {
      borderRadiusSM: 4,
    },
    Modal: {
      borderRadius: 8,
    },
    Breadcrumb: {
      itemColor: "#6b7280",
      lastItemColor: "#111827",
    },
  },
};
