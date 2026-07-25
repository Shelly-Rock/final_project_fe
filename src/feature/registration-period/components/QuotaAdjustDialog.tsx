"use client";

import { useState } from "react";
import { Dialog } from "@/shared/components";
import { Input } from "@/shared/components";
import { Button } from "@/shared/components";
import type { TeacherQuota } from "../types";

const MIN_QUOTA = 3;
const MAX_QUOTA = 10;

interface QuotaAdjustDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (quota: number) => Promise<void>;
  teacherQuota: TeacherQuota | null;
  loading?: boolean;
}

export function QuotaAdjustDialog({
  open,
  onClose,
  onSubmit,
  teacherQuota,
  loading = false,
}: QuotaAdjustDialogProps) {
  const [localQuota, setLocalQuota] = useState("");
  const [showError, setShowError] = useState(false);

  // Get numeric value for validation
  const numericValue = localQuota === "" ? null : parseInt(localQuota, 10);

  const isValid =
    numericValue !== null &&
    numericValue >= MIN_QUOTA &&
    numericValue <= MAX_QUOTA;

  // Use teacherQuota if available, otherwise use local state
  const displayValue = teacherQuota
    ? teacherQuota.assignedQuota.toString()
    : localQuota;

  const handleSubmit = async () => {
    if (!isValid) {
      setShowError(true);
      return;
    }
    await onSubmit(numericValue!);
  };

  const handleValueChange = (value: string) => {
    setLocalQuota(value);
    if (showError) {
      const numeric = value === "" ? null : parseInt(value, 10);
      if (numeric !== null && numeric >= MIN_QUOTA && numeric <= MAX_QUOTA) {
        setShowError(false);
      }
    }
  };

  const getHelperText = () => {
    if (localQuota === "") {
      return `Chỉ tiêu hợp lệ (${MIN_QUOTA}-${MAX_QUOTA} đề tài)`;
    }
    if (numericValue !== null && numericValue < MIN_QUOTA) {
      return `Chỉ tiêu tối thiểu là ${MIN_QUOTA} đề tài`;
    }
    if (numericValue !== null && numericValue > MAX_QUOTA) {
      return `Chỉ tiêu tối đa là ${MAX_QUOTA} đề tài`;
    }
    return `Chỉ tiêu hợp lệ (${MIN_QUOTA}-${MAX_QUOTA} đề tài)`;
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? () => {} : onClose}
      title="Điều chỉnh chỉ tiêu"
      description="Thay đổi số lượng đề tài tối đa mà giảng viên có thể hướng dẫn"
      size="sm"
      actions={
        <>
          <Button variant="outlined" onClick={onClose} disabled={loading}>
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            loading={loading}
            disabled={!isValid}
          >
            Lưu thay đổi
          </Button>
        </>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {teacherQuota && (
          <div
            style={{
              padding: 12,
              backgroundColor: "#f8fafc",
              borderRadius: 8,
              marginBottom: 8,
            }}
          >
            <div style={{ marginBottom: 4 }}>
              <span style={{ fontWeight: 600 }}>
                {teacherQuota.teacherName}
              </span>
            </div>
            <div style={{ fontSize: "0.875rem", color: "#64748b" }}>
              Khoa: {teacherQuota.department}
            </div>
            <div style={{ fontSize: "0.875rem", color: "#64748b" }}>
              Đã nộp: {teacherQuota.submittedTopics} đề tài
            </div>
          </div>
        )}

        <Input
          label="Số đề tài tối đa"
          type="number"
          value={displayValue}
          onChange={(e) => handleValueChange(e.target.value)}
          helperText={getHelperText()}
          error={showError || !isValid}
          fullWidth
        />

        <div
          style={{
            fontSize: "0.75rem",
            color: "#64748b",
            padding: "8px 12px",
            backgroundColor: "#fef3c7",
            borderRadius: 6,
            border: "1px solid #fcd34d",
          }}
        >
          <strong>Lưu ý:</strong> Chỉ tiêu phải từ {MIN_QUOTA} đến {MAX_QUOTA}{" "}
          đề tài/giảng viên.
        </div>
      </div>
    </Dialog>
  );
}
