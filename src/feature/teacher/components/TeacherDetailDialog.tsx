"use client";

import { Dialog, Button, Avatar } from "@/shared/components";
import { Box, Typography, Grid, Chip, Divider } from "@mui/material";
import type { Lecturer } from "@/feature/admin/types";

interface TeacherDetailDialogProps {
  open: boolean;
  onClose: () => void;
  teacher: Lecturer | null;
  faculties?: { id: string; name: string }[];
  departments?: { id: string; name: string }[];
}

const getStatusColor = (status: Lecturer["status"]) => {
  switch (status) {
    case "active":
      return "success";
    case "inactive":
      return "default";
    default:
      return "default";
  }
};

const getStatusLabel = (status: Lecturer["status"]) => {
  switch (status) {
    case "active":
      return "Đang công tác";
    case "inactive":
      return "Tạm khóa";
    default:
      return status;
  }
};

const getGenderLabel = (gender?: Lecturer["gender"]) => {
  switch (gender) {
    case "male":
      return "Nam";
    case "female":
      return "Nữ";
    case "other":
      return "Khác";
    default:
      return "—";
  }
};

export function TeacherDetailDialog({
  open,
  onClose,
  teacher,
  faculties = [],
  departments = [],
}: TeacherDetailDialogProps) {
  if (!teacher) return null;

  const facultyName =
    faculties.find((faculty) => faculty.id === teacher.facultyId)?.name || "—";
  const departmentName =
    departments.find((department) => department.id === teacher.departmentId)
      ?.name || "—";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Thông tin giảng viên"
      size="sm"
    >
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Avatar
            src=""
            alt={teacher.name}
            sx={{
              width: 60,
              height: 60,
              bgcolor: "primary.main",
              color: "white",
              fontSize: "1.5rem",
              fontWeight: 600,
            }}
          >
            {teacher.name.charAt(0)}
          </Avatar>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="h6">{teacher.name}</Typography>
              <Chip
                label={getStatusLabel(teacher.status)}
                color={getStatusColor(teacher.status)}
                size="small"
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              Mã GV: {teacher.code}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="text.secondary">
              Email
            </Typography>
            <Typography variant="body2">{teacher.email}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="text.secondary">
              Số điện thoại
            </Typography>
            <Typography variant="body2">{teacher.phone || "—"}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="text.secondary">
              Khoa
            </Typography>
            <Typography variant="body2">{facultyName}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="text.secondary">
              Bộ môn
            </Typography>
            <Typography variant="body2">{departmentName}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="text.secondary">
              Học hàm/học vị
            </Typography>
            <Typography variant="body2">
              {teacher.academicTitle || "—"}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="text.secondary">
              Chức vụ
            </Typography>
            <Typography variant="body2">{teacher.position || "—"}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="text.secondary">
              Ngày sinh
            </Typography>
            <Typography variant="body2">
              {teacher.dateOfBirth || "—"}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="text.secondary">
              Giới tính
            </Typography>
            <Typography variant="body2">
              {getGenderLabel(teacher.gender)}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary">
              Địa chỉ
            </Typography>
            <Typography variant="body2">{teacher.address || "—"}</Typography>
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
