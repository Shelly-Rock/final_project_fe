"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Avatar,
  Box,
  Divider,
  Badge as MuiBadge,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Bell,
  User,
  LogOut as LogoutIcon,
  Settings,
  ChevronDown,
} from "lucide-react";
import { ThemeSwitcher } from "@/shared/theme";
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
  [ROLE.SECRETARY]: "#2563eb",
  [ROLE.TEACHER]: "#22c55e",
  [ROLE.STUDENT]: "#8b5cf6",
};

export interface HeaderProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export function Header({ onMenuClick, showMenuButton = true }: HeaderProps) {
  const { role, setRole } = usePermissionContext();
  const router = useRouter();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [roleAnchorEl, setRoleAnchorEl] = useState<HTMLElement | null>(null);
  const [userAnchorEl, setUserAnchorEl] = useState<HTMLElement | null>(null);

  const currentRoleLabel = role ? ROLE_LABELS[role] : "Không xác định";
  const currentRoleColor = role ? ROLE_COLORS[role] : "#999";

  const handleRoleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setRoleAnchorEl(event.currentTarget);
    setRoleMenuOpen(true);
  };

  const handleRoleMenuClose = () => {
    setRoleAnchorEl(null);
    setRoleMenuOpen(false);
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserAnchorEl(event.currentTarget);
    setUserMenuOpen(true);
  };

  const handleUserMenuClose = () => {
    setUserAnchorEl(null);
    setUserMenuOpen(false);
  };

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
    setRoleMenuOpen(false);
    router.push("/dashboard");
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
        color: "text.primary",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ minHeight: 64 }}>
        {showMenuButton && (
          <IconButton
            edge="start"
            onClick={onMenuClick}
            sx={{ mr: 2, color: "text.secondary" }}
          >
            <MenuIcon size={22} />
          </IconButton>
        )}

        <Typography
          variant="h6"
          noWrap
          sx={{
            fontWeight: 700,
            fontSize: "1.1rem",
            background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mr: 3,
          }}
        >
          QTQ - Hệ Thống Quản Lý Đồ Án
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ThemeSwitcher variant="icon" size="small" />

          <IconButton sx={{ color: "text.secondary" }}>
            <MuiBadge badgeContent={3} color="error">
              <Bell size={20} />
            </MuiBadge>
          </IconButton>

          <Box sx={{ position: "relative" }}>
            <Box
              onClick={handleRoleMenuOpen}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 1.5,
                py: 0.75,
                borderRadius: 2,
                cursor: "pointer",
                border: "1px solid",
                borderColor: "divider",
                "&:hover": {
                  bgcolor: "action.hover",
                },
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: currentRoleColor,
                }}
              />
              <Typography variant="body2" fontWeight={500}>
                {currentRoleLabel}
              </Typography>
              <ChevronDown size={16} />
            </Box>

            <Menu
              open={roleMenuOpen}
              onClose={handleRoleMenuClose}
              anchorEl={roleAnchorEl}
              PaperProps={{
                sx: { minWidth: 200, borderRadius: 2, mt: 1 },
              }}
            >
              <Box sx={{ px: 2, py: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Chuyển vai trò (FE testing)
                </Typography>
              </Box>
              <Divider />
              {ALL_ROLES.map((r) => (
                <MenuItem
                  key={r}
                  onClick={() => handleRoleChange(r)}
                  selected={r === role}
                  sx={{ borderRadius: 1, mx: 1, my: 0.5 }}
                >
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: ROLE_COLORS[r],
                      }}
                    />
                  </ListItemIcon>
                  <Typography variant="body2">{ROLE_LABELS[r]}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Box sx={{ position: "relative", ml: 1 }}>
            <Box
              onClick={handleUserMenuOpen}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 1,
                py: 0.5,
                borderRadius: 2,
                cursor: "pointer",
                "&:hover": {
                  bgcolor: "action.hover",
                },
              }}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main" }}>
                NV
              </Avatar>
            </Box>

            <Menu
              open={userMenuOpen}
              onClose={handleUserMenuClose}
              anchorEl={userAnchorEl}
              PaperProps={{
                sx: { minWidth: 180, borderRadius: 2, mt: 1 },
              }}
            >
              <MenuItem sx={{ borderRadius: 1, mx: 1, my: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <User size={18} />
                </ListItemIcon>
                <Typography variant="body2">Hồ sơ</Typography>
              </MenuItem>
              <MenuItem sx={{ borderRadius: 1, mx: 1, my: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <Settings size={18} />
                </ListItemIcon>
                <Typography variant="body2">Cài đặt</Typography>
              </MenuItem>
              <Divider />
              <MenuItem
                sx={{ borderRadius: 1, mx: 1, my: 0.5, color: "error.main" }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: "error.main" }}>
                  <LogoutIcon size={18} />
                </ListItemIcon>
                <Typography variant="body2">Đăng xuất</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
