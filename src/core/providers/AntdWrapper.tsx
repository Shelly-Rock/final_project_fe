// ============================================================
// ANT DESIGN WRAPPER — ConfigProvider setup
// ============================================================
"use client";

import type { ReactNode } from "react";
import { ConfigProvider } from "antd";
import { antdTheme } from "@/core/providers/AntdTheme";

interface AntdWrapperProps {
  children: ReactNode;
}

export function AntdWrapper({ children }: AntdWrapperProps) {
  return (
    <ConfigProvider theme={antdTheme}>
      {children}
    </ConfigProvider>
  );
}
