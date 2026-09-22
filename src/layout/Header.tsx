"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
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
} from "@mui/material";
import { Menu as MenuIcon, LogOut as LogoutIcon, Settings } from "lucide-react";
import { RoleSwitcher } from "@/shared/components/RoleSwitcher";
import { NotificationBell } from "@/feature/notification";
import { usePermissionContext } from "@/core/providers/PermissionProvider";
import { useSidebarMenu } from "@/shared/hooks/useSidebarMenu";

const HeaderSlotContext = createContext<HTMLElement | null>(null);
const SetHeaderSlotContext = createContext<(el: HTMLElement | null) => void>(
  () => {},
);

export function HeaderSlotProvider({ children }: { children: ReactNode }) {
  const [slotEl, setSlotEl] = useState<HTMLElement | null>(null);
  return (
    <SetHeaderSlotContext.Provider value={setSlotEl}>
      <HeaderSlotContext.Provider value={slotEl}>
        {children}
      </HeaderSlotContext.Provider>
    </SetHeaderSlotContext.Provider>
  );
}

export function HeaderTools({ children }: { children: ReactNode }) {
  const slotEl = useContext(HeaderSlotContext);
  if (!slotEl) return null;
  return createPortal(children, slotEl);
}

export interface HeaderProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export function Header({ onMenuClick, showMenuButton = true }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const setSlotEl = useContext(SetHeaderSlotContext);
  const { role } = usePermissionContext();
  const { activeLabel } = useSidebarMenu();
  const pageTitle =
    activeLabel ??
    (pathname?.startsWith("/settings") ? "Hồ sơ & Cài đặt" : null);
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

  const handleLogout = async () => {
    handleUserMenuClose();
    await signOut({ redirect: false, callbackUrl: "/login" });
    router.push("/login");
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

        {pageTitle && (
          <Typography
            variant="h6"
            sx={{
              fontSize: 18,
              fontWeight: 700,
              color: "text.primary",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              mr: 2,
            }}
          >
            {pageTitle}
          </Typography>
        )}

        <Box
          ref={setSlotEl}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            flex: 1,
            minWidth: 0,
          }}
        />

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {role !== "admin" && <NotificationBell />}

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
                sx: (theme) => ({
                  minWidth: 200,
                  borderRadius: 2,
                  mt: 1,
                  ...(theme.palette.mode === "dark" && {
                    "& .MuiTypography-root": {
                      color: "#ffff",
                    },
                  }),
                }),
              }}
            >
              <MenuItem
                sx={{ borderRadius: 1, mx: 1, my: 0.5 }}
                onClick={() => {
                  handleUserMenuClose();
                  router.push("/settings");
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <Settings size={18} />
                </ListItemIcon>
                <Typography variant="body2">Hồ sơ & Cài đặt</Typography>
              </MenuItem>

              <Divider sx={{ my: 1 }} />
              <RoleSwitcher onClose={handleUserMenuClose} />

              <Divider sx={{ my: 1 }} />
              <MenuItem
                sx={{ borderRadius: 1, mx: 1, my: 0.5, color: "error.main" }}
                onClick={handleLogout}
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
