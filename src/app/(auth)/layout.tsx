// ============================================================
// AUTH LAYOUT — Standalone layout without sidebar (login, register, etc.)
// NOTE: Only root layout.tsx contains <html>/<body>. Route group layouts
//       must only return a fragment or a div fragment — no <html> or <body>.
// ============================================================
import type { Metadata } from "next";
import "@/styles/main.scss";
import "bootstrap-icons/font/bootstrap-icons.css";
import { AppProviders, AuthProvider } from "@/core/providers";

export const metadata: Metadata = {
  title: "QNQ - Hệ thống quản lý đồ án sinh viên",
  description:
    "Nền tảng hỗ trợ quản lý đồ án sinh viên, phân công giảng viên hướng dẫn, đăng ký đề tài, theo dõi tiến độ thực hiện, đánh giá kết quả và quản lý toàn bộ quy trình đồ án một cách hiệu quả.",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider session={null}>
      <AppProviders initialRole={null}>
        <main className="auth-main">{children}</main>
      </AppProviders>
    </AuthProvider>
  );
}
