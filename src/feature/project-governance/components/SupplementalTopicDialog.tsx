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
import { Dialog, Select } from "@/shared/components";
import { toast } from "sonner";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { topicManageService } from "../services/topicManage.service";
import type { StudentWithoutTopic, TeacherWithQuota } from "../types";
import { MAX_STUDENTS_PER_TOPIC_CEILING } from "../constants";
import { errorMessage } from "../utils/governance";

interface SupplementalTopicDialogProps {
  open: boolean;
  periodId: number | null;
  onClose: () => void;
  onCreated: () => void;
}

export function SupplementalTopicDialog({
  open,
  periodId,
  onClose,
  onCreated,
}: SupplementalTopicDialogProps) {
  const [teachers, setTeachers] = useState<TeacherWithQuota[]>([]);
  const [teacherId, setTeacherId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [maxStudents, setMaxStudents] = useState("1");
  const [reason, setReason] = useState("");
  const [loadingTeachers, setLoadingTeachers] = useState(false);
  const [saving, setSaving] = useState(false);

  const [studentSearch, setStudentSearch] = useState("");
  const debouncedStudentSearch = useDebouncedValue(studentSearch, 400);
  const [students, setStudents] = useState<StudentWithoutTopic[]>([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  const loadTeachers = useCallback(async () => {
    if (!open || !periodId) return;
    setLoadingTeachers(true);
    try {
      const response = await topicManageService.teachersWithQuota({
        periodId,
        page: 1,
        limit: 100,
      });
      setTeachers(response.items ?? []);
    } catch (error) {
      toast.error(
        errorMessage(error, "Không thể tải giảng viên còn chỉ tiêu."),
      );
    } finally {
      setLoadingTeachers(false);
    }
  }, [open, periodId]);

  const loadStudents = useCallback(async () => {
    if (!open || !periodId) return;
    setLoadingStudents(true);
    try {
      const response = await topicManageService.studentsWithoutTopic({
        periodId,
        search: debouncedStudentSearch.trim() || undefined,
        page: 1,
        limit: 100,
      });
      setStudents(response.items ?? []);
    } catch (error) {
      toast.error(
        errorMessage(error, "Không thể tải sinh viên chưa có đề tài."),
      );
    } finally {
      setLoadingStudents(false);
    }
  }, [debouncedStudentSearch, open, periodId]);

  useEffect(() => {
    if (!open) return;
    setTeacherId("");
    setName("");
    setDescription("");
    setMaxStudents("1");
    setReason("");
    setStudentSearch("");
    setSelectedStudentIds([]);
    loadTeachers();
  }, [open, periodId, loadTeachers]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  const selectedTeacher = useMemo(
    () => teachers.find((teacher) => String(teacher.id) === teacherId),
    [teacherId, teachers],
  );

  const validationError = useMemo(() => {
    if (!periodId) return "Vui lòng chọn đợt đồ án.";
    if (!selectedTeacher) return "Chọn giảng viên còn chỉ tiêu đề tài.";
    if (!name.trim()) return "Tên đề tài không được để trống.";
    if (!description.trim()) return "Mô tả đề tài không được để trống.";
    const max = Number(maxStudents);
    if (
      !Number.isInteger(max) ||
      max < 1 ||
      max > MAX_STUDENTS_PER_TOPIC_CEILING
    ) {
      return `Sĩ số phải nằm trong khoảng 1–${MAX_STUDENTS_PER_TOPIC_CEILING}.`;
    }
    if (selectedStudentIds.length > max) {
      return `Số sinh viên gán (${selectedStudentIds.length}) vượt sĩ số tối đa (${max}).`;
    }
    if (!reason.trim()) return "Đề tài bổ sung bắt buộc phải có lý do.";
    return null;
  }, [
    description,
    maxStudents,
    name,
    periodId,
    reason,
    selectedStudentIds.length,
    selectedTeacher,
  ]);

  const toggleStudent = (student: StudentWithoutTopic) => {
    if (student.isBanned) return;
    const max = Number(maxStudents) || 0;
    setSelectedStudentIds((ids) => {
      if (ids.includes(student.id))
        return ids.filter((id) => id !== student.id);
      if (ids.length >= max) return ids;
      return [...ids, student.id];
    });
  };

  const handleCreate = async () => {
    if (!periodId || validationError) return;
    setSaving(true);
    try {
      const result = await topicManageService.createSupplemental({
        periodId,
        teacherId: Number(teacherId),
        name: name.trim(),
        description: description.trim(),
        maxStudents: Number(maxStudents),
        studentIds: selectedStudentIds,
        reason: reason.trim(),
      });
      toast.success(
        `Đã tạo đề tài bổ sung ${result.code}. Giảng viên còn ${result.remainingQuota} chỉ tiêu.`,
      );
      onCreated();
      onClose();
    } catch (error) {
      toast.error(errorMessage(error, "Không thể tạo đề tài bổ sung."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Tạo đề tài bổ sung"
      description="Thư ký hoặc Quản trị viên có thể tạo đề tài bổ sung sau thời hạn. Hệ thống sẽ kiểm tra chỉ tiêu của giảng viên và tự cấp mã đề tài."
      closeOnBackdrop={!saving}
      closeOnEscape={!saving}
      actions={
        <>
          <Button variant="outlined" onClick={onClose} disabled={saving}>
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={saving || !!validationError}
          >
            {saving ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              "Tạo đề tài"
            )}
          </Button>
        </>
      }
    >
      <Box sx={{ display: "grid", gap: 1.5, pt: 1 }}>
        <Alert severity="info">
          Chỉ hiển thị giảng viên còn chỉ tiêu và sinh viên chưa có đề tài trong
          đợt đã chọn.
        </Alert>

        <Select
          label="Giảng viên hướng dẫn (còn chỉ tiêu)"
          size="small"
          value={teacherId}
          onChange={setTeacherId}
          disabled={saving || loadingTeachers}
          options={teachers.map((teacher) => ({
            value: String(teacher.id),
            label: `${teacher.name} (${teacher.teacherId}) · còn ${teacher.remainingTopics}/${teacher.assignedQuota}`,
          }))}
          helperText={
            loadingTeachers
              ? "Đang tải giảng viên..."
              : selectedTeacher
                ? `Bộ môn: ${selectedTeacher.departmentName ?? "—"} · Khoa: ${selectedTeacher.facultyName ?? "—"}`
                : "Chỉ liệt kê giảng viên còn chỉ tiêu."
          }
        />

        <TextField
          label="Tên đề tài"
          size="small"
          value={name}
          onChange={(event) => setName(event.target.value)}
          disabled={saving}
          required
          fullWidth
        />
        <TextField
          label="Mô tả"
          size="small"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          disabled={saving}
          multiline
          minRows={3}
          required
          fullWidth
        />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "160px 1fr" },
            gap: 1.5,
          }}
        >
          <TextField
            label="Sĩ số tối đa"
            type="number"
            size="small"
            value={maxStudents}
            onChange={(event) => setMaxStudents(event.target.value)}
            disabled={saving}
            inputProps={{
              min: 1,
              max: MAX_STUDENTS_PER_TOPIC_CEILING,
              step: 1,
            }}
            fullWidth
          />
          <TextField
            label="Tìm sinh viên để gán ngay (tùy chọn)"
            size="small"
            value={studentSearch}
            onChange={(event) => setStudentSearch(event.target.value)}
            disabled={saving}
            fullWidth
          />
        </Box>

        <Box
          sx={{
            maxHeight: 240,
            overflowY: "auto",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            px: 1,
          }}
        >
          {loadingStudents ? (
            <Box sx={{ py: 4, display: "flex", justifyContent: "center" }}>
              <CircularProgress size={24} />
            </Box>
          ) : students.length === 0 ? (
            <Typography
              color="text.secondary"
              variant="body2"
              sx={{ py: 3, textAlign: "center" }}
            >
              Không còn sinh viên chưa có đề tài.
            </Typography>
          ) : (
            students.map((student) => (
              <FormControlLabel
                key={student.id}
                disabled={
                  saving ||
                  student.isBanned ||
                  (!selectedStudentIds.includes(student.id) &&
                    selectedStudentIds.length >= (Number(maxStudents) || 0))
                }
                control={
                  <Checkbox
                    checked={selectedStudentIds.includes(student.id)}
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
                      {student.isBanned ? " · Đang bị cấm làm đồ án" : ""}
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

        <TextField
          label="Lý do tạo đề tài bổ sung"
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
