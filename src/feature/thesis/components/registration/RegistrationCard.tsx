"use client";

import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Button,
  Box,
  Avatar,
  Stack,
  Divider,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  BookmarkAdd as RegisterIcon,
  MoreVert as MoreIcon,
  CheckCircle as ApprovedIcon,
  Cancel as RejectedIcon,
  Pause as PausedIcon,
  Flag as CompletedIcon,
} from "@mui/icons-material";
import { RegistrationStatusBadge } from "./RegistrationStatusBadge";
import type { ThesisRegistration } from "@/feature/thesis/types";

interface RegistrationCardProps {
  registration: ThesisRegistration;
  variant?: "default" | "compact";
  onRegister?: (registration: ThesisRegistration) => void;
  onView?: (registration: ThesisRegistration) => void;
  onApprove?: (registration: ThesisRegistration) => void;
  onReject?: (registration: ThesisRegistration) => void;
}

export function RegistrationCard({
  registration,
  variant = "default",
  onRegister,
  onView,
  onApprove,
  onReject,
}: RegistrationCardProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (variant === "compact") {
    return (
      <Card
        sx={{
          display: "flex",
          alignItems: "center",
          p: 1,
          gap: 2,
        }}
      >
        <Avatar sx={{ bgcolor: "primary.main" }}>
          {registration.studentName.charAt(0)}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" fontWeight={500}>
            {registration.studentName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {registration.studentMssv}
          </Typography>
        </Box>
        <RegistrationStatusBadge status={registration.status} />
      </Card>
    );
  }

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Chip
            label={registration.studentMssv}
            size="small"
            variant="outlined"
          />
          <RegistrationStatusBadge status={registration.status} />
        </Box>

        <Typography
          variant="h6"
          sx={{
            mb: 1,
            fontWeight: 600,
            fontSize: "1rem",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {registration.topicName}
        </Typography>

        <Stack spacing={1} sx={{ mt: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>GV</Avatar>
            <Typography variant="body2" color="text.secondary">
              {registration.supervisorName}
            </Typography>
          </Box>

          <Typography variant="caption" color="text.secondary">
            Đăng ký: {registration.registeredAt}
          </Typography>

          {registration.confirmedAt && (
            <Typography variant="caption" color="text.secondary">
              Xác nhận: {registration.confirmedAt}
            </Typography>
          )}

          {registration.rejectionReason && (
            <Box
              sx={{
                mt: 1,
                p: 1,
                bgcolor: "error.light",
                borderRadius: 1,
              }}
            >
              <Typography variant="caption" color="error.dark">
                Lý do từ chối: {registration.rejectionReason}
              </Typography>
            </Box>
          )}

          {registration.note && (
            <Typography variant="caption" color="text.secondary" sx={{ fontStyle: "italic" }}>
              Ghi chú: {registration.note}
            </Typography>
          )}
        </Stack>
      </CardContent>

      <Divider />

      <CardActions sx={{ justifyContent: "space-between", px: 2 }}>
        {registration.status === "pending_supervisor" ? (
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="contained"
              color="success"
              startIcon={<ApprovedIcon />}
              onClick={(e) => {
                e.stopPropagation();
                onApprove?.(registration);
              }}
            >
              Xác nhận
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="error"
              startIcon={<RejectedIcon />}
              onClick={(e) => {
                e.stopPropagation();
                onReject?.(registration);
              }}
            >
              Từ chối
            </Button>
          </Stack>
        ) : (
          <Button
            size="small"
            variant="outlined"
            onClick={() => onView?.(registration)}
          >
            Xem chi tiết
          </Button>
        )}

        <IconButton size="small" onClick={handleClick}>
          <MoreIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          <MenuItem
            onClick={() => {
              handleClose();
              onView?.(registration);
            }}
          >
            Xem chi tiết
          </MenuItem>
          <MenuItem onClick={handleClose}>Gửi tin nhắn</MenuItem>
          <MenuItem onClick={handleClose}>Xuất hồ sơ</MenuItem>
        </Menu>
      </CardActions>
    </Card>
  );
}

// Need to import React for useState
import React from "react";
