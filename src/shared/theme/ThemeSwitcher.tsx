"use client";

import { IconButton, Tooltip, Menu, MenuItem, Box, Typography, ListItemIcon } from "@mui/material";
import { Sun, Moon, Monitor, Check } from "lucide-react";
import { useState } from "react";
import { useTheme, ThemeMode } from "./ThemeProvider";

export interface ThemeSwitcherProps {
  variant?: "icon" | "menu";
  showLabel?: boolean;
  size?: "small" | "medium";
}

const themeModes: { value: ThemeMode; label: string; icon: React.ReactNode }[] = [
  { value: "light", label: "Sáng", icon: <Sun size={18} /> },
  { value: "dark", label: "Tối", icon: <Moon size={18} /> },
  { value: "system", label: "Hệ thống", icon: <Monitor size={18} /> },
];

export function ThemeSwitcher({
  variant = "icon",
  showLabel: _showLabel,
  size = "medium",
}: ThemeSwitcherProps) {
  const { mode, setMode } = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleModeSelect = (newMode: ThemeMode) => {
    setMode(newMode);
    handleMenuClose();
  };

  const currentIcon = mode === "dark" ? <Moon size={size === "small" ? 18 : 22} /> 
    : mode === "light" ? <Sun size={size === "small" ? 18 : 22} />
    : <Monitor size={size === "small" ? 18 : 22} />;

  if (variant === "menu") {
    return (
      <>
        <Box
          onClick={handleMenuOpen}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            p: 1.5,
            borderRadius: 2,
            cursor: "pointer",
            "&:hover": {
              bgcolor: "action.hover",
            },
          }}
        >
          {currentIcon}
          <Typography variant="body2">
            {mode === "dark" ? "Tối" : mode === "light" ? "Sáng" : "Hệ thống"}
          </Typography>
        </Box>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              minWidth: 180,
              borderRadius: 2,
              mt: 1,
            },
          }}
        >
          {themeModes.map((item) => (
            <MenuItem
              key={item.value}
              onClick={() => handleModeSelect(item.value)}
              selected={mode === item.value}
              sx={{
                borderRadius: 1,
                mx: 1,
                my: 0.5,
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
              <Typography variant="body2" sx={{ flex: 1 }}>{item.label}</Typography>
              {mode === item.value && <Check size={16} />}
            </MenuItem>
          ))}
        </Menu>
      </>
    );
  }

  return (
    <>
      <Tooltip title={mode === "dark" ? "Chế độ tối" : mode === "light" ? "Chế độ sáng" : "Theo hệ thống"}>
        <IconButton
          onClick={handleMenuOpen}
          size={size}
          sx={{
            color: "text.secondary",
            "&:hover": {
              color: "primary.main",
              bgcolor: "action.hover",
            },
          }}
        >
          {currentIcon}
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            minWidth: 160,
            borderRadius: 2,
            mt: 1,
          },
        }}
      >
        {themeModes.map((item) => (
          <MenuItem
            key={item.value}
            onClick={() => handleModeSelect(item.value)}
            selected={mode === item.value}
            sx={{
              borderRadius: 1,
              mx: 1,
              my: 0.5,
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
            <Typography variant="body2">{item.label}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
