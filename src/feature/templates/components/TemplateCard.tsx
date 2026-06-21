"use client";

import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  IconButton,
  Tooltip,
  Divider,
  Button,
} from "@mui/material";
import {
  Download as DownloadIcon,
  Visibility as ViewIcon,
  Description as FileIcon,
  FolderOpen as FolderIcon,
  CheckCircle as CheckIcon,
  SwapHoriz as SwapIcon,
  Schedule as ClockIcon,
  Group as TeamIcon,
  Security as SafetyIcon,
  EmojiEvents as TrophyIcon,
  Assignment as SolutionIcon,
  Edit as EditIcon,
  CalendarMonth as CalendarIcon,
} from "@mui/icons-material";
import type { TemplateItem, CategoryType, StageType } from "../types";
import { categoryConfig, stageConfig } from "../types";

const iconMap: Record<string, React.ReactNode> = {
  folder: <FolderIcon />,
  check: <CheckIcon />,
  swap: <SwapIcon />,
  clock: <ClockIcon />,
  team: <TeamIcon />,
  safety: <SafetyIcon />,
  trophy: <TrophyIcon />,
  solution: <SolutionIcon />,
  calendar: <CalendarIcon />,
  edit: <EditIcon />,
  file: <FileIcon />,
};

interface TemplateCardProps {
  template: TemplateItem;
  onView?: (template: TemplateItem) => void;
  onDownload?: (template: TemplateItem, lang: "vi" | "en") => void;
}

export function TemplateCard({ template, onView, onDownload }: TemplateCardProps) {
  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 2,
        border: `1px solid ${template.color}30`,
        transition: "all 0.2s",
        "&:hover": {
          boxShadow: `0 4px 12px ${template.color}20`,
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardContent sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 1.5,
              background: `${template.color}15`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: template.color,
              fontSize: 22,
            }}
          >
            {iconMap[template.icon] || <FileIcon />}
          </Box>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Chip
              label={categoryConfig[template.category].label}
              color={categoryConfig[template.category].color as any}
              size="small"
              sx={{ height: 22 }}
            />
            <Chip
              label={template.fileType.toUpperCase()}
              size="small"
              variant="outlined"
              sx={{ height: 22, fontSize: 10 }}
            />
          </Stack>
        </Box>

        {/* Code */}
        <Typography variant="caption" color="text.secondary">
          {template.code}
        </Typography>

        {/* Title */}
        <Typography variant="h6" sx={{ fontSize: 15, fontWeight: 600, my: 0.5 }}>
          {template.name}
        </Typography>

        {/* Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            flex: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            mb: 2,
          }}
        >
          {template.description}
        </Typography>

        <Divider sx={{ my: 1.5 }} />

        {/* Actions */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="Xem chi tiết">
              <IconButton size="small" onClick={() => onView?.(template)}>
                <ViewIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={() => onDownload?.(template, "vi")}
              sx={{
                background: template.color,
                fontSize: 12,
                "&:hover": { opacity: 0.9 },
              }}
            >
              VN
            </Button>
            <Button
              size="small"
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={() => onDownload?.(template, "en")}
              sx={{ fontSize: 12 }}
            >
              EN
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}
