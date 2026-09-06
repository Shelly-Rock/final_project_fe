"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  MenuItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Box,
  Chip,
  Button,
} from "@mui/material";
import { Check, Shield, ChevronDown } from "lucide-react";
import { ROLE_LABELS, ROLE_COLORS, type Role } from "@/core/permissions/types";
import { authService } from "@/core/auth/auth.service";
import { usePermissionContext } from "@/core/providers/PermissionProvider";

export function RoleSwitcher({ onClose }: { onClose?: () => void }) {
  const { data: session, update } = useSession();
  const router = useRouter();
  const { setRole } = usePermissionContext();
  const [switching, setSwitching] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const currentRole = session?.user?.role;
  const availableRoles = session?.user?.roles ?? [];

  const handleSwitchRole = async (targetRole: Role) => {
    if (targetRole === currentRole || switching) return;

    setSwitching(true);
    try {
      const roleNameMap: Record<Role, string> = {
        admin: "ADMIN",
        secretary: "SECRETARY",
        teacher: "TEACHER",
        student: "STUDENT",
      };

      const result = await authService.switchRole(roleNameMap[targetRole]);

      await update({
        ...session,
        user: {
          ...session?.user,
          role: targetRole,
        },
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });

      setRole(targetRole);
      onClose?.();
      router.push("/");
    } catch (error) {
      console.error("Failed to switch role:", error);
      alert("Không thể chuyển role. Vui lòng thử lại.");
    } finally {
      setSwitching(false);
    }
  };

  if (availableRoles.length <= 1) {
    return null;
  }

  return (
    <Box sx={{ py: 1 }}>
      <Button
        onClick={() => setExpanded((prev) => !prev)}
        fullWidth
        size="small"
        sx={(theme) => ({
          justifyContent: "space-between",
          px: 2,
          py: 0.75,
          fontSize: "0.75rem",
          fontWeight: 600,
          letterSpacing: "0.02em",
          color: theme.palette.mode === "dark" ? "#ffff" : "text.secondary",
          "&:hover": {
            bgcolor: "action.hover",
          },
        })}
        endIcon={
          <ChevronDown
            size={14}
            style={{
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }}
          />
        }
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Shield size={14} />
          CHUYỂN ROLE
        </Box>
      </Button>

      {expanded &&
        availableRoles.map((role) => {
          const isActive = role === currentRole;
          const colors = ROLE_COLORS[role];

          return (
            <MenuItem
              key={role}
              onClick={() => {
                setExpanded(false);
                handleSwitchRole(role);
              }}
              disabled={switching || isActive}
              sx={{
                borderRadius: 1,
                mx: 1,
                my: 0.5,
                position: "relative",
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                {switching && !isActive ? (
                  <CircularProgress size={18} />
                ) : isActive ? (
                  <Check size={18} color={colors.color} />
                ) : (
                  <Shield size={18} style={{ opacity: 0.5 }} />
                )}
              </ListItemIcon>
              <ListItemText
                primary={ROLE_LABELS[role]}
                primaryTypographyProps={{
                  variant: "body2",
                  fontWeight: isActive ? 600 : 400,
                }}
              />
              {isActive && (
                <Chip
                  label="Hiện tại"
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: "0.65rem",
                    bgcolor: colors.bg,
                    color: colors.color,
                    border: `1px solid ${colors.border}`,
                  }}
                />
              )}
            </MenuItem>
          );
        })}
    </Box>
  );
}
