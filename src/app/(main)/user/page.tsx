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
  Avatar,
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
import { mockUsers, roleColors } from "@/feature/user/constants";
import { ROLE_LABELS } from "@/core/permissions/types";

export default function UserPage() {
  const [search, setSearch] = useState("");

  const columns: Column<(typeof mockUsers)[0]>[] = [
    {
      id: "name",
      label: "Người dùng",
      minWidth: 200,
      format: (_, row) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar sx={{ width: 32, height: 32, fontSize: "0.875rem" }}>
            {row.name.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {row.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row.email}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      id: "role",
      label: "Vai trò",
      minWidth: 120,
      format: (v) => (
        <Chip
          label={ROLE_LABELS[v as keyof typeof ROLE_LABELS]}
          color={roleColors[v as string]}
          size="small"
        />
      ),
    },
    { id: "department", label: "Khoa", minWidth: 120 },
    {
      id: "status",
      label: "Trạng thái",
      minWidth: 120,
      format: (v) => (
        <Chip
          label={v === "active" ? "Hoạt động" : "Khóa"}
          color={v === "active" ? "success" : "default"}
          size="small"
        />
      ),
    },
  ];

  const actions: Action<(typeof mockUsers)[0]>[] = [
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
        title="Người dùng"
        subtitle="Quản lý tài khoản người dùng"
        actions={
          <Button variant="contained" startIcon={<AddIcon />}>
            Thêm người dùng
          </Button>
        }
      />

      <FilterBar totalCount={mockUsers.length}>
        <TextField
          size="small"
          placeholder="Tìm kiếm..."
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
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {mockUsers.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tổng người dùng
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {mockUsers.filter((u) => u.role === "admin").length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Quản trị viên
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {mockUsers.filter((u) => u.role === "teacher").length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Giảng viên
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {mockUsers.filter((u) => u.role === "student").length}
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
        rows={mockUsers}
        rowKey="id"
        actions={actions}
      />
    </Box>
  );
}
