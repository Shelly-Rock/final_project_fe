"use client";

import { useState } from "react";
import "@/styles/main.scss";
import "bootstrap-icons/font/bootstrap-icons.css";
import { AppProviders } from "@/core/providers";
import { AuthProvider } from "@/core/providers/AuthProvider";
import { Sidebar } from "@/layout/Sidebar";
import { Header } from "@/layout/Header";
import { MOCK_SESSION } from "@/core/auth/auth.config";

// Main shell: always authenticated in FE test mode
export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  return (
    <AuthProvider session={MOCK_SESSION}>
      <AppProviders initialRole={MOCK_SESSION.user.role}>
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
          </div>
        </div>
      </AppProviders>
    </AuthProvider>
  );
}
