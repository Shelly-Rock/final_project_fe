"use client";

import React from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Avatar,
  Divider,
  Stack,
} from "@mui/material";
import {
  Close as CloseIcon,
  Email as EmailIcon,
  Event as EventIcon,
  Business as DepartmentIcon,
  MenuBook as TopicIcon,
  Person as TeacherIcon,
} from "@mui/icons-material";
import type { Student } from "../types/student.types";

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string | null | undefined;
  color?: string;
}

function InfoRow({ icon, label, value, color }: InfoRowProps) {
  return (
    <Box sx={{ display: "flex", py: 1.5 }}>
      <Box sx={{ display: "flex", alignItems: "center", minWidth: 160 }}>
        <Box sx={{ color: "text.secondary", mr: 1.5 }}>{icon}</Box>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
      </Box>
      <Typography
        variant="body2"
        sx={{
          fontWeight: 500,
          color: color || "text.primary",
          flex: 1,
        }}
      >
        {value || "—"}
      </Typography>
    </Box>
  );
}

interface StudentDetailModalProps {
  open: boolean;
  student: Student | null;
  onClose: () => void;
  onEdit: (student: Student) => void;
}

export function StudentDetailModal({
  open,
  student,
  onClose,
  onEdit,
}: StudentDetailModalProps) {
  if (!student) return null;

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
          Chi tiết sinh viên
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {/* Avatar & Name Header */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 3,
            pt: 1,
          }}
        >
          <Avatar
            sx={{
              width: 100,
              height: 100,
              bgcolor: "secondary.main",
              fontSize: "2.5rem",
              mb: 2,
            }}
          >
            {student.hoTen.charAt(0).toUpperCase()}
          </Avatar>
          <Typography
            variant="h5"
            sx={{ fontWeight: 600, textAlign: "center" }}
          >
            {student.hoTen}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {student.mssv}
          </Typography>
        </Box>

        <Divider sx={{ mb: 1 }} />

        {/* Info Rows */}
        <Box>
          <InfoRow
            icon={<EmailIcon fontSize="small" />}
            label="Email"
            value={student.gmail}
          />
          <Divider />
          <InfoRow
            icon={<DepartmentIcon fontSize="small" />}
            label="Khoa"
            value={student.khoa}
          />
          <Divider />
          <InfoRow
            icon={<EventIcon fontSize="small" />}
            label="Khóa học"
            value={`Khóa ${student.khoaHoc}`}
          />
          <Divider />
          <InfoRow
            icon={<TeacherIcon fontSize="small" />}
            label="GVHD"
            value={student.giaoVienHuongDan}
          />
          <Divider />
          <InfoRow
            icon={<TopicIcon fontSize="small" />}
            label="Đề tài"
            value={student.deTai}
            color={student.deTai ? "primary.main" : "text.disabled"}
          />
        </Box>

        {/* Status Badge */}
        <Box sx={{ mt: 3 }}>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Box
              sx={{
                px: 2,
                py: 1,
                borderRadius: 1,
                bgcolor: student.deTai ? "success.light" : "warning.light",
                color: student.deTai ? "success.dark" : "warning.dark",
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {student.deTai ? "Đã chọn đề tài" : "Chưa chọn đề tài"}
              </Typography>
            </Box>
          </Stack>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Đóng</Button>
        <Button variant="contained" onClick={() => onEdit(student)}>
          Sửa thông tin
        </Button>
      </DialogActions>
    </Dialog>
  );
}
