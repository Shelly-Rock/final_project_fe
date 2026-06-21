"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Switch,
  FormControlLabel,
  Badge,
  Paper,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  FolderOpen as FolderIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/shared/components";
import { mockTemplates } from "@/feature/templates/constants";
import type { TemplateItem, CategoryType, StageType, FileType } from "@/feature/templates/types";
import { categoryConfig, stageConfig } from "@/feature/templates/types";

const fileTypeOptions: FileType[] = ["docx", "doc", "pdf", "xlsx"];

const iconOptions = [
  { value: "folder", label: "Folder" },
  { value: "check", label: "Check" },
  { value: "swap", label: "Swap" },
  { value: "clock", label: "Clock" },
  { value: "team", label: "Team" },
  { value: "safety", label: "Safety" },
  { value: "trophy", label: "Trophy" },
  { value: "solution", label: "Solution" },
  { value: "calendar", label: "Calendar" },
  { value: "edit", label: "Edit" },
  { value: "file", label: "File" },
];

const colorOptions = [
  "#1890ff",
  "#52c41a",
  "#faad14",
  "#722ed1",
  "#eb2f96",
  "#fa8c16",
  "#13c2c2",
  "#2f54d2",
  "#a0d911",
  "#fa541c",
];

export default function ManageTemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<TemplateItem[]>(mockTemplates);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<TemplateItem | null>(null);
  const [formData, setFormData] = useState<Partial<TemplateItem>>({
    code: "",
    name: "",
    nameEn: "",
    description: "",
    icon: "file",
    color: "#1890ff",
    category: "student",
    stage: "execution",
    fileType: "docx",
    forRoles: ["student"],
    isActive: true,
  });
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const handleOpenModal = (template?: TemplateItem) => {
    if (template) {
      setEditingTemplate(template);
      setFormData({ ...template });
    } else {
      setEditingTemplate(null);
      setFormData({
        code: "",
        name: "",
        nameEn: "",
        description: "",
        icon: "file",
        color: "#1890ff",
        category: "student",
        stage: "execution",
        fileType: "docx",
        forRoles: ["student"],
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTemplate(null);
  };

  const handleSubmit = () => {
    if (!formData.code || !formData.name || !formData.nameEn) {
      setSnackbar({
        open: true,
        message: "Vui lòng điền đầy đủ thông tin bắt buộc",
        severity: "error",
      });
      return;
    }

    if (editingTemplate) {
      setTemplates(
        templates.map((t) =>
          t.id === editingTemplate.id ? { ...t, ...formData } as TemplateItem : t
        )
      );
      setSnackbar({ open: true, message: "Cập nhật biểu mẫu thành công", severity: "success" });
    } else {
      const newId = Math.max(...templates.map((t) => t.id)) + 1;
      setTemplates([...templates, { ...formData, id: newId, isActive: true } as TemplateItem]);
      setSnackbar({ open: true, message: "Thêm biểu mẫu thành công", severity: "success" });
    }

    handleCloseModal();
  };

  const handleDelete = (id: number) => {
    setTemplates(templates.filter((t) => t.id !== id));
    setSnackbar({ open: true, message: "Xóa biểu mẫu thành công", severity: "success" });
  };

  const handleRoleToggle = (role: CategoryType) => {
    const currentRoles = formData.forRoles || [];
    if (currentRoles.includes(role)) {
      setFormData({
        ...formData,
        forRoles: currentRoles.filter((r) => r !== role),
      });
    } else {
      setFormData({
        ...formData,
        forRoles: [...currentRoles, role],
      });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <PageHeader
        title="Quản lý biểu mẫu"
        subtitle="Thêm, sửa, xóa biểu mẫu khóa luận tốt nghiệp"
        actions={
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push("/templates")}
          >
            Quay lại
          </Button>
        }
      />

      {/* Actions Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body1">
              Tổng cộng: <strong>{templates.length}</strong> biểu mẫu
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenModal()}
            >
              Thêm biểu mẫu
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Templates Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "action.hover" }}>
                <TableCell sx={{ fontWeight: 600 }}>Mã</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Tên biểu mẫu</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Giai đoạn</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Vai trò</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>File</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {templates.map((template) => (
                <TableRow key={template.id} hover>
                  <TableCell>
                    <Chip label={template.code} size="small" color="primary" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box
                        sx={{
                          width: 28,
                          height: 28,
                          borderRadius: 1,
                          background: `${template.color}15`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: template.color,
                          fontSize: 14,
                        }}
                      >
                        <FolderIcon fontSize="small" />
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {template.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {template.nameEn}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={stageConfig[template.stage].label}
                      color={stageConfig[template.stage].color as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                      {template.forRoles.map((role) => (
                        <Chip
                          key={role}
                          label={categoryConfig[role].label}
                          color={categoryConfig[role].color as any}
                          size="small"
                        />
                      ))}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip label={template.fileType.toUpperCase()} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={template.isActive ? "Hoạt động" : "Tắt"}
                      color={template.isActive ? "success" : "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" justifyContent="center" spacing={0.5}>
                      <Tooltip title="Sửa">
                        <IconButton size="small" onClick={() => handleOpenModal(template)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(template.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingTemplate ? "Sửa biểu mẫu" : "Thêm biểu mẫu mới"}
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Mã biểu mẫu"
                value={formData.code || ""}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                fullWidth
                required
                placeholder="VD: NIIE-KLTN-01"
                size="small"
              />
              <FormControl fullWidth size="small">
                <InputLabel>Định dạng file</InputLabel>
                <Select
                  value={formData.fileType || "docx"}
                  label="Định dạng file"
                  onChange={(e) =>
                    setFormData({ ...formData, fileType: e.target.value as FileType })
                  }
                >
                  {fileTypeOptions.map((type) => (
                    <MenuItem key={type} value={type}>
                      .{type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Tên biểu mẫu (VI)"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                fullWidth
                required
                size="small"
              />
              <TextField
                label="Tên biểu mẫu (EN)"
                value={formData.nameEn || ""}
                onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                fullWidth
                required
                size="small"
              />
            </Stack>

            <TextField
              label="Mô tả"
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              fullWidth
              multiline
              rows={2}
              size="small"
            />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Giai đoạn</InputLabel>
                <Select
                  value={formData.stage || "execution"}
                  label="Giai đoạn"
                  onChange={(e) =>
                    setFormData({ ...formData, stage: e.target.value as StageType })
                  }
                >
                  {(Object.keys(stageConfig) as StageType[]).map((stage) => (
                    <MenuItem key={stage} value={stage}>
                      <Chip
                        label={stageConfig[stage].label}
                        color={stageConfig[stage].color as any}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel>Loại chính</InputLabel>
                <Select
                  value={formData.category || "student"}
                  label="Loại chính"
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value as CategoryType })
                  }
                >
                  {(Object.keys(categoryConfig) as CategoryType[]).map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      <Chip
                        label={categoryConfig[cat].label}
                        color={categoryConfig[cat].color as any}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            <FormControl fullWidth size="small">
              <InputLabel>Cho vai trò</InputLabel>
              <Select
                multiple
                value={formData.forRoles || []}
                label="Cho vai trò"
                renderValue={(selected) => (
                  <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                    {(selected as CategoryType[]).map((role) => (
                      <Chip
                        key={role}
                        label={categoryConfig[role].label}
                        color={categoryConfig[role].color as any}
                        size="small"
                      />
                    ))}
                  </Stack>
                )}
              >
                {(Object.keys(categoryConfig) as CategoryType[]).map((role) => (
                  <MenuItem key={role} value={role}>
                    <Switch
                      checked={(formData.forRoles || []).includes(role)}
                      onChange={() => handleRoleToggle(role)}
                      size="small"
                    />
                    <Chip
                      label={categoryConfig[role].label}
                      color={categoryConfig[role].color as any}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Icon</InputLabel>
                <Select
                  value={formData.icon || "file"}
                  label="Icon"
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                >
                  {iconOptions.map((icon) => (
                    <MenuItem key={icon.value} value={icon.value}>
                      {icon.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: "block" }}>
                  Màu sắc
                </Typography>
                <Stack direction="row" spacing={0.5}>
                  {colorOptions.map((color) => (
                    <Box
                      key={color}
                      onClick={() => setFormData({ ...formData, color })}
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: 1,
                        background: color,
                        cursor: "pointer",
                        border: formData.color === color ? "2px solid" : "1px solid #ddd",
                        borderColor: formData.color === color ? "primary.main" : undefined,
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            </Stack>

            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive ?? true}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
              }
              label="Hoạt động"
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseModal}>Hủy</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editingTemplate ? "Cập nhật" : "Thêm mới"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
