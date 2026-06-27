"use client";

import {
  Box,
  Typography,
  Paper,
  Tooltip,
  IconButton,
  Divider,
  Avatar,
  Chip,
  Stack,
  Zoom,
} from "@mui/material";
import {
  Close as CloseIcon,
  ExpandLess as CollapseIcon,
  ExpandMore as ExpandIcon,
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
  [ROLE.ADMIN]: <AdminIcon />,
  [ROLE.SECRETARY]: <SecretaryIcon />,
  [ROLE.TEACHER]: <TeacherIcon />,
  [ROLE.STUDENT]: <StudentIcon />,
  [ROLE.COUNCIL]: <CouncilIcon />,
};

const MUI_COLORS: Record<Role, "error" | "info" | "success" | "secondary" | "warning"> = {
  [ROLE.ADMIN]: "error",
  [ROLE.SECRETARY]: "info",
  [ROLE.TEACHER]: "success",
  [ROLE.STUDENT]: "secondary",
  [ROLE.COUNCIL]: "warning",
};

/**
 * DemoPanel — FLOATING ROLE SWITCHER
 * Always visible in the bottom-right corner.
 * Allows instant demo of all 5 roles without a login page.
 */
export function DemoPanel() {
  const user = useAuthStore((s) => s.user);
  const switchRole = useAuthStore((s) => s.switchRole);
  const logout = useAuthStore((s) => s.logout);
  const [collapsed, setCollapsed] = useState(false);

  const currentRole = user?.role ?? null;

  const handleSwitch = useCallback(
    (role: Role) => {
      switchRole(role);
    },
    [switchRole],
  );

  if (collapsed) {
    return (
      <Tooltip title="Mở Demo Panel" placement="left">
        <Paper
          elevation={6}
          onClick={() => setCollapsed(false)}
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            width: 52,
            height: 52,
            borderRadius: "50%",
            bgcolor: "primary.main",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 9999,
            transition: "all 0.3s",
            "&:hover": { bgcolor: "primary.dark", transform: "scale(1.08)" },
          }}
        >
          <Avatar
            sx={{
              bgcolor: ROLE_COLORS[currentRole ?? ROLE.ADMIN].bg,
              color: ROLE_COLORS[currentRole ?? ROLE.ADMIN].color,
              width: 36,
              height: 36,
              fontSize: "0.8rem",
              fontWeight: 800,
            }}
          >
            {user?.name?.split(" ").slice(-1)[0] ?? "AD"}
          </Avatar>
        </Paper>
      </Tooltip>
    );
  }

  return (
    <Zoom in>
      <Paper
        elevation={8}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 280,
          borderRadius: 3,
          overflow: "hidden",
          zIndex: 9999,
          bgcolor: "background.paper",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            px: 2,
            py: 1.5,
            background: "linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                bgcolor: "rgba(255,255,255,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.7rem",
                fontWeight: 900,
              }}
            >
              DEMO
            </Box>
            <Box>
              <Typography variant="caption" sx={{ opacity: 0.8, display: "block", lineHeight: 1 }}>
                Chuyển vai trò
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 700, fontSize: "0.7rem", lineHeight: 1 }}>
                Role Switcher
              </Typography>
            </Box>
          </Box>
          <IconButton
            size="small"
            onClick={() => setCollapsed(true)}
            sx={{ color: "white", p: 0.5 }}
          >
            <CollapseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Current user */}
        {user && (
          <Box sx={{ px: 2, py: 1.5, bgcolor: "#f8fafc" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: ROLE_COLORS[user.role].bg,
                  color: ROLE_COLORS[user.role].color,
                  fontWeight: 800,
                  fontSize: "0.75rem",
                }}
              >
                {user.name?.split(" ").slice(-1)[0]}
              </Avatar>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                  {user.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user.email}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        <Divider />

        {/* Role buttons */}
        <Box sx={{ px: 1.5, py: 1 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ px: 0.5, fontWeight: 700, fontSize: "0.65rem", textTransform: "uppercase" }}
          >
            Chọn vai trò để demo
          </Typography>
          <Stack spacing={0.5} sx={{ mt: 0.5 }}>
            {ROLES.map((role) => {
              const colors = ROLE_COLORS[role];
              const isActive = role === currentRole;
              const demoUser = DEMO_USERS[role];
              return (
                <Box
                  key={role}
                  onClick={() => handleSwitch(role)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    px: 1.5,
                    py: 1,
                    borderRadius: 2,
                    cursor: "pointer",
                    bgcolor: isActive ? colors.bg : "transparent",
                    border: `1.5px solid ${isActive ? colors.color : "transparent"}`,
                    transition: "all 0.15s",
                    "&:hover": {
                      bgcolor: isActive ? colors.bg : `${colors.bg}80`,
                      transform: "translateX(2px)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      bgcolor: colors.bg,
                      color: colors.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      border: `1.5px solid ${colors.border}`,
                      "& svg": { fontSize: 14 },
                    }}
                  >
                    {ROLE_ICONS[role]}
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: isActive ? 800 : 500,
                        color: isActive ? colors.color : "text.primary",
                        lineHeight: 1.2,
                        fontSize: "0.8rem",
                      }}
                    >
                      {ROLE_LABELS[role]}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.65rem" }}>
                      {demoUser?.department ?? ""}
                    </Typography>
                  </Box>
                  {isActive && (
                    <Chip
                      label="ACTIVE"
                      size="small"
                      color="success"
                      sx={{ fontSize: "0.5rem", height: 16, px: 0.5, fontWeight: 800 }}
                    />
                  )}
                </Box>
              );
            })}
          </Stack>
        </Box>

        {/* Footer */}
        <Divider />
        <Box
          onClick={logout}
          sx={{
            px: 2,
            py: 1,
            display: "flex",
            alignItems: "center",
            gap: 1,
            cursor: "pointer",
            color: "text.secondary",
            "&:hover": { bgcolor: "#fee2e2", color: "error.main" },
            transition: "all 0.15s",
          }}
        >
          <Typography variant="caption" sx={{ fontSize: "0.7rem" }}>
            Đăng xuất khỏi demo
          </Typography>
        </Box>
      </Paper>
    </Zoom>
  );
}
