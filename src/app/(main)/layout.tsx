"use client";

import { useEffect, useState } from "react";
import "@/styles/main.scss";
import "bootstrap-icons/font/bootstrap-icons.css";
import { AppProviders } from "@/core/providers";
import { Sidebar } from "@/layout/Sidebar";
import { Header } from "@/layout/Header";
import { ChatbotButton } from "@/shared/components/ChatbotButton/ChatbotButton";
import { useSession } from "next-auth/react";
import { useMediaQuery } from "@/shared/hooks";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isMobile = useMediaQuery("(max-width: 1024px)");
  const { data: session, status } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Plain HTML — MUI Box/CircularProgress here hydrates as <style> vs <div>
  // because Emotion runs before ThemeProvider is mounted.
  if (!mounted || status === "loading") {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "#f9fafb",
        }}
      >
        <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden>
          <circle
            cx="20"
            cy="20"
            r="16"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="3"
          />
          <circle
            cx="20"
            cy="20"
            r="16"
            fill="none"
            stroke="#2a5bc0"
            strokeWidth="3"
            strokeDasharray="80"
            strokeDashoffset="60"
            strokeLinecap="round"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 20 20"
              to="360 20 20"
              dur="0.8s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      </div>
    );
  }

  // Not authenticated → AuthProvider will redirect to /login via middleware
  if (status === "unauthenticated" || !session?.user) {
    return null;
  }

  return (
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
  );
}
