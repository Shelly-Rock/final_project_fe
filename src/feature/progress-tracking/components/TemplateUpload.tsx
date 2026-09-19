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
  FormHelperText,
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

interface DeadlineOption {
  id: number;
  label: string;
}
import {
  Upload as UploadIcon,
  Description as DescriptionIcon,
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
  CheckCircle as CheckCircleIcon,
  Visibility as VisibilityIcon,
  Sync as SyncIcon,
} from "@mui/icons-material";
import { toast } from "sonner";
import { progressTrackingService } from "../services";
import type { Template } from "../types";
import { apiClient } from "@/shared/services/api-client";

interface TemplateUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (template: Template) => void;
  replaceTemplate?: Template | null;
}

export function TemplateUploadDialog({
  open,
  onClose,
  onSuccess,
  replaceTemplate,
}: TemplateUploadDialogProps) {
  const [periodId, setPeriodId] = useState<number | "">("");
  const [deadlineIds, setDeadlineIds] = useState<number[]>([]);
  const [deadlines, setDeadlines] = useState<DeadlineOption[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (open) {
      if (replaceTemplate) {
        setName(replaceTemplate.name);
        setDescription(replaceTemplate.description || "");
      } else {
        setName("");
        setDescription("");
      }
      setFile(null);
      setDeadlineIds([]);

      // Load deadlines for mapping
      const loadDeadlines = async () => {
        try {
          const result = await progressTrackingService.getTimeline({
            periodId: periodId as number,
          });
          setDeadlines(result);
        } catch (error) {
          console.error("Failed to load timelines", error);
        }
      };
      loadDeadlines();
    }
  }, [open, replaceTemplate, periodId]);

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
      // Upload file first using API client instead of mock string
      const uploadRes = (await apiClient.uploadFile(
        "/upload/templates",
        file,
        "file",
      )) as {
        file_url?: string;
        url?: string;
      };

      const template = await progressTrackingService.createTemplate({
        name: name.trim(),
        description: description.trim() || undefined,
        periodId: periodId ? Number(periodId) : undefined,
        deadlineIds: deadlineIds.length > 0 ? deadlineIds : undefined,
        fileUrl: uploadRes.file_url || uploadRes.url || `/uploads/${file.name}`,
        fileName: file.name,
        fileSize: file.size,
      });

      if (replaceTemplate) {
        try {
          await progressTrackingService.deleteTemplate(replaceTemplate.id);
        } catch (e) {
          console.error("Lỗi xóa file cũ:", e);
        }
      }

      toast.success(
        replaceTemplate
          ? "Thay thế template thành công!"
          : "Tải lên template thành công!",
      );
      onSuccess?.(template);
      handleClose();
    } catch {
      toast.error("Có lỗi xảy ra khi tải lên");
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setPeriodId("");
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
          Tải lên Template biểu mẫu
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Alert severity="info" sx={{ mb: 1 }}>
            Thư ký ngành upload các biểu mẫu theo từng giai đoạn để Sinh viên
            tải về và nộp lại.
          </Alert>

          <FormControl fullWidth>
            <InputLabel>Áp dụng cho mốc tiến độ</InputLabel>
            <Select
              multiple
              value={deadlineIds}
              label="Áp dụng cho mốc tiến độ"
              onChange={(e) => {
                const value = e.target.value;
                setDeadlineIds(
                  typeof value === "string"
                    ? value.split(",").map(Number)
                    : (value as number[]),
                );
              }}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {(selected as number[]).map((value) => {
                    const dl = deadlines.find((d) => d.id === value);
                    return (
                      <Chip
                        key={value}
                        label={dl ? dl.label : value}
                        size="small"
                      />
                    );
                  })}
                </Box>
              )}
            >
              {deadlines.map((deadline) => (
                <MenuItem key={deadline.id} value={deadline.id}>
                  {deadline.label}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              Các biểu mẫu không được gán giai đoạn sẽ tự động được lưu vào danh
              sách biểu mẫu ngoại lệ
            </FormHelperText>
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
  onReplaceClick?: (template: Template) => void;
  departmentId?: string;
  periodId?: number;
  showUploadButton?: boolean;
}

export function TemplateList({
  onUploadClick,
  onReplaceClick,
  departmentId,
  periodId,
  showUploadButton = true,
}: TemplateListProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  const loadTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const result = await progressTrackingService.getTemplates({
        departmentId: departmentId,
        periodId: periodId,
      });
      setTemplates(result.data);
    } catch {
      toast.error("Không thể tải danh sách template");
    } finally {
      setLoading(false);
    }
  }, [departmentId, periodId]);

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
            Chưa có Template nào được tải lên
          </Typography>
        </Paper>
      ) : (
        <List>
          {templates.map((template) => (
            <Paper key={template.id} sx={{ mb: 1 }}>
              <ListItem
                secondaryAction={
                  <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    <Box sx={{ ml: 1 }}>
                      <IconButton
                        title="Xem trước"
                        onClick={() => setPreviewTemplate(template)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                      {onReplaceClick && (
                        <IconButton
                          title="Thay thế"
                          color="primary"
                          onClick={() => onReplaceClick(template)}
                        >
                          <SyncIcon />
                        </IconButton>
                      )}
                      <IconButton
                        title="Xóa"
                        color="error"
                        onClick={() => setDeleteConfirm(template.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                }
              >
                <ListItemIcon>
                  <DescriptionIcon />
                </ListItemIcon>
                <ListItemText
                  primary={template.name}
                  secondaryTypographyProps={{ component: "div" }}
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

      {/* Preview Dialog */}
      <Dialog
        open={previewTemplate !== null}
        onClose={() => setPreviewTemplate(null)}
        maxWidth="lg"
        fullWidth
        sx={{ "& .MuiDialog-paper": { height: "90vh" } }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Xem trước Biểu mẫu: {previewTemplate?.name}
          <Button onClick={() => setPreviewTemplate(null)}>Đóng</Button>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0, overflow: "hidden" }}>
          {previewTemplate &&
            (previewTemplate.fileUrl.toLowerCase().endsWith(".pdf") ? (
              <iframe
                src={previewTemplate.fileUrl}
                width="100%"
                height="100%"
                style={{ border: "none" }}
                title="PDF Preview"
              />
            ) : (
              <iframe
                src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(previewTemplate.fileUrl)}`}
                width="100%"
                height="100%"
                style={{ border: "none" }}
                title="Office Preview"
              />
            ))}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
