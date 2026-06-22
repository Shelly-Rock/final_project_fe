"use client";

import { useState, useMemo, useCallback } from "react";
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
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
import { UserFormModal } from "@/feature/user/components";
import { UserService } from "@/feature/user/services";
import type { User } from "@/feature/user/constants/mockUsers";
import { roleColors } from "@/feature/user/constants/mockUsers";
import { ROLE_LABELS } from "@/core/permissions/types";

export default function UserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info";
  }>({ open: false, message: "", severity: "success" });

  // Load users
  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await UserService.getAll();
      setUsers(data);
    } catch {
      setSnackbar({
        open: true,
        message: "Không thể tải danh sách người dùng",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useState(() => {
    loadUsers();
  });

  const filteredUsers = useMemo(() => {
    if (!search) return users;
    const lower = search.toLowerCase();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(lower) ||
        u.email.toLowerCase().includes(lower) ||
        u.department.toLowerCase().includes(lower),
    );
  }, [users, search]);

  const columns: Column<User>[] = [
    {
      id: "name",
      label: "Người dùng",
      minWidth: 220,
      format: (_, row) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              fontSize: "1rem",
              bgcolor: roleColors[row.role],
            }}
          >
            {row.name.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
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
      minWidth: 130,
      format: (v) => (
        <Chip
          label={ROLE_LABELS[v as keyof typeof ROLE_LABELS]}
          color={roleColors[v as string]}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      id: "department",
      label: "Khoa",
      minWidth: 150,
    },
    {
      id: "phone",
      label: "Số điện thoại",
      minWidth: 120,
      format: (v) => v || "—",
    },
    {
      id: "status",
      label: "Trạng thái",
      minWidth: 110,
      format: (v) => (
        <Chip
          label={v === "active" ? "Hoạt động" : "Khóa"}
          color={v === "active" ? "success" : "default"}
          size="small"
        />
      ),
    },
  ];

  const actions: Action<User>[] = [
    {
      id: "edit",
      icon: <EditIcon />,
      label: "Sửa",
      onClick: (row) => {
        setEditingUser(row);
        setFormModalOpen(true);
      },
    },
    {
      id: "delete",
      icon: <DeleteIcon />,
      label: "Xóa",
      onClick: (row) => {
        setUserToDelete(row);
        setDeleteDialogOpen(true);
      },
      color: "error",
    },
  ];

  const handleOpenForm = (user?: User) => {
    setEditingUser(user || null);
    setFormModalOpen(true);
  };

  const handleCloseForm = () => {
    setFormModalOpen(false);
    setEditingUser(null);
  };

  const handleSubmitForm = async (data: Partial<User>) => {
    try {
      if (editingUser?.id) {
        await UserService.update(editingUser.id, data);
        setSnackbar({
          open: true,
          message: "Cập nhật người dùng thành công",
          severity: "success",
        });
      } else {
        await UserService.create(data as Omit<User, "id" | "createdAt">);
        setSnackbar({
          open: true,
          message: "Thêm người dùng mới thành công",
          severity: "success",
        });
      }
      loadUsers();
      handleCloseForm();
    } catch {
      setSnackbar({
        open: true,
        message: "Đã xảy ra lỗi, vui lòng thử lại",
        severity: "error",
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await UserService.delete(userToDelete.id);
      setSnackbar({
        open: true,
        message: "Xóa người dùng thành công",
        severity: "success",
      });
      loadUsers();
    } catch {
      setSnackbar({
        open: true,
        message: "Không thể xóa người dùng",
        severity: "error",
      });
    } finally {
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  // Stats
  const stats = useMemo(
    () => ({
      total: users.length,
      admins: users.filter((u) => u.role === "admin").length,
      teachers: users.filter((u) => u.role === "teacher").length,
      students: users.filter((u) => u.role === "student").length,
      active: users.filter((u) => u.status === "active").length,
    }),
    [users],
  );

  return (
    <Box sx={{ p: 3 }}>
      <PageHeader
        title="Người dùng"
        subtitle="Quản lý tài khoản người dùng hệ thống"
        actions={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenForm()}
          >
            Thêm người dùng
          </Button>
        }
      />

      <FilterBar totalCount={filteredUsers.length}>
        <TextField
          size="small"
          placeholder="Tìm kiếm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 280 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </FilterBar>

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: "primary.main" }}
              >
                {stats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tổng người dùng
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: "success.main" }}
              >
                {stats.active}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Đang hoạt động
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {stats.teachers}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Giảng viên
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <DataTable
        columns={columns}
        rows={filteredUsers}
        rowKey="id"
        actions={actions}
        loading={loading}
      />

      {/* User Form Modal */}
      <UserFormModal
        open={formModalOpen}
        user={editingUser}
        onClose={handleCloseForm}
        onSubmit={handleSubmitForm}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa người dùng{" "}
            <strong>{userToDelete?.name}</strong> không?
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>
            Hành động này không thể hoàn tác.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Hủy</Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
