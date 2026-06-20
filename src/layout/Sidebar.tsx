// ============================================================
// SIDEBAR COMPONENT — Using AntD Menu
// ============================================================
"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState, useCallback, useEffect, useMemo } from "react";
import { Menu, Button, Avatar, Dropdown, type MenuProps } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  FileTextOutlined,
  SettingOutlined,
  BarChartOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BookOutlined,
  CalendarOutlined,
  CheckSquareOutlined,
  AuditOutlined,
  SolutionOutlined,
  PlusOutlined,
  FlagOutlined,
  TrophyOutlined,
  BellOutlined,
  ProjectOutlined,
  FileProtectOutlined,
  SafetyOutlined,
  HistoryOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { usePermissionContext } from "@/core/providers/PermissionProvider";
import { ROLE_LABELS } from "@/core/permissions/types";
import { getMenuSectionsForRole, type MenuItem } from "@/shared/constants/menus";

const ICON_MAP: Record<string, React.ReactNode> = {
  "bi-speedometer2": <DashboardOutlined />,
  "bi-house": <DashboardOutlined />,
  "bi-person": <UserOutlined />,
  "bi-people": <TeamOutlined />,
  "bi-file-earmark-text": <FileTextOutlined />,
  "bi-gear": <SettingOutlined />,
  "bi-bar-chart": <BarChartOutlined />,
  "bi-book": <BookOutlined />,
  "bi-calendar-event": <CalendarOutlined />,
  "bi-check-circle": <CheckSquareOutlined />,
  "bi-clipboard-check": <AuditOutlined />,
  "bi-journal-check": <SolutionOutlined />,
  "bi-calendar-plus": <PlusOutlined />,
  "bi-flag": <FlagOutlined />,
  "bi-trophy": <TrophyOutlined />,
  "bi-bell": <BellOutlined />,
  "bi-folder": <ProjectOutlined />,
  "bi-shield-check": <FileProtectOutlined />,
  "bi-safe": <SafetyOutlined />,
  "bi-clock-history": <HistoryOutlined />,
  "bi-currency-dollar": <DollarOutlined />,
};

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { role } = usePermissionContext();

  const menuSections = useMemo(() => {
    if (!role) return [];
    return getMenuSectionsForRole(role);
  }, [role]);

  const handleSignOut = useCallback(async () => {
    await signOut({ redirect: false, callbackUrl: "/login" });
    router.push("/login");
  }, [router]);

  const isActive = (path?: string) => {
    if (!path) return false;
    return pathname === path || pathname.startsWith(path + "/");
  };

  const buildMenuItems = (): MenuProps["items"] => {
    const items: MenuProps["items"] = [];
    
    menuSections.forEach((section) => {
      const menuItems: MenuProps["items"] = section.items.map((item) => {
        if (item.children && item.children.length > 0) {
          return {
            key: item.key,
            label: item.label,
            icon: ICON_MAP[item.icon || ""] || <FileTextOutlined />,
            children: item.children.map((child) => ({
              key: child.key,
              label: <Link href={child.path || "#"}>{child.label}</Link>,
              icon: ICON_MAP[child.icon || ""] || <FileTextOutlined />,
            })),
          };
        }
        return {
          key: item.key,
          label: <Link href={item.path || "#"}>{item.label}</Link>,
          icon: ICON_MAP[item.icon || ""] || <FileTextOutlined />,
        };
      });
      
      items.push({
        type: "divider",
        key: `section-${section.section}`,
        label: !collapsed ? section.section : undefined,
        style: { height: 24, margin: "12px 0", color: "#a8c5e2", fontSize: 12, fontWeight: 600 },
      } as any);
      items.push(...menuItems);
    });
    
    return items;
  };

  const selectedKeys = useMemo(() => {
    const keys: string[] = [];
    menuSections.forEach((section) => {
      section.items.forEach((item) => {
        if (isActive(item.path)) {
          keys.push(item.key);
        }
        if (item.children) {
          item.children.forEach((child) => {
            if (isActive(child.path)) {
              keys.push(child.key);
            }
          });
        }
      });
    });
    return keys;
  }, [pathname, menuSections]);

  const userMenuItems: MenuProps["items"] = [
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      danger: true,
    },
  ];

  const handleUserMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "logout") {
      handleSignOut();
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        background: "#1e3a5f",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.2s",
        width: collapsed ? 80 : 260,
      }}
    >
      {/* Brand */}
      <div
        style={{
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          padding: collapsed ? "0" : "0 16px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        {!collapsed && (
          <span style={{ fontWeight: 700, fontSize: 18, color: "#fff" }}>
            Thesis Manager
          </span>
        )}
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onToggle}
          style={{ fontSize: 16, color: "#fff" }}
        />
      </div>

      {/* Navigation */}
      <div style={{ flex: 1, overflow: "auto", padding: "8px 0" }}>
        <Menu
          mode="inline"
          selectedKeys={selectedKeys}
          inlineCollapsed={collapsed}
          style={{
            border: "none",
            background: "transparent",
            color: "#a8c5e2",
          }}
          items={buildMenuItems()}
          theme="dark"
        />
      </div>

      {/* User */}
      <div
        style={{
          padding: collapsed ? "12px 8px" : "12px 16px",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Dropdown
          menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
          placement="topRight"
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              cursor: "pointer",
              padding: "4px 8px",
              borderRadius: 6,
              transition: "background 0.2s",
            }}
          >
            <Avatar
              style={{ background: "#3b82f6", flexShrink: 0 }}
              icon={<UserOutlined />}
            />
            {!collapsed && (
              <div style={{ overflow: "hidden" }}>
                <div style={{ fontWeight: 500, fontSize: 14, color: "#fff", whiteSpace: "nowrap" }}>
                  Người dùng
                </div>
                <div style={{ fontSize: 12, color: "#a8c5e2", whiteSpace: "nowrap" }}>
                  {role ? ROLE_LABELS[role] : "Khách"}
                </div>
              </div>
            )}
          </div>
        </Dropdown>
      </div>
    </div>
  );
}
