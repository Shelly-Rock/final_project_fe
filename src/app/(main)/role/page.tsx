"use client";

import { useEffect, useMemo, useState, useCallback, Fragment } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Checkbox,
  Table as MuiTable,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Tabs,
  Tab,
  TextField,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { PageHeader } from "@/shared/components";
import { ShieldCheck, Users, Save, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "@/shared/theme";
import {
  roleService,
  type RoleItem,
  type PermissionItem,
  type UserWithRoles,
} from "@/feature/role/services/role.service";
import { ROLE_COLORS, type Role } from "@/core/permissions/types";
import { Dialog } from "@/shared/components/Dialog";
import { MultiSelect } from "@/shared/components/Select";

// ---------- Helpers ----------

const ACTION_LABEL: Record<string, string> = {
  read: "Xem",
  create: "Tạo",
  update: "Sửa",
  delete: "Xóa",
};

const ACTION_ORDER = ["read", "create", "update", "delete"];

const MODULE_LABEL: Record<string, string> = {
  role: "Vai trò",
  user: "Tài khoản",
  student: "Sinh viên",
  teacher: "Giảng viên",
};

function moduleLabel(m: string) {
  return MODULE_LABEL[m] ?? m;
}

function actionLabel(a: string) {
  return ACTION_LABEL[a] ?? a;
}

// ---------- Matrix Tab ----------

function MatrixTab({
  roles,
  permissions,
  onSaved,
}: {
  roles: RoleItem[];
  permissions: PermissionItem[];
  onSaved: () => void;
}) {
  const { resolvedMode } = useTheme();
  const isDark = resolvedMode === "dark";

  // Group permissions by module
  const modules = useMemo(() => {
    const map = new Map<string, PermissionItem[]>();
    for (const p of permissions) {
      if (!map.has(p.module)) map.set(p.module, []);
      map.get(p.module)!.push(p);
    }
    // sort actions within each module
    for (const [, arr] of map) {
      arr.sort(
        (a, b) =>
          ACTION_ORDER.indexOf(a.action) - ACTION_ORDER.indexOf(b.action),
      );
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [permissions]);

  // pending: roleId -> Set<permissionId>
  const [pending, setPending] = useState<Map<number, Set<number>>>(
    () => new Map(),
  );
  const [saving, setSaving] = useState(false);
  const [focusRoleId, setFocusRoleId] = useState<number | "all">("all");

  // init pending from roles
  useEffect(() => {
    const m = new Map<number, Set<number>>();
    for (const r of roles) {
      m.set(r.id, new Set(r.permissions.map((p) => p.id)));
    }
    setPending(m);
  }, [roles]);

  const toggle = useCallback((roleId: number, permId: number) => {
    setPending((prev) => {
      const next = new Map(prev);
      const s = new Set(next.get(roleId) ?? []);
      if (s.has(permId)) s.delete(permId);
      else s.add(permId);
      next.set(roleId, s);
      return next;
    });
  }, []);

  const isDirty = useMemo(() => {
    for (const r of roles) {
      const original = new Set(r.permissions.map((p) => p.id));
      const cur = pending.get(r.id) ?? new Set();
      if (original.size !== cur.size) return true;
      for (const id of original) if (!cur.has(id)) return true;
    }
    return false;
  }, [roles, pending]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const dirtyRoles: RoleItem[] = [];
      for (const r of roles) {
        const original = new Set(r.permissions.map((p) => p.id));
        const cur = pending.get(r.id) ?? new Set();
        const same =
          original.size === cur.size &&
          [...original].every((id) => cur.has(id));
        if (!same) dirtyRoles.push(r);
      }
      if (dirtyRoles.length === 0) {
        toast.info("Không có thay đổi để lưu");
        return;
      }
      for (const r of dirtyRoles) {
        const ids = [...(pending.get(r.id) ?? [])];
        await roleService.updateRolePermissions(r.id, ids);
      }
      toast.success(`Đã lưu phân quyền cho ${dirtyRoles.length} vai trò`);
      onSaved();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Lưu phân quyền thất bại";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    const m = new Map<number, Set<number>>();
    for (const r of roles) m.set(r.id, new Set(r.permissions.map((p) => p.id)));
    setPending(m);
  };

  const visibleRoles =
    focusRoleId === "all" ? roles : roles.filter((r) => r.id === focusRoleId);

  return (
    <Box>
      {/* Header controls */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          flexWrap: "wrap",
          mb: 2,
        }}
      >
        <TextField
          select
          size="small"
          label="Vai trò"
          value={focusRoleId}
          onChange={(e) => {
            const v = e.target.value as string;
            setFocusRoleId(v === "all" ? "all" : Number(v));
          }}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="all">Tất cả vai trò</MenuItem>
          {roles.map((r) => (
            <MenuItem key={r.id} value={r.id}>
              {r.display_name} ({r.name})
            </MenuItem>
          ))}
        </TextField>

        <Box sx={{ flex: 1 }} />

        <Button
          variant="outlined"
          startIcon={<RefreshCw size={16} />}
          onClick={handleReset}
          disabled={!isDirty || saving}
        >
          Đặt lại
        </Button>
        <Button
          variant="contained"
          startIcon={
            saving ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <Save size={16} />
            )
          }
          onClick={handleSave}
          disabled={!isDirty || saving}
        >
          Lưu thay đổi
        </Button>
      </Box>

      {/* Matrix table */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: isDark ? "#334155" : "#e2e8f0",
          borderRadius: 2,
          overflowX: "auto",
        }}
      >
        <MuiTable size="small" stickyHeader>
          <TableHead>
            <TableRow
              sx={{
                bgcolor: isDark ? "#1e293b" : "#f1f5f9",
                "& th": {
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                  borderBottom: "2px solid",
                  borderColor: isDark ? "#334155" : "#e2e8f0",
                  bgcolor: isDark ? "#1e293b" : "#f1f5f9",
                },
              }}
            >
              <TableCell sx={{ minWidth: 160 }}>Module / Quyền</TableCell>
              {visibleRoles.map((r) => (
                <TableCell key={r.id} align="center" sx={{ minWidth: 110 }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 0.25,
                    }}
                  >
                    <span>{r.display_name}</span>
                    <Chip
                      label={r.name}
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: 10,
                        bgcolor:
                          ROLE_COLORS[r.name.toLowerCase() as Role]?.bg ??
                          "#e2e8f0",
                        color:
                          ROLE_COLORS[r.name.toLowerCase() as Role]?.color ??
                          "#334155",
                      }}
                    />
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {modules.map(([mod, perms]) => (
              <Fragment key={`mod-${mod}`}>
                <TableRow
                  sx={{
                    bgcolor: isDark ? "#0f172a" : "#f8fafc",
                    "& td": {
                      fontWeight: 700,
                      borderBottom: "1px solid",
                      borderColor: isDark ? "#334155" : "#e2e8f0",
                    },
                  }}
                >
                  <TableCell colSpan={visibleRoles.length + 1}>
                    {moduleLabel(mod)}{" "}
                    <Typography
                      component="span"
                      variant="caption"
                      color="text.secondary"
                    >
                      ({mod})
                    </Typography>
                  </TableCell>
                </TableRow>
                {perms.map((perm) => (
                  <TableRow
                    key={perm.id}
                    hover
                    sx={{
                      "& td": {
                        borderBottom: "1px solid",
                        borderColor: isDark ? "#1e293b" : "#f1f5f9",
                      },
                    }}
                  >
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Typography variant="body2" sx={{ minWidth: 80 }}>
                          {actionLabel(perm.action)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {perm.name}
                        </Typography>
                      </Box>
                      {perm.description && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "block" }}
                        >
                          {perm.description}
                        </Typography>
                      )}
                    </TableCell>
                    {visibleRoles.map((r) => {
                      const checked = pending.get(r.id)?.has(perm.id) ?? false;
                      return (
                        <TableCell key={r.id} align="center">
                          <Checkbox
                            size="small"
                            checked={checked}
                            onChange={() => toggle(r.id, perm.id)}
                          />
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </Fragment>
            ))}
            {modules.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={visibleRoles.length + 1}
                  align="center"
                  sx={{ py: 4 }}
                >
                  <Typography color="text.secondary">
                    Chưa có permission nào
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </MuiTable>
      </TableContainer>

      {!isDirty && roles.length > 0 && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mt: 1 }}
        >
          Tick/untick các ô rồi bấm &quot;Lưu thay đổi&quot; để cập nhật phân
          quyền.
        </Typography>
      )}
    </Box>
  );
}

// ---------- Users Tab ----------

function UsersTab({ roles }: { roles: RoleItem[] }) {
  const { resolvedMode } = useTheme();
  const isDark = resolvedMode === "dark";
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const limit = 20;

  const [editUser, setEditUser] = useState<UserWithRoles | null>(null);
  const [editRoleIds, setEditRoleIds] = useState<(string | number)[]>([]);
  const [savingUser, setSavingUser] = useState(false);

  const roleOptions = useMemo(
    () =>
      roles.map((r) => ({
        value: String(r.id),
        label: `${r.display_name} (${r.name})`,
      })),
    [roles],
  );

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await roleService.getUsersWithRoles({
        page,
        limit,
        search: search || undefined,
      });
      setUsers(res.data);
      setTotal(res.total);
    } catch (e: unknown) {
      const msg =
        e instanceof Error ? e.message : "Không tải được danh sách tài khoản";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const openEdit = (u: UserWithRoles) => {
    setEditUser(u);
    setEditRoleIds(u.roles.map((r) => String(r.id)));
  };

  const handleSaveUser = async () => {
    if (!editUser) return;
    setSavingUser(true);
    try {
      await roleService.assignUserRoles(editUser.id, editRoleIds.map(Number));
      toast.success("Cập nhật vai trò thành công");
      setEditUser(null);
      fetchUsers();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Cập nhật vai trò thất bại";
      toast.error(msg);
    } finally {
      setSavingUser(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
        <TextField
          size="small"
          placeholder="Tìm theo email hoặc username..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          sx={{ minWidth: 280, flex: 1, maxWidth: 400 }}
        />
        <Button variant="outlined" onClick={fetchUsers} disabled={loading}>
          {loading ? <CircularProgress size={16} /> : "Làm mới"}
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: isDark ? "#334155" : "#e2e8f0",
          borderRadius: 2,
        }}
      >
        <MuiTable size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: isDark ? "#1e293b" : "#f8fafc" }}>
              <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Tài khoản</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Vai trò</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="center">
                Thao tác
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    Không có dữ liệu
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              users.map((u) => (
                <TableRow key={u.id} hover>
                  <TableCell>{u.id}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{u.username}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                      {u.roles.length === 0 ? (
                        <Chip label="—" size="small" variant="outlined" />
                      ) : (
                        u.roles.map((r) => {
                          const c = ROLE_COLORS[r.name.toLowerCase() as Role];
                          return (
                            <Chip
                              key={r.id}
                              label={r.display_name}
                              size="small"
                              sx={
                                c
                                  ? {
                                      bgcolor: c.bg,
                                      color: c.color,
                                      borderColor: c.border,
                                      borderWidth: 1,
                                      borderStyle: "solid",
                                    }
                                  : undefined
                              }
                            />
                          );
                        })
                      )}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Chỉnh vai trò">
                      <IconButton size="small" onClick={() => openEdit(u)}>
                        <ShieldCheck size={16} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </MuiTable>
      </TableContainer>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 1.5,
        }}
      >
        <Typography variant="caption" color="text.secondary">
          Tổng {total} tài khoản — Trang {page}/{totalPages}
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Trước
          </Button>
          <Button
            size="small"
            variant="outlined"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Sau
          </Button>
        </Box>
      </Box>

      {/* Edit dialog */}
      <Dialog
        open={!!editUser}
        onClose={() => setEditUser(null)}
        title={editUser ? `Gán vai trò — ${editUser.username}` : "Gán vai trò"}
        actions={
          <>
            <Button
              variant="outlined"
              onClick={() => setEditUser(null)}
              disabled={savingUser}
            >
              Hủy
            </Button>
            <Button
              variant="contained"
              onClick={handleSaveUser}
              disabled={savingUser}
            >
              {savingUser ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                "Lưu"
              )}
            </Button>
          </>
        }
      >
        <Box sx={{ minWidth: 360, pt: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Chọn một hoặc nhiều vai trò cho tài khoản này. Để trống nếu muốn gỡ
            hết vai trò (không khuyến nghị).
          </Typography>
          <MultiSelect
            label="Vai trò"
            placeholder="Chọn vai trò..."
            options={roleOptions}
            value={editRoleIds}
            onChange={setEditRoleIds}
          />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mt: 1 }}
          >
            Vai trò hệ thống (is_system) vẫn có thể gán — việc xóa role hệ thống
            bị chặn ở BE.
          </Typography>
        </Box>
      </Dialog>
    </Box>
  );
}

// ---------- Page ----------

export default function RolePermissionsPage() {
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [permissions, setPermissions] = useState<PermissionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [r, p] = await Promise.all([
        roleService.getRoles(),
        roleService.getPermissionsCatalog(),
      ]);
      setRoles(r);
      setPermissions(p);
    } catch (e: unknown) {
      const msg =
        e instanceof Error ? e.message : "Không tải được dữ liệu phân quyền";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  if (loading) {
    return (
      <Box sx={{ p: 3, display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, width: "100%" }}>
      <PageHeader
        title="Quản lý phân quyền"
        subtitle="Ma trận quyền theo vai trò và gán vai trò cho tài khoản"
        illustration={<ShieldCheck size={56} strokeWidth={1.5} />}
        showBgImage
      />

      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{ px: 2, borderBottom: "1px solid", borderColor: "divider" }}
        >
          <Tab
            icon={<ShieldCheck size={16} />}
            iconPosition="start"
            label="Ma trận quyền"
          />
          <Tab
            icon={<Users size={16} />}
            iconPosition="start"
            label="Tài khoản & vai trò"
          />
        </Tabs>
        <Box sx={{ p: 2.5 }}>
          {tab === 0 && (
            <MatrixTab
              roles={roles}
              permissions={permissions}
              onSaved={fetchAll}
            />
          )}
          {tab === 1 && <UsersTab roles={roles} />}
        </Box>
      </Paper>
    </Box>
  );
}
