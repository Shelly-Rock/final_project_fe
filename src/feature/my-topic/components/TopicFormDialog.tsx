"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  Autocomplete,
  TextField,
  Box,
  Alert,
  Typography,
  Tabs,
  Tab,
} from "@mui/material";
import { Dialog } from "@/shared/components";
import { Input } from "@/shared/components";
import { Select } from "@/shared/components";
import { Button } from "@/shared/components";
import type { MyTopic, CreateTopicInput, Student } from "../types";
import { myTopicService } from "../services/my-topic.service";

const DEFAULT_MAX_STUDENTS = 3;
const MIN_STUDENTS = 1;
const MAX_STUDENTS_INPUT = 10;

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`topic-tabpanel-${index}`}
      aria-labelledby={`topic-tab-${index}`}
      style={{ paddingTop: 16 }}
      {...other}
    >
      {value === index && <Box sx={{ pt: 1 }}>{children}</Box>}
    </div>
  );
}

interface TopicFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTopicInput) => Promise<void>;
  topic?: MyTopic | null;
  isException?: boolean;
  loading?: boolean;
  teacherDepartment?: string;
}

export function TopicFormDialog({
  open,
  onClose,
  onSubmit,
  topic,
  isException = false,
  loading = false,
  teacherDepartment,
}: TopicFormDialogProps) {
  const isEdit = !!topic;
  const prevOpenRef = useRef<boolean>(open);

  // Tab state
  const [activeTab, setActiveTab] = useState(0);

  // Form state - Tab 1: Thông tin đề tài
  const [name, setName] = useState("");
  const [englishName, setEnglishName] = useState("");
  const [description, setDescription] = useState("");
  const [objectives, setObjectives] = useState("");
  const [technologies, setTechnologies] = useState("");

  // Form state - Tab 2: Chỉ tiêu đề tài
  const [periodId, setPeriodId] = useState<string>("1");
  const [maxStudents, setMaxStudents] = useState<string>(
    DEFAULT_MAX_STUDENTS.toString(),
  );
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [studentQuery, setStudentQuery] = useState("");
  const [studentOptions, setStudentOptions] = useState<Student[]>([]);
  const [searchingStudents, setSearchingStudents] = useState(false);

  // Validation
  const [touched, setTouched] = useState({
    name: false,
    englishName: false,
    description: false,
    objectives: false,
    periodId: false,
    maxStudents: false,
  });

  // Lấy giới hạn sĩ số theo ngành
  const departmentLimits = useMemo(() => {
    if (!periodId) return [];
    return myTopicService.getDepartmentStudentLimits(Number(periodId));
  }, [periodId]);

  // Tính sĩ số tối đa cho phép dựa trên ngành
  const maxAllowedStudents = useMemo(() => {
    if (teacherDepartment) {
      const limit = departmentLimits.find(
        (l) => l.department === teacherDepartment,
      );
      if (limit) return limit.maxStudents;
    }
    return MAX_STUDENTS_INPUT;
  }, [departmentLimits, teacherDepartment]);

  // Reset state when dialog opens
  useEffect(() => {
    if (open && !prevOpenRef.current) {
      // Reset tab
      setActiveTab(0);

      // Tab 1
      setName(topic?.name || "");
      setEnglishName(topic?.englishName || "");
      setDescription(topic?.description || "");
      setObjectives(topic?.objectives || "");
      setTechnologies(topic?.technologies || "");

      // Tab 2
      setPeriodId(String(topic?.periodId || "1"));
      setMaxStudents(String(topic?.maxStudents || DEFAULT_MAX_STUDENTS));
      setStudentQuery("");
      setStudentOptions([]);

      // Reset validation
      setTouched({
        name: false,
        englishName: false,
        description: false,
        objectives: false,
        periodId: false,
        maxStudents: false,
      });

      // Convert preAssignedStudents
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
    prevOpenRef.current = open;
  }, [open, topic]);

  // Cập nhật sĩ số tối đa khi period thay đổi
  useEffect(() => {
    if (open && !isEdit) {
      const currentMax = Number(maxStudents);
      if (currentMax > maxAllowedStudents) {
        setMaxStudents(maxAllowedStudents.toString());
      }
    }
  }, [periodId, maxAllowedStudents, open, isEdit, maxStudents]);

  // Validation
  const nameError = touched.name && !name.trim();
  const englishNameError = touched.englishName && !englishName.trim();
  const descriptionError = touched.description && !description.trim();
  const objectivesError = touched.objectives && !objectives.trim();
  const maxStudentsNum = parseInt(maxStudents, 10);
  const maxStudentsError =
    touched.maxStudents &&
    (isNaN(maxStudentsNum) ||
      maxStudentsNum < MIN_STUDENTS ||
      maxStudentsNum > maxAllowedStudents);

  // Button enabled khi đủ thông tin bắt buộc
  const isFormValid = useMemo(() => {
    const maxNum = parseInt(maxStudents, 10);
    return (
      name.trim().length > 0 &&
      englishName.trim().length > 0 &&
      description.trim().length > 0 &&
      objectives.trim().length > 0 &&
      !isNaN(maxNum) &&
      maxNum >= MIN_STUDENTS &&
      maxNum <= maxAllowedStudents
    );
  }, [
    name,
    englishName,
    description,
    objectives,
    maxStudents,
    maxAllowedStudents,
  ]);

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

    // Mark all required fields as touched
    setTouched({
      name: true,
      englishName: true,
      description: true,
      objectives: true,
      periodId: true,
      maxStudents: true,
    });

    // Validate
    if (
      !name.trim() ||
      !englishName.trim() ||
      !description.trim() ||
      !objectives.trim()
    ) {
      return;
    }

    const maxNum = parseInt(maxStudents, 10);
    if (isNaN(maxNum) || maxNum < MIN_STUDENTS || maxNum > maxAllowedStudents) {
      return;
    }

    const data: CreateTopicInput = {
      name: name.trim(),
      englishName: englishName.trim() || undefined,
      description: description.trim(),
      objectives: objectives.trim() || undefined,
      technologies: technologies.trim() || undefined,
      periodId: Number(periodId),
      maxStudents: maxNum,
      preAssignedStudentIds: selectedStudents.map((s) => s.id),
      isException,
      teacherDepartment,
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

  const handleMaxStudentsChange = (value: string) => {
    setMaxStudents(value);
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
            disabled={!isFormValid && !isEdit}
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

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={(_event, newValue) => setActiveTab(newValue)}
          sx={{
            minHeight: 36,
            "& .MuiTab-root": {
              minHeight: 36,
              textTransform: "none",
              fontWeight: 500,
            },
          }}
        >
          <Tab
            label={
              <Box
                component="span"
                sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
              >
                Thông tin đề tài
                <Box
                  component="span"
                  sx={{ color: "error.main", fontSize: "0.8rem" }}
                >
                  *
                </Box>
              </Box>
            }
          />
          <Tab
            label={
              <Box
                component="span"
                sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
              >
                Chỉ tiêu đề tài
                <Box
                  component="span"
                  sx={{ color: "error.main", fontSize: "0.8rem" }}
                >
                  *
                </Box>
              </Box>
            }
          />
        </Tabs>

        {/* Tab 1: Thông tin đề tài */}
        <TabPanel value={activeTab} index={0}>
          <Box
            sx={{ display: "flex", flexDirection: "column", gap: 2.5, mt: 1 }}
          >
            <Input
              name="name"
              label="Tên đề tài"
              placeholder="VD: Xây dựng hệ thống quản lý thư viện"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, name: true }))}
              error={nameError}
              helperText={nameError ? "Tên đề tài không được để trống" : ""}
              required
              fullWidth
            />

            <Input
              name="englishName"
              label="Tên tiếng Anh"
              placeholder="VD: Library Management System"
              value={englishName}
              onChange={(e) => setEnglishName(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, englishName: true }))}
              error={englishNameError}
              helperText={
                englishNameError ? "Tên tiếng Anh không được để trống" : ""
              }
              required
              fullWidth
            />

            <Input
              name="description"
              label="Mô tả đề tài"
              placeholder="Mô tả chi tiết về đề tài, yêu cầu và mong muốn..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, description: true }))}
              error={descriptionError}
              helperText={descriptionError ? "Mô tả không được để trống" : ""}
              required
              multiline
              rows={4}
              fullWidth
            />

            <Input
              name="objectives"
              label="Mục tiêu đề tài"
              placeholder="Mục tiêu cần đạt được của đề tài..."
              value={objectives}
              onChange={(e) => setObjectives(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, objectives: true }))}
              error={objectivesError}
              helperText={objectivesError ? "Mục tiêu không được để trống" : ""}
              required
              multiline
              rows={3}
              fullWidth
            />

            <Input
              name="technologies"
              label="Công nghệ sử dụng"
              placeholder="VD: React, Node.js, PostgreSQL, Docker..."
              value={technologies}
              onChange={(e) => setTechnologies(e.target.value)}
              fullWidth
            />
          </Box>
        </TabPanel>

        {/* Tab 2: Chỉ tiêu đề tài */}
        <TabPanel value={activeTab} index={1}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}>
            {/* Row 1: Đợt đăng ký */}
            <Select
              name="periodId"
              label="Đợt đăng ký"
              options={[
                { value: "1", label: "HK1 2025-2026" },
                { value: "2", label: "HK2 2025-2026" },
              ]}
              value={periodId}
              onChange={(value) => setPeriodId(value)}
              required
              fullWidth
              disabled={isEdit}
            />

            {/* Row 2: Sĩ số tối đa */}
            <Box>
              <Input
                name="maxStudents"
                label="Sĩ số tối đa"
                type="number"
                value={maxStudents}
                onChange={(e) => handleMaxStudentsChange(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, maxStudents: true }))}
                error={!!maxStudentsError}
                helperText={
                  maxStudentsError
                    ? `Sĩ số phải từ ${MIN_STUDENTS} đến ${maxAllowedStudents}`
                    : `Từ ${MIN_STUDENTS} đến ${maxAllowedStudents} sinh viên`
                }
                required
                fullWidth
                inputProps={{
                  min: MIN_STUDENTS,
                  max: maxAllowedStudents,
                }}
              />
              {teacherDepartment &&
                departmentLimits.length > 0 &&
                !maxStudentsError && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 0.5, display: "block" }}
                  >
                    Sĩ số tối đa cho ngành &quot;{teacherDepartment}&quot;:{" "}
                    {maxAllowedStudents}
                  </Typography>
                )}
            </Box>

            {/* Row 3: Gán sinh viên (Order) */}
            <Box>
              <Autocomplete
                options={studentOptions}
                getOptionLabel={(option) => `${option.code} - ${option.name}`}
                value={null}
                inputValue={studentQuery}
                onInputChange={(_event, value) => setStudentQuery(value)}
                onChange={handleStudentChange}
                loading={searchingStudents}
                disabled={
                  selectedStudents.length >= Number(maxStudents) ||
                  Number.isNaN(Number(maxStudents))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={`Gán sinh viên (Oder) - ${selectedStudents.length}/${maxStudents || "?"}`}
                    placeholder="Tìm theo mã sinh viên..."
                    size="small"
                    helperText={
                      selectedStudents.length >= Number(maxStudents)
                        ? `Đã đạt sĩ số tối đa (${maxStudents})`
                        : "Tìm kiếm và chọn sinh viên (không bắt buộc)"
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
                            sx={{
                              fontSize: "0.75rem",
                              color: "text.secondary",
                            }}
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
        </TabPanel>
      </form>
    </Dialog>
  );
}
