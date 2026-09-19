import { Box, Typography, Button, Alert } from "@mui/material";
import { CheckCircle } from "lucide-react";
import { Dialog } from "@/shared/components";
import type { PendingRequest } from "../types";

interface ApproveConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  request: PendingRequest | null;
  loading?: boolean;
}

export function ApproveConfirmDialog({
  open,
  onClose,
  onConfirm,
  request,
  loading = false,
}: ApproveConfirmDialogProps) {
  if (!request) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Xác nhận phê duyệt"
      size="sm"
      actions={
        <>
          <Button variant="outlined" onClick={onClose} disabled={loading}>
            Hủy
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Xác nhận duyệt"}
          </Button>
        </>
      }
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pb: 1 }}>
        <Alert severity="info" icon={<CheckCircle size={20} />} sx={{ mb: 1 }}>
          <Typography variant="body2">
            Bạn đang xét duyệt sinh viên <strong>{request.studentName}</strong>{" "}
            vào đề tài <strong>{request.topicName}</strong>.
          </Typography>
        </Alert>

        <Box
          sx={{
            p: 2,
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ mb: 2, fontWeight: 600, color: "text.primary" }}
          >
            Thông tin ứng viên
          </Typography>

          <Box
            sx={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: 1.5 }}
          >
            <Typography variant="body2" color="text.secondary">
              Họ và tên
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {request.studentName}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Mã số SV
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {request.studentCode}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Ngày gửi
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {new Date(request.requestedAt).toLocaleDateString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Typography>
          </Box>
        </Box>

        {request.studentMessage && (
          <Box
            sx={{
              p: 2,
              bgcolor: "info.50",
              border: "1px solid",
              borderColor: "info.200",
              borderRadius: 1,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ mb: 1, fontWeight: 600, color: "info.900" }}
            >
              Nguyện vọng phân công công việc
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontStyle: "italic",
                color: "info.800",
                whiteSpace: "pre-wrap",
              }}
            >
              &quot;{request.studentMessage}&quot;
            </Typography>
          </Box>
        )}
      </Box>
    </Dialog>
  );
}
