"use client";

import { useState, useEffect } from "react";
import { Box, CircularProgress, Alert } from "@mui/material";
import StudentSubmission from "@/feature/submission/components/StudentSubmission";
import { submissionService } from "@/feature/submission/services";
import { useSession } from "next-auth/react";

export default function StudentSubmissionPage() {
  const { data: session, status } = useSession();
  const [projectData, setProjectData] = useState<{
    studentId: number;
    projectId: number;
    projectCode: string;
    projectName: string;
    isLeader: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "authenticated") return;

    const loadProjectData = async () => {
      try {
        setLoading(true);
        setError(null);

        const mySubmissions = await submissionService.getMySubmissions();

        if (!mySubmissions || mySubmissions.length === 0) {
          setProjectData(null);
          return;
        }

        const firstSubmission = mySubmissions[0];
        setProjectData({
          studentId: firstSubmission.studentId,
          projectId: firstSubmission.projectId,
          projectCode: firstSubmission.projectCode || "",
          projectName: firstSubmission.projectName || "",
          isLeader: true,
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Không thể tải thông tin đề tài",
        );
        setProjectData(null);
      } finally {
        setLoading(false);
      }
    };

    loadProjectData();
  }, [status]);

  // Loading state
  if (status === "loading" || loading) {
    return (
      <Box
        sx={{
          p: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 400,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Not authenticated
  if (status !== "authenticated") {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Vui lòng đăng nhập để truy cập trang này.
        </Alert>
      </Box>
    );
  }

  // No project assigned
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!projectData) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">
          Bạn chưa được gán đề tài. Vui lòng liên hệ giáo vụ để được cấp đề tài.
        </Alert>
      </Box>
    );
  }

  return (
    <StudentSubmission
      studentId={projectData.studentId}
      projectId={projectData.projectId}
      projectCode={projectData.projectCode}
      projectName={projectData.projectName}
      isLeader={projectData.isLeader}
    />
  );
}
