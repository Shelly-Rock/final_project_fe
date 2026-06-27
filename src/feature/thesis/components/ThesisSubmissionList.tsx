"use client";

import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  LinearProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Snackbar,
  LinearProgress as UploadProgress,
} from "@mui/material";
import {
  Description as FileIcon,
  CheckCircle as CheckIcon,
  Schedule as ScheduleIcon,
  Upload as UploadIcon,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Error as ErrorIcon,
  CheckCircle as SuccessIcon,
} from "@mui/icons-material";
import { useState, useCallback } from "react";
import type { ThesisSubmission } from "../constants";

interface ThesisSubmissionListProps {
  submissions: ThesisSubmission[];
}

// Convention: MaSV_BaiTapA.pdf  (A, B, C, D, E, F, G)
const CONVENTION_REGEX = /^[A-Z]{2}\d{6}_[A-Z][a-zA-Z0-9_]+\.pdf$/;
const CONVENTION_EXAMPLE = "CN200101_BaiTapA.pdf";

interface ValidationResult {
  valid: boolean;
  error?: string;
}

function validateFileName(fileName: string, mssv: string): ValidationResult {
  if (!fileName) return { valid: false, error: "Vui lòng chọn file." };

  const parts = fileName.split("_");
  if (parts.length < 2) {
    return { valid: false, error: `Tên file phải có định dạng: ${CONVENTION_EXAMPLE}` };
  }

  const prefix = parts[0];
  if (prefix !== mssv) {
    return { valid: false, error: `Mã SV không khớp. File phải bắt đầu bằng mssv của bạn: "${mssv}_"` };
  }

  const filePart = parts.slice(1).join("_");
  if (!/^[A-Z][a-zA-Z0-9_]+\.pdf$/.test(filePart)) {
    return {
      valid: false,
      error: `Phần sau mssv phải có dạng "BaiTapA.pdf" (A→G). Ví dụ: ${CONVENTION_EXAMPLE}`,
    };
  }

  const taskCode = filePart.match(/^([A-Z])[a-zA-Z0-9_]+\.pdf$/)?.[1];
  if (!["A", "B", "C", "D", "E", "F", "G"].includes(taskCode ?? "")) {
    return { valid: false, error: "Phần định danh bài tập phải là A, B, C, D, E, F hoặc G (in hoa)." };
  }

  return { valid: true };
}

export function ThesisSubmissionList({
  submissions,
}: ThesisSubmissionListProps) {
  const MOCK_MSSV = "CN200101"; // SV đang đăng nhập
  const MOCK_NAME = "Nguyễn Văn Minh";

  const [localSubmissions, setLocalSubmissions] = useState<ThesisSubmission[]>(submissions);
  const [uploadDialog, setUploadDialog] = useState<{
    open: boolean;
    submissionId: string | null;
    submissionName: string;
  }>({ open: false, submissionId: null, submissionName: "" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [validationError, setValidationError] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" });

  const submittedCount = localSubmissions.filter((s) => s.status === "submitted").length;
  const progress = (submittedCount / localSubmissions.length) * 100;

  const openUpload = useCallback((submission: ThesisSubmission) => {
    setUploadDialog({ open: true, submissionId: submission.id, submissionName: submission.name });
    setSelectedFile(null);
    setFileName("");
    setValidationError("");
    setUploadProgress(0);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setFileName(file.name);
    setValidationError("");

    // Auto-validate on selection
    const result = validateFileName(file.name, MOCK_MSSV);
    if (!result.valid) {
      setValidationError(result.error ?? "");
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (!file) return;
      setSelectedFile(file);
      setFileName(file.name);
      const result = validateFileName(file.name, MOCK_MSSV);
      if (!result.valid) {
        setValidationError(result.error ?? "");
      }
    },
    []
  );

  const handleManualNameChange = useCallback((name: string) => {
    setFileName(name);
    if (name) {
      const result = validateFileName(name, MOCK_MSSV);
      setValidationError(result.valid ? "" : result.error ?? "");
    } else {
      setValidationError("");
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    const result = validateFileName(fileName, MOCK_MSSV);
    if (!result.valid) {
      setValidationError(result.error ?? "");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    for (let p = 0; p <= 100; p += 10) {
      await new Promise((r) => setTimeout(r, 150));
      setUploadProgress(p);
    }

    setLocalSubmissions((prev) =>
      prev.map((s) =>
        s.id === uploadDialog.submissionId
          ? { ...s, status: "submitted" as const, file: fileName }
          : s
      )
    );

    setUploading(false);
    setUploadDialog({ open: false, submissionId: null, submissionName: "" });
    setSnackbar({
      open: true,
      message: `Nộp thành công: ${fileName}`,
      severity: "success",
    });
  }, [fileName, uploadDialog.submissionId]);

  const handleDeleteFile = useCallback((submissionId: string) => {
    setLocalSubmissions((prev) =>
      prev.map((s) =>
        s.id === submissionId ? { ...s, status: "pending" as const, file: null } : s
      )
    );
    setSnackbar({ open: true, message: "Đã xóa file!", severity: "success" });
  }, []);

  return (
    <>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Tiến độ nộp bài
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ flexGrow: 1, height: 10, borderRadius: 5 }}
          />
          <Typography variant="body2" color="text.secondary">
            {submittedCount}/{localSubmissions.length} đã nộp
          </Typography>
        </Box>

        {/* Convention info */}
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="caption" sx={{ fontWeight: 700 }}>
            Quy ước đặt tên file:
          </Typography>
          <Typography variant="caption" sx={{ display: "block", mt: 0.5 }}>
            <strong>{CONVENTION_EXAMPLE}</strong>
          </Typography>
          <Typography variant="caption" color="text.secondary">
            MSSV_BaiTapA.pdf — A/B/C/D/E/F/G là định danh bài tập. Không dùng tiếng Việt có dấu, không khoảng trắng.
          </Typography>
        </Alert>

        {progress === 100 && (
          <Alert severity="success">
            Bạn đã hoàn thành tất cả các bài nộp!
          </Alert>
        )}
      </Paper>

      <Paper>
        <List disablePadding>
          {localSubmissions.map((submission) => (
            <ListItem
              key={submission.id}
              sx={{
                borderBottom: "1px solid",
                borderColor: "divider",
                "&:last-child": { borderBottom: "none" },
              }}
            >
              <ListItemIcon>
                <FileIcon color={submission.status === "submitted" ? "success" : "action"} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {submission.name}
                    </Typography>
                    {submission.status === "submitted" && submission.file && (
                      <Chip
                        label={submission.file}
                        size="small"
                        variant="outlined"
                        color="success"
                        sx={{ fontFamily: "monospace", fontSize: "0.7rem" }}
                      />
                    )}
                  </Box>
                }
                secondary={
                  <Box sx={{ mt: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      Hạn chót: {submission.deadline}
                    </Typography>
                    {submission.status === "submitted" && submission.file && (
                      <Typography variant="caption" color="success.main" sx={{ display: "block", fontWeight: 700 }}>
                        ✓ Đã nộp: {submission.file}
                      </Typography>
                    )}
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {submission.status === "submitted" ? (
                    <>
                      <Chip
                        icon={<CheckIcon />}
                        label="Đã nộp"
                        color="success"
                        size="small"
                      />
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteFile(submission.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <Chip
                        icon={<ScheduleIcon />}
                        label="Chờ nộp"
                        color="warning"
                        size="small"
                      />
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<UploadIcon />}
                        onClick={() => openUpload(submission)}
                      >
                        Nộp bài
                      </Button>
                    </>
                  )}
                </Box>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Upload Dialog */}
      <Dialog
        open={uploadDialog.open}
        onClose={() => !uploading && setUploadDialog({ open: false, submissionId: null, submissionName: "" })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Nộp: {uploadDialog.submissionName}
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="caption" sx={{ fontWeight: 700 }}>
              Quy ước đặt tên: {CONVENTION_EXAMPLE}
            </Typography>
            <br />
            <Typography variant="caption" color="text.secondary">
              Thay "CN200101" bằng MSSV của bạn. A→G là định danh bài.
            </Typography>
          </Alert>

          {/* Drop zone */}
          <Box
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            sx={{
              border: "2px dashed",
              borderColor: selectedFile ? (validationError ? "error.main" : "success.main") : "divider",
              borderRadius: 2,
              p: 4,
              textAlign: "center",
              cursor: "pointer",
              bgcolor: selectedFile ? (validationError ? "error.50" : "success.50") : "grey.50",
              mb: 2,
              transition: "all 0.2s",
            }}
            onClick={() => document.getElementById("file-input")?.click()}
          >
            <input
              id="file-input"
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              style={{ display: "none" }}
            />
            {selectedFile ? (
              <>
                <SuccessIcon sx={{ fontSize: 40, color: "success.main", mb: 1 }} />
                <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {selectedFile.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </Typography>
              </>
            ) : (
              <>
                <CloudUploadIcon sx={{ fontSize: 40, color: "text.secondary", mb: 1 }} />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Kéo thả file PDF vào đây
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  hoặc click để chọn file
                </Typography>
              </>
            )}
          </Box>

          {/* Manual name input */}
          <TextField
            fullWidth
            size="small"
            label="Tên file (tự động lấy từ file, hoặc nhập lại để đổi tên)"
            value={fileName}
            onChange={(e) => handleManualNameChange(e.target.value)}
            sx={{ mb: 1 }}
            inputProps={{ accept: ".pdf" }}
            disabled={uploading}
          />

          {/* Validation error */}
          {validationError && (
            <Alert severity="error" icon={<ErrorIcon />}>
              <Typography variant="caption">
                <strong>Lỗi quy ước tên file:</strong> {validationError}
              </Typography>
            </Alert>
          )}

          {/* Upload progress */}
          {uploading && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" sx={{ mb: 0.5, display: "block" }}>
                Đang upload... {uploadProgress}%
              </Typography>
              <UploadProgress variant="determinate" value={uploadProgress} />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setUploadDialog({ open: false, submissionId: null, submissionName: "" })}
            disabled={uploading}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!selectedFile || !!validationError || uploading}
            startIcon={<UploadIcon />}
          >
            {uploading ? "Đang nộp..." : "Nộp file"}
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
    </>
  );
}
