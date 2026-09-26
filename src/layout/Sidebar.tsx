"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePermissionContext } from "@/core/providers/PermissionProvider";
import { getMenuSectionsForRole } from "@/shared/constants/menus";
import { useMediaQuery } from "@/shared/hooks";
import {
  buildDepartmentScopedPath,
  useDepartmentContext,
} from "@/shared/hooks/useDepartmentContext";
import { default as Logo } from "@/assets/image/png/logo.png";
import { default as LogoCollapsed } from "@/assets/image/png/logo02.png";
import Image from "next/image";
import { PanelLeftClose } from "lucide-react";

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({
  collapsed = false,
  onToggle,
  mobileOpen = false,
  onMobileClose,
}: SidebarProps) {
  const pathname = usePathname();
  const { role } = usePermissionContext();
  const { departmentId } = useDepartmentContext();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const menuSections = useMemo(() => {
    if (!role) return [];
    return getMenuSectionsForRole(role);
  }, [role]);

  const handleToggle = useCallback(() => {
    if (isDesktop) {
      onToggle?.();
    } else {
      onMobileClose?.();
    }
  }, [isDesktop, onToggle, onMobileClose]);

  const isActive = useCallback(
    (path?: string) => {
      if (!path) return false;
      return pathname === path || pathname.startsWith(path + "/");
    },
    [pathname],
  );

  const isSectionActive = useCallback(
    (paths: (string | undefined)[]) => paths.some((p) => isActive(p)),
    [isActive],
  );

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const initialOpenSections = useMemo(() => {
    const init: Record<string, boolean> = {};
    for (const section of menuSections) {
      if (isSectionActive(section.items.map((i) => i.path)))
        init[section.section] = true;
    }
    return init;
  }, [menuSections, isSectionActive]);

  useEffect(() => {
    setOpenSections((prev) => {
      const next = { ...prev };
      let changed = false;
      for (const key of Object.keys(initialOpenSections)) {
        if (!prev[key]) {
          next[key] = true;
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [initialOpenSections]);

  const toggleSection = useCallback((key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  return (
    <>
      {/* Sidebar */}
      <div
        className={`sidebar-wrapper ${collapsed ? "collapsed" : ""} ${mobileOpen && !isDesktop ? "mobile-open" : ""}`}
      >
        <div className={`sidebar ${collapsed ? "sidebar--collapsed" : ""}`}>
          {/* Brand */}
          <div className="sidebar-header flex items-center w-full">
            {collapsed ? (
              <button
                type="button"
                className="sidebar-brand"
                onClick={handleToggle}
                aria-label="Mở sidebar"
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                }}
              >
                <div className="sidebar-brand-logo-wrap flex items-center justify-center mx-auto">
                  <Image
                    src={LogoCollapsed}
                    alt="Logo"
                    width={55}
                    height={55}
                    className="sidebar-brand-logo object-contain"
                  />
                </div>
              </button>
            ) : (
              <Link
                href="/"
                className="sidebar-brand"
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div className="sidebar-brand-logo-wrap flex items-center justify-center mx-auto">
                  <Image
                    src={Logo}
                    alt="Logo"
                    className="sidebar-brand-logo object-contain object-center drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                    style={{
                      height: "50px",
                      width: "auto",
                      maxWidth: "100%",
                      margin: "0 auto",
                    }}
                    priority
                  />
                </div>
              </Link>
            )}

            {!collapsed && (
              <button
                type="button"
                className="sidebar-toggle-btn"
                onClick={handleToggle}
                aria-label="Thu gọn sidebar"
              >
                <PanelLeftClose size={16} />
              </button>
            )}
          </div>
          {/* Navigation */}
          <nav className="sidebar-nav" aria-label="Main navigation">
            {menuSections.map((section) => {
              const expanded = collapsed
                ? true
                : (openSections[section.section] ?? false);
              return (
                <div
                  key={section.section}
                  className={`sidebar-section ${expanded ? "sidebar-section--open" : "sidebar-section--collapsed"}`}
                >
                  {!collapsed ? (
                    <button
                      type="button"
                      className="sidebar-section-toggle"
                      onClick={() => toggleSection(section.section)}
                      aria-expanded={expanded}
                      aria-controls={`section-${section.section}`}
                    >
                      <span
                        className={`bi ${expanded ? "bi-chevron-up" : "bi-chevron-down"} sidebar-section-chevron`}
                        aria-hidden="true"
                      />
                      <span className="sidebar-section-title">
                        {section.section}
                      </span>
                    </button>
                  ) : null}
                  {(collapsed || expanded) && (
                    <ul
                      id={`section-${section.section}`}
                      className="sidebar-menu"
                    >
                      {section.items.map((item) => {
                        const href = buildDepartmentScopedPath(
                          item.path,
                          item.key,
                          departmentId,
                        );
                        return (
                          <li
                            key={item.key}
                            className={`sidebar-menu-item ${isActive(item.path) ? "active" : ""}`}
                          >
                            <Link
                              href={href}
                              className="sidebar-menu-link"
                              title={item.label}
                            >
                              <span
                                className={`sidebar-menu-icon bi ${item.icon || "bi-circle"}`}
                              />
                              {!collapsed && (
                                <span className="sidebar-menu-label">
                                  {item.label}
                                </span>
                              )}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}
