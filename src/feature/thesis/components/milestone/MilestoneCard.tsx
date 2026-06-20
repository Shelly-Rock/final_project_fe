"use client";

import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Button,
  Box,
  LinearProgress,
  Stack,
  Divider,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  AccessTime as DeadlineIcon,
  AttachFile as AttachmentIcon,
  MoreVert as MoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { StatusBadge } from "@/feature/thesis/components/registration/RegistrationStatusBadge";
import type { Milestone } from "@/feature/thesis/types";

interface MilestoneCardProps {
  milestone: Milestone;
  index: number;
  onEdit?: (milestone: Milestone) => void;
  onDelete?: (milestone: Milestone) => void;
  onApprove?: (milestone: Milestone) => void;
  onRequestRevision?: (milestone: Milestone) => void;
}

export function MilestoneCard({
  milestone,
  index,
  onEdit,
  onDelete,
  onApprove,
  onRequestRevision,
}: MilestoneCardProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isOverdue =
    new Date(milestone.deadline) < new Date() &&
    milestone.status !== "completed" &&
    milestone.status !== "approved";

  const getProgressValue = (): number => {
    switch (milestone.status) {
      case "not_started":
        return 0;
      case "in_progress":
        return 30;
      case "submitted":
        return 70;
      case "approved":
      case "completed":
        return 100;
      default:
        return 0;
    }
  };

  return (
    <Card
      sx={{
        position: "relative",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: 2,
        },
      }}
    >
      {/* Status indicator */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          bgcolor:
            milestone.status === "completed" || milestone.status === "approved"
              ? "success.main"
              : milestone.status === "overdue"
                ? "error.main"
                : milestone.status === "in_progress"
                  ? "info.main"
                  : "grey.300",
        }}
      />

      <CardContent sx={{ pt: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Chip label={`Bước ${index + 1}`} size="small" variant="outlined" />
          <StatusBadge status={milestone.status} />
        </Box>

        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
          {milestone.name}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {milestone.description}
        </Typography>

        <Stack spacing={1}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <DeadlineIcon
              fontSize="small"
              sx={{ color: isOverdue ? "error.main" : "text.secondary" }}
            />
            <Typography
              variant="body2"
              sx={{ color: isOverdue ? "error.main" : "text.secondary" }}
            >
              Hạn: {milestone.deadline}
              {isOverdue && " (Quá hạn)"}
            </Typography>
          </Box>

          {milestone.attachments && milestone.attachments.length > 0 && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AttachmentIcon fontSize="small" sx={{ color: "text.secondary" }} />
              <Typography variant="body2" color="text.secondary">
                {milestone.attachments.length} file đính kèm
              </Typography>
            </Box>
          )}

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Trọng số:
            </Typography>
            <Chip label={`${milestone.weight}%`} size="small" />
          </Box>
        </Stack>

        {/* Progress bar */}
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              Tiến độ
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {getProgressValue()}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={getProgressValue()}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: "grey.200",
              "& .MuiLinearProgress-bar": {
                bgcolor:
                  milestone.status === "completed" || milestone.status === "approved"
                    ? "success.main"
                    : milestone.status === "overdue"
                      ? "error.main"
                      : "primary.main",
              },
            }}
          />
        </Box>

        {milestone.revisionNote && (
          <Box
            sx={{
              mt: 2,
              p: 1.5,
              bgcolor: "warning.light",
              borderRadius: 1,
            }}
          >
            <Typography variant="caption" color="warning.dark" fontWeight={500}>
              Yêu cầu chỉnh sửa:
            </Typography>
            <Typography variant="body2" color="warning.dark">
              {milestone.revisionNote}
            </Typography>
          </Box>
        )}
      </CardContent>

      <Divider />

      <CardActions sx={{ justifyContent: "flex-end", px: 2 }}>
        {milestone.status === "submitted" && (
          <>
            <Button
              size="small"
              variant="outlined"
              color="warning"
              onClick={() => onRequestRevision?.(milestone)}
            >
              Yêu cầu sửa
            </Button>
            <Button
              size="small"
              variant="contained"
              color="success"
              onClick={() => onApprove?.(milestone)}
            >
              Duyệt
            </Button>
          </>
        )}
        <IconButton size="small" onClick={handleClick}>
          <MoreIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          <MenuItem
            onClick={() => {
              handleClose();
              onEdit?.(milestone);
            }}
          >
            <EditIcon fontSize="small" sx={{ mr: 1 }} />
            Chỉnh sửa
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleClose();
              onDelete?.(milestone);
            }}
          >
            <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
            Xóa
          </MenuItem>
        </Menu>
      </CardActions>
    </Card>
  );
}

import React from "react";
