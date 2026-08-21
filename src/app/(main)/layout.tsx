"use client";

import { useState } from "react";
import "@/styles/main.scss";
import "bootstrap-icons/font/bootstrap-icons.css";
import { AppProviders } from "@/core/providers";
import { AuthProvider } from "@/core/providers/AuthProvider";
import { Sidebar } from "@/layout/Sidebar";
import { Header } from "@/layout/Header";
import { ChatbotButton } from "@/shared/components/ChatbotButton/ChatbotButton";
import { useSession } from "next-auth/react";
import { useMediaQuery } from "@/shared/hooks";
import { CircularProgress, Box } from "@mui/material";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 1024px)");
  const { data: session, status } = useSession();

  // Still loading → show spinner
  if (status === "loading") {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          bgcolor: "background.default",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Not authenticated → AuthProvider will redirect to /login via middleware
  if (status === "unauthenticated" || !session?.user) {
    return null;
  }

  return (
    <AuthProvider session={session}>
      <AppProviders initialRole={session.user.role}>
        <div className="app-shell">
          {/* Mobile overlay */}
          {mobileSidebarOpen && isMobile && (
            <div
              className="sidebar-overlay"
              onClick={() => setMobileSidebarOpen(false)}
              aria-hidden="true"
            />
          )}

          {/* Mobile toggle button on header */}
          {isMobile && (
            <button
              type="button"
              className="sidebar-mobile-toggle"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open menu"
            >
              <span className="bi bi-list" />
            </button>
          )}

          <Sidebar
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed((prev) => !prev)}
            mobileOpen={mobileSidebarOpen}
            onMobileClose={() => setMobileSidebarOpen(false)}
          />
          <div
            className={`app-main ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}
          >
            <Header
              onMenuClick={() => setMobileSidebarOpen(true)}
              showMenuButton={isMobile}
            />
            {children}
            <ChatbotButton />
          </div>
        </div>
      </AppProviders>
    </AuthProvider>
  );
}
