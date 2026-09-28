"use client";

import { useState, useEffect } from "react";
import { Dialog, Input, Select, Textarea, Button } from "@/shared/components";
import type { SelectOption } from "@/shared/types";
import type { Lecturer, CreateLecturerInput } from "@/feature/admin/types";
import { teacherService } from "@/feature/teacher/services/teacher.service";

interface Faculty {
  id: string;
  name: string;
}

interface TeacherFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateLecturerInput) => void;
  teacher: Lecturer | null;
  loading?: boolean;
  faculties?: Faculty[];
}

const GENDER_OPTIONS: SelectOption[] = [
  { value: "male", label: "Nam" },
  { value: "female", label: "Nữ" },
  { value: "other", label: "Khác" },
];

const ACADEMIC_TITLE_OPTIONS: SelectOption[] = [
  { value: "Thạc sĩ", label: "Thạc sĩ" },
  { value: "Tiến sĩ", label: "Tiến sĩ" },
  { value: "Phó Giáo sư", label: "Phó Giáo sư" },
  { value: "Giáo sư", label: "Giáo sư" },
];

const POSITION_OPTIONS: SelectOption[] = [
  { value: "Giảng viên", label: "Giảng viên" },
  { value: "Phó trưởng ngành", label: "Phó trưởng ngành" },
  { value: "Trưởng ngành", label: "Trưởng ngành" },
  { value: "Phó khoa", label: "Phó khoa" },
  { value: "Trưởng khoa", label: "Trưởng khoa" },
];

const INITIAL_FORM_DATA: CreateLecturerInput = {
  code: "",
  name: "",
  email: "",
  phone: "",
  facultyId: "",
  academicTitle: "",
  position: "",
  dateOfBirth: "",
  gender: undefined,
  address: "",
};

export function TeacherFormDialog({
  open,
  onClose,
  onSubmit,
  teacher,
  loading = false,
  faculties = [],
}: TeacherFormDialogProps) {
  const [formData, setFormData] =
    useState<CreateLecturerInput>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [codeLoading, setCodeLoading] = useState(false);
  const [isCodeAutoFilled, setIsCodeAutoFilled] = useState(false);

  const isEditing = !!teacher;

  // Faculty options
  const facultyOptions: SelectOption[] = faculties.map((f) => ({
    value: f.id,
    label: f.name,
  }));

  // Reset form state when dialog opens
  useEffect(() => {
    if (open) {
      if (teacher) {
        setFormData({
          code: teacher.code,
          name: teacher.name,
          email: teacher.email,
          phone: teacher.phone || "",
          facultyId: teacher.facultyId,
          academicTitle: teacher.academicTitle || "",
          position: teacher.position || "",
          dateOfBirth: teacher.dateOfBirth || "",
          gender: teacher.gender,
          address: teacher.address || "",
        });
        setIsCodeAutoFilled(false);
      } else {
        setFormData(INITIAL_FORM_DATA);
        setIsCodeAutoFilled(false);
      }
      setErrors({});
    }
  }, [open, teacher]);

  // Auto-fill code on create
  useEffect(() => {
    if (open && !isEditing && !isCodeAutoFilled) {
      const loadNextCode = async () => {
        setCodeLoading(true);
        try {
          const nextCode = await teacherService.getNextCode();
          setFormData((prev) => ({ ...prev, code: nextCode }));
          setIsCodeAutoFilled(true);
        } catch {
          // Fallback: keep manual entry
        } finally {
          setCodeLoading(false);
        }
      };
      loadNextCode();
    }
  }, [open, isEditing, isCodeAutoFilled]);

  const handleChange = (key: string, value: string | undefined) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.code) newErrors.code = "Mã GV là bắt buộc";
    if (!formData.name) newErrors.name = "Họ tên là bắt buộc";
    if (!formData.email) newErrors.email = "Email là bắt buộc";
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    if (!formData.facultyId) newErrors.facultyId = "Khoa là bắt buộc";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    await onSubmit(formData);
    setFormData(INITIAL_FORM_DATA);
    setIsCodeAutoFilled(false);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={isEditing ? "Chỉnh sửa giảng viên" : "Thêm giảng viên"}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Input
          label="Mã GV"
          value={formData.code}
          onChange={(e) => handleChange("code", e.target.value)}
          disabled={isEditing || codeLoading}
          error={!!errors.code}
          helperText={errors.code}
          placeholder="Để trống để tạo tự động"
        />

        <Input
          label="Họ tên"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          error={!!errors.name}
          helperText={errors.name}
          required
        />

        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          error={!!errors.email}
          helperText={errors.email}
          required
        />

        <Input
          label="Số điện thoại"
          value={formData.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
        />

        <Select
          label="Khoa"
          value={formData.facultyId}
          onChange={(val) => {
            handleChange("facultyId", val);
          }}
          options={facultyOptions}
          error={!!errors.facultyId}
          helperText={errors.facultyId}
          required
        />

        <Input
          label="Ngày sinh"
          type="date"
          value={formData.dateOfBirth}
          onChange={(e) => handleChange("dateOfBirth", e.target.value)}
          InputLabelProps={{ shrink: true }}
        />

        <Select
          label="Giới tính"
          value={formData.gender || ""}
          onChange={(val) => handleChange("gender", val || undefined)}
          options={GENDER_OPTIONS}
        />

        <Input
          label="Địa chỉ"
          value={formData.address}
          onChange={(e) => handleChange("address", e.target.value)}
        />

        <Select
          label="Học hàm"
          value={formData.academicTitle || ""}
          onChange={(val) => handleChange("academicTitle", val || undefined)}
          options={ACADEMIC_TITLE_OPTIONS}
        />

        <Select
          label="Chức vụ"
          value={formData.position || ""}
          onChange={(val) => handleChange("position", val || undefined)}
          options={POSITION_OPTIONS}
        />

        <Textarea
          label="Ghi chú"
          value={formData.address}
          onChange={(val) => handleChange("address", val)}
          rows={3}
        />

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <Button onClick={onClose} variant="outlined">
            Hủy
          </Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading}>
            {isEditing ? "Cập nhật" : "Thêm"}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
