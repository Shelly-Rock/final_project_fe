// ============================================================
// HEADER COMPONENT — Role switcher & user info bar
// ============================================================
"use client";

import { useState } from "react";
import type { Role } from "@/core/permissions/types";
import { ROLE, ROLE_LABELS } from "@/core/permissions/types";
import { useAuthStore } from "@/store";

const ALL_ROLES: Role[] = [
  ROLE.ADMIN,
  ROLE.SECRETARY,
  ROLE.TEACHER,
  ROLE.STUDENT,
  ROLE.COUNCIL,
];

const ROLE_COLORS: Record<Role, string> = {
  [ROLE.ADMIN]: "#d32f2f",
  [ROLE.SECRETARY]: "#1976d2",
  [ROLE.TEACHER]: "#388e3c",
  [ROLE.STUDENT]: "#7b1fa2",
  [ROLE.COUNCIL]: "#f57c00",
};

export function Header() {
  const user = useAuthStore((s) => s.user);
  const switchRole = useAuthStore((s) => s.switchRole);
  const logout = useAuthStore((s) => s.logout);
  const [switcherOpen, setSwitcherOpen] = useState(false);

  const currentRole = user?.role ?? null;
  const currentRoleLabel = currentRole ? ROLE_LABELS[currentRole] : "Chưa đăng nhập";
  const currentRoleColor = currentRole ? ROLE_COLORS[currentRole] : "#999";

  return (
    <header className="app-header">
      <div className="app-header-left">
        <span className="app-header-breadcrumb">
          Hệ Thống Quản Lý Đồ Án Sinh Viên
        </span>
      </div>

      <div className="app-header-right">
        {/* Role switcher — driven by useAuthStore */}
        <div className="role-switcher">
          <button
            type="button"
            className="role-switcher-btn"
            onClick={() => setSwitcherOpen((v) => !v)}
            title="Chuyển vai trò (DEV testing)"
          >
            <span
              className="bi bi-person-badge-fill role-switcher-icon"
              style={{ color: currentRoleColor }}
            />
            <span className="role-switcher-label">{currentRoleLabel}</span>
            <span
              className={`bi bi-chevron-down role-switcher-arrow ${switcherOpen ? "open" : ""}`}
            />
          </button>

          {switcherOpen && (
            <>
              <div
                className="role-switcher-overlay"
                onClick={() => setSwitcherOpen(false)}
                aria-hidden="true"
              />
              <div className="role-switcher-dropdown">
                <div className="role-switcher-dropdown-header">
                  <span className="bi bi-tools" />
                  &nbsp;Chuyển vai trò (DEV testing)
                </div>
                {ALL_ROLES.map((r) => {
                  const isActive = r === currentRole;
                  return (
                    <button
                      key={r}
                      type="button"
                      className={`role-switcher-item ${isActive ? "active" : ""}`}
                      onClick={() => {
                        switchRole(r);
                        setSwitcherOpen(false);
                      }}
                    >
                      <span
                        className="role-switcher-dot"
                        style={{ backgroundColor: ROLE_COLORS[r] }}
                      />
                      <span>{ROLE_LABELS[r]}</span>
                      {isActive && (
                        <span className="bi bi-check role-switcher-check" />
                      )}
                    </button>
                  );
                })}
                <div className="role-switcher-dropdown-divider" />
                <button
                  type="button"
                  className="role-switcher-item"
                  onClick={() => {
                    logout();
                    setSwitcherOpen(false);
                  }}
                >
                  <span
                    className="bi bi-box-arrow-right role-switcher-dot"
                    style={{ backgroundColor: "#c62828" }}
                  />
                  <span style={{ color: "#c62828" }}>Đăng xuất</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* User name */}
        {user?.name && (
          <span
            className="app-header-user"
            title={user.email}
          >
            <span className="bi bi-person-fill" />
            {user.name}
          </span>
        )}
      </div>
    </header>
  );
}
