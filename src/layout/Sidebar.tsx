// ============================================================
// SIDEBAR COMPONENT — Brand, user info, logout (navigation TBD)
// ============================================================
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState, useCallback, useEffect } from "react";
import { usePermissionContext } from "@/core/providers/PermissionProvider";
import { ROLE_LABELS } from "@/core/permissions/types";
import { default as Logo } from "@/assets/image/png/logo.png";
import Image from "next/image";

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const router = useRouter();
  const { role } = usePermissionContext();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Check screen size
  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  const toggleMobile = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  const handleToggle = useCallback(() => {
    if (isDesktop) {
      // Desktop: use the collapse toggle
      onToggle?.();
    } else {
      // Mobile: toggle mobile menu
      setMobileOpen((prev) => !prev);
    }
  }, [isDesktop, onToggle]);

  const handleSignOut = useCallback(async () => {
    await signOut({ redirect: false, callbackUrl: "/login" });
    router.push("/login");
  }, [router]);

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile hamburger */}
      <button
        type="button"
        className="sidebar-mobile-toggle"
        onClick={toggleMobile}
        aria-label="Open menu"
      >
        <span className="bi bi-list" />
      </button>

      {/* Sidebar */}
      <div
        className={`sidebar-wrapper ${collapsed ? "collapsed" : ""} ${mobileOpen && !isDesktop ? "mobile-open" : ""}`}
      >
        <div className={`sidebar ${collapsed ? "sidebar--collapsed" : ""}`}>
          {/* Brand */}
          <div className="sidebar-header">
            <Link href="/" className="sidebar-brand">
              <div className="sidebar-brand-logo-wrap">
                <Image
                  src={Logo}
                  alt="Logo"
                  width={42}
                  height={42}
                  className="sidebar-brand-logo"
                />
              </div>
              {!collapsed && (
                <span className="sidebar-brand-text">Thesis Manager</span>
              )}
            </Link>
            <button
              type="button"
              className="sidebar-toggle-btn"
              onClick={handleToggle}
              aria-label="Toggle sidebar"
            >
              <span
                className={`bi ${collapsed ? "bi-chevron-double-right" : "bi-chevron-double-left"} sidebar-toggle-icon`}
              />
            </button>
          </div>

          {/* Navigation — Dashboard */}
          <nav className="sidebar-nav" aria-label="Main navigation">
            <ul className="sidebar-menu">
              <li className="sidebar-menu-item active">
                <Link href="/" className="sidebar-menu-link" title="Dashboard">
                  <span className="sidebar-menu-icon bi bi-house-fill" />
                  {!collapsed && (
                    <span className="sidebar-menu-label">Dashboard</span>
                  )}
                </Link>
              </li>
            </ul>
          </nav>

          {/* User info */}
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">
              <span className="bi bi-person-circle" />
            </div>
            {!collapsed && (
              <div className="sidebar-user-info">
                <span className="sidebar-user-name">Người dùng</span>
                <span className="sidebar-user-role">
                  {role ? ROLE_LABELS[role] : "Khách"}
                </span>
              </div>
            )}
          </div>

          {/* Footer / Logout */}
          <div className="sidebar-footer">
            <button
              type="button"
              className="sidebar-logout-btn"
              onClick={handleSignOut}
              title="Đăng xuất"
            >
              <span className="bi bi-box-arrow-right sidebar-logout-icon" />
              {!collapsed && <span>Đăng xuất</span>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
