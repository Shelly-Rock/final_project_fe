"use client";

import { useState } from "react";
import { Box, Paper, Typography, Avatar } from "@mui/material";
import { User } from "lucide-react";

export interface HoverCardContent {
  title?: string;
  description?: string;
  image?: string;
  footer?: React.ReactNode;
}

export interface HoverCardProps {
  trigger: React.ReactNode;
  content: HoverCardContent;
  placement?: "top" | "bottom" | "left" | "right";
  delay?: { open: number; close: number };
  width?: number | string;
}

export function HoverCard({
  trigger,
  content,
  placement = "top",
  delay = { open: 200, close: 150 },
  width = 300,
}: HoverCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutId) clearTimeout(timeoutId);
    const id = setTimeout(() => setIsOpen(true), delay.open);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) clearTimeout(timeoutId);
    const id = setTimeout(() => setIsOpen(false), delay.close);
    setTimeoutId(id);
  };

  const placementStyles = {
    top: {
      bottom: "100%",
      mb: 1,
    },
    bottom: {
      top: "100%",
      mt: 1,
    },
    left: {
      right: "100%",
      mr: 1,
    },
    right: {
      left: "100%",
      ml: 1,
    },
  };

  return (
    <Box
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{ position: "relative", display: "inline-block" }}
    >
      {trigger}
      {isOpen && (
        <Paper
          elevation={8}
          sx={{
            position: "absolute",
            ...placementStyles[placement],
            left: placement === "left" || placement === "right" ? undefined : 0,
            right: placement === "right" ? undefined : "auto",
            width,
            zIndex: 1000,
            overflow: "hidden",
            borderRadius: 2,
          }}
        >
          {content.image && (
            <Box
              sx={{
                height: 120,
                backgroundImage: `url(${content.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          )}
          <Box sx={{ p: 2 }}>
            {content.title && (
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.5 }}>
                {content.title}
              </Typography>
            )}
            {content.description && (
              <Typography variant="body2" color="text.secondary">
                {content.description}
              </Typography>
            )}
            {content.footer && (
              <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: "divider" }}>
                {content.footer}
              </Box>
            )}
          </Box>
        </Paper>
      )}
    </Box>
  );
}

export interface HoverCardUserProps {
  trigger: React.ReactNode;
  user: {
    name: string;
    email: string;
    role?: string;
    avatar?: string;
  };
  placement?: "top" | "bottom" | "left" | "right";
}

export function HoverCardUser({
  trigger,
  user,
  placement = "top",
}: HoverCardUserProps) {
  return (
    <HoverCard
      trigger={trigger}
      placement={placement}
      content={{
        image: undefined,
        title: user.name,
        description: user.email,
        footer: user.role ? (
          <Typography variant="caption" color="primary">
            {user.role}
          </Typography>
        ) : undefined,
      }}
    />
  );
}
