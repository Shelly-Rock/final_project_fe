"use client";

import React, { useState, useMemo } from "react";
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
  Snackbar,
  Alert,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  FolderOpen as FolderIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  FileUpload as UploadIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/shared/components";
import { mockTemplates } from "@/feature/templates/constants";
import { TemplateFormModal } from "@/feature/templates/components";
import type { TemplateItem, StageType } from "@/feature/templates/types";
import { categoryConfig, stageConfig } from "@/feature/templates/types";

export default function ManageTemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<TemplateItem[]>(mockTemplates);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<TemplateItem | null>(
    null,
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<TemplateItem | null>(
    null,
  );
  const [searchText, setSearchText] = useState("");
  const [filterStage, setFilterStage] = useState<StageType | "all">("all");
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const filteredTemplates = useMemo(() => {
    return templates.filter((t) => {
      const matchSearch =
        searchText === "" ||
        t.name.toLowerCase().includes(searchText.toLowerCase()) ||
        t.code.toLowerCase().includes(searchText.toLowerCase()) ||
        t.nameEn.toLowerCase().includes(searchText.toLowerCase());

      const matchStage = filterStage === "all" || t.stage === filterStage;

      return matchSearch && matchStage;
    });
  }, [templates, searchText, filterStage]);

  const handleOpenFormModal = (template?: TemplateItem) => {
    setEditingTemplate(template || null);
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setEditingTemplate(null);
  };

  const handleSubmitForm = (formData: Partial<TemplateItem>) => {
    if (editingTemplate) {
      setTemplates(
        templates.map((t) =>
          t.id === editingTemplate.id
            ? ({ ...t, ...formData } as TemplateItem)
            : t,
        ),
      );
      setSnackbar({
        open: true,
        message: "Cập nhật biểu mẫu thành công",
        severity: "success",
      });
    } else {
      const newId = Math.max(...templates.map((t) => t.id), 0) + 1;
      setTemplates([
        ...templates,
        { ...formData, id: newId, isActive: true } as TemplateItem,
      ]);
      setSnackbar({
        open: true,
        message: "Thêm biểu mẫu thành công",
        severity: "success",
      });
    }
  };

  const handleOpenDeleteDialog = (template: TemplateItem) => {
    setTemplateToDelete(template);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (templateToDelete) {
      setTemplates(templates.filter((t) => t.id !== templateToDelete.id));
      setSnackbar({
        open: true,
        message: "Xóa biểu mẫu thành công",
        severity: "success",
      });
    }
    setDeleteDialogOpen(false);
    setTemplateToDelete(null);
  };

  const handleToggleActive = (template: TemplateItem) => {
    setTemplates(
      templates.map((t) =>
        t.id === template.id ? { ...t, isActive: !t.isActive } : t,
      ),
    );
    setSnackbar({
      open: true,
      message: `${template.isActive ? "Tắt" : "Bật"} biểu mẫu thành công`,
      severity: "success",
    });
  };

  const handleRefresh = () => {
    setTemplates([...mockTemplates]);
    setSearchText("");
    setFilterStage("all");
    setSnackbar({
      open: true,
      message: "Đã làm mới dữ liệu",
      severity: "info",
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <PageHeader
        title="Quản lý biểu mẫu"
        subtitle="Thêm, sửa, xóa và quản lý các biểu mẫu khóa luận tốt nghiệp"
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

      {/* Stats Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "repeat(4, 1fr)",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <Card>
          <CardContent sx={{ textAlign: "center" }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: "primary.main" }}
            >
              {templates.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tổng biểu mẫu
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent sx={{ textAlign: "center" }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: "success.main" }}
            >
              {templates.filter((t) => t.isActive).length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Đang hoạt động
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent sx={{ textAlign: "center" }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: "warning.main" }}
            >
              {templates.filter((t) => !t.isActive).length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Bị tắt
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent sx={{ textAlign: "center" }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: "info.main" }}
            >
              {filteredTemplates.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Đang hiển thị
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Actions Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", md: "center" }}
            spacing={2}
          >
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{ flex: 1 }}
            >
              <TextField
                size="small"
                placeholder="Tìm kiếm biểu mẫu..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ minWidth: 250 }}
              />
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Giai đoạn</InputLabel>
                <Select
                  value={filterStage}
                  label="Giai đoạn"
                  onChange={(e) =>
                    setFilterStage(e.target.value as StageType | "all")
                  }
                >
                  <MenuItem value="all">Tất cả</MenuItem>
                  {(Object.keys(stageConfig) as StageType[]).map((stage) => (
                    <MenuItem key={stage} value={stage}>
                      {stageConfig[stage].label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Tooltip title="Làm mới">
                <IconButton onClick={handleRefresh}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Stack>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenFormModal()}
            >
              Thêm biểu mẫu
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Templates Table */}
      <Card>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "action.hover" }}>
                <TableCell sx={{ fontWeight: 600, width: 100 }}>Mã</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Tên biểu mẫu</TableCell>
                <TableCell sx={{ fontWeight: 600, width: 120 }}>
                  Giai đoạn
                </TableCell>
                <TableCell sx={{ fontWeight: 600, width: 180 }}>
                  Vai trò
                </TableCell>
                <TableCell sx={{ fontWeight: 600, width: 80 }}>File</TableCell>
                <TableCell sx={{ fontWeight: 600, width: 100 }}>
                  Trạng thái
                </TableCell>
                <TableCell sx={{ fontWeight: 600, width: 120 }} align="center">
                  Thao tác
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTemplates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      Không tìm thấy biểu mẫu nào
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredTemplates.map((template) => (
                  <TableRow key={template.id} hover>
                    <TableCell>
                      <Chip
                        label={template.code}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: 1.5,
                            background: `${template.color}15`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: template.color,
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
                        color={stageConfig[template.stage].color}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Stack
                        direction="row"
                        spacing={0.5}
                        flexWrap="wrap"
                        useFlexGap
                      >
                        {template.forRoles.slice(0, 2).map((role) => (
                          <Chip
                            key={role}
                            label={categoryConfig[role].label}
                            color={categoryConfig[role].color}
                            size="small"
                          />
                        ))}
                        {template.forRoles.length > 2 && (
                          <Chip
                            label={`+${template.forRoles.length - 2}`}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={template.fileType.toUpperCase()}
                        size="small"
                        variant="outlined"
                        icon={<UploadIcon style={{ fontSize: 14 }} />}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={template.isActive ? "Hoạt động" : "Tắt"}
                        color={template.isActive ? "success" : "default"}
                        size="small"
                        onClick={() => handleToggleActive(template)}
                        sx={{ cursor: "pointer" }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Stack
                        direction="row"
                        justifyContent="center"
                        spacing={0.5}
                      >
                        <Tooltip title="Sửa">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleOpenFormModal(template)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleOpenDeleteDialog(template)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Form Modal */}
      <TemplateFormModal
        open={isFormModalOpen}
        template={editingTemplate}
        onClose={handleCloseFormModal}
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
            Bạn có chắc chắn muốn xóa biểu mẫu{" "}
            <strong>{templateToDelete?.name}</strong> không?
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
