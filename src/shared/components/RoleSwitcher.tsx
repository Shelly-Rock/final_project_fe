"use client";

import {
  Box,
  Typography,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
  Button,
  Tooltip,
} from "@mui/material";
import {
  SwapHoriz as SwitchIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  Badge as SecretaryIcon,
  School as TeacherIcon,
  PersonOutline as StudentIcon,
  Groups as CouncilIcon,
} from "@mui/icons-material";
import { useState, useCallback } from "react";
import { useAuthStore, DEMO_USERS } from "@/store";
import { ROLE, ROLE_LABELS, ROLE_COLORS, type Role } from "@/core/permissions/types";

const ROLES: Role[] = [
  ROLE.ADMIN,
  ROLE.SECRETARY,
  ROLE.TEACHER,
  ROLE.STUDENT,
  ROLE.COUNCIL,
];

const ROLE_ICONS: Record<Role, React.ReactElement> = {
  [ROLE.ADMIN]: <AdminIcon sx={{ fontSize: 18 }} />,
  [ROLE.SECRETARY]: <SecretaryIcon sx={{ fontSize: 18 }} />,
  [ROLE.TEACHER]: <TeacherIcon sx={{ fontSize: 18 }} />,
  [ROLE.STUDENT]: <StudentIcon sx={{ fontSize: 18 }} />,
  [ROLE.COUNCIL]: <CouncilIcon sx={{ fontSize: 18 }} />,
};

const MUI_COLORS: Record<Role, "error" | "info" | "success" | "secondary" | "warning"> = {
  [ROLE.ADMIN]: "error",
  [ROLE.SECRETARY]: "info",
  [ROLE.TEACHER]: "success",
  [ROLE.STUDENT]: "secondary",
  [ROLE.COUNCIL]: "warning",
};

interface RoleSwitcherProps {
  variant?: "chip" | "dropdown";
}

/**
 * RoleSwitcher — DEV TOOL
 * Allows switching between demo user roles to test different views.
 * Connected to `useAuthStore` (Zustand + localStorage).
 */
export function RoleSwitcher({ variant = "chip" }: RoleSwitcherProps) {
  const user = useAuthStore((s) => s.user);
  const switchRole = useAuthStore((s) => s.switchRole);
  const logout = useAuthStore((s) => s.logout);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleOpen = useCallback((e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleSwitch = useCallback(
    (role: Role) => {
      switchRole(role);
      handleClose();
    },
    [switchRole, handleClose],
  );

  const currentRole = user?.role ?? null;
  const currentColors = currentRole ? ROLE_COLORS[currentRole] : { bg: "#f0f0f0", color: "#666", border: "#e0e0e0" };

  // --- Chip variant: just shows current role ---
  if (variant === "chip") {
    return (
      <Tooltip title="Click để đổi vai trò (DEV)">
        <Chip
          icon={currentRole ? ROLE_ICONS[currentRole] : <PersonIcon />}
          label={currentRole ? ROLE_LABELS[currentRole] : "Chưa đăng nhập"}
          color={currentRole ? MUI_COLORS[currentRole] : "default"}
          size="small"
          onClick={handleOpen}
          sx={{ fontWeight: 700, cursor: "pointer" }}
        />
      </Tooltip>
    );
  }

  // --- Dropdown variant ---
  return (
    <Box>
      <Button
        id="role-switcher-button"
        aria-controls={open ? "role-switcher-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleOpen}
        sx={{
          textTransform: "none",
          gap: 1,
          px: 1.5,
          borderRadius: 2,
          bgcolor: currentColors.bg,
          color: currentColors.color,
          border: `1px solid ${currentColors.border}`,
          "&:hover": { bgcolor: currentColors.border },
        }}
        size="small"
      >
        {user?.name ? (
          <Avatar sx={{ width: 20, height: 20, fontSize: "0.6rem" }}>
            {user.name.split(" ").slice(-1)[0]}
          </Avatar>
        ) : (
          ROLE_ICONS[currentRole ?? ROLE.ADMIN]
        )}
        <Box sx={{ textAlign: "left", display: { xs: "none", sm: "block" } }}>
          <Typography variant="caption" sx={{ fontWeight: 700, lineHeight: 1.2, display: "block" }}>
            {user?.name ?? "Khách"}
          </Typography>
          <Typography variant="caption" sx={{ fontSize: "0.6rem", opacity: 0.8, lineHeight: 1 }}>
            {currentRole ? ROLE_LABELS[currentRole] : "Chưa đăng nhập"}
          </Typography>
        </Box>
        <SwitchIcon sx={{ fontSize: 14, ml: 0.5 }} />
      </Button>

      <Menu
        id="role-switcher-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ "aria-labelledby": "role-switcher-button" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{ sx: { minWidth: 240, mt: 0.5 } }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
            CHUYỂN VAI TRÒ (DEV)
          </Typography>
        </Box>
        <Divider />

        {ROLES.map((role) => {
          const colors = ROLE_COLORS[role];
          const isActive = role === currentRole;
          return (
            <MenuItem
              key={role}
              onClick={() => handleSwitch(role)}
              selected={isActive}
              sx={{
                py: 1,
                "&.Mui-selected": {
                  bgcolor: colors.bg,
                  "&:hover": { bgcolor: colors.border },
                },
              }}
            >
              <ListItemIcon sx={{ color: colors.color, minWidth: 36 }}>
                {ROLE_ICONS[role]}
              </ListItemIcon>
              <ListItemText>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: isActive ? 800 : 500, color: colors.color }}
                >
                  {ROLE_LABELS[role]}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {DEMO_USERS[role]?.email ?? ""}
                </Typography>
              </ListItemText>
              {isActive && (
                <Chip
                  label="ACTIVE"
                  size="small"
                  color="success"
                  sx={{ fontSize: "0.55rem", height: 16 }}
                />
              )}
            </MenuItem>
          );
        })}

        <Divider sx={{ mt: 0.5 }} />
        <MenuItem
          onClick={() => {
            logout();
            handleClose();
          }}
          sx={{ color: "error.main" }}
        >
          <ListItemIcon sx={{ color: "error.main", minWidth: 36 }}>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" color="error">Đăng xuất</Typography>
          </ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
}
