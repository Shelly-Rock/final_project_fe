"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { PageHeader, FilterBar } from "@/shared/components";
import { DataTable } from "@/shared/components/DataTable";
import type { Column, Action } from "@/shared/components";
import { mockClasses } from "@/feature/class-management/constants";

export default function ClassPage() {
  const [search, setSearch] = useState("");

  const columns: Column<(typeof mockClasses)[0]>[] = [
    { id: "name", label: "Tên lớp", minWidth: 120, sortable: true },
    { id: "major", label: "Ngành", minWidth: 180, sortable: true },
    {
      id: "year",
      label: "Khóa",
      minWidth: 80,
      align: "center",
      sortable: true,
    },
    {
      id: "studentCount",
      label: "SV",
      minWidth: 60,
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

  const actions: Action<(typeof mockClasses)[0]>[] = [
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
        title="Lớp học"
        subtitle="Quản lý thông tin các lớp học"
        actions={
          <Button variant="contained" startIcon={<AddIcon />}>
            Thêm lớp
          </Button>
        }
      />

      <FilterBar totalCount={mockClasses.length}>
        <TextField
          size="small"
          placeholder="Tìm kiếm lớp..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 250 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </FilterBar>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {mockClasses.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tổng lớp
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {mockClasses.reduce((sum, c) => sum + c.studentCount, 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tổng sinh viên
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {new Set(mockClasses.map((c) => c.major)).size}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ngành
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <DataTable
        columns={columns}
        rows={mockClasses}
        rowKey="id"
        actions={actions}
      />
    </Box>
  );
}
