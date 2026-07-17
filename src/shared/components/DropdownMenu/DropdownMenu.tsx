"use client";

import { useState, useRef } from "react";
import {
  Box,
  Paper,
  Menu,
  MenuItem,
  MenuList,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import { ChevronRight } from "lucide-react";

export interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  danger?: boolean;
  onClick?: () => void;
  children?: DropdownItem[];
}

export interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  align?: "start" | "center" | "end";
}

export function DropdownMenu({
  trigger,
  items,
  controlledOpen,
  onOpenChange,
  align = "start",
}: DropdownMenuProps & { controlledOpen?: boolean }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [triggerElement, setTriggerElement] = useState<HTMLElement | null>(
    null,
  );
  const triggerRef = useRef<HTMLDivElement>(null);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : anchorEl !== null;

  const horizontalAlign =
    align === "end" ? "right" : align === "start" ? "left" : align;

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    if (isControlled) {
      onOpenChange?.(!open);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    if (!isControlled) {
      setAnchorEl(null);
    }
    onOpenChange?.(false);
    setActiveSubmenu(null);
  };

  const handleItemClick = (item: DropdownItem) => {
    if (item.children?.length) {
      setActiveSubmenu(activeSubmenu === item.id ? null : item.id);
    } else {
      item.onClick?.();
      if (!isControlled) {
        handleClose();
      }
    }
  };

  const renderMenuItem = (item: DropdownItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;

    return (
      <Box key={item.id}>
        <MenuItem
          onClick={() => handleItemClick(item)}
          disabled={item.disabled}
          sx={{
            minWidth: 160,
            position: "relative",
            bgcolor: item.danger ? "error.main" : "transparent",
            color: item.danger ? "error.contrastText" : "inherit",
            "&:hover": {
              bgcolor: "rgba(37, 99, 235, 0.08)",
            },
            "&.Mui-selected": {
              bgcolor: "rgba(37, 99, 235, 0.12)",
              "&:hover": {
                bgcolor: "rgba(37, 99, 235, 0.18)",
              },
            },
            py: 1,
          }}
        >
          {item.icon && (
            <ListItemIcon sx={{ minWidth: 32, mr: 1, color: "#2563eb" }}>
              {item.icon}
            </ListItemIcon>
          )}
          <ListItemText primary={item.label} sx={{ color: "#1e293b" }} />
          {hasChildren && <ChevronRight size={16} style={{ marginLeft: 8 }} />}
          {hasChildren && activeSubmenu === item.id && (
            <Paper
              elevation={8}
              sx={{
                position: "absolute",
                left: "100%",
                top: 0,
                ml: 0.5,
                minWidth: 160,
                zIndex: 10,
              }}
            >
              <MenuList>
                {item.children!.map((child) =>
                  renderMenuItem(child, depth + 1),
                )}
              </MenuList>
            </Paper>
          )}
        </MenuItem>
        {item.danger && <Divider />}
      </Box>
    );
  };

  const menuAnchorEl = isControlled ? triggerElement : anchorEl;

  const setTriggerRef: React.RefCallback<HTMLDivElement> = (node) => {
    triggerRef.current = node;
    setTriggerElement(node);
  };

  return (
    <>
      <Box
        ref={setTriggerRef}
        onClick={handleOpen}
        style={{ cursor: "pointer", display: "inline-flex" }}
      >
        {trigger}
      </Box>
      <Menu
        anchorEl={menuAnchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: horizontalAlign,
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: horizontalAlign,
        }}
        PaperProps={{
          sx: {
            minWidth: 180,
            borderRadius: 2,
            mt: 0.5,
          },
        }}
      >
        {items.map((item) => renderMenuItem(item))}
      </Menu>
    </>
  );
}
