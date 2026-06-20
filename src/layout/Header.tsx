// ============================================================
// HEADER COMPONENT — Using AntD components
// ============================================================
"use client";

import { useState } from "react";
import { Breadcrumb, Dropdown, Avatar, Tag, type MenuProps } from "antd";
import {
  UserOutlined,
  SwapOutlined,
  CheckOutlined,
} from "@ant-design/icons";
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
  [ROLE.ADMIN]: "#ef4444",
  [ROLE.SECRETARY]: "#3b82f6",
  [ROLE.TEACHER]: "#22c55e",
  [ROLE.STUDENT]: "#a855f7",
};

export function Header() {
  const { role, setRole } = usePermissionContext();

  const currentRoleLabel = role ? ROLE_LABELS[role] : "Không xác định";
  const currentRoleColor = role ? ROLE_COLORS[role] : "#999";

  const roleSwitcherItems: MenuProps["items"] = [
    {
      key: "title",
      label: (
        <div style={{ fontWeight: 600, color: "#6b7280", fontSize: 12 }}>
          CHUYỂN VAI TRÒ (FE TESTING)
        </div>
      ),
      disabled: true,
    },
    { type: "divider" },
    ...ALL_ROLES.map((r) => ({
      key: r,
      icon: r === role ? <CheckOutlined /> : null,
      label: r === role ? (
        <span style={{ fontWeight: 600 }}>{ROLE_LABELS[r]}</span>
      ) : (
        ROLE_LABELS[r]
      ),
      onClick: () => setRole(r),
    })),
  ];

  return (
    <header
      style={{
        height: 64,
        background: "#f8fafc",
        borderBottom: "1px solid #e2e8f0",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <Breadcrumb
          items={[
            { title: "QNQ" },
            { title: "Hệ Thống Quản Lý Đồ Án Sinh Viên" },
          ]}
        />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {/* Role Switcher */}
        <Dropdown
          menu={{ items: roleSwitcherItems }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 12px",
              borderRadius: 6,
              cursor: "pointer",
              background: "#fff",
              border: "1px solid #e2e8f0",
              transition: "all 0.2s",
            }}
          >
            <Tag
              color={currentRoleColor}
              style={{ margin: 0, fontWeight: 500 }}
            >
              {currentRoleLabel}
            </Tag>
            <SwapOutlined style={{ fontSize: 12, color: "#64748b" }} />
          </div>
        </Dropdown>

        {/* User Avatar */}
        <Avatar
          style={{ background: "#1e3a5f", cursor: "pointer" }}
          icon={<UserOutlined />}
        />
      </div>
    </header>
  );
}
