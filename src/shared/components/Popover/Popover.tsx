"use client";

import { useState } from "react";
import {
  Box,
  Paper,
  Popper as MuiPopper,
  ClickAwayListener,
  Fade,
} from "@mui/material";

export interface PopoverProps {
  content: React.ReactNode;
  trigger?: React.ReactNode;
  placement?:
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "top-start"
    | "top-end"
    | "bottom-start"
    | "bottom-end"
    | "left-start"
    | "left-end"
    | "right-start"
    | "right-end";
  triggerType?: "click" | "hover";
  disabled?: boolean;
  offset?: number;
}

export function Popover({
  trigger,
  content,
  placement = "bottom",
  triggerType = "click",
  disabled = false,
  offset = 8,
}: PopoverProps) {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleToggle = (event: React.MouseEvent<HTMLElement>) => {
    if (disabled) return;
    if (open) {
      setOpen(false);
      setAnchorEl(null);
    } else {
      setAnchorEl(event.currentTarget);
      setOpen(true);
    }
  };

  const handleMouseEnter = () => {
    if (triggerType === "hover" && !disabled) {
      setOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (triggerType === "hover" && !disabled) {
      setOpen(false);
      setAnchorEl(null);
    }
  };

  return (
    <>
      <Box
        onClick={triggerType === "click" ? handleToggle : undefined}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        sx={{ display: "inline-block" }}
      >
        {trigger}
      </Box>
      <MuiPopper
        open={open}
        anchorEl={anchorEl}
        placement={placement}
        transition
        sx={{ zIndex: 1300 }}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={200}>
            <Paper
              elevation={8}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              sx={{
                mt: offset / 8,
                borderRadius: 2,
                maxWidth: 400,
              }}
            >
              <Box sx={{ p: 2 }}>{content}</Box>
            </Paper>
          </Fade>
        )}
      </MuiPopper>
    </>
  );
}
