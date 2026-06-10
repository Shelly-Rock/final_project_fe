// ============================================================
// UNAUTHORIZED PAGE — 403 Access Denied
// ============================================================
import Link from "next/link";
import Image from "next/image";
import { default as Logo } from "@/assets/image/png/logo.png";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "403 - Không có quyền truy cập",
};

export default function UnauthorizedPage() {
  return (
    <div className="unauthorized-page">
      <div className="unauthorized-container">
        {/* Logo */}
        <div className="unauthorized-logo">
          <Image
            src={Logo}
            alt="QNQ Logo"
            width={80}
            height={80}
            className="unauthorized-logo-img"
          />
        </div>

        {/* Shield Icon */}
        <div className="unauthorized-icon">
          <span className="bi bi-shield-lock" />
        </div>

        {/* Error Code */}
        <div className="unauthorized-code">403</div>

        {/* Title */}
        <h1 className="unauthorized-title">Không có quyền truy cập</h1>

        {/* Description */}
        <p className="unauthorized-desc">
          Bạn không có quyền truy cập trang này.
          <br />
          Vui lòng liên hệ quản trị viên nếu bạn cần hỗ trợ.
        </p>

        {/* Actions */}
        <div className="unauthorized-actions">
          <Link href="/" className="unauthorized-btn unauthorized-btn--primary">
            <span className="bi bi-house-door" />
            Quay về trang chủ
          </Link>
          <Link
            href="/login"
            className="unauthorized-btn unauthorized-btn--secondary"
          >
            <span className="bi bi-box-arrow-in-right" />
            Đăng nhập lại
          </Link>
        </div>

        {/* Help text */}
        <div className="unauthorized-help">
          <span className="bi bi-question-circle" />
          Bạn cần hỗ trợ? Liên hệ:{" "}
          <a href="mailto:support@qnq.edu.vn" className="unauthorized-link">
            support@qnq.edu.vn
          </a>
        </div>
      </div>
    </div>
  );
}
