"use client";

import React, { useState } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  IconButton,
  Avatar,
  InputAdornment,
} from "@mui/material";
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
  School as SchoolIcon,
} from "@mui/icons-material";
import type { Student, StudentFormData } from "../types/student.types";

interface StudentFormModalProps {
  open: boolean;
  student?: Student | null;
  onClose: () => void;
  onSubmit: (data: StudentFormData) => void;
}

const khoaOptions = [
  "Công nghệ thông tin",
  "Kỹ thuật phần mềm",
  "Khoa học máy tính",
  "Hệ thống thông tin",
  "An toàn thông tin",
  "Mạng máy tính",
];

const khoaHocOptions = ["2020", "2021", "2022", "2023", "2024", "2025"];

export function StudentFormModal({
  open,
  student,
  onClose,
  onSubmit,
}: StudentFormModalProps) {
  const buildInitialData = (): StudentFormData =>
    student
      ? {
          stt: student.stt,
          mssv: student.mssv,
          hoTen: student.hoTen,
          khoa: student.khoa,
          khoaHoc: student.khoaHoc,
          gmail: student.gmail,
          deTai: student.deTai || undefined,
          giaoVienHuongDan: student.giaoVienHuongDan || undefined,
        }
      : {
          stt: 0,
          mssv: "",
          hoTen: "",
          khoa: "",
          khoaHoc: "",
          gmail: "",
          deTai: undefined,
          giaoVienHuongDan: undefined,
        };

  const [formData, setFormData] = useState<StudentFormData>(buildInitialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = Boolean(student?.id);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.mssv.trim()) {
      newErrors.mssv = "MSSV bắt buộc";
    } else if (!/^\d{7,8}$/.test(formData.mssv)) {
      newErrors.mssv = "MSSV phải có 7-8 chữ số";
    }

    if (!formData.hoTen.trim()) {
      newErrors.hoTen = "Họ tên bắt buộc";
    }

    if (!formData.gmail.trim()) {
      newErrors.gmail = "Email bắt buộc";
    } else if (!/^[^\s@]+@gmail\.com$/.test(formData.gmail)) {
      newErrors.gmail = "Email phải có định dạng @gmail.com";
    }

    if (!formData.khoa) {
      newErrors.khoa = "Khoa bắt buộc";
    }

    if (!formData.khoaHoc) {
      newErrors.khoaHoc = "Khóa học bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit(formData);
  };

  const handleChange = (field: keyof StudentFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

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
          {isEditing ? "Sửa thông tin sinh viên" : "Thêm sinh viên mới"}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {/* Avatar */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: "secondary.main",
                fontSize: "2rem",
              }}
            >
              {formData.hoTen?.charAt(0)?.toUpperCase() || "S"}
            </Avatar>
          </Box>

          {/* MSSV */}
          <TextField
            label="Mã số sinh viên (MSSV)"
            value={formData.mssv}
            onChange={(e) => handleChange("mssv", e.target.value)}
            fullWidth
            required
            size="small"
            error={Boolean(errors.mssv)}
            helperText={errors.mssv}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BadgeIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
          />

          {/* Họ tên */}
          <TextField
            label="Họ và tên"
            value={formData.hoTen}
            onChange={(e) => handleChange("hoTen", e.target.value)}
            fullWidth
            required
            size="small"
            error={Boolean(errors.hoTen)}
            helperText={errors.hoTen}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
          />

          {/* Email */}
          <TextField
            label="Email (@gmail.com)"
            type="email"
            value={formData.gmail}
            onChange={(e) => handleChange("gmail", e.target.value)}
            fullWidth
            required
            size="small"
            error={Boolean(errors.gmail)}
            helperText={errors.gmail}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
          />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            {/* Khoa */}
            <FormControl
              fullWidth
              size="small"
              required
              error={Boolean(errors.khoa)}
            >
              <InputLabel>Khoa</InputLabel>
              <Select
                value={formData.khoa}
                label="Khoa"
                onChange={(e) => handleChange("khoa", e.target.value)}
              >
                {khoaOptions.map((khoa) => (
                  <MenuItem key={khoa} value={khoa}>
                    {khoa}
                  </MenuItem>
                ))}
              </Select>
              {errors.khoa && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ mt: 0.5, ml: 1.5 }}
                >
                  {errors.khoa}
                </Typography>
              )}
            </FormControl>

            {/* Khóa học */}
            <FormControl
              fullWidth
              size="small"
              required
              error={Boolean(errors.khoaHoc)}
            >
              <InputLabel>Khóa học</InputLabel>
              <Select
                value={formData.khoaHoc}
                label="Khóa học"
                onChange={(e) => handleChange("khoaHoc", e.target.value)}
              >
                {khoaHocOptions.map((khoa) => (
                  <MenuItem key={khoa} value={khoa}>
                    Khóa {khoa}
                  </MenuItem>
                ))}
              </Select>
              {errors.khoaHoc && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ mt: 0.5, ml: 1.5 }}
                >
                  {errors.khoaHoc}
                </Typography>
              )}
            </FormControl>
          </Stack>

          {/* Giảng viên hướng dẫn */}
          <TextField
            label="Giảng viên hướng dẫn"
            value={formData.giaoVienHuongDan || ""}
            onChange={(e) => handleChange("giaoVienHuongDan", e.target.value)}
            fullWidth
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SchoolIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {isEditing ? "Cập nhật" : "Thêm mới"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
