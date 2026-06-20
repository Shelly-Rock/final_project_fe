"use client";

import { useState } from "react";
import { Layout } from "antd";
import { AppProviders } from "@/core/providers";
import { AuthProvider } from "@/core/providers/AuthProvider";
import { Sidebar } from "@/layout/Sidebar";
import { Header } from "@/layout/Header";
import { ChatbotButton } from "@/shared/components/ChatbotButton";
import { MOCK_SESSION } from "@/core/auth/auth.config";

const { Sider } = Layout;

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <AuthProvider session={MOCK_SESSION}>
      <AppProviders initialRole={MOCK_SESSION.user.role}>
        <Layout style={{ minHeight: "100vh" }}>
          <Sider
            width={260}
            collapsedWidth={80}
            collapsible
            collapsed={collapsed}
            onCollapse={setCollapsed}
            trigger={null}
            style={{
              background: "#fff",
              borderRight: "1px solid #e5e7eb",
              position: "fixed",
              height: "100vh",
              left: 0,
              top: 0,
              zIndex: 100,
            }}
          >
            <Sidebar
              collapsed={collapsed}
              onToggle={() => setCollapsed(!collapsed)}
            />
          </Sider>
          <Layout style={{ marginLeft: collapsed ? 80 : 260, transition: "margin-left 0.2s" }}>
            <Header />
            <div style={{ padding: 24, background: "#f9fafb", minHeight: "calc(100vh - 64px)" }}>
              {children}
            </div>
            <ChatbotButton />
          </Layout>
        </Layout>
      </AppProviders>
    </AuthProvider>
  );
}
