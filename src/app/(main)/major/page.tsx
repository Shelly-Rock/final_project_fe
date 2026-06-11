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
import { mockMajors } from "@/feature/major/constants";

export default function MajorPage() {
  const columns: Column<(typeof mockMajors)[0]>[] = [
    { id: "code", label: "Mã ngành", minWidth: 100, sortable: true },
    { id: "name", label: "Tên ngành", minWidth: 200, sortable: true },
    { id: "department", label: "Khoa", minWidth: 150 },
    {
      id: "studentCount",
      label: "Sinh viên",
      minWidth: 100,
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

  const actions: Action<(typeof mockMajors)[0]>[] = [
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
        title="Ngành"
        subtitle="Quản lý thông tin các ngành học"
        actions={
          <Button variant="contained" startIcon={<AddIcon />}>
            Thêm ngành
          </Button>
        }
      />

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {mockMajors.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tổng số ngành
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {mockMajors.reduce((sum, m) => sum + m.studentCount, 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tổng sinh viên
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <DataTable
        columns={columns}
        rows={mockMajors}
        rowKey="id"
        actions={actions}
      />
    </Box>
  );
}
