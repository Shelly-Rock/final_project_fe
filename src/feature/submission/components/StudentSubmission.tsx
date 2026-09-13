"use client";

// ============================================================
// StudentSubmission — Giao diện nộp bài cuối kỳ (Sinh viên)
//
// Luồng upload theo Cách 2: Google Drive Resumable Upload
//   Bước 1 — initDriveUpload: FE gọi BE → BE xin sessionUrl từ Google → trả về FE
//   Bước 2 — uploadToDrive  : FE PUT file trực tiếp lên Google qua sessionUrl (có Progress)
//   Bước 3 — confirmDriveUpload: FE báo BE → BE lưu driveFileId + webViewLink vào DB
// ============================================================

import React, { useState, useEffect, useCallback } from "react";
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

// ---------- Constants ----------

const MAX_FILE_SIZE_MB = 150;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_EXTENSIONS = ["PDF", "DOCX", "PPTX"] as const;

// ---------- Props ----------

interface StudentSubmissionProps {
  studentId: number;
  projectId: number;
  projectCode: string;
  projectName: string;
  /** true nếu sinh viên này là Đại diện/Trưởng nhóm — chỉ họ mới được nộp file */
  isLeader: boolean;
}

// ---------- Helpers ----------

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

// ---------- Upload Stage ----------

type UploadStage =
  | "idle" // Chưa làm gì
  | "requesting" // Đang gọi BE xin sessionUrl (Bước 1)
  | "uploading" // Đang PUT file lên Google Drive (Bước 2)
  | "confirming" // Đang gọi BE lưu vào DB (Bước 3)
  | "done" // Hoàn tất
  | "error"; // Thất bại

const STAGE_LABELS: Record<UploadStage, string> = {
  idle: "",
  requesting: "Đang khởi tạo phiên tải lên...",
  uploading: "Đang tải file lên Google Drive...",
  confirming: "Đang xác nhận và lưu thông tin...",
  done: "Nộp bài thành công!",
  error: "Đã xảy ra lỗi",
};

// ============================================================
// Component
// ============================================================

export default function StudentSubmission({
  studentId,
  projectId,
  projectCode,
  projectName,
  isLeader,
}: StudentSubmissionProps) {
  const [eligible, setEligible] = useState(false);
  const [checking, setChecking] = useState(true);

  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const [stage, setStage] = useState<UploadStage>("idle");
  const [uploadProgress, setUploadProgress] = useState(0); // 0–100
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Submission đã được xác nhận thành công (Bước 3 trả về)
  const [submission, setSubmission] = useState<Submission | null>(null);

  // ---- Check eligibility ----
  const checkEligibility = useCallback(async () => {
    setChecking(true);
    try {
      // 1. Kiểm tra xem sinh viên đã nộp bài chưa
      const mySubmissions = await submissionService.getMySubmissions();
      if (mySubmissions && mySubmissions.length > 0) {
        setSubmission(mySubmissions[0]);
        setStage("done"); // Đã nộp
      }

      // 2. Kiểm tra điều kiện nộp bài
      const eligibleStudents = await submissionService.getEligibleStudents();
      const isEligible = eligibleStudents.some((s) => s.id === studentId);
      setEligible(isEligible);
    } catch {
      toast.error("Không thể kiểm tra điều kiện nộp bài");
      // Fail-open: vẫn cho tương tác UI để không chặn oan
      setEligible(true);
    } finally {
      setChecking(false);
    }
  }, [studentId]);

  useEffect(() => {
    checkEligibility();
  }, [checkEligibility]);

  // ---- File validation ----
  const validateAndSetFile = (selectedFile: File): boolean => {
    setFileError(null);

    // 1. Kiểm tra dung lượng tối đa
    if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
      const msg = `File vượt quá dung lượng tối đa cho phép (${MAX_FILE_SIZE_MB}MB). File của bạn: ${formatFileSize(selectedFile.size)}.`;
      setFileError(msg);
      toast.error(msg);
      return false;
    }

    // 2. Kiểm tra định dạng file
    const rawExt = selectedFile.name.split(".").pop()?.toUpperCase() ?? "";
    if (!ALLOWED_EXTENSIONS.includes(rawExt as AllowedExtension)) {
      const msg = `Định dạng không hợp lệ. Chỉ chấp nhận: ${ALLOWED_EXTENSIONS.join(", ")}.`;
      setFileError(msg);
      toast.error(msg);
      return false;
    }

    // 3. Kiểm tra chuẩn tên file: phải bắt đầu bằng [MãĐềTài] (không phân biệt hoa/thường)
    //    Ví dụ hợp lệ: [DT001].PDF | [DT001].pdf | [DT001].DOCX
    const expectedPrefix = `[${projectCode}]`;
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
    event.target.value = ""; // Reset để có thể chọn lại cùng file nếu cần
    if (!selectedFile) return;

    if (validateAndSetFile(selectedFile)) {
      setFile(selectedFile);
    } else {
      setFile(null);
    }
  };

  // ---- Main upload handler (3-step Resumable Upload) ----
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
      // ── Bước 1: Gọi BE xin Google Drive sessionUrl ──────────────────────
      setStage("requesting");
      const session = await submissionService.initDriveUpload({
        projectId,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type || "application/octet-stream",
      });

      // ── Bước 2: PUT file trực tiếp lên Google qua sessionUrl ────────────
      setStage("uploading");
      await submissionService.uploadToDrive(
        session.sessionUrl,
        file,
        (percent) => setUploadProgress(percent),
      );

      // ── Bước 3: Báo BE xác nhận và lưu vào Database ─────────────────────
      setStage("confirming");
      const confirmed = await submissionService.confirmDriveUpload({
        projectId,
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

  // ============================================================
  // Render: Loading trạng thái eligibility
  // ============================================================
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

  // ============================================================
  // Render: Chặn nếu không phải Trưởng nhóm
  // ============================================================
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
                Chỉ <strong>Đại diện nhóm</strong> mới được phép tải lên tài
                liệu báo cáo. Vui lòng liên hệ trưởng nhóm của bạn để thực hiện
                thao tác này.
              </Typography>
            </Box>
          </CardContentDiv>
        </Card>
      </Box>
    );
  }

  // ============================================================
  // Render: Nộp bài thành công
  // ============================================================
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

              {/* Thông tin file đã nộp */}
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

              {/* Link xem file trực tiếp trên Google Drive */}
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

  // ============================================================
  // Render: Form nộp bài chính
  // ============================================================
  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Card>
        <CardHeader title="Nộp bài cuối kỳ" />
        <CardContentDiv padding={3}>
          {/* Cảnh báo chưa đủ điều kiện */}
          {!eligible && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              <Typography variant="body2">
                <strong>Chưa đủ điều kiện:</strong> Bạn cần hoàn thành tất cả
                báo cáo tiến độ và không bị cấm thi để có thể nộp bài.
              </Typography>
            </Alert>
          )}

          {/* Thông tin đề tài */}
          <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Mã đề tài
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {projectCode}
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Tên đề tài
              </Typography>
              <Typography variant="body1">{projectName}</Typography>
            </Box>
          </Box>

          {/* Hướng dẫn quy cách file */}
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
              [{projectCode}].PDF &nbsp;|&nbsp; [{projectCode}].DOCX
              &nbsp;|&nbsp; [{projectCode}].PPTX
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 1, display: "block" }}
            >
              Dung lượng tối đa: {MAX_FILE_SIZE_MB}MB
            </Typography>
          </Alert>

          {/* Khu vực kéo thả / chọn file */}
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

          {/* Lỗi validate file */}
          {fileError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {fileError}
            </Alert>
          )}

          {/* Progress Bar — chỉ hiển thị khi đang upload */}
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

          {/* Lỗi upload */}
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

          {/* Nút Nộp bài */}
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

          {/* Ghi chú không thể thay đổi sau khi nộp */}
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
