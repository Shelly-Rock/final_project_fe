"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  MenuItem,
  Paper,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { KeyRound, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog } from "@/shared/components/Dialog";
import { facultyService } from "@/feature/admin/services";
import type { Faculty } from "@/feature/admin/types";
import { isValidEmail } from "@/shared/utils/validation.utils";
import {
  roleService,
  type SecretaryAccount,
  type SecretaryAccountInput,
} from "../services/role.service";

type FormState = {
  username: string;
  email: string;
  password: string;
  facultyId: string;
};

const EMPTY_FORM: FormState = {
  username: "",
  email: "",
  password: "",
  facultyId: "",
};

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export function SecretaryAccountsTab() {
  const [accounts, setAccounts] = useState<SecretaryAccount[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<SecretaryAccount | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [secretaries, facultyRows] = await Promise.all([
        roleService.getSecretaryAccounts(),
        facultyService.getAll({ isActive: true }),
      ]);
      setAccounts(secretaries);
      setFaculties(facultyRows);
    } catch (error) {
      toast.error(errorMessage(error, "Không tải được tài khoản thư ký"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const usedFacultyIds = useMemo(
    () =>
      new Set(
        accounts
          .filter((account) => account.id !== editing?.id)
          .map((account) => account.facultyId),
      ),
    [accounts, editing?.id],
  );

  const availableFaculties = useMemo(
    () =>
      faculties.filter(
        (faculty) =>
          faculty.id === editing?.facultyId || !usedFacultyIds.has(faculty.id),
      ),
    [editing?.facultyId, faculties, usedFacultyIds],
  );

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setDialogOpen(true);
  };

  const openEdit = (account: SecretaryAccount) => {
    setEditing(account);
    setForm({
      username: account.username,
      email: account.email,
      password: "",
      facultyId: account.facultyId,
    });
    setFormErrors({});
    setDialogOpen(true);
  };

  const closeDialog = () => {
    if (!saving) setDialogOpen(false);
  };

  const submit = async () => {
    const username = form.username.trim();
    const email = form.email.trim();
    const facultyId = form.facultyId.trim();
    const errors: Partial<Record<keyof FormState, string>> = {};
    if (!username) errors.username = "Vui lòng nhập tài khoản";
    if (!email) errors.email = "Vui lòng nhập email";
    else if (!isValidEmail(email)) errors.email = "Email không hợp lệ";
    if (!editing && !form.password) errors.password = "Vui lòng nhập mật khẩu";
    else if (form.password && form.password.length < 6)
      errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    if (!facultyId) errors.facultyId = "Vui lòng chọn khoa";
    else if (usedFacultyIds.has(facultyId))
      errors.facultyId = "Khoa này đã có thư ký";
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    const input: SecretaryAccountInput = {
      username,
      email,
      facultyId,
      ...(form.password ? { password: form.password } : {}),
    };
    setSaving(true);
    try {
      if (editing) {
        await roleService.updateSecretaryAccount(editing.id, input);
        toast.success("Đã cập nhật tài khoản thư ký");
      } else {
        await roleService.createSecretaryAccount(input);
        toast.success("Đã tạo tài khoản thư ký");
      }
      setDialogOpen(false);
      await load();
    } catch (error) {
      toast.error(errorMessage(error, "Lưu tài khoản thư ký thất bại"));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (account: SecretaryAccount) => {
    if (
      !window.confirm(
        `Xóa tài khoản thư ký ${account.username} của khoa ${account.facultyName}?`,
      )
    ) {
      return;
    }
    try {
      await roleService.deleteSecretaryAccount(account.id);
      toast.success("Đã xóa tài khoản thư ký");
      await load();
    } catch (error) {
      toast.error(errorMessage(error, "Xóa tài khoản thư ký thất bại"));
    }
  };

  const setField = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFormErrors((current) => ({ ...current, [field]: undefined }));
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          mb: 2,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography variant="h6">Tài khoản thư ký</Typography>
          <Typography variant="body2" color="text.secondary">
            Mỗi khoa chỉ được gán một tài khoản thư ký.
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            onClick={load}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : undefined}
          >
            Làm mới
          </Button>
          <Button
            variant="contained"
            onClick={openCreate}
            startIcon={<Plus size={16} />}
          >
            Thêm thư ký
          </Button>
        </Box>
      </Box>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}
      >
        <MuiTable size="small">
          <TableHead>
            <TableRow
              sx={{
                bgcolor: "#2563eb",
                "& th": { color: "#fff", fontWeight: 700 },
              }}
            >
              <TableCell>Tài khoản</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Khoa</TableCell>
              <TableCell align="center">Trạng thái</TableCell>
              <TableCell align="center">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : accounts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    Chưa có tài khoản thư ký
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              accounts.map((account) => (
                <TableRow key={account.id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>
                    {account.username}
                  </TableCell>
                  <TableCell>{account.email}</TableCell>
                  <TableCell>
                    {account.facultyName || account.facultyId}
                  </TableCell>
                  <TableCell align="center">
                    {account.isActive ? "Đang hoạt động" : "Đã khóa"}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Đổi thông tin hoặc khoa">
                      <IconButton
                        size="small"
                        onClick={() => openEdit(account)}
                      >
                        <Pencil size={16} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Đặt lại mật khẩu">
                      <IconButton
                        size="small"
                        onClick={() => openEdit(account)}
                      >
                        <KeyRound size={16} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa tài khoản">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => remove(account)}
                      >
                        <Trash2 size={16} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </MuiTable>
      </TableContainer>

      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        title={editing ? "Cập nhật tài khoản thư ký" : "Tạo tài khoản thư ký"}
        actions={
          <>
            <Button variant="outlined" onClick={closeDialog} disabled={saving}>
              Hủy
            </Button>
            <Button variant="contained" onClick={submit} disabled={saving}>
              {saving ? <CircularProgress size={16} color="inherit" /> : "Lưu"}
            </Button>
          </>
        }
      >
        <Box sx={{ display: "grid", gap: 2, pt: 1 }}>
          <TextField
            label="Tên tài khoản"
            value={form.username}
            onChange={(e) => setField("username", e.target.value)}
            disabled={!!editing}
            required
            error={!!formErrors.username}
            helperText={formErrors.username}
            fullWidth
          />
          <TextField
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setField("email", e.target.value)}
            required
            error={!!formErrors.email}
            helperText={formErrors.email}
            fullWidth
          />
          <TextField
            label={editing ? "Mật khẩu mới (tùy chọn)" : "Mật khẩu"}
            type="password"
            value={form.password}
            onChange={(e) => setField("password", e.target.value)}
            required={!editing}
            error={!!formErrors.password}
            helperText={formErrors.password}
            fullWidth
          />
          <TextField
            select
            label="Khoa"
            value={form.facultyId}
            onChange={(e) => setField("facultyId", e.target.value)}
            required
            fullWidth
            error={!!formErrors.facultyId}
            helperText={
              formErrors.facultyId || "Khoa đã có thư ký sẽ không xuất hiện"
            }
          >
            {availableFaculties.map((faculty) => (
              <MenuItem key={faculty.id} value={faculty.id}>
                {faculty.name} ({faculty.id})
              </MenuItem>
            ))}
          </TextField>
          {availableFaculties.length === 0 && (
            <Typography color="warning.main" variant="body2">
              Tất cả khoa đang có thư ký.
            </Typography>
          )}
        </Box>
      </Dialog>
    </Box>
  );
}

export default SecretaryAccountsTab;
