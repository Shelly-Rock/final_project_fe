"use client";

import type { ReactNode } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Chip,
  Stack,
  IconButton,
  Button,
  Divider,
} from "@mui/material";
import {
  Close as CloseIcon,
  Download as DownloadIcon,
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
import type { TemplateItem } from "../types";
import { categoryConfig, stageConfig } from "../types";

const iconMap: Record<string, ReactNode> = {
  folder: <FolderIcon sx={{ fontSize: 32 }} />,
  check: <CheckIcon sx={{ fontSize: 32 }} />,
  swap: <SwapIcon sx={{ fontSize: 32 }} />,
  clock: <ClockIcon sx={{ fontSize: 32 }} />,
  team: <TeamIcon sx={{ fontSize: 32 }} />,
  safety: <SafetyIcon sx={{ fontSize: 32 }} />,
  trophy: <TrophyIcon sx={{ fontSize: 32 }} />,
  solution: <SolutionIcon sx={{ fontSize: 32 }} />,
  calendar: <CalendarIcon sx={{ fontSize: 32 }} />,
  edit: <EditIcon sx={{ fontSize: 32 }} />,
  file: <FileIcon sx={{ fontSize: 32 }} />,
};

interface TemplatePreviewModalProps {
  open: boolean;
  template: TemplateItem | null;
  onClose: () => void;
  onDownload?: (template: TemplateItem, lang: "vi" | "en") => void;
}

export function TemplatePreviewModal({
  open,
  template,
  onClose,
  onDownload,
}: TemplatePreviewModalProps) {
  if (!template) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" component="span">
          Xem trước biểu mẫu
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {/* Template Card Preview */}
        <Box
          sx={{
            p: 3,
            borderRadius: 2,
            border: `2px solid ${template.color}30`,
            background: `${template.color}08`,
            mb: 3,
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: 2,
                background: `${template.color}15`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: template.color,
              }}
            >
              {iconMap[template.icon] || <FileIcon sx={{ fontSize: 32 }} />}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {template.code}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {template.name}
              </Typography>
            </Box>
          </Stack>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {template.description}
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              label={categoryConfig[template.category].label}
              color={categoryConfig[template.category].color}
              size="small"
            />
            <Chip
              label={stageConfig[template.stage].label}
              color={stageConfig[template.stage].color}
              size="small"
            />
            <Chip
              label={template.fileType.toUpperCase()}
              size="small"
              variant="outlined"
            />
          </Stack>
        </Box>

        {/* Template Details */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Chi tiết biểu mẫu
          </Typography>
          <Stack spacing={1}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2" color="text.secondary">
                Mã biểu mẫu
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                {template.code}
              </Typography>
            </Box>
            <Divider />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2" color="text.secondary">
                Giai đoạn
              </Typography>
              <Chip
                label={stageConfig[template.stage].label}
                color={stageConfig[template.stage].color}
                size="small"
              />
            </Box>
            <Divider />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Dành cho vai trò
              </Typography>
              <Stack direction="row" spacing={0.5}>
                {template.forRoles.map((role) => (
                  <Chip
                    key={role}
                    label={categoryConfig[role].label}
                    color={categoryConfig[role].color}
                    size="small"
                  />
                ))}
              </Stack>
            </Box>
            <Divider />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2" color="text.secondary">
                Định dạng file
              </Typography>
              <Typography variant="body2">
                {template.fileType.toUpperCase()}
              </Typography>
            </Box>
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Đóng</Button>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={() => onDownload?.(template, "en")}
        >
          Tải EN
        </Button>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={() => onDownload?.(template, "vi")}
          sx={{ background: template.color }}
        >
          Tải VN
        </Button>
      </DialogActions>
    </Dialog>
  );
}
