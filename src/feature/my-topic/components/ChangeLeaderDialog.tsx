"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Alert,
  RadioGroup,
  Radio,
  FormControlLabel,
  Button,
} from "@mui/material";
import { Dialog } from "@/shared/components";
import type { MyTopic } from "../types";

export interface ChangeLeaderDialogProps {
  open: boolean;
  topic: MyTopic | null;
  onClose: () => void;
  onSubmit: (topicId: number, projectId: number) => Promise<void>;
}

export function ChangeLeaderDialog({
  open,
  topic,
  onClose,
  onSubmit,
}: ChangeLeaderDialogProps) {
  const [leaderId, setLeaderId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const approvedStudents = useMemo(() => {
    return (
      topic?.registeredStudents?.filter((s) => s.status === "Approved") || []
    );
  }, [topic]);

  useEffect(() => {
    if (open && topic) {
      const currentLeader = approvedStudents.find((s) => s.isLeader);
      if (currentLeader) {
        setLeaderId(currentLeader.id);
      } else {
        setLeaderId(null);
      }
      setError(null);
    }
  }, [open, topic, approvedStudents]);

  const handleSubmit = async () => {
    setError(null);
    if (!leaderId) {
      setError("Vui lòng chọn 1 Trưởng nhóm.");
      return;
    }

    try {
      setLoading(true);
      await onSubmit(topic!.id, leaderId);
      onClose();
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setError(errorObj.message || "Đã xảy ra lỗi khi thay đổi trưởng nhóm.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Đổi trưởng nhóm"
      actions={
        <>
          <Button onClick={onClose} disabled={loading}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading}>
            Lưu thay đổi
          </Button>
        </>
      }
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Vui lòng chọn sinh viên để phân công làm trưởng nhóm mới cho đề tài{" "}
          <strong>{topic?.name}</strong>.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {approvedStudents.length === 0 ? (
          <Alert severity="warning">
            Không có sinh viên nào trong đề tài này.
          </Alert>
        ) : (
          <RadioGroup
            value={leaderId ?? ""}
            onChange={(e) => setLeaderId(Number(e.target.value))}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {approvedStudents.map((student) => (
                <Box
                  key={student.id}
                  sx={{
                    p: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                    bgcolor:
                      leaderId === student.id ? "primary.50" : "transparent",
                  }}
                >
                  <FormControlLabel
                    value={student.id}
                    control={<Radio />}
                    label={
                      <Box>
                        <Typography variant="subtitle2">
                          {student.studentName} - {student.studentCode}
                        </Typography>
                        {student.assignedTask && (
                          <Typography variant="body2" color="text.secondary">
                            Nhiệm vụ: {student.assignedTask}
                          </Typography>
                        )}
                        {student.isLeader && (
                          <Typography variant="caption" color="primary">
                            (Đang là trưởng nhóm)
                          </Typography>
                        )}
                      </Box>
                    }
                    sx={{ m: 0, width: "100%" }}
                  />
                </Box>
              ))}
            </Box>
          </RadioGroup>
        )}
      </Box>
    </Dialog>
  );
}
