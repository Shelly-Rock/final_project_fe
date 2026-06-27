"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Chip,
} from "@mui/material";
import {
  PlayArrow as ContinueIcon,
  Schedule as ExtendIcon,
  SwapHoriz as ChangeIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import { useState, useCallback } from "react";

type ExtensionChoice = "continue" | "extend" | "change";
type ExtensionChoiceLabel = {
  value: ExtensionChoice;
  label: string;
  description: string;
  icon: React.ReactElement;
  color: "success" | "info" | "warning";
};

const CHOICES: ExtensionChoiceLabel[] = [
  {
    value: "continue",
    label: "Tiếp tục thực hiện",
    description: "Giữ nguyên đề tài và tiến độ hiện tại. Không thay đổi deadline.",
    icon: <ContinueIcon />,
    color: "success",
  },
  {
    value: "extend",
    label: "Gia hạn thời gian",
    description: "Kéo dài thời gian thực hiện thêm X tuần/tháng mà không đổi đề tài.",
    icon: <ExtendIcon />,
    color: "info",
  },
  {
    value: "change",
    label: "Đổi đề tài",
    description: "SV được phép chọn đề tài mới. Đề tài cũ sẽ bị hủy.",
    icon: <ChangeIcon />,
    color: "warning",
  },
];

interface ExtendOrChangeTopicModalProps {
  open: boolean;
  onClose: () => void;
  topicName: string;
  studentName: string;
  currentDeadline: string;
  onSubmit: (choice: ExtensionChoice, note?: string, newDeadline?: string) => void;
  loading?: boolean;
}

export function ExtendOrChangeTopicModal({
  open,
  onClose,
  topicName,
  studentName,
  currentDeadline,
  onSubmit,
  loading = false,
}: ExtendOrChangeTopicModalProps) {
  const [choice, setChoice] = useState<ExtensionChoice>("continue");
  const [note, setNote] = useState("");
  const [confirmExtend, setConfirmExtend] = useState("");
  const [confirmChange, setConfirmChange] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = useCallback(() => {
    if (choice === "extend") {
      if (!confirmExtend.trim()) {
        setError("Vui lòng nhập 'Tôi đồng ý gia hạn' để xác nhận.");
        return;
      }
      if (!note.trim()) {
        setError("Vui lòng nhập lý do gia hạn.");
        return;
      }
    }
    if (choice === "change") {
      if (!confirmChange.trim()) {
        setError("Vui lòng nhập 'Tôi đồng ý đổi đề tài' để xác nhận.");
        return;
      }
    }
    setError("");
    onSubmit(choice, note);
    onClose();
  }, [choice, confirmExtend, confirmChange, note, onSubmit, onClose]);

  const handleClose = useCallback(() => {
    setChoice("continue");
    setNote("");
    setConfirmExtend("");
    setConfirmChange("");
    setError("");
    onClose();
  }, [onClose]);

  const isConfirmExtendValid = confirmExtend.trim() === "Tôi đồng ý gia hạn";
  const isConfirmChangeValid = confirmChange.trim() === "Tôi đồng ý đổi đề tài";

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        Gia hạn / Đổi đề tài
      </DialogTitle>

      <DialogContent>
        {/* Topic info */}
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Sinh viên:</strong> {studentName} &nbsp;|&nbsp;
            <strong>Đề tài:</strong> {topicName}
          </Typography>
          <Typography variant="caption">
            Hạn hiện tại: {new Date(currentDeadline).toLocaleDateString("vi-VN")}
          </Typography>
        </Alert>

        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
          Chọn hành động:
        </Typography>

        <RadioGroup
          value={choice}
          onChange={(e) => {
            setChoice(e.target.value as ExtensionChoice);
            setError("");
          }}
        >
          {CHOICES.map((c) => (
            <Box
              key={c.value}
              sx={{
                border: "1px solid",
                borderColor: choice === c.value ? `${c.color}.main` : "divider",
                borderRadius: 2,
                p: 2,
                mb: 1.5,
                cursor: "pointer",
                bgcolor: choice === c.value ? `${c.color}.50` : "background.paper",
                transition: "all 0.2s",
                "&:hover": { borderColor: `${c.color}.main` },
              }}
              onClick={() => setChoice(c.value)}
            >
              <FormControlLabel
                value={c.value}
                control={<Radio />}
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {c.icon}
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {c.label}
                    </Typography>
                  </Box>
                }
                sx={{ m: 0, mb: 0.5 }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", ml: 4 }}>
                {c.description}
              </Typography>
            </Box>
          ))}
        </RadioGroup>

        <Divider sx={{ my: 2 }} />

        {/* Extend fields */}
        {choice === "extend" && (
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
              Lý do gia hạn (bắt buộc):
            </Typography>
            <TextField
              fullWidth
              size="small"
              multiline
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="VD: Cần thêm thời gian thu thập dữ liệu..."
              sx={{ mb: 2 }}
            />

            <Alert severity="warning" sx={{ mb: 1 }}>
              <Typography variant="caption">
                Xác nhận bằng cách nhập: <strong>Tôi đồng ý gia hạn</strong>
              </Typography>
            </Alert>
            <TextField
              fullWidth
              size="small"
              value={confirmExtend}
              onChange={(e) => setConfirmExtend(e.target.value)}
              placeholder="Tôi đồng ý gia hạn"
              error={confirmExtend.length > 0 && !isConfirmExtendValid}
            />
          </Box>
        )}

        {/* Change fields */}
        {choice === "change" && (
          <Box>
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="caption">
                SV phải đăng ký lại từ đầu. Đề tài cũ sẽ bị hủy và không thể khôi phục.
              </Typography>
            </Alert>

            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
              Ghi chú (tùy chọn):
            </Typography>
            <TextField
              fullWidth
              size="small"
              multiline
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="VD: Đề tài cũ không phù hợp với hướng nghiên cứu..."
              sx={{ mb: 2 }}
            />

            <Alert severity="error" sx={{ mb: 1 }}>
              <Typography variant="caption">
                Xác nhận bằng cách nhập: <strong>Tôi đồng ý đổi đề tài</strong>
              </Typography>
            </Alert>
            <TextField
              fullWidth
              size="small"
              value={confirmChange}
              onChange={(e) => setConfirmChange(e.target.value)}
              placeholder="Tôi đồng ý đổi đề tài"
              error={confirmChange.length > 0 && !isConfirmChangeValid}
            />
          </Box>
        )}

        {/* Continue — just a note */}
        {choice === "continue" && (
          <Alert severity="success">
            <Typography variant="caption">
              Đề tài và tiến độ giữ nguyên. Thao tác này chỉ ghi nhận yêu cầu của sinh viên.
            </Typography>
          </Alert>
        )}

        {/* Error */}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            <Typography variant="caption">{error}</Typography>
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={loading}>
          Hủy
        </Button>
        <Button
          variant="contained"
          color={
            choice === "continue" ? "success" : choice === "extend" ? "info" : "warning"
          }
          onClick={handleSubmit}
          disabled={
            loading ||
            (choice === "extend" && !isConfirmExtendValid) ||
            (choice === "change" && !isConfirmChangeValid)
          }
          startIcon={
            choice === "continue" ? <ContinueIcon /> : choice === "extend" ? <ExtendIcon /> : <ChangeIcon />
          }
        >
          {loading ? "Đang xử lý..." : "Xác nhận"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
