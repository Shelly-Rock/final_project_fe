"use client";

import { useState, useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import { Dialog } from "@/shared/components";
import { Input } from "@/shared/components";
import { Button } from "@/shared/components";
import type { Submission, SubmissionStatus } from "../services";

interface SubmissionWithName extends Submission {
  studentName?: string;
  studentMssv?: string;
  projectCode?: string;
  projectName?: string;
}

interface SubmissionReviewDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    status: SubmissionStatus,
    rejectionReason?: string,
  ) => Promise<void>;
  submission?: SubmissionWithName | null;
  loading?: boolean;
  initialStatus?: SubmissionStatus;
}

export function SubmissionReviewDialog({
  open,
  onClose,
  onSubmit,
  submission,
  loading = false,
  initialStatus = "APPROVED",
}: SubmissionReviewDialogProps) {
  const prevOpenRef = useRef<boolean>(open);
  const [reviewStatus, setReviewStatus] =
    useState<SubmissionStatus>("APPROVED");
  const [rejectionReason, setRejectionReason] = useState("");

  // Reset state when dialog opens
  useEffect(() => {
    if (open && !prevOpenRef.current) {
      setReviewStatus(initialStatus);
      setRejectionReason("");
    }
    prevOpenRef.current = open;
  }, [open, initialStatus]);

  const handleSubmit = async () => {
    await onSubmit(
      reviewStatus,
      reviewStatus === "REJECTED" ? rejectionReason : undefined,
    );
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? () => {} : onClose}
      title={reviewStatus === "APPROVED" ? "Duyệt bài nộp" : "Từ chối bài nộp"}
      description={
        reviewStatus === "APPROVED"
          ? "Xác nhận duyệt bài nộp này"
          : "Xác nhận từ chối bài nộp này"
      }
      size="md"
      actions={
        <>
          <Button variant="outlined" onClick={onClose} disabled={loading}>
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            color={reviewStatus === "REJECTED" ? "error" : "primary"}
            loading={loading}
          >
            {reviewStatus === "APPROVED" ? "Duyệt" : "Từ chối"}
          </Button>
        </>
      }
    >
      <Box sx={{ mt: 2 }}>
        {submission && (
          <>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Sinh viên:
              </Typography>
              <Typography variant="body1">{submission.studentName}</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Đề tài:
              </Typography>
              <Typography variant="body1">{submission.projectName}</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                File:
              </Typography>
              <Typography variant="body1">{submission.fileName}</Typography>
            </Box>
            {reviewStatus === "REJECTED" && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Lý do từ chối:
                </Typography>
                <Input
                  multiline
                  rows={4}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Nhập lý do từ chối..."
                  fullWidth
                />
              </Box>
            )}
          </>
        )}
      </Box>
    </Dialog>
  );
}
