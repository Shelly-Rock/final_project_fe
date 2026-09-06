"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Chip,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Upload as UploadIcon,
  Description as DescriptionIcon,
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { toast } from "sonner";
import { progressTrackingService } from "../services";
import type { Template, TemplateType } from "../types";

interface TemplateUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (template: Template) => void;
  teacherId: number;
}

const TEMPLATE_TYPE_LABELS: Record<TemplateType, string> = {
  MONTHLY_REPORT: "Báo cáo tháng",
  MIDTERM_REPORT: "Báo cáo giữa kỳ",
  FINAL_REPORT: "Báo cáo cuối kỳ",
  PROPOSAL: "Đề xuất đề tài",
  PRESENTATION: "Bài trình bày",
};

const TEMPLATE_TYPE_DESCRIPTIONS: Record<TemplateType, string> = {
  MONTHLY_REPORT: "Template báo cáo tiến độ hàng tháng",
  MIDTERM_REPORT: "Template báo cáo kiểm tra giữa kỳ",
  FINAL_REPORT: "Template báo cáo tổng kết cuối kỳ",
  PROPOSAL: "Template đề xuất và phê duyệt đề tài",
  PRESENTATION: "Template bài trình bày bảo vệ đề tài",
};

export function TemplateUploadDialog({
  open,
  onClose,
  onSuccess,
  teacherId,
}: TemplateUploadDialogProps) {
  const [type, setType] = useState<TemplateType>("MONTHLY_REPORT");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const isValidFile = (file: File): boolean => {
    const validTypes = [".doc", ".docx", ".pdf"];
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    return validTypes.includes(ext);
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const droppedFile = e.dataTransfer.files[0];
        if (isValidFile(droppedFile)) {
          setFile(droppedFile);
          if (!name) {
            setName(droppedFile.name.replace(/\.[^/.]+$/, ""));
          }
        }
      }
    },
    [name],
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Vui lòng nhập tên template");
      return;
    }
    if (!file) {
      toast.error("Vui lòng chọn file");
      return;
    }

    setUploading(true);
    try {
      // Upload file first (mock - in real app, upload to storage)
      const fileUrl = `/uploads/${file.name}`;
      const template = await progressTrackingService.createTemplate({
        teacherId: teacherId,
        name: name.trim(),
        description: description.trim() || undefined,
        type,
        fileUrl,
        fileName: file.name,
        fileSize: file.size,
      });
      toast.success("Tải lên template thành công!");
      onSuccess?.(template);
      handleClose();
    } catch {
      toast.error("Có lỗi xảy ra khi tải lên");
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setType("MONTHLY_REPORT");
    setName("");
    setDescription("");
    setFile(null);
    setDragActive(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <UploadIcon color="primary" />
          Tải lên Template báo cáo
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Alert severity="info" sx={{ mb: 1 }}>
            Giảng viên có thể cung cấp biểu mẫu chuẩn (Template Word) cho Sinh
            viên viết báo cáo.
          </Alert>

          <FormControl fullWidth required>
            <InputLabel>Loại template</InputLabel>
            <Select
              value={type}
              label="Loại template"
              onChange={(e) => setType(e.target.value as TemplateType)}
            >
              {Object.entries(TEMPLATE_TYPE_LABELS).map(([value, label]) => (
                <MenuItem key={value} value={value}>
                  <Box>
                    <Typography variant="body1">{label}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {TEMPLATE_TYPE_DESCRIPTIONS[value as TemplateType]}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Tên template"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="VD: Báo cáo tiến độ tháng 8/2026"
            fullWidth
          />

          <TextField
            label="Mô tả (tùy chọn)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={2}
            fullWidth
          />

          {/* Drag & Drop Zone */}
          <Box
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            sx={{
              border: "2px dashed",
              borderColor: dragActive ? "primary.main" : "divider",
              borderRadius: 2,
              p: 3,
              textAlign: "center",
              bgcolor: dragActive ? "primary.50" : "background.default",
              transition: "all 0.2s",
              cursor: "pointer",
            }}
            component="label"
          >
            <input
              type="file"
              accept=".doc,.docx,.pdf"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            {file ? (
              <Box>
                <CheckCircleIcon color="success" sx={{ fontSize: 48, mb: 1 }} />
                <Typography variant="body1" fontWeight={500}>
                  {file.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {(file.size / 1024).toFixed(1)} KB
                </Typography>
              </Box>
            ) : (
              <Box>
                <CloudUploadIcon
                  sx={{ fontSize: 48, color: "text.disabled", mb: 1 }}
                />
                <Typography variant="body1" fontWeight={500}>
                  Kéo thả file hoặc click để chọn
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Hỗ trợ: .doc, .docx, .pdf
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} disabled={uploading}>
          Hủy
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={uploading || !name.trim() || !file}
          startIcon={
            uploading ? <CircularProgress size={20} /> : <UploadIcon />
          }
        >
          {uploading ? "Đang tải lên..." : "Tải lên"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ============================================================
// Template List Component
// ============================================================

interface TemplateListProps {
  onUploadClick?: () => void;
  teacherId?: number;
  showUploadButton?: boolean;
}

export function TemplateList({
  onUploadClick,
  teacherId,
  showUploadButton = true,
}: TemplateListProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const loadTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const result = await progressTrackingService.getTemplates(
        teacherId ? { teacherId } : undefined,
      );
      setTemplates(result.data);
    } catch {
      toast.error("Không thể tải danh sách template");
    } finally {
      setLoading(false);
    }
  }, [teacherId]);

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  const handleDelete = async (id: number) => {
    try {
      await progressTrackingService.deleteTemplate(id);
      toast.success("Đã xóa template");
      setDeleteConfirm(null);
      loadTemplates();
    } catch {
      toast.error("Không thể xóa template");
    }
  };

  const getTypeChipColor = (
    type: TemplateType,
  ): "primary" | "warning" | "success" | "info" | "default" => {
    switch (type) {
      case "MONTHLY_REPORT":
        return "primary";
      case "MIDTERM_REPORT":
        return "warning";
      case "FINAL_REPORT":
        return "success";
      case "PROPOSAL":
        return "info";
      case "PRESENTATION":
        return "default";
      default:
        return "default";
    }
  };

  const getTypeLabel = (type: TemplateType): string => {
    return TEMPLATE_TYPE_LABELS[type] || type;
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">
          Danh sách Template ({templates.length})
        </Typography>
        {showUploadButton && onUploadClick && (
          <Button
            startIcon={<UploadIcon />}
            onClick={onUploadClick}
            variant="outlined"
          >
            Tải lên Template mới
          </Button>
        )}
      </Box>

      {templates.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <DescriptionIcon
            sx={{ fontSize: 64, color: "text.disabled", mb: 2 }}
          />
          <Typography variant="h6" color="text.secondary">
            Chưa có Template nào
          </Typography>
          {showUploadButton && onUploadClick && (
            <Button
              sx={{ mt: 2 }}
              startIcon={<UploadIcon />}
              onClick={onUploadClick}
              variant="contained"
            >
              Tải lên Template đầu tiên
            </Button>
          )}
        </Paper>
      ) : (
        <List>
          {templates.map((template) => (
            <Paper key={template.id} sx={{ mb: 1 }}>
              <ListItem
                secondaryAction={
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Chip
                      label={getTypeLabel(template.type)}
                      size="small"
                      color={getTypeChipColor(template.type)}
                    />
                    <IconButton
                      edge="end"
                      onClick={() => setDeleteConfirm(template.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemIcon>
                  <DescriptionIcon />
                </ListItemIcon>
                <ListItemText
                  primary={template.name}
                  secondary={
                    <Box>
                      <Typography
                        variant="caption"
                        component="span"
                        sx={{ display: "block" }}
                      >
                        {template.description || "Không có mô tả"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        File: {template.fileName} •{" "}
                        {(template.fileSize / 1024).toFixed(1)} KB
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            </Paper>
          ))}
        </List>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
      >
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc muốn xóa template này?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)}>Hủy</Button>
          <Button
            color="error"
            onClick={() =>
              deleteConfirm !== null && handleDelete(deleteConfirm)
            }
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
