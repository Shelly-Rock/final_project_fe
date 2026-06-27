"use client";

import { useState, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  Snackbar,
  Paper,
  Divider,
  LinearProgress,
  Chip,
  Grid,
} from "@mui/material";
import {
  Upload as UploadIcon,
  Description as FileIcon,
  CheckCircle as DoneIcon,
  Warning as WarningIcon,
  Timer as TimerIcon,
} from "@mui/icons-material";
import { CountdownTimer } from "@/shared/components/CountdownTimer";
import { useRouter } from "next/navigation";

const REVISION_DEADLINE = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days

const mockThesis = {
  id: "t1",
  topicName: "Ứng dụng AI trong y tế",
  studentName: "Nguyễn Văn Minh",
  mssv: "CN200101",
  revisionNote: "Cần bổ sung phần thực nghiệm và cải thiện kết quả đạt được. Thời hạn 14 ngày.",
};

interface UploadedFile {
  name: string;
  size: number;
  uploadedAt: string;
}

export default function StudentRevisionPage() {
  const router = useRouter();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" | "warning" }>({ open: false, message: "", severity: "success" });

  const acceptedTypes = [
    ".pdf", ".doc", ".docx", ".zip",
  ];

  const handleFiles = useCallback((fileList: FileList) => {
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const ext = "." + file.name.split(".").pop()?.toLowerCase();
      if (!acceptedTypes.includes(ext)) {
        setSnackbar({ open: true, message: `File "${file.name}" không đúng định dạng!`, severity: "error" });
        continue;
      }
      if (file.size > 50 * 1024 * 1024) {
        setSnackbar({ open: true, message: `File "${file.name}" vượt 50MB!`, severity: "error" });
        continue;
      }
      setFiles((prev) => [
        ...prev,
        {
          name: file.name,
          size: file.size,
          uploadedAt: new Date().toISOString(),
        },
      ]);
      setSnackbar({ open: true, message: `Đã tải lên: ${file.name}`, severity: "success" });
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFiles(e.target.files);
  }, [handleFiles]);

  const handleRemoveFile = useCallback((name: string) => {
    setFiles((prev) => prev.filter((f) => f.name !== name));
  }, []);

  const handleSubmit = useCallback(() => {
    if (files.length === 0) {
      setSnackbar({ open: true, message: "Vui lòng upload ít nhất 1 file trước khi nộp!", severity: "warning" });
      return;
    }
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setSubmitted(true);
      setSnackbar({ open: true, message: "Đã nộp bài chỉnh sửa thành công!", severity: "success" });
    }, 1500);
  }, [files]);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const totalSize = files.reduce((s, f) => s + f.size, 0);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
          Nộp bài chỉnh sửa cuối
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Upload bài chỉnh sửa theo yêu cầu của Hội đồng. Chỉ chấp nhận file PDF, Word, ZIP.
        </Typography>
      </Box>

      {/* Thesis info */}
      <Alert severity="warning" sx={{ mb: 3 }}>
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          {mockThesis.topicName}
        </Typography>
        <Typography variant="caption">
          SV: {mockThesis.studentName} ({mockThesis.mssv})
        </Typography>
        <Divider sx={{ my: 0.75 }} />
        <Typography variant="caption">
          <strong>Yêu cầu chỉnh sửa:</strong> {mockThesis.revisionNote}
        </Typography>
      </Alert>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {/* Countdown */}
          {!submitted && (
            <Box sx={{ mb: 3, maxWidth: 400 }}>
              <CountdownTimer
                deadline={REVISION_DEADLINE}
                label="Thời gian còn lại để nộp bài:"
              />
            </Box>
          )}

          {/* Submitted state */}
          {submitted && (
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 2,
                border: "2px solid",
                borderColor: "success.main",
                bgcolor: "success.50",
                textAlign: "center",
              }}
            >
              <DoneIcon sx={{ fontSize: 48, color: "success.main", mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: "success.main" }}>
                Đã nộp thành công!
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Bài chỉnh sửa đã được gửi đến Thư ký khoa. Bạn sẽ nhận được thông báo khi có kết quả.
              </Typography>
            </Paper>
          )}

          {/* Drop zone */}
          {!submitted && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  sx={{
                    border: "2px dashed",
                    borderColor: dragging ? "primary.main" : "grey.400",
                    borderRadius: 2,
                    p: 4,
                    textAlign: "center",
                    bgcolor: dragging ? "primary.50" : "grey.50",
                    transition: "all 0.2s",
                    cursor: "pointer",
                    "&:hover": { borderColor: "primary.main", bgcolor: "primary.50" },
                  }}
                  onClick={() => document.getElementById("file-input")?.click()}
                >
                  <UploadIcon sx={{ fontSize: 48, color: dragging ? "primary.main" : "grey.400", mb: 1 }} />
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    Kéo thả file vào đây hoặc click để chọn
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Chấp nhận: PDF, Word (.doc/.docx), ZIP — Tối đa 50MB mỗi file
                  </Typography>
                  <input
                    id="file-input"
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.zip"
                    style={{ display: "none" }}
                    onChange={handleInputChange}
                  />
                </Box>

                {/* File list */}
                {files.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        Đã chọn ({files.length} file)
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Tổng: {formatSize(totalSize)}
                      </Typography>
                    </Box>
                    {files.map((f) => (
                      <Paper
                        key={f.name}
                        variant="outlined"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          p: 1,
                          mb: 0.75,
                          borderRadius: 1,
                        }}
                      >
                        <FileIcon sx={{ fontSize: 20, color: "primary.main" }} />
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {f.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatSize(f.size)} • {new Date(f.uploadedAt).toLocaleTimeString("vi-VN")}
                          </Typography>
                        </Box>
                        {!submitted && (
                          <Button
                            size="small"
                            color="error"
                            onClick={() => handleRemoveFile(f.name)}
                          >
                            Xóa
                          </Button>
                        )}
                      </Paper>
                    ))}
                  </Box>
                )}

                {/* Upload progress */}
                {uploading && (
                  <Box sx={{ mt: 2 }}>
                    <LinearProgress />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                      Đang gửi...
                    </Typography>
                  </Box>
                )}

                {/* Submit */}
                {!submitted && (
                  <Box sx={{ mt: 2 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="success"
                      size="large"
                      startIcon={<UploadIcon />}
                      onClick={handleSubmit}
                      disabled={files.length === 0 || uploading}
                    >
                      Nộp bài chỉnh sửa
                    </Button>
                    {files.length === 0 && (
                      <Typography variant="caption" color="warning.main" sx={{ display: "block", textAlign: "center", mt: 0.5 }}>
                        Vui lòng upload ít nhất 1 file
                      </Typography>
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          )}

          {/* Requirements */}
          {!submitted && (
            <Alert severity="info">
              <Typography variant="caption" sx={{ fontWeight: 700 }}>
                Lưu ý:
              </Typography>
              <Typography variant="caption" component="ul" sx={{ pl: 1.5, m: 0 }}>
                <li>Chỉ chấp nhận file PDF, Word (.doc/.docx), ZIP.</li>
                <li>File ZIP phải nén đúng cấu trúc: code + báo cáo + data.</li>
                <li>Tổng dung lượng không giới hạn.</li>
                <li>Đảm bảo file không bị lỗi, có thể đọc được.</li>
                <li>Sau khi nộp, không thể chỉnh sửa. Liên hệ Thư ký nếu cần.</li>
              </Typography>
            </Alert>
          )}
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Revision info */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
                Thông tin chỉnh sửa
              </Typography>
              {[
                { label: "Yêu cầu từ", value: "Hội đồng A" },
                { label: "Ngày yêu cầu", value: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleDateString("vi-VN") },
                { label: "Thời hạn", value: "14 ngày" },
                { label: "Số file đã nộp", value: String(files.length) },
                { label: "Trạng thái", value: submitted ? "Đã nộp" : "Chưa nộp" },
              ].map(({ label, value }) => (
                <Box key={label} sx={{ display: "flex", justifyContent: "space-between", mb: 0.75 }}>
                  <Typography variant="caption" color="text.secondary">{label}:</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>{value}</Typography>
                </Box>
              ))}

              {!submitted && (
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
                    <TimerIcon sx={{ fontSize: 14, color: "warning.main" }} />
                    <Typography variant="caption" color="warning.main" sx={{ fontWeight: 700 }}>
                      Countdown
                    </Typography>
                  </Box>
                  <CountdownTimer
                    deadline={REVISION_DEADLINE}
                    compact
                    label=""
                  />
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Help */}
          <Alert severity="info">
            <Typography variant="caption" sx={{ fontWeight: 700 }}>
              Cần hỗ trợ?
            </Typography>
            <Typography variant="caption" component="ul" sx={{ pl: 1.5, m: 0 }}>
              <li>Liên hệ Thư ký khoa: thuky@khoa.edu.vn</li>
              <li>Gửi ticket hỗ trợ trong hệ thống</li>
            </Typography>
          </Alert>
        </Grid>
      </Grid>

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
