"use client";

import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Avatar,
  AvatarGroup,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Groups as CouncilIcon,
} from "@mui/icons-material";
import { mockCouncilMembers, getCouncilRoleLabel } from "@/feature/thesis/constants";
import type { CouncilMember } from "@/feature/thesis/types";

interface CouncilManagementProps {
  members?: CouncilMember[];
  onAdd?: (member: CouncilMember) => void;
  onEdit?: (member: CouncilMember) => void;
  onDelete?: (memberId: string) => void;
}

export function CouncilManagement({
  members = mockCouncilMembers,
  onAdd,
  onEdit,
  onDelete,
}: CouncilManagementProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<CouncilMember | null>(null);
  const [newMember, setNewMember] = useState<Partial<CouncilMember>>({
    name: "",
    role: "member",
    department: "",
  });

  const handleAdd = () => {
    if (newMember.name && newMember.department) {
      onAdd?.({
        id: `cm-${Date.now()}`,
        name: newMember.name!,
        role: newMember.role as CouncilMember["role"],
        department: newMember.department!,
      });
      setNewMember({ name: "", role: "member", department: "" });
      setIsAddDialogOpen(false);
    }
  };

  const handleEdit = () => {
    if (editingMember) {
      onEdit?.(editingMember);
      setEditingMember(null);
    }
  };

  // Group by role
  const chairman = members.filter((m) => m.role === "chairman");
  const secretary = members.filter((m) => m.role === "secretary");
  const members_list = members.filter((m) => m.role === "member");

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h6">Quản lý hội đồng bảo vệ</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsAddDialogOpen(true)}
        >
          Thêm thành viên
        </Button>
      </Box>

      {/* Statistics */}
      <Stack direction="row" spacing={3} sx={{ mb: 3 }}>
        <Paper sx={{ p: 2, flex: 1, textAlign: "center" }}>
          <Typography variant="h4" color="primary">
            {chairman.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Chủ tịch
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: 1, textAlign: "center" }}>
          <Typography variant="h4" color="secondary.main">
            {secretary.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Thư ký
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: 1, textAlign: "center" }}>
          <Typography variant="h4" color="default">
            {members_list.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Thành viên
          </Typography>
        </Paper>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "grey.100" }}>
              <TableCell sx={{ fontWeight: 600 }}>STT</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Họ tên</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Vai trò</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Khoa</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {members.map((member, index) => (
              <TableRow key={member.id} hover>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>
                      {member.name.charAt(0)}
                    </Avatar>
                    {member.name}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={getCouncilRoleLabel(member.role)}
                    size="small"
                    color={
                      member.role === "chairman"
                        ? "primary"
                        : member.role === "secretary"
                          ? "secondary"
                          : "default"
                    }
                  />
                </TableCell>
                <TableCell>{member.department}</TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => setEditingMember(member)}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => onDelete?.(member.id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Dialog */}
      <Dialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Thêm thành viên hội đồng</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Họ tên"
              value={newMember.name || ""}
              onChange={(e) => setNewMember((prev) => ({ ...prev, name: e.target.value }))}
            />
            <TextField
              label="Khoa"
              value={newMember.department || ""}
              onChange={(e) => setNewMember((prev) => ({ ...prev, department: e.target.value }))}
            />
            <TextField
              select
              label="Vai trò"
              value={newMember.role || "member"}
              onChange={(e) =>
                setNewMember((prev) => ({
                  ...prev,
                  role: e.target.value as CouncilMember["role"],
                }))
              }
            >
              <option value="chairman">Chủ tịch</option>
              <option value="secretary">Thư ký</option>
              <option value="member">Thành viên</option>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddDialogOpen(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleAdd}>
            Thêm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={Boolean(editingMember)}
        onClose={() => setEditingMember(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Chỉnh sửa thành viên</DialogTitle>
        <DialogContent>
          {editingMember && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Họ tên"
                value={editingMember.name}
                onChange={(e) =>
                  setEditingMember((prev) =>
                    prev ? { ...prev, name: e.target.value } : null
                  )
                }
              />
              <TextField
                label="Khoa"
                value={editingMember.department}
                onChange={(e) =>
                  setEditingMember((prev) =>
                    prev ? { ...prev, department: e.target.value } : null
                  )
                }
              />
              <TextField
                select
                label="Vai trò"
                value={editingMember.role}
                onChange={(e) =>
                  setEditingMember((prev) =>
                    prev
                      ? { ...prev, role: e.target.value as CouncilMember["role"] }
                      : null
                  )
                }
              >
                <option value="chairman">Chủ tịch</option>
                <option value="secretary">Thư ký</option>
                <option value="member">Thành viên</option>
              </TextField>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingMember(null)}>Hủy</Button>
          <Button variant="contained" onClick={handleEdit}>
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

import { useState } from "react";
