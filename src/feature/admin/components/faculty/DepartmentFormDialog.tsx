"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Box } from "@mui/material";
import { Button, Dialog, Input } from "@/shared/components";
import type { Department } from "@/feature/admin/services";

interface DepartmentFormDialogProps {
  open: boolean;
  department?: Department | null;
  /** Danh sách khoa để chọn khi tạo mới (dùng cho cả form sửa). */
  faculties: Array<{ id: string; name: string }>;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (data: {
    id?: string;
    name: string;
    facultyId: string;
  }) => Promise<void>;
}

interface FormState {
  id: string;
  name: string;
  facultyId: string;
}

export function DepartmentFormDialog({
  open,
  department,
  faculties,
  loading = false,
  onClose,
  onSubmit,
}: DepartmentFormDialogProps) {
  const isEdit = Boolean(department);
  const [form, setForm] = useState<FormState>({
    id: "",
    name: "",
    facultyId: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});

  useEffect(() => {
    if (!open) return;
    setForm(
      department
        ? {
            id: department.id,
            name: department.name,
            facultyId: department.facultyId,
          }
        : { id: "", name: "", facultyId: faculties[0]?.id ?? "" },
    );
    setErrors({});
  }, [department, open, faculties]);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((cur) => ({ ...cur, [key]: value }));
    setErrors((cur) => ({ ...cur, [key]: undefined }));
  };

  const validate = () => {
    const next: Partial<Record<keyof FormState, string>> = {};
    const id = form.id.trim();
    const name = form.name.trim();

    if (!isEdit && !id) next.id = "Vui lòng nhập mã bộ môn";
    else if (!isEdit && id.length > 50) next.id = "Mã bộ môn tối đa 50 ký tự";

    if (!name) next.name = "Vui lòng nhập tên bộ môn";
    else if (name.length > 255) next.name = "Tên bộ môn tối đa 255 ký tự";

    if (!form.facultyId) next.facultyId = "Vui lòng chọn khoa";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    const payload = {
      name: form.name.trim(),
      facultyId: form.facultyId,
    };

    await onSubmit(isEdit ? payload : { id: form.id.trim(), ...payload });
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? () => {} : onClose}
      title={isEdit ? "Cập nhật bộ môn" : "Thêm bộ môn mới"}
      description={
        isEdit
          ? "Cập nhật thông tin của bộ môn"
          : "Tạo bộ môn mới và gán vào khoa tương ứng"
      }
      actions={
        <>
          <Button variant="outlined" onClick={onClose} disabled={loading}>
            Hủy
          </Button>
          <Button type="submit" form="department-form" loading={loading}>
            {isEdit ? "Lưu thay đổi" : "Tạo bộ môn"}
          </Button>
        </>
      }
    >
      <Box
        id="department-form"
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "grid", gap: 2, pt: 1 }}
      >
        <Input
          label="Mã bộ môn"
          value={form.id}
          disabled={isEdit || loading}
          required
          maxLength={50}
          showCharCount
          error={Boolean(errors.id)}
          helperText={
            errors.id ||
            (isEdit ? "Mã bộ môn không thể thay đổi sau khi tạo" : undefined)
          }
          onChange={(event) => setField("id", event.target.value)}
        />
        <Input
          label="Tên bộ môn"
          value={form.name}
          disabled={loading}
          required
          maxLength={255}
          showCharCount
          error={Boolean(errors.name)}
          helperText={errors.name}
          onChange={(event) => setField("name", event.target.value)}
        />
        <Box sx={{ display: "grid", gap: 0.75 }}>
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "var(--text-primary, #0f172a)",
            }}
          >
            Khoa sở hữu *
          </span>
          <select
            value={form.facultyId}
            disabled={loading}
            onChange={(event) => setField("facultyId", event.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 8,
              border: errors.facultyId
                ? "1px solid #dc2626"
                : "1px solid rgba(15,23,42,0.15)",
              background: "transparent",
              color: "inherit",
              fontSize: 14,
            }}
          >
            <option value="">-- Chọn khoa --</option>
            {faculties.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.id})
              </option>
            ))}
          </select>
          {errors.facultyId && (
            <span style={{ fontSize: 12, color: "#dc2626" }}>
              {errors.facultyId}
            </span>
          )}
        </Box>
      </Box>
    </Dialog>
  );
}

export default DepartmentFormDialog;
