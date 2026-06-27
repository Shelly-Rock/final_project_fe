// ============================================================
// HEADER COMPONENT — Role switcher & user info bar
// ============================================================
"use client";

import { useState } from "react";
import type { Role } from "@/core/permissions/types";
import { ROLE, ROLE_LABELS } from "@/core/permissions/types";
import { usePermissionContext } from "@/core/providers/PermissionProvider";

const ALL_ROLES: Role[] = [
  ROLE.ADMIN,
  ROLE.SECRETARY,
  ROLE.TEACHER,
  ROLE.STUDENT,
];

const ROLE_COLORS: Record<Role, string> = {
  [ROLE.ADMIN]: "#d32f2f",
  [ROLE.SECRETARY]: "#1976d2",
  [ROLE.TEACHER]: "#388e3c",
  [ROLE.STUDENT]: "#7b1fa2",
};

export function Header() {
  const { role, setRole } = usePermissionContext();
  const [switcherOpen, setSwitcherOpen] = useState(false);

  const currentRoleLabel = role ? ROLE_LABELS[role] : "Không xác định";
  const currentRoleColor = role ? ROLE_COLORS[role] : "#999";

  return (
    <header className="app-header">
      <div className="app-header-left">
        <span className="app-header-breadcrumb">
          Hệ Thống Quản Lý Đồ Án Sinh Viên
        </span>
      </div>

      <div className="app-header-right">
        {/* Role switcher */}
        <div className="role-switcher">
          <button
            type="button"
            className="role-switcher-btn"
            onClick={() => setSwitcherOpen((v) => !v)}
            title="Chuyển vai trò (FE testing)"
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
                  &nbsp;Chuyển vai trò (FE testing)
                </div>
                {ALL_ROLES.map((r) => {
                  const isActive = r === role;
                  return (
                    <button
                      key={r}
                      type="button"
                      className={`role-switcher-item ${isActive ? "active" : ""}`}
                      onClick={() => {
                        setRole(r);
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
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
