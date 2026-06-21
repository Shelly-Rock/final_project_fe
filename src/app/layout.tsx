// ============================================================
// ROOT LAYOUT — Only <html>/<body> wrapper; no sidebar here.
// Auth routes: (auth)/layout.tsx (no sidebar)
// Main routes:  (main)/layout.tsx (with sidebar)
// ============================================================
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/main.scss";
import "bootstrap-icons/font/bootstrap-icons.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QNQ - Hệ thống quản lý đồ án sinh viên",
  description:
    "Hệ thống quản lý đồ án sinh viên, phân công giảng viên hướng dẫn, đăng ký đề tài, theo dõi tiến độ thực hiện, đánh giá kết quả và quản lý toàn bộ quy trình đồ án một cách hiệu quả.",
};

export default function RootLayout({

  
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
