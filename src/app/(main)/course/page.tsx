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
import { mockCourses, typeConfig } from "@/feature/course-management/constants";

export default function CoursePage() {
  const [search, setSearch] = useState("");

  const columns: Column<(typeof mockCourses)[0]>[] = [
    { id: "code", label: "Mã HP", minWidth: 100, sortable: true },
    { id: "name", label: "Tên học phần", minWidth: 200, sortable: true },
    { id: "department", label: "Khoa", minWidth: 120 },
    {
      id: "credits",
      label: "Tín chỉ",
      minWidth: 80,
      align: "center",
      sortable: true,
    },
    {
      id: "type",
      label: "Loại",
      minWidth: 120,
      format: (v) => {
        return (
          <Chip
            label={typeConfig[v as string] ?? v}
            size="small"
            variant="outlined"
          />
        );
      },
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

  const actions: Action<(typeof mockCourses)[0]>[] = [
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
        title="Học phần"
        subtitle="Quản lý thông tin học phần"
        actions={
          <Button variant="contained" startIcon={<AddIcon />}>
            Thêm học phần
          </Button>
        }
      />

      <FilterBar totalCount={mockCourses.length}>
        <TextField
          size="small"
          placeholder="Tìm kiếm học phần..."
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
                {mockCourses.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tổng học phần
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {mockCourses.reduce((sum, c) => sum + c.credits, 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tổng tín chỉ
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {new Set(mockCourses.map((c) => c.department)).size}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Khoa
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <DataTable
        columns={columns}
        rows={mockCourses}
        rowKey="id"
        actions={actions}
      />
    </Box>
  );
}
