import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QNQ-Hệ thống quản lý đồ án sinh viên",
  description:
    "Nền tảng hỗ trợ quản lý đồ án sinh viên, phân công giảng viên hướng dẫn, đăng ký đề tài, theo dõi tiến độ thực hiện, đánh giá kết quả và quản lý toàn bộ quy trình đồ án một cách hiệu quả.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
