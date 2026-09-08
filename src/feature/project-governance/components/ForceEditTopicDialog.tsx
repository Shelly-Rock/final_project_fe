"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  Switch as MuiSwitch,
  TextField,
} from "@mui/material";
import { Dialog, Select } from "@/shared/components";
import { topicManageService } from "../services/topicManage.service";
import type {
  ForceUpdateTopicInput,
  ManagedTopicRow,
  TeacherWithQuota,
  TopicStatus,
} from "../types";
import {
  MAX_STUDENTS_PER_TOPIC_CEILING,
  TOPIC_STATUS_LABELS,
} from "../constants";
import { errorMessage } from "../utils/governance";
import { toast } from "sonner";

interface ForceEditTopicDialogProps {
  open: boolean;
  topic: ManagedTopicRow | null;
  onClose: () => void;
  onSaved: () => void;
}

export function ForceEditTopicDialog({
  open,
  topic,
  onClose,
  onSaved,
}: ForceEditTopicDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [maxStudents, setMaxStudents] = useState("1");
  const [teacherId, setTeacherId] = useState("");
  const [status, setStatus] = useState<TopicStatus>("PENDING");
  const [locked, setLocked] = useState(false);
  const [reason, setReason] = useState("");
  const [teachers, setTeachers] = useState<TeacherWithQuota[]>([]);
  const [loadingTeachers, setLoadingTeachers] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open || !topic) return;
    setName(topic.name);
    setDescription(topic.description);
    setMaxStudents(String(topic.maxStudents));
    setTeacherId(topic.teacher ? String(topic.teacher.id) : "");
    setStatus(topic.status);
    setLocked(topic.locked);
    setReason("");

    let active = true;
    setLoadingTeachers(true);
    topicManageService
      .teachersWithQuota({ periodId: topic.periodId, page: 1, limit: 100 })
      .then((response) => {
        if (!active) return;
        const items = [...response.items];
        if (
          topic.teacher &&
          !items.some((teacher) => teacher.id === topic.teacher?.id)
        ) {
          items.unshift({
            id: topic.teacher.id,
            teacherId: topic.teacher.teacherId,
            name: topic.teacher.name,
            email: topic.teacher.email,
            departmentId: topic.teacher.departmentId,
            departmentName: topic.teacher.departmentName,
            facultyId: topic.teacher.facultyId,
            facultyName: topic.teacher.facultyName,
            assignedQuota: 0,
            submittedTopics: 0,
            remainingTopics: 0,
            isOverride: false,
          });
        }
        setTeachers(items);
      })
      .catch((error) => {
        if (active) {
          toast.error(
            errorMessage(error, "Không thể tải danh sách giảng viên."),
          );
        }
      })
      .finally(() => {
        if (active) setLoadingTeachers(false);
      });

    return () => {
      active = false;
    };
  }, [open, topic]);

  const validationError = useMemo(() => {
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
    if (topic && max < topic.occupiedStudents) {
      return `Không thể giảm sĩ số dưới ${topic.occupiedStudents} sinh viên đang chiếm chỗ.`;
    }
    if (!teacherId) return "Vui lòng chọn giảng viên hướng dẫn.";
    if (!reason.trim()) return "Vui lòng nhập lý do điều chỉnh.";
    return null;
  }, [description, maxStudents, name, reason, teacherId, topic]);

  const handleSave = async () => {
    if (!topic || validationError) return;

    const input: ForceUpdateTopicInput = { reason: reason.trim() };
    if (name.trim() !== topic.name) input.name = name.trim();
    if (description.trim() !== topic.description) {
      input.description = description.trim();
    }
    const nextMaxStudents = Number(maxStudents);
    if (nextMaxStudents !== topic.maxStudents) {
      input.maxStudents = nextMaxStudents;
    }
    const nextTeacherId = Number(teacherId);
    if (nextTeacherId !== topic.teacher?.id) input.teacherId = nextTeacherId;
    if (status !== topic.status) input.status = status;
    if (locked !== topic.locked) input.locked = locked;

    setSaving(true);
    try {
      await topicManageService.forceUpdate(topic.id, input);
      toast.success("Đã cập nhật đề tài và lưu lịch sử thay đổi.");
      onSaved();
      onClose();
    } catch (error) {
      toast.error(errorMessage(error, "Không thể cập nhật đề tài."));
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
          ? `Điều chỉnh đề tài — ${topic.code ?? `#${topic.id}`}`
          : "Điều chỉnh đề tài"
      }
      description="Quản trị viên và Thư ký có thể điều chỉnh đề tài sau thời hạn. Mọi thay đổi đều phải có lý do và được lưu vào lịch sử."
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
              "Lưu thay đổi"
            )}
          </Button>
        </>
      }
    >
      <Box sx={{ display: "grid", gap: 2, pt: 1 }}>
        <Alert severity="warning">
          Đây là thao tác quản trị đặc biệt và sẽ được lưu đầy đủ trong lịch sử
          thay đổi.
        </Alert>
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
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
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
          <Select
            label="Trạng thái"
            size="small"
            value={status}
            onChange={(value) => setStatus(value as TopicStatus)}
            options={(Object.keys(TOPIC_STATUS_LABELS) as TopicStatus[]).map(
              (value) => ({
                value,
                label: TOPIC_STATUS_LABELS[value],
              }),
            )}
            disabled={saving}
          />
        </Box>
        <Select
          label="Giảng viên hướng dẫn"
          size="small"
          value={teacherId}
          onChange={setTeacherId}
          options={teachers.map((teacher) => ({
            value: String(teacher.id),
            label: `${teacher.name} (${teacher.teacherId}) · còn ${teacher.remainingTopics}`,
          }))}
          disabled={saving || loadingTeachers}
          helperText="Khi đổi giảng viên, hệ thống sẽ kiểm tra chỉ tiêu còn lại trước khi lưu."
        />
        <FormControlLabel
          control={
            <MuiSwitch
              checked={locked}
              onChange={(_, checked) => setLocked(checked)}
              disabled={saving}
            />
          }
          label={locked ? "Đề tài đang khóa" : "Đề tài đang mở"}
        />
        <TextField
          label="Lý do điều chỉnh"
          size="small"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          disabled={saving}
          multiline
          minRows={2}
          required
          error={!!validationError && !reason.trim()}
          helperText={
            validationError ?? "Lý do sẽ xuất hiện trong lịch sử thay đổi."
          }
          fullWidth
        />
      </Box>
    </Dialog>
  );
}
