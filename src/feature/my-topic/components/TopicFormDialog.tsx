"use client";

import { useState, useEffect, useCallback } from "react";
import { Autocomplete, TextField, Box, Alert } from "@mui/material";
import { Dialog } from "@/shared/components";
import { Input } from "@/shared/components";
import { Select } from "@/shared/components";
import { Button } from "@/shared/components";
import type { MyTopic, CreateTopicInput, Student } from "../types";
import { myTopicService } from "../services/my-topic.service";

const MAX_STUDENTS = 3;

interface TopicFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTopicInput) => Promise<void>;
  topic?: MyTopic | null;
  isException?: boolean;
  loading?: boolean;
}

const maxStudentOptions = [
  { value: "1", label: "1 sinh viên" },
  { value: "2", label: "2 sinh viên" },
  { value: "3", label: "3 sinh viên" },
];

const periodOptions = [
  { value: "1", label: "HK1 2025-2026" },
  { value: "2", label: "HK2 2025-2026" },
];

export function TopicFormDialog({
  open,
  onClose,
  onSubmit,
  topic,
  isException = false,
  loading = false,
}: TopicFormDialogProps) {
  const isEdit = !!topic;

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [periodId, setPeriodId] = useState<string>("1");
  const [maxStudents, setMaxStudents] = useState<string>("3");
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [studentQuery, setStudentQuery] = useState("");
  const [studentOptions, setStudentOptions] = useState<Student[]>([]);
  const [searchingStudents, setSearchingStudents] = useState(false);

  // Validation
  const [nameError, setNameError] = useState(false);

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setName(topic?.name || "");
      setDescription(topic?.description || "");
      setPeriodId(String(topic?.periodId || "1"));
      setMaxStudents(String(topic?.maxStudents || MAX_STUDENTS));
      setNameError(false);
      setStudentQuery("");
      setStudentOptions([]);

      // Convert preAssignedStudents to Student type for editing
      if (topic?.preAssignedStudents && topic.preAssignedStudents.length > 0) {
        const preAssigned: Student[] = topic.preAssignedStudents.map((p) => ({
          id: p.studentId,
          code: p.studentCode,
          name: p.studentName,
          email: "",
          className: "",
        }));
        setSelectedStudents(preAssigned);
      } else {
        setSelectedStudents([]);
      }
    }
  }, [open, topic]);

  // Search students
  const searchStudents = useCallback(
    async (query: string) => {
      if (query.length < 2) {
        setStudentOptions([]);
        return;
      }

      setSearchingStudents(true);
      try {
        const results = await myTopicService.searchStudents(query);
        // Filter out already selected students
        const available = results.filter(
          (s) => !selectedStudents.some((selected) => selected.id === s.id),
        );
        setStudentOptions(available);
      } catch {
        // Handle error silently
      } finally {
        setSearchingStudents(false);
      }
    },
    [selectedStudents],
  );

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (studentQuery) {
        searchStudents(studentQuery);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [studentQuery, searchStudents]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate name
    if (!name.trim()) {
      setNameError(true);
      return;
    }

    const data: CreateTopicInput = {
      name: name.trim(),
      description: description.trim(),
      periodId: Number(periodId),
      maxStudents: Number(maxStudents),
      preAssignedStudentIds: selectedStudents.map((s) => s.id),
      isException,
    };

    await onSubmit(data);
  };

  const handleStudentChange = (
    _event: React.SyntheticEvent,
    value: Student | null,
    reason: string,
  ) => {
    if (reason === "selectOption" && value) {
      if (selectedStudents.length < Number(maxStudents)) {
        setSelectedStudents([...selectedStudents, value]);
        setStudentQuery("");
        setStudentOptions([]);
      }
    }
  };

  const handleRemoveStudent = (studentId: number) => {
    setSelectedStudents(selectedStudents.filter((s) => s.id !== studentId));
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? () => {} : onClose}
      title={
        isException
          ? "Đề xuất ngoại lệ"
          : isEdit
            ? "Chỉnh sửa đề tài"
            : "Tạo đề tài mới"
      }
      description={
        isException
          ? "Đề tài ngoại lệ cần được Thư ký phê duyệt"
          : isEdit
            ? "Cập nhật thông tin đề tài"
            : "Thiết lập thông tin cho đề tài mới"
      }
      size="lg"
      actions={
        <>
          <Button variant="outlined" onClick={onClose} disabled={loading}>
            Hủy
          </Button>
          <Button
            type="submit"
            form="topic-form"
            variant="contained"
            loading={loading}
            color={isException ? "warning" : "primary"}
          >
            {isException ? "Gửi đề xuất" : isEdit ? "Lưu thay đổi" : "Tạo mới"}
          </Button>
        </>
      }
    >
      <form id="topic-form" onSubmit={handleSubmit}>
        {/* Exception Alert */}
        {isException && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Đây là đề tài ngoại lệ. Sau khi gửi, đề tài sẽ có trạng thái
            &quot;Chờ Thư ký&quot; và cần được Thư ký phê duyệt trước khi sinh
            viên có thể đăng ký.
          </Alert>
        )}

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <Input
            name="name"
            label="Tên đề tài"
            placeholder="VD: Xây dựng hệ thống quản lý thư viện"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (e.target.value.trim()) setNameError(false);
            }}
            error={nameError}
            helperText={nameError ? "Tên đề tài không được để trống" : ""}
            required
            fullWidth
          />

          <Input
            name="description"
            label="Mô tả"
            placeholder="Mô tả chi tiết về đề tài, yêu cầu và mong muốn..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={4}
            fullWidth
          />

          <Box sx={{ display: "flex", gap: 2 }}>
            <Select
              name="periodId"
              label="Đợt đăng ký"
              options={periodOptions}
              value={periodId}
              onChange={(value) => setPeriodId(value)}
              required
              fullWidth
            />
            <Select
              name="maxStudents"
              label="Sĩ số tối đa"
              options={maxStudentOptions}
              value={maxStudents}
              onChange={(value) => {
                const newMax = Number(value);
                setMaxStudents(value);
                // Remove excess students if max is reduced
                if (selectedStudents.length > newMax) {
                  setSelectedStudents(selectedStudents.slice(0, newMax));
                }
              }}
              required
              fullWidth
            />
          </Box>

          {/* Student Assignment (Autocomplete) */}
          <Box>
            <Autocomplete
              options={studentOptions}
              getOptionLabel={(option) => `${option.code} - ${option.name}`}
              value={null}
              inputValue={studentQuery}
              onInputChange={(_event, value) => setStudentQuery(value)}
              onChange={handleStudentChange}
              loading={searchingStudents}
              disabled={selectedStudents.length >= Number(maxStudents)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={`Gán sinh viên (Order) - ${selectedStudents.length}/${maxStudents}`}
                  placeholder="Tìm theo mã sinh viên..."
                  size="small"
                  helperText={
                    selectedStudents.length >= Number(maxStudents)
                      ? `Đã đạt sĩ số tối đa (${maxStudents})`
                      : "Tìm kiếm và chọn sinh viên (tối đa " +
                        maxStudents +
                        ")"
                  }
                />
              )}
              noOptionsText={
                studentQuery.length < 2
                  ? "Nhập ít nhất 2 ký tự để tìm kiếm"
                  : "Không tìm thấy sinh viên"
              }
            />

            {/* Selected Students List */}
            {selectedStudents.length > 0 && (
              <Box
                sx={{
                  mt: 1.5,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                {selectedStudents.map((student, index) => (
                  <Box
                    key={student.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: 1.5,
                      borderRadius: 1,
                      bgcolor: "action.hover",
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          bgcolor: "primary.main",
                          color: "primary.contrastText",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                        }}
                      >
                        {index + 1}
                      </Box>
                      <Box>
                        <Box sx={{ fontWeight: 500 }}>{student.name}</Box>
                        <Box
                          sx={{ fontSize: "0.75rem", color: "text.secondary" }}
                        >
                          {student.code}
                        </Box>
                      </Box>
                    </Box>
                    <Button
                      variant="text"
                      size="small"
                      color="error"
                      onClick={() => handleRemoveStudent(student.id)}
                    >
                      Xóa
                    </Button>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </form>
    </Dialog>
  );
}
