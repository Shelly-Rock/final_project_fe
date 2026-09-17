"use client";

import { useState, useEffect } from "react";
import { Box, CircularProgress, Alert } from "@mui/material";
import StudentSubmission from "@/feature/submission/components/StudentSubmission";
import { submissionService } from "@/feature/submission/services";
import { studentTopicService } from "@/feature/student-topic/services/studentTopicService";
import { toast } from "sonner";

export default function StudentSubmissionPage() {
  const [topicData, setTopicData] = useState<{
    topicId: number;
    topicCode: string;
    topicName: string;
    isLeader: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitData = async () => {
      try {
        const reg = await studentTopicService.getMyRegistration();
        if (reg?.topicId) {
          const elig = await submissionService.getMyEligibility();
          setTopicData({
            topicId: Number(reg.topicId),
            topicCode: "",
            topicName: reg.topicName,
            isLeader: !!elig.isLeader,
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
        topicId={topicData.topicId}
        topicCode={topicData.topicCode}
        topicName={topicData.topicName}
        isLeader={topicData.isLeader}
      />
    </Box>
  );
}
