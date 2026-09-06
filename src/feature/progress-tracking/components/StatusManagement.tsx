"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  PlayArrow as ContinueIcon,
  Schedule as ExtendIcon,
  SwapHoriz as ChangeTopicIcon,
  Warning as WarningIcon,
  CheckCircle as ApproveIcon,
} from "@mui/icons-material";
import { toast } from "sonner";
import { progressTrackingService } from "../services";
import type { StudentProgress, ProgressStatus } from "../types";

interface StatusManagementButtonProps {
  student: StudentProgress;
  onStatusUpdated?: (student: StudentProgress) => void;
  variant?: "button" | "menu";
}

const STATUS_LABELS: Record<ProgressStatus, string> = {
  ON_TRACK: "Tiến hành bình thường",
  EXTENDED: "Gia hạn",
  TOPIC_CHANGED: "Đổi đề tài",
  BANNED: "Cấm thi",
};

// ============================================================
// Status Update Button (Multiple options)
// ============================================================

export function StatusManagementButton({
  student,
  onStatusUpdated,
}: StatusManagementButtonProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleStatusChange = async (_newStatus: ProgressStatus) => {
    handleClose();
    onStatusUpdated?.(student);
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={handleClick}
        endIcon={<ExtendIcon />}
        disabled={student.isBanned}
      >
        Cập nhật trạng thái
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem
          onClick={() => handleStatusChange("ON_TRACK")}
          disabled={student.status === "ON_TRACK"}
        >
          <ListItemIcon>
            <ContinueIcon color="success" fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Tiếp tục" secondary="Tiến hành bình thường" />
        </MenuItem>

        <MenuItem
          onClick={() => handleStatusChange("EXTENDED")}
          disabled={student.status === "EXTENDED"}
        >
          <ListItemIcon>
            <ExtendIcon color="warning" fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Gia hạn"
            secondary="Gia hạn thời gian thực hiện"
          />
        </MenuItem>

        <Divider />

        <MenuItem
          onClick={() => handleStatusChange("TOPIC_CHANGED")}
          disabled={student.status === "TOPIC_CHANGED"}
        >
          <ListItemIcon>
            <ChangeTopicIcon color="info" fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Đổi đề tài"
            secondary="Sinh viên làm đề tài mới"
          />
        </MenuItem>
      </Menu>
    </>
  );
}

// ============================================================
// Status Update Dialog
// ============================================================

interface StatusUpdateDialogProps {
  open: boolean;
  onClose: () => void;
  student: StudentProgress | null;
  onSuccess?: (student: StudentProgress) => void;
  userId: number;
  userName: string;
  userRole: "teacher" | "admin" | "secretary";
}

export function StatusUpdateDialog({
  open,
  onClose,
  student,
  onSuccess,
  userId: _userId,
  userName: _userName,
}: StatusUpdateDialogProps) {
  const [newStatus, setNewStatus] = useState<ProgressStatus | null>(null);
  const [reason, setReason] = useState("");
  const [updating, setUpdating] = useState(false);

  const handleSubmit = async () => {
    if (!student || !newStatus) {
      toast.error("Vui lòng chọn trạng thái mới");
      return;
    }

    if (!reason.trim()) {
      toast.error("Vui lòng nhập lý do thay đổi");
      return;
    }

    setUpdating(true);
    try {
      const updated = await progressTrackingService.updateStudentProgress(
        student.studentId,
        {
          status: newStatus,
          banReason: reason.trim(),
        },
      );

      const statusLabel = STATUS_LABELS[newStatus];
      toast.success(`Đã cập nhật trạng thái: ${statusLabel}`);
      toast.info(`Thông báo đã được gửi đến ${student.studentName}`);

      onSuccess?.(updated);
      handleClose();
    } catch {
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái");
    } finally {
      setUpdating(false);
    }
  };

  const handleClose = () => {
    setNewStatus(null);
    setReason("");
    onClose();
  };

  if (!student) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ExtendIcon color="primary" />
          Cập nhật trạng thái tiến độ
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Student Info */}
          <Alert severity="info">
            <Typography variant="body2">
              <strong>Sinh viên:</strong> {student.studentName}
            </Typography>
            <Typography variant="body2">
              <strong>MSSV:</strong> {student.studentMssv}
            </Typography>
            <Typography variant="body2">
              <strong>Đề tài:</strong> {student.topicName}
            </Typography>
            <Typography variant="body2">
              <strong>Trạng thái hiện tại:</strong>{" "}
              <Chip
                size="small"
                label={STATUS_LABELS[student.status]}
                color={student.isBanned ? "error" : "default"}
              />
            </Typography>
          </Alert>

          {/* Status Options */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Chọn trạng thái mới <span style={{ color: "red" }}>*</span>
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <StatusOptionButton
                status="ON_TRACK"
                selected={newStatus === "ON_TRACK"}
                onClick={() => setNewStatus("ON_TRACK")}
                disabled={student.status === "ON_TRACK"}
              />
              <StatusOptionButton
                status="EXTENDED"
                selected={newStatus === "EXTENDED"}
                onClick={() => setNewStatus("EXTENDED")}
                disabled={student.status === "EXTENDED"}
              />
              <StatusOptionButton
                status="TOPIC_CHANGED"
                selected={newStatus === "TOPIC_CHANGED"}
                onClick={() => setNewStatus("TOPIC_CHANGED")}
                disabled={student.status === "TOPIC_CHANGED"}
              />
            </Box>
          </Box>

          {/* Reason */}
          <TextField
            label="Lý do thay đổi"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="VD: Sinh viên có tiến độ tốt, tiếp tục thực hiện"
            multiline
            rows={3}
            fullWidth
            required
            helperText="Mô tả chi tiết lý do thay đổi trạng thái"
          />

          {/* Warning */}
          {newStatus && newStatus !== student.status && (
            <Alert severity="warning" icon={<WarningIcon />}>
              <Typography variant="body2">
                Thay đổi trạng thái sẽ kích hoạt hệ thống gửi thông báo đến sinh
                viên <strong>{student.studentName}</strong>.
              </Typography>
            </Alert>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} disabled={updating}>
          Hủy
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={updating || !newStatus || !reason.trim()}
          startIcon={
            updating ? <CircularProgress size={20} /> : <ApproveIcon />
          }
        >
          {updating ? "Đang cập nhật..." : "Cập nhật"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ============================================================
// Status Option Button
// ============================================================

interface StatusOptionButtonProps {
  status: ProgressStatus;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

function StatusOptionButton({
  status,
  selected,
  onClick,
  disabled,
}: StatusOptionButtonProps) {
  const config = {
    ON_TRACK: {
      icon: <ContinueIcon />,
      label: "Tiếp tục",
      description: "Sinh viên tiếp tục thực hiện đề tài bình thường",
      color: "success" as const,
    },
    EXTENDED: {
      icon: <ExtendIcon />,
      label: "Gia hạn",
      description: "Gia hạn thời gian thực hiện đề tài cho sinh viên",
      color: "warning" as const,
    },
    TOPIC_CHANGED: {
      icon: <ChangeTopicIcon />,
      label: "Đổi đề tài",
      description: "Sinh viên chuyển sang làm đề tài mới",
      color: "info" as const,
    },
    BANNED: {
      icon: <WarningIcon />,
      label: "Cấm thi",
      description: "Cấm sinh viên không nộp báo cáo",
      color: "error" as const,
    },
  };

  const { icon, label, description, color } = config[status];

  return (
    <Button
      fullWidth
      variant={selected ? "contained" : "outlined"}
      color={selected ? color : "inherit"}
      onClick={onClick}
      disabled={disabled}
      startIcon={icon}
      sx={{
        justifyContent: "flex-start",
        textAlign: "left",
        py: 1.5,
        borderColor: selected ? undefined : "divider",
        "&:hover": {
          borderColor: `${color}.main`,
        },
      }}
    >
      <Box sx={{ textAlign: "left" }}>
        <Typography variant="body1" fontWeight={500}>
          {label}
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.8 }}>
          {description}
        </Typography>
      </Box>
    </Button>
  );
}

// ============================================================
// Student Status Card (compact view for lists)
// ============================================================

interface StudentStatusCardProps {
  student: StudentProgress;
  onUpdateStatus?: () => void;
}

export function StudentStatusCard({
  student,
  onUpdateStatus,
}: StudentStatusCardProps) {
  const getStatusColor = (status: ProgressStatus) => {
    switch (status) {
      case "ON_TRACK":
        return "success";
      case "EXTENDED":
        return "warning";
      case "TOPIC_CHANGED":
        return "info";
      case "BANNED":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Box
      sx={{
        p: 2,
        border: "1px solid",
        borderColor: student.isBanned ? "error.main" : "divider",
        borderRadius: 1,
        bgcolor: student.isBanned ? "error.50" : "background.paper",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Box>
          <Typography variant="body1" fontWeight={500}>
            {student.studentName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {student.studentMssv}
          </Typography>
        </Box>
        <Chip
          size="small"
          label={student.isBanned ? "Cấm thi" : STATUS_LABELS[student.status]}
          color={student.isBanned ? "error" : getStatusColor(student.status)}
        />
      </Box>

      <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">
        {student.topicName}
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
        <Typography variant="caption" color="text.secondary">
          Báo cáo: {student.totalReportsSubmitted}/
          {student.totalReportsRequired}
        </Typography>
        {student.isBanned && (
          <Typography variant="caption" color="error.main">
            • Lý do: {student.banReason}
          </Typography>
        )}
      </Box>

      {!student.isBanned && onUpdateStatus && (
        <Box sx={{ mt: 1 }}>
          <Button
            size="small"
            variant="outlined"
            onClick={onUpdateStatus}
            startIcon={<ExtendIcon />}
          >
            Cập nhật
          </Button>
        </Box>
      )}
    </Box>
  );
}
