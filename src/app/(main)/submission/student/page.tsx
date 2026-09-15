"use client";

import { useState, useEffect } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  Alert,
  Button,
} from "@mui/material";
import { BookOpen, ShieldAlert } from "lucide-react";
import StudentSubmission from "@/feature/submission/components/StudentSubmission";
import apiClient from "@/core/api";
import type { MyRegistrationResponse } from "@/feature/student-topic/services/topic.api";

interface ApprovedProjectInfo {
  studentId: number;
  projectId: number;
  projectCode: string;
  projectName: string;
}

type PageState = "loading" | "no_project" | "ready" | "error";

export default function StudentSubmissionPage() {
  const [pageState, setPageState] = useState<PageState>("loading");
  const [projectInfo, setProjectInfo] = useState<ApprovedProjectInfo | null>(
    null,
  );
  const [statusMessage, setStatusMessage] = useState<string>("");

  useEffect(() => {
    async function loadProjectInfo() {
      try {
        const response = await apiClient.get<MyRegistrationResponse>(
          "/topics/my-registration",
        );
        const raw = response.data;

        if (!raw.registration) {
          setStatusMessage(
            "Bạn chưa đăng ký đề tài nào. Vui lòng vào trang Đăng ký đề tài để chọn đề tài.",
          );
          setPageState("no_project");
          return;
        }

        const reg = raw.registration;
        const normalizedStatus = (reg.status ?? "").toUpperCase();

        if (
          normalizedStatus !== "APPROVED" &&
          normalizedStatus !== "ASSIGNED"
        ) {
          const statusLabels: Record<string, string> = {
            PENDING:
              "Đề tài đang chờ giảng viên phê duyệt. Vui lòng chờ kết quả trước khi nộp bài.",
            REJECTED:
              "Yêu cầu đăng ký đề tài đã bị từ chối. Vui lòng đăng ký lại đề tài khác.",
          };
          setStatusMessage(
            statusLabels[normalizedStatus] ??
              `Trạng thái đề tài hiện tại: "${reg.statusLabel ?? normalizedStatus}". Vui lòng liên hệ giáo vụ để được hỗ trợ.`,
          );
          setPageState("no_project");
          return;
        }

        const topic = reg.topic;
        const projectCode = reg.projectCode ?? topic?.code ?? "N/A";
        const projectName = topic?.name ?? "";

        setProjectInfo({
          studentId: raw.student?.id ?? 0,
          projectId: reg.projectId,
          projectCode,
          projectName,
        });
        setPageState("ready");
      } catch {
        setStatusMessage(
          "Không thể tải thông tin đề tài. Vui lòng thử lại hoặc liên hệ giáo vụ.",
        );
        setPageState("error");
      }
    }

    loadProjectInfo();
  }, []);

  if (pageState === "loading") {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 300,
          gap: 2,
        }}
      >
        <CircularProgress size={28} />
        <Typography color="text.secondary">
          Đang tải thông tin đề tài...
        </Typography>
      </Box>
    );
  }

  if (pageState === "no_project" || pageState === "error") {
    return (
      <Box sx={{ maxWidth: 600, mx: "auto", mt: 6, px: 2 }}>
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <ShieldAlert size={64} color="#f97316" />
        </Box>
        <Alert
          severity={pageState === "error" ? "error" : "warning"}
          sx={{ mb: 3, borderRadius: 2 }}
        >
          <Typography variant="body1" fontWeight={600} gutterBottom>
            {pageState === "error"
              ? "Không thể tải thông tin"
              : "Chưa sẵn sàng nộp bài"}
          </Typography>
          <Typography variant="body2">{statusMessage}</Typography>
        </Alert>
        <Box sx={{ textAlign: "center" }}>
          {pageState === "no_project" ? (
            <Button
              variant="outlined"
              startIcon={<BookOpen size={16} />}
              href="/topic-registration"
            >
              Đến trang Đăng ký đề tài
            </Button>
          ) : (
            <Button variant="outlined" onClick={() => window.location.reload()}>
              Thử lại
            </Button>
          )}
        </Box>
      </Box>
    );
  }

  if (!projectInfo) return null;

  return (
    <StudentSubmission
      projectId={projectInfo.projectId}
      projectCode={projectInfo.projectCode}
      projectName={projectInfo.projectName}
    />
  );
}
