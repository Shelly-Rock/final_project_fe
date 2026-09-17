import { Box, Typography, SxProps, Theme } from "@mui/material";
import React from "react";

export interface TopicDetailBlockProps {
  label: string;
  content?: string | null;
  icon?: React.ReactNode;
  isHtml?: boolean;
  valueVariant?: "body1" | "body2";
  valueFontWeight?: number;
  sx?: SxProps<Theme>;
}

export function TopicDetailBlock({
  label,
  content,
  icon,
  isHtml = false,
  valueVariant = "body2",
  valueFontWeight,
  sx,
}: TopicDetailBlockProps) {
  if (!content) return null;

  return (
    <Box sx={sx}>
      {icon ? (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          {icon}
          <Typography variant="caption" color="text.secondary">
            {label}
          </Typography>
        </Box>
      ) : (
        <Typography
          variant="subtitle2"
          fontWeight={600}
          color="text.secondary"
          gutterBottom
        >
          {label}
        </Typography>
      )}

      {isHtml ? (
        <Typography
          variant={valueVariant}
          color="text.primary"
          sx={{ lineHeight: 1.7, fontWeight: valueFontWeight }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      ) : (
        <Typography
          variant={valueVariant}
          sx={{
            fontWeight: valueFontWeight,
            lineHeight: 1.6,
            whiteSpace: "pre-wrap",
          }}
        >
          {content}
        </Typography>
      )}
    </Box>
  );
}
