"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Box } from "@mui/material";
import { Select } from "@/shared/components";
import { submissionService, Submission, SubmissionStatus } from "../services";
import { toast } from "sonner";
import { SubmissionStats } from "./SubmissionStats";
import { SubmissionTable } from "./SubmissionTable";
import { SubmissionReviewDialog } from "./SubmissionReviewDialog";

interface SubmissionWithName extends Submission {
  studentName?: string;
  studentMssv?: string;
  projectCode?: string;
  projectName?: string;
}

export function SubmissionManagement() {
  const [submissions, setSubmissions] = useState<SubmissionWithName[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | "">("");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [selectedSubmission, setSelectedSubmission] =
    useState<SubmissionWithName | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { current, pageSize } = pagination;

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const result = await submissionService.getSubmissions({
        page: current,
        limit: pageSize,
        status: statusFilter || undefined,
      });
      setSubmissions(result.data as SubmissionWithName[]);
      setPagination((prev) => ({ ...prev, total: result.total }));
    } catch {
      toast.error("Không thể tải danh sách bài nộp");
    } finally {
      setLoading(false);
    }
  }, [current, pageSize, statusFilter]);

  const fetchStats = useCallback(async () => {
    try {
      const result = await submissionService.getStats();
      setStats(result);
    } catch {
      // silent fail for stats
    }
  }, []);

  useEffect(() => {
    fetchSubmissions();
    fetchStats();
  }, [fetchSubmissions, fetchStats]);

  const handleReview = async (
    status: SubmissionStatus,
    rejectionReason?: string,
  ) => {
    if (!selectedSubmission) return;
    setSubmitting(true);
    try {
      await submissionService.reviewSubmission(selectedSubmission.id, 1, {
        status,
        rejectionReason,
      });
      toast.success(
        status === "APPROVED" ? "Đã duyệt bài nộp" : "Đã từ chối bài nộp",
      );
      setReviewModalVisible(false);
      fetchSubmissions();
      fetchStats();
    } catch {
      toast.error("Không thể duyệt bài nộp");
    } finally {
      setSubmitting(false);
    }
  };

  const openReviewModal = (
    submission: SubmissionWithName,
    status: SubmissionStatus = "APPROVED",
  ) => {
    setSelectedSubmission(submission);
    setReviewModalVisible(true);
  };

  return (
    <>
      <SubmissionStats stats={stats} />

      <Box sx={{ mb: 3 }}>
        <Select
          placeholder="Lọc trạng thái"
          value={statusFilter || undefined}
          onChange={(v) => setStatusFilter(v as SubmissionStatus | "")}
          options={[
            { value: "", label: "Tất cả" },
            { value: "PENDING", label: "Chờ duyệt" },
            { value: "APPROVED", label: "Đã duyệt" },
            { value: "REJECTED", label: "Từ chối" },
          ]}
          sx={{ width: 200 }}
        />
      </Box>

      <SubmissionTable
        submissions={submissions}
        loading={loading}
        pagination={pagination}
        onApprove={(row) => openReviewModal(row, "APPROVED")}
        onReject={(row) => openReviewModal(row, "REJECTED")}
        onView={(row) => window.open(row.fileName, "_blank")}
        onPageChange={(page) =>
          setPagination({ ...pagination, current: page + 1 })
        }
        onRowsPerPageChange={(pageSize) =>
          setPagination({ ...pagination, pageSize })
        }
      />

      <SubmissionReviewDialog
        open={reviewModalVisible}
        onClose={() => setReviewModalVisible(false)}
        onSubmit={handleReview}
        submission={selectedSubmission}
        loading={submitting}
      />
    </>
  );
}

export default SubmissionManagement;
