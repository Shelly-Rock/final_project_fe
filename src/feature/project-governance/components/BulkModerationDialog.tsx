"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { Dialog } from "@/shared/components";
import { toast } from "sonner";
import { topicManageService } from "../services/topicManage.service";
import { errorMessage } from "../utils/governance";

interface BulkModerationDialogProps {
  open: boolean;
  action: "APPROVE" | "REJECT";
  topicIds: number[];
  onClose: () => void;
  onCompleted: () => void;
}

export function BulkModerationDialog({
  open,
  action,
  topicIds,
  onClose,
  onCompleted,
}: BulkModerationDialogProps) {
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setReason("");
  }, [action, open]);

  const isReject = action === "REJECT";
  const validationError = useMemo(() => {
    if (topicIds.length === 0) return "Vui lòng chọn ít nhất một đề tài.";
    if (isReject && !reason.trim())
      return "Từ chối đề tài bắt buộc phải nêu lý do.";
    return null;
  }, [isReject, reason, topicIds.length]);

  const handleSubmit = async () => {
    if (validationError) return;
    setSaving(true);
    try {
      const result = await topicManageService.bulkModeration({
        topicIds,
        action,
        reason: reason.trim() || undefined,
      });
      const changed = isReject ? result.rejected : result.approved;
      const verb = isReject ? "từ chối" : "duyệt";
      const notFoundText = result.notFound.length
        ? ` Không tìm thấy ${result.notFound.length} đề tài.`
        : "";
      toast.success(`Đã ${verb} ${changed} đề tài.${notFoundText}`);
      onCompleted();
      onClose();
    } catch (error) {
      toast.error(
        errorMessage(
          error,
          isReject
            ? "Không thể từ chối các đề tài."
            : "Không thể duyệt các đề tài.",
        ),
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={isReject ? "Từ chối đề tài đã chọn" : "Duyệt đề tài đã chọn"}
      description={`Thao tác áp dụng cho ${topicIds.length} đề tài và được ghi vào lịch sử từng đề tài.`}
      closeOnBackdrop={!saving}
      closeOnEscape={!saving}
      actions={
        <>
          <Button variant="outlined" onClick={onClose} disabled={saving}>
            Hủy
          </Button>
          <Button
            variant="contained"
            color={isReject ? "error" : "primary"}
            onClick={handleSubmit}
            disabled={saving || !!validationError}
          >
            {saving ? (
              <CircularProgress size={18} color="inherit" />
            ) : isReject ? (
              "Xác nhận từ chối"
            ) : (
              "Xác nhận duyệt"
            )}
          </Button>
        </>
      }
    >
      <Box sx={{ display: "grid", gap: 1.5, pt: 1 }}>
        <Alert severity={isReject ? "warning" : "info"}>
          {isReject
            ? "Các đăng ký đang chờ của đề tài bị từ chối cũng sẽ được cập nhật theo nghiệp vụ phía máy chủ."
            : "Chỉ các đề tài tồn tại trong danh sách đã chọn mới được cập nhật."}
        </Alert>
        <Typography variant="body2">
          Đã chọn: <strong>{topicIds.length}</strong> đề tài.
        </Typography>
        <TextField
          label={isReject ? "Lý do từ chối" : "Ghi chú duyệt (tùy chọn)"}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          disabled={saving}
          required={isReject}
          multiline
          minRows={3}
          error={isReject && !reason.trim()}
          helperText={
            validationError ??
            (isReject
              ? "Lý do được lưu vào đề tài và lịch sử kiểm duyệt."
              : "Ghi chú được lưu vào lịch sử kiểm duyệt khi có nội dung.")
          }
          fullWidth
        />
      </Box>
    </Dialog>
  );
}
