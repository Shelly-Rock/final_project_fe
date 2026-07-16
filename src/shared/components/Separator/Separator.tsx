"use client";

import {
  Divider as MuiDivider,
  DividerProps as MuiDividerProps,
} from "@mui/material";

export interface SeparatorProps extends Omit<MuiDividerProps, "component"> {
  label?: string;
  orientation?: "horizontal" | "vertical";
}

export function Separator({
  label,
  orientation = "horizontal",
  sx,
  ...props
}: SeparatorProps) {
  if (label) {
    return (
      <MuiDivider
        {...props}
        sx={{
          ...sx,
          "&::before, &::after": {
            borderColor: "divider",
          },
          "& .MuiDivider-wrapper": {
            px: 2,
          },
        }}
      >
        {label}
      </MuiDivider>
    );
  }

  return <MuiDivider orientation={orientation} sx={sx} {...props} />;
}
