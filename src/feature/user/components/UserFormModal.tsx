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
  Switch,
  Typography,
  IconButton,
  Avatar,
  InputAdornment,
} from "@mui/material";
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
} from "@mui/icons-material";
import type { User } from "../constants/mockUsers";
import { departments, roleColors } from "../constants/mockUsers";

interface UserFormModalProps {
  open: boolean;
  user?: User | null;
  onClose: () => void;
  onSubmit: (data: Partial<User>) => void;
}

export function UserFormModal({
  open,
  user,
  onClose,
  onSubmit,
}: UserFormModalProps) {
  const initialData = user
    ? { ...user }
    : {
        name: "",
        email: "",
        phone: "",
        role: "student" as const,
        department: "",
        status: "active" as const,
      };

  const [formData, setFormData] = useState<Partial<User>>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = Boolean(user?.id);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Họ tên bắt buộc";
    }

    if (!formData.email?.trim()) {
      newErrors.email = "Email bắt buộc";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.department?.trim()) {
      newErrors.department = "Khoa bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit(formData);
    onClose();
  };

  const handleChange = (field: keyof User, value: unknown) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const roleOptions = [
    { value: "admin", label: "Quản trị viên", color: "error" },
    { value: "secretary", label: "Thư ký", color: "info" },
    { value: "teacher", label: "Giảng viên", color: "success" },
    { value: "student", label: "Sinh viên", color: "secondary" },
  ];

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
          {isEditing ? "Sửa người dùng" : "Thêm người dùng mới"}
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
                bgcolor: roleColors[formData.role || "student"],
                fontSize: "2rem",
              }}
            >
              {formData.name?.charAt(0)?.toUpperCase() || "U"}
            </Avatar>
          </Box>

          {/* Họ tên */}
          <TextField
            label="Họ tên"
            value={formData.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
            fullWidth
            required
            size="small"
            error={Boolean(errors.name)}
            helperText={errors.name}
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
            label="Email"
            type="email"
            value={formData.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
            fullWidth
            required
            size="small"
            error={Boolean(errors.email)}
            helperText={errors.email}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
          />

          {/* Số điện thoại */}
          <TextField
            label="Số điện thoại"
            value={formData.phone || ""}
            onChange={(e) => handleChange("phone", e.target.value)}
            fullWidth
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
          />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            {/* Vai trò */}
            <FormControl fullWidth size="small" required>
              <InputLabel>Vai trò</InputLabel>
              <Select
                value={formData.role || "student"}
                label="Vai trò"
                onChange={(e) => handleChange("role", e.target.value)}
              >
                {roleOptions.map((role) => (
                  <MenuItem key={role.value} value={role.value}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          bgcolor: `${role.color}.main`,
                        }}
                      />
                      {role.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Khoa */}
            <FormControl
              fullWidth
              size="small"
              required
              error={Boolean(errors.department)}
            >
              <InputLabel>Khoa</InputLabel>
              <Select
                value={formData.department || ""}
                label="Khoa"
                onChange={(e) => handleChange("department", e.target.value)}
              >
                {departments.map((dept) => (
                  <MenuItem key={dept} value={dept}>
                    {dept}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          {/* Trạng thái hoạt động */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
            }}
          >
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Trạng thái hoạt động
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Cho phép người dùng đăng nhập và sử dụng hệ thống
              </Typography>
            </Box>
            <Switch
              checked={formData.status === "active"}
              onChange={(e) =>
                handleChange("status", e.target.checked ? "active" : "inactive")
              }
              color="success"
            />
          </Box>
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
