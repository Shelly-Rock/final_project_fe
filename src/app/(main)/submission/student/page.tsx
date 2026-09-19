"use client";

import { useState, useEffect } from "react";
import { Box, CircularProgress, Alert } from "@mui/material";
import StudentSubmission from "@/feature/submission/components/StudentSubmission";
import { submissionService } from "@/feature/submission/services";
import { studentTopicService } from "@/feature/student-topic/services/studentTopicService";
import { toast } from "sonner";

export default function StudentSubmissionPage() {
  const [topicData, setTopicData] = useState<{
    projectId: number;
    topicId: number;
    topicCode: string;
    topicName: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitData = async () => {
      try {
        const reg = await studentTopicService.getMyRegistration();
        if (reg?.id) {
          setTopicData({
            projectId: Number(reg.id), // Use projectId from registration
            topicId: Number(reg.topicId),
            topicCode: reg.topicCode || "",
            topicName: reg.topicName,
          });
        }
      } catch {
        toast.error(
          "Không thể tải thông tin đăng ký đề tài. Vui lòng thử lại!",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchInitData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!topicData) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">Bạn chưa đăng ký đề tài nào.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, width: "100%" }}>
      <StudentSubmission
        projectId={topicData.projectId}
        topicId={topicData.topicId}
        topicCode={topicData.topicCode}
        topicName={topicData.topicName}
      />
    </Box>
  );
}
