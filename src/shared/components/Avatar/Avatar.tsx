"use client";

import {
  Avatar as MuiAvatar,
  AvatarProps as MuiAvatarProps,
} from "@mui/material";
import { User } from "lucide-react";

export interface AvatarComponentProps extends Omit<MuiAvatarProps, "src"> {
  src?: string | null;
  fallback?: React.ReactNode;
}

const getInitials = (name: string): string => {
  const parts = name.split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

export function Avatar({
  src,
  alt,
  fallback,
  children,
  sx,
  ...props
}: AvatarComponentProps) {
  const renderFallback = () => {
    if (fallback) return fallback;
    if (children) return children;
    if (alt) return getInitials(alt);
    return <User size={20} />;
  };

  return (
    <MuiAvatar
      src={src || undefined}
      alt={alt}
      sx={{
        bgcolor: !src ? "primary.main" : undefined,
        ...sx,
      }}
      {...props}
    >
      {renderFallback()}
    </MuiAvatar>
  );
}
