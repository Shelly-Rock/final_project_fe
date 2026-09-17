import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
} from "@mui/material";

interface GenerateCodeDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (prefix: string) => void;
  count: number;
}

export const GenerateCodeDialog: React.FC<GenerateCodeDialogProps> = ({
  open,
  onClose,
  onConfirm,
  count,
}) => {
  const [prefix, setPrefix] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(prefix.trim());
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Sinh mã đề tài</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" sx={{ mb: 3 }}>
            Hệ thống sẽ tự động cấp mã cho <strong>{count}</strong> đề tài theo
            quy tắc: <code>[Tiền tố] + [STT Giảng viên] + [STT Đề tài]</code>.
            <br />
            Bạn có thể nhập tiền tố cho đợt cấp mã này (ví dụ:{" "}
            <code>IT22.</code>).
          </Typography>
          <TextField
            autoFocus
            fullWidth
            label="Tiền tố mã đề tài (Tùy chọn)"
            placeholder="VD: IT22."
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Hủy</Button>
          <Button type="submit" variant="contained">
            Bắt đầu sinh mã
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
