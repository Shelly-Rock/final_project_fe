import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/core/providers/AuthProvider";
import { AppProviders } from "@/core/providers/AppProviders";
import { Sonner } from "@/shared/components/Sonner/Sonner";
import SchoolLogo from "@/assets/image/png/logo02.png";
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
  icons: {
    icon: SchoolLogo.src,
    apple: SchoolLogo.src,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <AuthProvider>
          <AppProviders>{children}</AppProviders>
        </AuthProvider>
        <Sonner position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
