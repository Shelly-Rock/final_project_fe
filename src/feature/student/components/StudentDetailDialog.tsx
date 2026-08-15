// ============================================================
// Student Detail Dialog Component
// ============================================================
"use client";

import React from "react";
import { Dialog, Button, Avatar } from "@/shared/components";
import { Box, Typography, Grid, Chip, Divider } from "@mui/material";
import type { Student } from "../types";

interface StudentDetailDialogProps {
  open: boolean;
  onClose: () => void;
  student: Student | null;
}

const getStatusColor = (status: Student["trangThai"]) => {
  switch (status) {
    case "active":
      return "success";
    case "inactive":
      return "default";
    case "graduated":
      return "info";
    default:
      return "default";
  }
};

const getStatusLabel = (status: Student["trangThai"]) => {
  switch (status) {
    case "active":
      return "Đang học";
    case "inactive":
      return "Nghỉ học";
    case "graduated":
      return "Đã tốt nghiệp";
    default:
      return status;
  }
};

export function StudentDetailDialog({
  open,
  onClose,
  student,
}: StudentDetailDialogProps) {
  if (!student) return null;

  return (
    <Dialog open={open} onClose={onClose} title="Thông tin sinh viên" size="sm">
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Avatar
            src=""
            alt={student.hoTen}
            sx={{
              width: 60,
              height: 60,
              bgcolor: "primary.main",
              color: "white",
              fontSize: "1.5rem",
              fontWeight: 600,
            }}
          >
            {student.hoTen.charAt(0)}
          </Avatar>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="h6">{student.hoTen}</Typography>
              <Chip
                label={getStatusLabel(student.trangThai)}
                color={getStatusColor(student.trangThai)}
                size="small"
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              MSSV: {student.mssv}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="text.secondary">
              Email
            </Typography>
            <Typography variant="body2">{student.gmail}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="text.secondary">
              Số điện thoại
            </Typography>
            <Typography variant="body2">
              {student.soDienThoai || "—"}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="text.secondary">
              Khoa
            </Typography>
            <Typography variant="body2">{student.khoa}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="text.secondary">
              Khóa
            </Typography>
            <Typography variant="body2">{student.khoaHoc}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="text.secondary">
              Lớp
            </Typography>
            <Typography variant="body2">{student.lop}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="text.secondary">
              Ngày sinh
            </Typography>
            <Typography variant="body2">{student.ngaySinh || "—"}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary">
              Địa chỉ
            </Typography>
            <Typography variant="body2">{student.diaChi || "—"}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary">
              Đề tài khóa luận
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {student.deTai || "Chưa có đề tài"}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary">
              Giảng viên hướng dẫn
            </Typography>
            <Typography variant="body2">
              {student.giangVienHuongDan || "—"}
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
        <Button variant="text" onClick={onClose}>
          Đóng
        </Button>
      </Box>
    </Dialog>
  );
}
