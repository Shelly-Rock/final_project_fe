import type { Meta, StoryObj } from "@storybook/react";
import { useState, useCallback } from "react";
import {
  Box,
  Button,
  Chip,
  Paper,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import {
  PermissionGuard,
  ProtectedComponent,
  RoleGate,
} from "./PermissionGuard";
import type { Action, Resource, Role } from "@/core/permissions/types";

const ROLE_PERMISSIONS: Record<
  Role,
  { action: Action | "manage"; resource: Resource | "all" }[]
> = {
  admin: [
    { action: "manage", resource: "all" },
    { action: "create", resource: "user" },
    { action: "read", resource: "user" },
    { action: "update", resource: "user" },
    { action: "delete", resource: "user" },
    { action: "manage", resource: "thesis" },
    { action: "manage", resource: "setting" },
  ],
  secretary: [
    { action: "create", resource: "user" },
    { action: "read", resource: "user" },
    { action: "update", resource: "user" },
    { action: "manage", resource: "thesis" },
    { action: "manage", resource: "announcement" },
  ],
  teacher: [
    { action: "read", resource: "thesis" },
    { action: "review", resource: "thesis" },
    { action: "create", resource: "thesis_score" },
    { action: "manage", resource: "thesis_review" },
  ],
  student: [
    { action: "read", resource: "thesis" },
    { action: "submit", resource: "thesis" },
    { action: "read", resource: "announcement" },
  ],
};

const mockAbility = {
  can: (
    action: Action | "manage",
    resource: Resource | "all",
    role: Role | null,
  ) => {
    if (role === "admin") return true;
    if (!role) return false;
    const permissions = ROLE_PERMISSIONS[role];
    return permissions.some(
      (p) =>
        (p.action === "manage" || p.action === action) &&
        (p.resource === "all" || p.resource === resource),
    );
  },
  cannot: (
    action: Action | "manage",
    resource: Resource | "all",
    role: Role | null,
  ) => {
    return !mockAbility.can(action, resource, role);
  },
};

const PermissionContextValue = {
  role: "admin" as Role | null,
  can: (action: Action | "manage", resource: Resource | "all") =>
    mockAbility.can(action, resource, "admin"),
  cannot: (action: Action | "manage", resource: Resource | "all") =>
    mockAbility.cannot(action, resource, "admin"),
  ability: {
    can: (action: Action | "manage", resource: Resource | "all") =>
      mockAbility.can(action, resource, "admin"),
    cannot: (action: Action | "manage", resource: Resource | "all") =>
      mockAbility.cannot(action, resource, "admin"),
  },
  setRole: () => {},
};

const meta = {
  title: "Shared/PermissionGuard",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta;

export default meta;

const AdminBadge = () => <Chip label="Admin" size="small" color="primary" />;

export const PermissionGuardDemo: StoryObj = {
  render: () => (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 600 }}
    >
      <Typography variant="h6" gutterBottom>
        PermissionGuard - Kiểm tra quyền
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Component hiển thị nội dung dựa trên quyền của user.
      </Typography>

      <Paper sx={{ p: 2, bgcolor: "#f8f9fa" }}>
        <Typography variant="subtitle2" gutterBottom>
          Role: <AdminBadge />
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Action: <strong>manage</strong> on <strong>user</strong>
        </Typography>
        <PermissionGuard
          action="manage"
          resource="user"
          fallback={<Typography color="error">Bạn không có quyền</Typography>}
        >
          <Button variant="contained" color="success" fullWidth>
            Có quyền - Thực hiện thao tác
          </Button>
        </PermissionGuard>
      </Paper>
    </Box>
  ),
};

export const RoleGateDemo: StoryObj = {
  render: function RoleGateDemoRender() {
    const [selectedRole, setSelectedRole] = useState<string>("admin");

    const currentRole = selectedRole as Role;

    return (
      <Box
        sx={{ display: "flex", flexDirection: "column", gap: 3, maxWidth: 600 }}
      >
        <Typography variant="h6">RoleGate - Kiểm tra vai trò</Typography>
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Chọn vai trò:
          </Typography>
          <ToggleButtonGroup
            value={selectedRole}
            exclusive
            onChange={(_, v) => v && setSelectedRole(v)}
            size="small"
          >
            <ToggleButton value="admin">Admin</ToggleButton>
            <ToggleButton value="secretary">Secretary</ToggleButton>
            <ToggleButton value="teacher">Teacher</ToggleButton>
            <ToggleButton value="student">Student</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Typography variant="body2" color="text.secondary">
          Vai trò hiện tại: <Chip label={selectedRole} size="small" />
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="subtitle2" color="primary">
            {'<RoleGate roles={["admin", "secretary"]}>'}
          </Typography>
          <RoleGate roles={["admin", "secretary"]}>
            <Paper sx={{ p: 2, bgcolor: "#e3f2fd" }}>
              <Typography color="primary" fontWeight="bold">
                Nội dung chỉ Admin và Secretary mới thấy
              </Typography>
            </Paper>
          </RoleGate>
          <RoleGate
            roles={["admin", "secretary"]}
            fallback={
              <Typography color="error">
                Bạn không có vai trò phù hợp
              </Typography>
            }
          >
            <></>
          </RoleGate>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="subtitle2" color="success.main">
            {'<RoleGate roles="teacher">'}
          </Typography>
          <RoleGate roles="teacher">
            <Paper sx={{ p: 2, bgcolor: "#e8f5e9" }}>
              <Typography color="success.main" fontWeight="bold">
                Nội dung chỉ Teacher mới thấy
              </Typography>
            </Paper>
          </RoleGate>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="subtitle2" color="warning.main">
            {'<RoleGate roles={["admin", "secretary", "teacher"]}>'}
          </Typography>
          <RoleGate roles={["admin", "secretary", "teacher"]}>
            <Paper sx={{ p: 2, bgcolor: "#fff3e0" }}>
              <Typography color="warning.main" fontWeight="bold">
                Nội dung cho nhiều vai trò (Admin, Secretary, Teacher)
              </Typography>
            </Paper>
          </RoleGate>
        </Box>
      </Box>
    );
  },
};

export const ProtectedComponentWithMessage: StoryObj = {
  render: () => (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 600 }}
    >
      <Typography variant="h6" gutterBottom>
        ProtectedComponent - Với thông báo mặc định
      </Typography>

      <ProtectedComponent action="delete" resource="user">
        <Paper sx={{ p: 3, bgcolor: "#ffebee" }}>
          <Typography color="error" fontWeight="bold">
            Panel xóa người dùng (cần quyền delete user)
          </Typography>
        </Paper>
      </ProtectedComponent>

      <ProtectedComponent
        action="manage"
        resource="setting"
        message="Bạn không có quyền quản lý cài đặt hệ thống."
      >
        <Paper sx={{ p: 3, bgcolor: "#e3f2fd" }}>
          <Typography color="primary" fontWeight="bold">
            Panel cài đặt hệ thống
          </Typography>
        </Paper>
      </ProtectedComponent>

      <ProtectedComponent
        action="manage"
        resource="thesis"
        fallback={
          <Typography color="text.secondary">Nội dung thay thế</Typography>
        }
      >
        <Paper sx={{ p: 3, bgcolor: "#f3e8ff" }}>
          <Typography color="secondary" fontWeight="bold">
            Panel quản lý khóa luận
          </Typography>
        </Paper>
      </ProtectedComponent>
    </Box>
  ),
};

export const PermissionMatrix: StoryObj = {
  render: () => {
    const roles: Role[] = ["admin", "secretary", "teacher", "student"];
    const permissions: { action: Action | "manage"; resource: Resource }[] = [
      { action: "manage", resource: "user" },
      { action: "manage", resource: "thesis" },
      { action: "manage", resource: "setting" },
      { action: "read", resource: "thesis" },
      { action: "submit", resource: "thesis" },
    ];

    return (
      <Box sx={{ maxWidth: 800 }}>
        <Typography variant="h6" gutterBottom>
          Ma trận quyền
        </Typography>
        <Paper sx={{ p: 2, overflowX: "auto" }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                pb: 1,
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              <Box sx={{ minWidth: 150, fontWeight: "bold" }}>Quyền</Box>
              {roles.map((role) => (
                <Box
                  key={role}
                  sx={{
                    minWidth: 100,
                    textAlign: "center",
                    fontWeight: "bold",
                    textTransform: "capitalize",
                  }}
                >
                  {role}
                </Box>
              ))}
            </Box>
            {permissions.map((perm) => (
              <Box
                key={`${perm.action}-${perm.resource}`}
                sx={{ display: "flex", gap: 1, py: 0.5 }}
              >
                <Box sx={{ minWidth: 150 }}>
                  <Chip size="small" label={perm.action} sx={{ mr: 1 }} />
                  <Typography variant="caption">{perm.resource}</Typography>
                </Box>
                {roles.map((role) => (
                  <Box key={role} sx={{ minWidth: 100, textAlign: "center" }}>
                    {mockAbility.can(perm.action, perm.resource, role) ? (
                      <Chip size="small" label="Có" color="success" />
                    ) : (
                      <Chip
                        size="small"
                        label="Không"
                        color="error"
                        variant="outlined"
                      />
                    )}
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        </Paper>
      </Box>
    );
  },
};
