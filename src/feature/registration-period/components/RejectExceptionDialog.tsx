"use client";

import { useState } from "react";
import { Dialog } from "@/shared/components";
import { Button } from "@/shared/components";
import { Textarea } from "@/shared/components";

interface RejectExceptionDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
  exceptionName: string;
}

export function RejectExceptionDialog({
  open,
  onClose,
  onConfirm,
  exceptionName,
}: RejectExceptionDialogProps) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!reason.trim()) return;

    setLoading(true);
    try {
      await onConfirm(reason);
      setReason("");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setReason("");
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Từ chối yêu cầu ngoại lệ"
      description={`Đề tài: ${exceptionName}`}
      size="md"
      actions={
        <>
          <Button variant="outlined" onClick={handleClose} disabled={loading}>
            Hủy
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirm}
            loading={loading}
            disabled={!reason.trim()}
          >
            Xác nhận từ chối
          </Button>
        </>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Textarea
          label="Lý do từ chối"
          placeholder="Nhập lý do từ chối yêu cầu ngoại lệ này..."
          value={reason}
          onChange={(value) => setReason(value)}
          minRows={3}
          required
          fullWidth
        />
      </div>
    </Dialog>
  );
}
