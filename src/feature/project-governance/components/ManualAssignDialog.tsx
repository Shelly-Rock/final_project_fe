"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { Dialog } from "@/shared/components";
import { toast } from "sonner";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { topicManageService } from "../services/topicManage.service";
import type { ManagedTopicRow, StudentWithoutTopic } from "../types";
import { errorMessage } from "../utils/governance";

interface ManualAssignDialogProps {
  open: boolean;
  topic: ManagedTopicRow | null;
  onClose: () => void;
  onSaved: () => void;
}

export function ManualAssignDialog({
  open,
  topic,
  onClose,
  onSaved,
}: ManualAssignDialogProps) {
  const [search, setSearch] = useState("");
  const debounced = useDebouncedValue(search, 400);
  const [students, setStudents] = useState<StudentWithoutTopic[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const remainingSlots = topic?.remainingSlots ?? 0;

  const loadStudents = useCallback(async () => {
    if (!open || !topic) return;
    setLoading(true);
    try {
      const response = await topicManageService.studentsWithoutTopic({
        periodId: topic.periodId,
        search: debounced.trim() || undefined,
        page: 1,
        limit: 100,
      });
      setStudents(response.items ?? []);
    } catch (error) {
      toast.error(
        errorMessage(error, "Không thể tải sinh viên chưa có đề tài."),
      );
    } finally {
      setLoading(false);
    }
  }, [debounced, open, topic]);

  useEffect(() => {
    if (!open) return;
    setSearch("");
    setSelectedIds([]);
    setReason("");
  }, [open, topic?.id]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  const validationError = useMemo(() => {
    if (remainingSlots <= 0) return "Đề tài đã hết chỗ.";
    if (!selectedIds.length) return "Vui lòng chọn ít nhất một sinh viên.";
    if (selectedIds.length > remainingSlots) {
      return `Chỉ còn ${remainingSlots} chỗ nhưng đang chọn ${selectedIds.length} sinh viên.`;
    }
    if (!reason.trim()) return "Gán trực tiếp bắt buộc phải có lý do.";
    return null;
  }, [reason, remainingSlots, selectedIds.length]);

  const toggleStudent = (student: StudentWithoutTopic) => {
    if (student.isBanned) return;
    setSelectedIds((ids) => {
      if (ids.includes(student.id))
        return ids.filter((id) => id !== student.id);
      if (ids.length >= remainingSlots) return ids;
      return [...ids, student.id];
    });
  };

  const handleSave = async () => {
    if (!topic || validationError) return;
    setSaving(true);
    try {
      await topicManageService.manualAssign({
        topicId: topic.id,
        studentIds: selectedIds,
        reason: reason.trim(),
      });
      toast.success(`Đã gán ${selectedIds.length} sinh viên vào đề tài.`);
      onSaved();
      onClose();
    } catch (error) {
      toast.error(errorMessage(error, "Không thể gán sinh viên vào đề tài."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={
        topic
          ? `Gán sinh viên — ${topic.code ?? `#${topic.id}`}`
          : "Gán sinh viên"
      }
      description={`Đề tài còn ${remainingSlots} chỗ. Hệ thống sẽ kiểm tra lại điều kiện của sinh viên trước khi gán.`}
      closeOnBackdrop={!saving}
      closeOnEscape={!saving}
      actions={
        <>
          <Button variant="outlined" onClick={onClose} disabled={saving}>
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving || !!validationError}
          >
            {saving ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              "Gán sinh viên"
            )}
          </Button>
        </>
      }
    >
      <Box sx={{ display: "grid", gap: 1.5, pt: 1 }}>
        <Alert severity="info">
          Chỉ những sinh viên chưa có đề tài và đáp ứng điều kiện đăng ký mới có
          thể được chọn.
        </Alert>
        <TextField
          label="Tìm sinh viên"
          placeholder="Mã SV / Họ tên / Email / Lớp"
          size="small"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          disabled={saving}
          fullWidth
        />

        <Box
          sx={{
            maxHeight: 310,
            overflowY: "auto",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            px: 1,
          }}
        >
          {loading ? (
            <Box sx={{ py: 4, display: "flex", justifyContent: "center" }}>
              <CircularProgress size={24} />
            </Box>
          ) : students.length === 0 ? (
            <Typography
              color="text.secondary"
              variant="body2"
              sx={{ py: 3, textAlign: "center" }}
            >
              Không còn sinh viên phù hợp.
            </Typography>
          ) : (
            students.map((student) => (
              <FormControlLabel
                key={student.id}
                disabled={
                  saving ||
                  student.isBanned ||
                  (!selectedIds.includes(student.id) &&
                    selectedIds.length >= remainingSlots)
                }
                control={
                  <Checkbox
                    checked={selectedIds.includes(student.id)}
                    onChange={() => toggleStudent(student)}
                  />
                }
                label={
                  <Box sx={{ py: 0.75 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {student.studentCode} · {student.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      color={student.isBanned ? "error" : "text.secondary"}
                    >
                      {student.className ?? "—"} · {student.email}
                      {student.isBanned
                        ? ` · Đang bị cấm: ${student.banReason ?? "Không rõ lý do"}`
                        : ""}
                    </Typography>
                  </Box>
                }
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  width: "100%",
                  m: 0,
                }}
              />
            ))
          )}
        </Box>

        <Typography variant="caption" color="text.secondary">
          Đã chọn {selectedIds.length}/{remainingSlots} chỗ.
        </Typography>

        <TextField
          label="Lý do gán trực tiếp"
          size="small"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          disabled={saving}
          multiline
          minRows={2}
          required
          error={!!validationError && !reason.trim()}
          helperText={
            validationError ??
            "Lý do sẽ được lưu trong lịch sử thay đổi của đề tài."
          }
          fullWidth
        />
      </Box>
    </Dialog>
  );
}
