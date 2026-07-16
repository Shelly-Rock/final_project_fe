"use client";

import { useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer,
  Typography,
  Collapse,
} from "@mui/material";
import { ChevronRight, ChevronDown } from "lucide-react";
import { useTheme } from "@/shared/theme";

export interface SidebarMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  children?: SidebarMenuItem[];
  badge?: string | number;
  disabled?: boolean;
}

export interface SidebarProps {
  items: SidebarMenuItem[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  variant?: "permanent" | "temporary";
  width?: number | string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  defaultActiveId?: string;
}

export function Sidebar({
  items,
  open: controlledOpen,
  onOpenChange,
  variant = "permanent",
  width = 260,
  header,
  footer,
  defaultActiveId,
}: SidebarProps) {
  const { resolvedMode } = useTheme();
  const isDark = resolvedMode === "dark";

  const [internalOpen, setInternalOpen] = useState(true);
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string | undefined>(defaultActiveId);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const handleToggle = () => {
    if (isControlled) {
      onOpenChange?.(!open);
    } else {
      setInternalOpen(!open);
    }
  };

  const handleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleSelect = (item: SidebarMenuItem) => {
    if (item.children?.length) {
      handleExpand(item.id);
    }
    setActiveId(item.id);
  };

  const renderMenuItem = (item: SidebarMenuItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedIds.includes(item.id);
    const isActive = activeId === item.id;

    return (
      <Box key={item.id}>
        <ListItem disablePadding sx={{ display: "block" }}>
          <ListItemButton
            onClick={() => handleSelect(item)}
            disabled={item.disabled}
            sx={{
              pl: 2 + depth * 2,
              py: 1,
              minHeight: 44,
              mx: 1,
              borderRadius: 1.5,
              mb: 0.5,
              bgcolor: isActive
                ? isDark
                  ? "#1e40af"
                  : "#dbeafe"
                : "transparent",
              color: isActive
                ? isDark
                  ? "#93c5fd"
                  : "#2563eb"
                : isDark
                  ? "#cbd5e1"
                  : "#334155",
              "&:hover": {
                bgcolor: isActive
                  ? isDark
                    ? "#1e40af"
                    : "#dbeafe"
                  : isDark
                    ? "#334155"
                    : "#f1f5f9",
              },
              "& .MuiListItemIcon-root": {
                color: isActive
                  ? isDark
                    ? "#93c5fd"
                    : "#2563eb"
                  : isDark
                    ? "#94a3b8"
                    : "#64748b",
              },
            }}
          >
            {item.icon && (
              <ListItemIcon sx={{ minWidth: 36, mr: 1 }}>
                {item.icon}
              </ListItemIcon>
            )}
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontSize: 14,
                fontWeight: isActive ? 600 : 500,
              }}
            />
            {item.badge && (
              <Box
                sx={{
                  ml: 1,
                  px: 1,
                  py: 0.25,
                  bgcolor: isDark ? "#475569" : "#e2e8f0",
                  color: isDark ? "#f1f5f9" : "#475569",
                  borderRadius: 10,
                  fontSize: 11,
                  fontWeight: 600,
                }}
              >
                {item.badge}
              </Box>
            )}
            {hasChildren && (
              <Box sx={{ ml: "auto", display: "flex", alignItems: "center" }}>
                {isExpanded ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </Box>
            )}
          </ListItemButton>
        </ListItem>
        {hasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children?.map((child) => renderMenuItem(child, depth + 1))}
            </List>
          </Collapse>
        )}
      </Box>
    );
  };

  const sidebarContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width,
        bgcolor: isDark ? "#1e293b" : "#ffffff",
        borderRight: "1px solid",
        borderColor: isDark ? "#334155" : "#e2e8f0",
      }}
    >
      {header && (
        <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
          {header}
        </Box>
      )}
      <Box sx={{ flex: 1, overflow: "auto", py: 1 }}>
        <List component="nav" disablePadding>
          {items.map((item) => renderMenuItem(item))}
        </List>
      </Box>
      {footer && (
        <Box sx={{ p: 2, borderTop: "1px solid", borderColor: "divider" }}>
          {footer}
        </Box>
      )}
    </Box>
  );

  if (variant === "temporary") {
    return (
      <Drawer
        variant="temporary"
        open={open}
        onClose={handleToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          "& .MuiDrawer-paper": {
            width,
            boxSizing: "border-box",
            bgcolor: isDark ? "#1e293b" : "#ffffff",
            borderRight: "1px solid",
            borderColor: isDark ? "#334155" : "#e2e8f0",
          },
        }}
      >
        {sidebarContent}
      </Drawer>
    );
  }

  return (
    <Box
      sx={{
        width,
        flexShrink: 0,
        height: "100vh",
        position: "sticky",
        top: 0,
        "& .MuiDrawer-paper": {
          width,
          boxSizing: "border-box",
          position: "relative",
          bgcolor: "transparent",
          borderRight: "none",
        },
      }}
    >
      {sidebarContent}
    </Box>
  );
}
