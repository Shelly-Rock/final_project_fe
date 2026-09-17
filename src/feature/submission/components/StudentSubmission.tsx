"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Paper,
  LinearProgress,
  Chip,
} from "@mui/material";
import { Card, CardHeader, CardContentDiv } from "@/shared/components";
import {
  Inbox,
  Upload,
  CheckCircle,
  ShieldAlert,
  AlertTriangle,
  FileText,
  ExternalLink,
} from "lucide-react";
import { submissionService, type Submission } from "../services";
import { toast } from "sonner";

const MAX_FILE_SIZE_MB = 150;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_EXTENSIONS = ["PDF", "DOCX", "PPTX"] as const;

interface StudentSubmissionProps {
  topicId: number;
  topicCode: string;
  topicName: string;
  isLeader?: boolean;
}

type AllowedExtension = (typeof ALLOWED_EXTENSIONS)[number];

function getFileType(ext: AllowedExtension): "PDF" | "WORD" | "POWERPOINT" {
  if (ext === "PDF") return "PDF";
  if (ext === "DOCX") return "WORD";
  return "POWERPOINT";
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

type UploadStage =
  | "idle"
  | "requesting"
  | "uploading"
  | "confirming"
  | "done"
  | "error";

const STAGE_LABELS: Record<UploadStage, string> = {
  idle: "",
  requesting: "Đang khởi tạo phiên tải lên...",
  uploading: "Đang tải file lên Google Drive...",
  confirming: "Đang xác nhận và lưu thông tin...",
  done: "Nộp bài thành công!",
  error: "Đã xảy ra lỗi",
};

export default function StudentSubmission({
  isLeader,
  topicId,
  topicCode,
  topicName,
}: StudentSubmissionProps) {
  const [eligible] = useState(true);
  const [checking] = useState(true);

  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const [stage, setStage] = useState<UploadStage>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [submission, setSubmission] = useState<Submission | null>(null);
  const validateAndSetFile = (selectedFile: File): boolean => {
    setFileError(null);

    if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
      const msg = `File vượt quá dung lượng tối đa cho phép (${MAX_FILE_SIZE_MB}MB). File của bạn: ${formatFileSize(selectedFile.size)}.`;
      setFileError(msg);
      toast.error(msg);
      return false;
    }

    const rawExt = selectedFile.name.split(".").pop()?.toUpperCase() ?? "";
    if (!ALLOWED_EXTENSIONS.includes(rawExt as AllowedExtension)) {
      const msg = `Định dạng không hợp lệ. Chỉ chấp nhận: ${ALLOWED_EXTENSIONS.join(", ")}.`;
      setFileError(msg);
      toast.error(msg);
      return false;
    }

    const expectedPrefix = `[${topicCode}]`;
    if (
      !selectedFile.name.toLowerCase().startsWith(expectedPrefix.toLowerCase())
    ) {
      const msg = `Tên file không đúng chuẩn. Phải bắt đầu bằng "${expectedPrefix}". Ví dụ: ${expectedPrefix}.PDF`;
      setFileError(msg);
      toast.error(msg);
      return false;
    }

    return true;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    event.target.value = "";
    if (!selectedFile) return;

    if (validateAndSetFile(selectedFile)) {
      setFile(selectedFile);
    } else {
      setFile(null);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error("Vui lòng chọn file để nộp");
      return;
    }
    if (!eligible) {
      toast.error("Bạn chưa đủ điều kiện nộp bài");
      return;
    }

    const ext = (file.name.split(".").pop()?.toUpperCase() ??
      "") as AllowedExtension;
    setErrorMessage(null);
    setUploadProgress(0);

    try {
      setStage("requesting");
      const session = await submissionService.initDriveUpload({
        topicId,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type || "application/octet-stream",
      });

      setStage("uploading");
      await submissionService.uploadToDrive(
        session.sessionUrl,
        file,
        (percent) => setUploadProgress(percent),
      );

      setStage("confirming");
      const confirmed = await submissionService.confirmDriveUpload({
        topicId,
        driveFileId: session.driveFileId,
        webViewLink: session.webViewLink,
        fileName: file.name,
        fileSize: file.size,
        fileType: getFileType(ext),
      });

      setStage("done");
      setSubmission(confirmed);
      toast.success("Nộp bài thành công! File đã được lưu trên hệ thống.");
    } catch (err) {
      setStage("error");
      const msg =
        err instanceof Error
          ? err.message
          : "Đã xảy ra lỗi không xác định. Vui lòng thử lại.";
      setErrorMessage(msg);
      toast.error(msg);
    }
  };

  const isUploading =
    stage === "requesting" || stage === "uploading" || stage === "confirming";

  if (checking) {
    return (
      <Box
        sx={{
          maxWidth: 600,
          mx: "auto",
          mt: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 200,
          gap: 2,
        }}
      >
        <CircularProgress size={28} />
        <Typography color="text.secondary">
          Đang kiểm tra điều kiện...
        </Typography>
      </Box>
    );
  }

  if (!isLeader) {
    return (
      <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
        <Card>
          <CardContentDiv padding={4}>
            <Box sx={{ textAlign: "center" }}>
              <ShieldAlert
                size={64}
                color="#f97316"
                style={{ marginBottom: 16 }}
              />
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                Không có quyền nộp bài
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Chỉ <strong>Trưởng Nhóm</strong> mới được phép tải lên tài liệu
                báo cáo. Vui lòng liên hệ trưởng nhóm của bạn để thực hiện thao
                tác này.
              </Typography>
            </Box>
          </CardContentDiv>
        </Card>
      </Box>
    );
  }

  if (stage === "done" && submission) {
    return (
      <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
        <Card>
          <CardContentDiv padding={4}>
            <Box sx={{ textAlign: "center" }}>
              <CheckCircle
                size={64}
                color="#22c55e"
                style={{ marginBottom: 16 }}
              />
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                Nộp bài thành công!
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Tài liệu của bạn đã được lưu trên hệ thống và đang chờ được
                duyệt.
              </Typography>

              <Paper
                variant="outlined"
                sx={{ p: 2, textAlign: "left", borderRadius: 2, mb: 3 }}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <FileText size={16} color="#64748b" />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {submission.fileName}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Kích thước: {formatFileSize(submission.fileSize)}
                </Typography>
              </Paper>

              {submission.fileUrl && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<ExternalLink size={14} />}
                  onClick={() => window.open(submission.fileUrl, "_blank")}
                >
                  Xem tài liệu trên Google Drive
                </Button>
              )}
            </Box>
          </CardContentDiv>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Card>
        <CardHeader title="Nộp bài cuối kỳ" />
        <CardContentDiv padding={3}>
          {!eligible && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              <Typography variant="body2">
                <strong>Chưa đủ điều kiện:</strong> Bạn cần hoàn thành tất cả
                báo cáo tiến độ và không bị cấm thi để có thể nộp bài.
              </Typography>
            </Alert>
          )}

          <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Mã đề tài
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {topicCode}
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Tên đề tài
              </Typography>
              <Typography variant="body1">{topicName}</Typography>
            </Box>
          </Box>

          <Alert
            severity="info"
            icon={<AlertTriangle size={18} />}
            sx={{ mb: 3 }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Quy cách đặt tên file bắt buộc:
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontFamily: "monospace", mt: 0.5 }}
            >
              [{topicCode}].PDF &nbsp;|&nbsp; [{topicCode}].DOCX &nbsp;|&nbsp; [
              {topicCode}].PPTX
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 1, display: "block" }}
            >
              Dung lượng tối đa: {MAX_FILE_SIZE_MB}MB
            </Typography>
          </Alert>

          <Paper
            sx={{
              p: 4,
              mb: 3,
              border: "2px dashed",
              borderColor: fileError
                ? "error.main"
                : file
                  ? "success.main"
                  : "divider",
              textAlign: "center",
              cursor: isUploading ? "not-allowed" : "pointer",
              bgcolor: isUploading
                ? "action.disabledBackground"
                : "transparent",
              transition: "border-color 0.2s",
              "&:hover": isUploading
                ? {}
                : {
                    borderColor: "primary.main",
                    bgcolor: "action.hover",
                  },
            }}
            onClick={() =>
              !isUploading &&
              document.getElementById("file-upload-input")?.click()
            }
          >
            <input
              id="file-upload-input"
              type="file"
              accept=".pdf,.docx,.pptx"
              style={{ display: "none" }}
              onChange={handleFileChange}
              disabled={isUploading}
            />
            <Inbox
              size={48}
              color={file ? "#22c55e" : "#9ca3af"}
              style={{ marginBottom: 12 }}
            />
            {file ? (
              <Box>
                <Chip
                  label={file.name}
                  color="success"
                  variant="outlined"
                  size="small"
                  sx={{ mb: 0.5, maxWidth: "100%" }}
                />
                <Typography
                  variant="caption"
                  display="block"
                  color="text.secondary"
                >
                  {formatFileSize(file.size)} — Click để chọn lại
                </Typography>
              </Box>
            ) : (
              <>
                <Typography variant="body1" sx={{ mb: 0.5 }}>
                  Kéo thả file vào đây hoặc click để chọn
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  PDF, DOCX, PPTX — Tối đa {MAX_FILE_SIZE_MB}MB
                </Typography>
              </>
            )}
          </Paper>

          {fileError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {fileError}
            </Alert>
          )}

          {isUploading && (
            <Box sx={{ mb: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 0.5,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  {STAGE_LABELS[stage]}
                </Typography>
                {stage === "uploading" && (
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    {uploadProgress}%
                  </Typography>
                )}
              </Box>
              <LinearProgress
                variant={
                  stage === "uploading" ? "determinate" : "indeterminate"
                }
                value={stage === "uploading" ? uploadProgress : undefined}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
          )}

          {stage === "error" && errorMessage && (
            <Alert
              severity="error"
              sx={{ mb: 3 }}
              action={
                <Button size="small" onClick={() => setStage("idle")}>
                  Thử lại
                </Button>
              }
            >
              {errorMessage}
            </Alert>
          )}

          <Button
            variant="contained"
            size="large"
            fullWidth
            startIcon={
              isUploading ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <Upload size={18} />
              )
            }
            onClick={handleSubmit}
            disabled={!file || !eligible || isUploading}
          >
            {isUploading ? STAGE_LABELS[stage] : "Nộp bài"}
          </Button>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", textAlign: "center", mt: 1.5 }}
          >
            Sau khi nộp, bạn có thể liên hệ Thư ký để cập nhật lại trong thời
            gian quy định.
          </Typography>
        </CardContentDiv>
      </Card>
    </Box>
  );
}
