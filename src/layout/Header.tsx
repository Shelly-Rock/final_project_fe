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
} from "lucide-react";
import { ThemeSwitcher } from "@/shared/theme";

export interface HeaderProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export function Header({ onMenuClick, showMenuButton = true }: HeaderProps) {
  const router = useRouter();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [userAnchorEl, setUserAnchorEl] = useState<HTMLElement | null>(null);

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserAnchorEl(event.currentTarget);
    setUserMenuOpen(true);
  };

  const handleUserMenuClose = () => {
    setUserAnchorEl(null);
    setUserMenuOpen(false);
  };

  return (
    <AppBar
      elevation={0}
      sx={{
        bgcolor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
        color: "text.primary",
        position: "sticky",
        top: 0,
        zIndex: 10,
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

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ThemeSwitcher variant="icon" size="small" />

          <IconButton sx={{ color: "text.secondary" }}>
            <MuiBadge badgeContent={3} color="error">
              <Bell size={20} />
            </MuiBadge>
          </IconButton>

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
              <MenuItem
                sx={{ borderRadius: 1, mx: 1, my: 0.5 }}
                onClick={() => {
                  handleUserMenuClose();
                  router.push("/change-password");
                }}
              >
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
