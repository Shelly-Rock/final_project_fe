"use client";

import React, { useState, useCallback } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Switch,
  Typography,
  Chip,
  IconButton,
  LinearProgress,
} from "@mui/material";
import {
  Close as CloseIcon,
  Upload as UploadIcon,
  Delete as DeleteIcon,
  Description as FileIcon,
} from "@mui/icons-material";
import type { TemplateItem, CategoryType, StageType, FileType } from "../types";
import { categoryConfig, stageConfig } from "../types";
import { TemplateService } from "../services";

const fileTypeOptions: FileType[] = ["docx", "doc", "pdf", "xlsx", "xls"];

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

interface TemplateFormModalProps {
  open: boolean;
  template?: TemplateItem | null;
  onClose: () => void;
  onSubmit: (data: Partial<TemplateItem>) => void;
}

export function TemplateFormModal({
  open,
  template,
  onClose,
  onSubmit,
}: TemplateFormModalProps) {
  const initialData = template
    ? { ...template }
    : {
        code: "",
        name: "",
        nameEn: "",
        description: "",
        icon: "file",
        color: "#1890ff",
        category: "student" as const,
        stage: "execution" as const,
        fileType: "docx" as const,
        forRoles: ["student"] as CategoryType[],
        isActive: true,
      };

  const [formData, setFormData] = useState<Partial<TemplateItem>>(initialData);
  const [uploadingFile, setUploadingFile] = useState<"vi" | "en" | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const isEditing = Boolean(template?.id);

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

  const handleFileUpload = useCallback(
    async (lang: "vi" | "en", file: File) => {
      try {
        setUploadingFile(lang);
        setUploadProgress(0);

        const interval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 90) {
              clearInterval(interval);
              return prev;
            }
            return prev + 10;
          });
        }, 100);

        const fileUrl = await TemplateService.uploadFile(file);

        clearInterval(interval);
        setUploadProgress(100);

        setTimeout(() => {
          setFormData((prev) => ({
            ...prev,
            [lang === "vi" ? "fileVI" : "fileEN"]: fileUrl,
          }));
          setUploadingFile(null);
          setUploadProgress(0);
        }, 300);
      } catch {
        setUploadingFile(null);
        setUploadProgress(0);
      }
    },
    [],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent, lang: "vi" | "en") => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) {
        handleFileUpload(lang, file);
      }
    },
    [handleFileUpload],
  );

  const handleSubmit = () => {
    if (!formData.code || !formData.name || !formData.nameEn) {
      return;
    }
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">
          {isEditing ? "Sửa biểu mẫu" : "Thêm biểu mẫu mới"}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Mã biểu mẫu"
              value={formData.code || ""}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value })
              }
              fullWidth
              required
              placeholder="VD: NIIE-KLTN-01"
              size="small"
              error={!formData.code && isEditing}
              helperText={
                !formData.code && isEditing ? "Mã biểu mẫu bắt buộc" : ""
              }
            />
            <FormControl fullWidth size="small">
              <InputLabel>Định dạng file</InputLabel>
              <Select
                value={formData.fileType || "docx"}
                label="Định dạng file"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fileType: e.target.value as FileType,
                  })
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
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              fullWidth
              required
              size="small"
              error={!formData.name && isEditing}
              helperText={
                !formData.name && isEditing ? "Tên tiếng Việt bắt buộc" : ""
              }
            />
            <TextField
              label="Tên biểu mẫu (EN)"
              value={formData.nameEn || ""}
              onChange={(e) =>
                setFormData({ ...formData, nameEn: e.target.value })
              }
              fullWidth
              required
              size="small"
              error={!formData.nameEn && isEditing}
              helperText={
                !formData.nameEn && isEditing ? "Tên tiếng Anh bắt buộc" : ""
              }
            />
          </Stack>

          <TextField
            label="Mô tả"
            value={formData.description || ""}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
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
                  setFormData({
                    ...formData,
                    stage: e.target.value as StageType,
                  })
                }
              >
                {(Object.keys(stageConfig) as StageType[]).map((stage) => (
                  <MenuItem key={stage} value={stage}>
                    <Chip
                      label={stageConfig[stage].label}
                      color={stageConfig[stage].color}
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
                  setFormData({
                    ...formData,
                    category: e.target.value as CategoryType,
                  })
                }
              >
                {(Object.keys(categoryConfig) as CategoryType[]).map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    <Chip
                      label={categoryConfig[cat].label}
                      color={categoryConfig[cat].color}
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
                      color={categoryConfig[role].color}
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
                    color={categoryConfig[role].color}
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
                onChange={(e) =>
                  setFormData({ ...formData, icon: e.target.value })
                }
              >
                {iconOptions.map((icon) => (
                  <MenuItem key={icon.value} value={icon.value}>
                    {icon.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mb: 0.5, display: "block" }}
              >
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
                      border:
                        formData.color === color
                          ? "2px solid"
                          : "1px solid #ddd",
                      borderColor:
                        formData.color === color ? "primary.main" : undefined,
                    }}
                  />
                ))}
              </Stack>
            </Box>
          </Stack>

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Upload File
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              {/* File VI */}
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mb: 0.5, display: "block" }}
                >
                  File tiếng Việt
                </Typography>
                {formData.fileVI ? (
                  <Box
                    sx={{
                      p: 2,
                      border: "1px solid",
                      borderColor: "success.main",
                      borderRadius: 1,
                      bgcolor: "success.50",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <FileIcon color="success" />
                      <Typography variant="body2" noWrap sx={{ maxWidth: 120 }}>
                        {formData.fileVI.split("/").pop()}
                      </Typography>
                    </Stack>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() =>
                        setFormData({ ...formData, fileVI: undefined })
                      }
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ) : (
                  <Box
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDrop(e, "vi")}
                    sx={{
                      p: 2,
                      border: "2px dashed",
                      borderColor:
                        uploadingFile === "vi" ? "primary.main" : "divider",
                      borderRadius: 1,
                      textAlign: "center",
                      bgcolor:
                        uploadingFile === "vi" ? "primary.50" : "transparent",
                      transition: "all 0.2s",
                    }}
                  >
                    {uploadingFile === "vi" ? (
                      <Box>
                        <LinearProgress
                          variant="determinate"
                          value={uploadProgress}
                          sx={{ mb: 1 }}
                        />
                        <Typography variant="caption">
                          Đang tải lên...
                        </Typography>
                      </Box>
                    ) : (
                      <>
                        <UploadIcon color="action" sx={{ mb: 0.5 }} />
                        <Typography variant="caption" display="block">
                          Kéo thả file hoặc
                        </Typography>
                        <Button size="small" component="label">
                          Chọn file
                          <input
                            type="file"
                            hidden
                            accept=".docx,.doc,.pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload("vi", file);
                            }}
                          />
                        </Button>
                      </>
                    )}
                  </Box>
                )}
              </Box>

              {/* File EN */}
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mb: 0.5, display: "block" }}
                >
                  File tiếng Anh
                </Typography>
                {formData.fileEN ? (
                  <Box
                    sx={{
                      p: 2,
                      border: "1px solid",
                      borderColor: "success.main",
                      borderRadius: 1,
                      bgcolor: "success.50",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <FileIcon color="success" />
                      <Typography variant="body2" noWrap sx={{ maxWidth: 120 }}>
                        {formData.fileEN.split("/").pop()}
                      </Typography>
                    </Stack>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() =>
                        setFormData({ ...formData, fileEN: undefined })
                      }
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ) : (
                  <Box
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDrop(e, "en")}
                    sx={{
                      p: 2,
                      border: "2px dashed",
                      borderColor:
                        uploadingFile === "en" ? "primary.main" : "divider",
                      borderRadius: 1,
                      textAlign: "center",
                      bgcolor:
                        uploadingFile === "en" ? "primary.50" : "transparent",
                      transition: "all 0.2s",
                    }}
                  >
                    {uploadingFile === "en" ? (
                      <Box>
                        <LinearProgress
                          variant="determinate"
                          value={uploadProgress}
                          sx={{ mb: 1 }}
                        />
                        <Typography variant="caption">
                          Đang tải lên...
                        </Typography>
                      </Box>
                    ) : (
                      <>
                        <UploadIcon color="action" sx={{ mb: 0.5 }} />
                        <Typography variant="caption" display="block">
                          Kéo thả file hoặc
                        </Typography>
                        <Button size="small" component="label">
                          Chọn file
                          <input
                            type="file"
                            hidden
                            accept=".docx,.doc,.pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload("en", file);
                            }}
                          />
                        </Button>
                      </>
                    )}
                  </Box>
                )}
              </Box>
            </Stack>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {isEditing ? "Cập nhật" : "Thêm mới"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
