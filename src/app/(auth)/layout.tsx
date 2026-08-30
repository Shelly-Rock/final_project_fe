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
    <AuthProvider>
      <AppProviders initialRole={null}>
        <main className="auth-main">{children}</main>
      </AppProviders>
    </AuthProvider>
  );
}
