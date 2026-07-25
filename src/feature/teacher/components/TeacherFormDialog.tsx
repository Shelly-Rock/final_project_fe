"use client";

import { useState, useEffect } from "react";
import { Dialog, Input, Select, Textarea, Button } from "@/shared/components";
import type { SelectOption } from "@/shared/types";
import type { Teacher, CreateTeacherInput } from "../types";

interface TeacherFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTeacherInput) => void;
  teacher: Teacher | null;
  loading?: boolean;
}

const GENDER_OPTIONS: SelectOption[] = [
  { value: "male", label: "Nam" },
  { value: "female", label: "Nữ" },
  { value: "other", label: "Khác" },
];

const ACADEMIC_TITLE_OPTIONS: SelectOption[] = [
  { value: "Cử nhân", label: "Cử nhân" },
  { value: "Thạc sĩ", label: "Thạc sĩ" },
  { value: "Tiến sĩ", label: "Tiến sĩ" },
  { value: "Phó Giáo sư", label: "Phó Giáo sư" },
  { value: "Giáo sư", label: "Giáo sư" },
];

const DEPARTMENTS: SelectOption[] = [
  { value: "Công nghệ phần mềm", label: "Công nghệ phần mềm" },
  { value: "Hệ thống thông tin", label: "Hệ thống thông tin" },
  { value: "Khoa học máy tính", label: "Khoa học máy tính" },
  { value: "Mạng máy tính", label: "Mạng máy tính" },
  { value: "An toàn thông tin", label: "An toàn thông tin" },
  { value: "Trí tuệ nhân tạo", label: "Trí tuệ nhân tạo" },
];

const POSITION_OPTIONS: SelectOption[] = [
  { value: "Giảng viên", label: "Giảng viên" },
  { value: "Phó trưởng ngành", label: "Phó trưởng ngành" },
  { value: "Trưởng ngành", label: "Trưởng ngành" },
  { value: "Phó khoa", label: "Phó khoa" },
  { value: "Trưởng khoa", label: "Trưởng khoa" },
];

const INITIAL_FORM_DATA: CreateTeacherInput = {
  code: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  department: "",
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
}: TeacherFormDialogProps) {
  const [formData, setFormData] =
    useState<CreateTeacherInput>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = !!teacher;

  // Reset form state when dialog opens
  useEffect(() => {
    if (open) {
      if (teacher) {
        setFormData({
          code: teacher.code,
          firstName: teacher.firstName,
          lastName: teacher.lastName,
          email: teacher.email,
          phone: teacher.phone || "",
          department: teacher.department,
          academicTitle: teacher.academicTitle || "",
          position: teacher.position || "",
          dateOfBirth: teacher.dateOfBirth || "",
          gender: teacher.gender,
          address: teacher.address || "",
        });
      } else {
        setFormData(INITIAL_FORM_DATA);
      }
      setErrors({});
    }
  }, [open, teacher]);

  const handleChange = (field: keyof CreateTeacherInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.code.trim()) {
      newErrors.code = "Mã giảng viên là bắt buộc";
    }
    if (!formData.firstName.trim()) {
      newErrors.firstName = "Họ là bắt buộc";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Tên là bắt buộc";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    if (!formData.department) {
      newErrors.department = "Chuyên ngành là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={isEditing ? "Cập nhật giảng viên" : "Thêm giảng viên mới"}
      size="lg"
      showCloseButton
      actions={
        <>
          <Button variant="outlined" onClick={onClose} disabled={loading}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} loading={loading}>
            {isEditing ? "Cập nhật" : "Thêm mới"}
          </Button>
        </>
      }
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
          marginTop: "16px",
        }}
      >
        {/* Mã giảng viên */}
        <Input
          label="Mã giảng viên"
          value={formData.code}
          onChange={(e) => handleChange("code", e.target.value)}
          error={!!errors.code}
          helperText={errors.code}
          required
          disabled={isEditing}
          placeholder="VD: GV001"
        />

        {/* Email */}
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          error={!!errors.email}
          helperText={errors.email}
          required
          placeholder="VD: nguyen.van@ctu.edu.vn"
        />

        {/* Họ */}
        <Input
          label="Họ"
          value={formData.firstName}
          onChange={(e) => handleChange("firstName", e.target.value)}
          error={!!errors.firstName}
          helperText={errors.firstName}
          required
          placeholder="VD: Nguyễn Văn"
        />

        {/* Tên */}
        <Input
          label="Tên"
          value={formData.lastName}
          onChange={(e) => handleChange("lastName", e.target.value)}
          error={!!errors.lastName}
          helperText={errors.lastName}
          required
          placeholder="VD: An"
        />

        {/* Số điện thoại */}
        <Input
          label="Số điện thoại"
          value={formData.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          placeholder="VD: 0912345678"
        />

        {/* Ngày sinh */}
        <Input
          label="Ngày sinh"
          type="date"
          value={formData.dateOfBirth}
          onChange={(e) => handleChange("dateOfBirth", e.target.value)}
        />

        {/* Giới tính */}
        <Select
          label="Giới tính"
          options={GENDER_OPTIONS}
          value={formData.gender || ""}
          onChange={(value) => handleChange("gender", value)}
          placeholder="Chọn giới tính"
        />

        {/* Chuyên ngành */}
        <Select
          label="Chuyên ngành"
          options={DEPARTMENTS}
          value={formData.department}
          onChange={(value) => handleChange("department", value)}
          error={!!errors.department}
          helperText={errors.department}
          required
          placeholder="Chọn chuyên ngành"
        />

        {/* Học hàm, học vị */}
        <Select
          label="Học hàm, học vị"
          options={ACADEMIC_TITLE_OPTIONS}
          value={formData.academicTitle || ""}
          onChange={(value) => handleChange("academicTitle", value)}
          placeholder="Chọn học hàm/học vị"
        />

        {/* Chức vụ */}
        <Select
          label="Chức vụ"
          options={POSITION_OPTIONS}
          value={formData.position || ""}
          onChange={(value) => handleChange("position", value)}
          placeholder="Chọn chức vụ"
        />
      </div>

      {/* Địa chỉ */}
      <div style={{ marginTop: "16px" }}>
        <Textarea
          label="Địa chỉ"
          value={formData.address}
          onChange={(value) => handleChange("address", value)}
          placeholder="Địa chỉ liên hệ"
          minRows={2}
          maxRows={4}
          fullWidth
        />
      </div>
    </Dialog>
  );
}
