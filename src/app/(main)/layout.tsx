"use client";

import { useState } from "react";
import "@/styles/main.scss";
import "bootstrap-icons/font/bootstrap-icons.css";
import { AppProviders } from "@/core/providers";
import { AuthProvider } from "@/core/providers/AuthProvider";
import { Sidebar } from "@/layout/Sidebar";
import { Header } from "@/layout/Header";
import { ChatbotButton } from "@/shared/components/ChatbotButton";
import { DemoPanel } from "@/shared/components/DemoPanel";
import { MOCK_SESSION } from "@/core/auth/auth.config";

/**
 * Main authenticated shell.
 * Role is managed by `useAuthStore` (Zustand + localStorage persistence).
 * AuthProvider is still used for NextAuth session compatibility.
 * Falls back to MOCK_SESSION admin role only when auth store is not yet hydrated.
 */
export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <AuthProvider session={MOCK_SESSION}>
      <AppProviders>
        <div className="app-shell">
          <Sidebar
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed((prev) => !prev)}
          />
          <div
            className={`app-main ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}
          >
            <Header />
            {children}
            <DemoPanel />
            <ChatbotButton />
          </div>
        </div>
      </AppProviders>
    </AuthProvider>
  );
}
