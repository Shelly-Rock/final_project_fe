import { Box, Typography, Button, TextField, Alert } from "@mui/material";
import { XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { Dialog } from "@/shared/components";
import type { PendingRequest } from "../types";

interface RejectConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  request: PendingRequest | null;
  loading?: boolean;
}

export function RejectConfirmDialog({
  open,
  onClose,
  onConfirm,
  request,
  loading = false,
}: RejectConfirmDialogProps) {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (open) {
      setReason("");
    }
  }, [open]);

  if (!request) return null;

  const handleConfirm = () => {
    onConfirm(reason.trim() || "Không đạt yêu cầu");
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Từ chối yêu cầu"
      size="sm"
      actions={
        <>
          <Button variant="outlined" onClick={onClose} disabled={loading}>
            Hủy
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Từ chối"}
          </Button>
        </>
      }
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pb: 1 }}>
        <Alert severity="warning" icon={<XCircle size={20} />} sx={{ mb: 1 }}>
          <Typography variant="body2">
            Bạn chuẩn bị từ chối yêu cầu đăng ký đề tài{" "}
            <strong>{request.topicName}</strong> của sinh viên{" "}
            <strong>{request.studentName}</strong>.
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

        <Box sx={{ mt: 1 }}>
          <Typography
            variant="subtitle2"
            sx={{ mb: 1, fontWeight: 600, color: "text.primary" }}
          >
            Lý do từ chối
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Nhập lý do từ chối (tùy chọn)..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={loading}
            size="small"
          />
        </Box>
      </Box>
    </Dialog>
  );
}
