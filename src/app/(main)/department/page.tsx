"use client";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { PageHeader } from "@/shared/components";
import { DataTable } from "@/shared/components/DataTable";
import type { Column, Action } from "@/shared/components";
import { mockDepartments } from "@/feature/department/constants";

export default function DepartmentPage() {
  const columns: Column<(typeof mockDepartments)[0]>[] = [
    { id: "code", label: "Mã khoa", minWidth: 100, sortable: true },
    { id: "name", label: "Tên khoa", minWidth: 200, sortable: true },
    {
      id: "lecturerCount",
      label: "Giảng viên",
      minWidth: 120,
      align: "center",
      sortable: true,
    },
    {
      id: "studentCount",
      label: "Sinh viên",
      minWidth: 120,
      align: "center",
      sortable: true,
    },
    {
      id: "status",
      label: "Trạng thái",
      minWidth: 120,
      format: (v) => (
        <Chip
          label={v === "active" ? "Hoạt động" : "Không hoạt động"}
          color={v === "active" ? "success" : "default"}
          size="small"
        />
      ),
    },
  ];

  const actions: Action<(typeof mockDepartments)[0]>[] = [
    { id: "edit", icon: <EditIcon />, label: "Sửa", onClick: () => {} },
    {
      id: "delete",
      icon: <DeleteIcon />,
      label: "Xóa",
      onClick: () => {},
      color: "error",
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <PageHeader
        title="Khoa"
        subtitle="Quản lý thông tin các khoa"
        actions={
          <Button variant="contained" startIcon={<AddIcon />}>
            Thêm khoa
          </Button>
        }
      />

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {mockDepartments.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tổng số khoa
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {mockDepartments.reduce((sum, d) => sum + d.lecturerCount, 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Giảng viên
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {mockDepartments.reduce((sum, d) => sum + d.studentCount, 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sinh viên
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <DataTable
        columns={columns}
        rows={mockDepartments}
        rowKey="id"
        actions={actions}
      />
    </Box>
  );
}
