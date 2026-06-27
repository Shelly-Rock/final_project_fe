"use client";

import { useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  LinearProgress,
} from "@mui/material";
import {
  ArrowBack as BackIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  InsertDriveFile as FileIcon,
  Delete as DeleteIcon,
  Description as DescIcon,
  Article as ArticleIcon,
  CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";
import * as XLSX from "xlsx";

interface Template {
  id: string;
  name: string;
  type: "system" | "custom";
  fileUrl?: string;
  uploadedAt?: string;
  uploadedBy?: string;
  description: string;
}

const SYSTEM_TEMPLATES: Template[] = [
  {
    id: "tpl-1",
    name: "Mẫu đề cương chi tiết",
    type: "system",
    description: "Mẫu đề cương theo quy chuẩn trường — có cấu trúc I, II, III, IV, V",
    fileUrl: "/templates/de_cuong_mau.docx",
  },
  {
    id: "tpl-2",
    name: "Mẫu báo cáo tiến độ hàng tháng",
    type: "system",
    description: "Mẫu báo cáo tiến độ hàng tháng theo tháng, có bảng đánh giá của GVHD",
    fileUrl: "/templates/bao_cao_tien_do.docx",
  },
  {
    id: "tpl-3",
    name: "Mẫu slide bảo vệ",
    type: "system",
    description: "Mẫu PowerPoint bảo vệ luận văn — 15-20 slides",
    fileUrl: "/templates/mau_slide_bv.pptx",
  },
  {
    id: "tpl-4",
    name: "Mẫu đánh giá chấm điểm",
    type: "system",
    description: "Phiếu đánh giá chấm điểm cho Hội đồng bảo vệ",
    fileUrl: "/templates/phieu_danh_gia.docx",
  },
  {
    id: "tpl-5",
    name: "Mẫu biên bản bảo vệ",
    type: "system",
    description: "Biên bản bảo vệ luận văn tốt nghiệp",
    fileUrl: "/templates/bien_ban_bv.docx",
  },
];

const mockTopicInfo = {
  id: "1",
  code: "DT-001",
  name: "Ứng dụng AI trong y tế",
  student: "Nguyễn Văn Minh",
  mssv: "20210001",
  customTemplates: [
    {
      id: "ct-1",
      name: "Yêu cầu riêng cho dự án AI",
      type: "custom" as const,
      uploadedAt: "2026-06-15",
      uploadedBy: "TS. Nguyễn Văn A",
      description: "File hướng dẫn riêng cho đề tài AI y tế",
    },
  ],
};

export default function TeacherTemplatePage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.id as string;

  const [customTemplates, setCustomTemplates] = useState<Template[]>(mockTopicInfo.customTemplates);
  const [uploadDialog, setUploadDialog] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadName, setUploadName] = useState("");
  const [uploadDesc, setUploadDesc] = useState("");
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" | "warning" }>({ open: false, message: "", severity: "success" });

  const handleDownloadSystem = useCallback((tpl: Template) => {
    // TODO: Real download from API
    const ws = XLSX.utils.json_to_sheet([{ a: 1 }]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, `${tpl.name.replace(/\s+/g, "_")}.xlsx`);
    setSnackbar({ open: true, message: `Đang tải: ${tpl.name}`, severity: "success" });
  }, []);

  const handleDeleteCustom = useCallback((id: string) => {
    setCustomTemplates((prev) => prev.filter((t) => t.id !== id));
    setSnackbar({ open: true, message: "Đã xóa mẫu tùy chỉnh!", severity: "success" });
  }, []);

  const handleUploadCustom = useCallback(async () => {
    if (!uploadName.trim()) {
      setSnackbar({ open: true, message: "Vui lòng nhập tên mẫu!", severity: "error" });
      return;
    }
    setUploading(true);
    await new Promise((r) => setTimeout(r, 1500));
    const newTpl: Template = {
      id: `ct-${Date.now()}`,
      name: uploadName,
      type: "custom",
      description: uploadDesc,
      uploadedAt: new Date().toISOString().split("T")[0],
      uploadedBy: mockTopicInfo.student,
    };
    setCustomTemplates((prev) => [...prev, newTpl]);
    setUploading(false);
    setUploadDialog(false);
    setUploadName("");
    setUploadDesc("");
    setSnackbar({ open: true, message: "Upload mẫu thành công!", severity: "success" });
  }, [uploadName, uploadDesc]);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <IconButton onClick={() => router.push("/teacher/topics")}>
          <BackIcon />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Mẫu văn bản & Tài liệu
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {mockTopicInfo.code} — {mockTopicInfo.name}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<UploadIcon />}
          onClick={() => setUploadDialog(true)}
          size="small"
        >
          Upload mẫu riêng
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Custom templates */}
        <Grid item xs={12} md={5}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Mẫu tùy chỉnh ({customTemplates.length})
                </Typography>
                <Chip
                  label="GV upload"
                  size="small"
                  color="warning"
                  variant="outlined"
                />
              </Box>

              {customTemplates.length === 0 ? (
                <Alert severity="info">
                  <Typography variant="caption">
                    Chưa có mẫu tùy chỉnh. Upload mẫu riêng để hướng dẫn SV.
                  </Typography>
                </Alert>
              ) : (
                <List disablePadding>
                  {customTemplates.map((tpl) => (
                    <ListItem
                      key={tpl.id}
                      sx={{
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1,
                        mb: 1,
                        bgcolor: "grey.50",
                      }}
                    >
                      <ListItemIcon>
                        <ArticleIcon color="warning" />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {tpl.name}
                          </Typography>
                        }
                        secondary={
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              {tpl.description}
                            </Typography>
                            <br />
                            <Typography variant="caption" color="text.secondary">
                              Upload: {tpl.uploadedAt} • {tpl.uploadedBy}
                            </Typography>
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteCustom(tpl.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              )}

              <Button
                fullWidth
                variant="outlined"
                startIcon={<UploadIcon />}
                onClick={() => setUploadDialog(true)}
                sx={{ mt: 2 }}
              >
                Upload mẫu tùy chỉnh
              </Button>
            </CardContent>
          </Card>

          {/* Info */}
          <Alert severity="info">
            <Typography variant="caption">
              <strong>Mẫu tùy chỉnh</strong> chỉ áp dụng cho đề tài này. SV sẽ nhận thông báo khi có mẫu mới.
            </Typography>
          </Alert>
        </Grid>

        {/* System templates */}
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Mẫu hệ thống ({SYSTEM_TEMPLATES.length})
                </Typography>
                <Chip label="Mẫu chuẩn" size="small" color="default" variant="outlined" />
              </Box>

              <Grid container spacing={2}>
                {SYSTEM_TEMPLATES.map((tpl) => (
                  <Grid item xs={12} sm={6} key={tpl.id}>
                    <Card
                      variant="outlined"
                      sx={{
                        p: 2,
                        height: "100%",
                        cursor: "pointer",
                        "&:hover": { borderColor: "primary.main", bgcolor: "action.hover" },
                        transition: "all 0.2s",
                      }}
                      onClick={() => handleDownloadSystem(tpl)}
                    >
                      <Box sx={{ display: "flex", gap: 1.5, mb: 1 }}>
                        <FileIcon color="primary" />
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 700, mb: 0.5 }}
                          >
                            {tpl.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {tpl.description}
                          </Typography>
                        </Box>
                      </Box>
                      <Button
                        size="small"
                        variant="text"
                        startIcon={<DownloadIcon />}
                        sx={{ mt: 1 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadSystem(tpl);
                        }}
                      >
                        Tải xuống
                      </Button>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Upload dialog */}
      <Dialog open={uploadDialog} onClose={() => setUploadDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload mẫu tùy chỉnh</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="caption">
              Mẫu tùy chỉnh chỉ hiển thị cho SV đăng ký đề tài này.
            </Typography>
          </Alert>

          <Box
            sx={{
              border: "2px dashed",
              borderColor: "divider",
              borderRadius: 2,
              p: 4,
              textAlign: "center",
              mb: 2,
              cursor: "pointer",
              "&:hover": { borderColor: "primary.main", bgcolor: "action.hover" },
            }}
          >
            <CloudUploadIcon sx={{ fontSize: 40, color: "text.secondary", mb: 1 }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Kéo thả file vào đây
            </Typography>
            <Typography variant="caption" color="text.secondary">
              hoặc click để chọn file (.docx, .doc, .pdf, .xlsx)
            </Typography>
          </Box>

          <TextField
            fullWidth
            size="small"
            label="Tên mẫu"
            value={uploadName}
            onChange={(e) => setUploadName(e.target.value)}
            sx={{ mb: 2 }}
            required
          />

          <TextField
            fullWidth
            size="small"
            label="Mô tả (tùy chọn)"
            value={uploadDesc}
            onChange={(e) => setUploadDesc(e.target.value)}
            multiline
            rows={2}
          />

          {uploading && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" sx={{ mb: 0.5, display: "block" }}>
                Đang upload...
              </Typography>
              <LinearProgress />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialog(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleUploadCustom} disabled={uploading}>
            {uploading ? "Đang upload..." : "Upload"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
