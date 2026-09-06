"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Paper,
} from "@mui/material";
import { Card, CardHeader, CardContentDiv } from "@/shared/components";
import { Inbox, Upload, CheckCircle } from "lucide-react";
import { submissionService } from "../services";
import { toast } from "sonner";

interface StudentSubmissionProps {
  studentId: number;
  projectId: number;
  projectCode: string;
  projectName: string;
}

export default function StudentSubmission({
  studentId,
  projectId,
  projectCode,
  projectName,
}: StudentSubmissionProps) {
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [eligible, setEligible] = useState(false);
  const [checking, setChecking] = useState(true);

  const checkEligibility = useCallback(async () => {
    setChecking(true);
    try {
      const eligibleStudents = await submissionService.getEligibleStudents();
      const isEligible = eligibleStudents.some((s) => s.id === studentId);
      setEligible(isEligible);
    } catch {
      toast.error("Không thể kiểm tra điều kiện nộp bài");
      setEligible(true);
    } finally {
      setChecking(false);
    }
  }, [studentId]);

  useEffect(() => {
    checkEligibility();
  }, [checkEligibility]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    const fileName = selectedFile.name;
    const expectedPrefix = `[${projectCode}]`;

    if (!fileName.startsWith(expectedPrefix)) {
      toast.error(
        `Tên file phải bắt đầu bằng "${expectedPrefix}" (VD: ${projectCode}.PDF)`,
      );
      event.target.value = "";
      return;
    }

    const extension = fileName.split(".").pop()?.toUpperCase();
    if (!["PDF", "DOCX", "PPTX"].includes(extension || "")) {
      toast.error("Chỉ chấp nhận file PDF, Word (.docx), PowerPoint (.pptx)");
      event.target.value = "";
      return;
    }

    setFile(selectedFile);
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error("Vui lòng chọn file để nộp");
      return;
    }

    setSubmitting(true);
    try {
      const fileUrl = `/uploads/${file.name}`;
      await submissionService.createSubmission({
        studentId,
        projectId,
        fileUrl,
        fileName: file.name,
        originalName: file.name,
        fileSize: file.size || 0,
        fileType: getFileType(file.name),
      });
      setSubmitted(true);
      toast.success("Nộp bài thành công!");
    } catch {
      toast.error("Không thể nộp bài");
    } finally {
      setSubmitting(false);
    }
  };

  const getFileType = (fileName: string): "PDF" | "WORD" | "POWERPOINT" => {
    const ext = fileName.split(".").pop()?.toUpperCase();
    if (ext === "PDF") return "PDF";
    if (ext === "DOCX" || ext === "DOC") return "WORD";
    return "POWERPOINT";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (checking) {
    return (
      <Box
        sx={{
          maxWidth: 600,
          mx: "auto",
          mt: 4,
          p: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 200,
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Đang kiểm tra...</Typography>
      </Box>
    );
  }

  if (submitted) {
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
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                Nộp bài thành công!
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Bài nộp của bạn đang chờ được duyệt.
              </Typography>
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

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Mã đề tài:
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 700 }}>
              {projectCode}
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Tên đề tài:
            </Typography>
            <Typography variant="body1">{projectName}</Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Quy cách file:
            </Typography>
            <Typography variant="body1">
              [{projectCode}].PDF hoặc .DOCX hoặc .PPTX
            </Typography>
          </Box>

          <Paper
            sx={{
              p: 4,
              mb: 3,
              border: "2px dashed",
              borderColor: "divider",
              textAlign: "center",
              cursor: "pointer",
              "&:hover": {
                borderColor: "primary.main",
                bgcolor: "action.hover",
              },
            }}
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            <input
              id="file-upload"
              type="file"
              accept=".pdf,.docx,.pptx"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <Inbox size={48} color="#9ca3af" style={{ marginBottom: 16 }} />
            <Typography variant="body1" sx={{ mb: 1 }}>
              Kéo thả file vào đây hoặc click để chọn
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Chỉ chấp nhận file PDF, Word (.docx), PowerPoint (.pptx)
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#1976d2", fontWeight: 600 }}
            >
              Tên file phải theo định dạng: [{projectCode}].PDF
            </Typography>
          </Paper>

          {file && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                File đã chọn:
              </Typography>
              <Typography variant="body1">{file.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                Kích thước: {formatFileSize(file.size || 0)}
              </Typography>
            </Box>
          )}

          <Button
            variant="contained"
            startIcon={<Upload size={18} />}
            onClick={handleSubmit}
            disabled={!file || !eligible}
            sx={{ minWidth: 120 }}
          >
            {submitting ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
            Nộp bài
          </Button>
        </CardContentDiv>
      </Card>
    </Box>
  );
}
