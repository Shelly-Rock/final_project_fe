"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Box, FormControlLabel, Switch } from "@mui/material";
import { Button, Dialog, Input } from "@/shared/components";
import type {
  CreateFacultyInput,
  Faculty,
  UpdateFacultyInput,
} from "@/feature/admin/types";

interface FacultyFormDialogProps {
  open: boolean;
  faculty?: Faculty | null;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (data: CreateFacultyInput | UpdateFacultyInput) => Promise<void>;
}

interface FormState {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

const emptyForm: FormState = {
  id: "",
  name: "",
  description: "",
  isActive: true,
};

export function FacultyFormDialog({
  open,
  faculty,
  loading = false,
  onClose,
  onSubmit,
}: FacultyFormDialogProps) {
  const isEdit = Boolean(faculty);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});

  useEffect(() => {
    if (!open) return;
    setForm(
      faculty
        ? {
            id: faculty.id,
            name: faculty.name,
            description: faculty.description ?? "",
            isActive: faculty.isActive,
          }
        : emptyForm,
    );
    setErrors({});
  }, [faculty, open]);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((cur) => ({ ...cur, [key]: value }));
    setErrors((cur) => ({ ...cur, [key]: undefined }));
  };

  const validate = () => {
    const next: Partial<Record<keyof FormState, string>> = {};
    const id = form.id.trim();
    const name = form.name.trim();

    if (!id) next.id = "Vui lòng nhập mã khoa";
    else if (id.length > 50) next.id = "Mã khoa tối đa 50 ký tự";

    if (!name) next.name = "Vui lòng nhập tên khoa";
    else if (name.length > 255) next.name = "Tên khoa tối đa 255 ký tự";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      isActive: form.isActive,
    };

    await onSubmit(
      isEdit
        ? payload
        : {
            id: form.id.trim(),
            ...payload,
          },
    );
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? () => {} : onClose}
      title={isEdit ? "Cập nhật khoa" : "Thêm khoa mới"}
      description={
        isEdit
          ? "Cập nhật thông tin cơ bản của khoa"
          : "Tạo khoa mới để sử dụng trong các màn hình quản trị"
      }
      actions={
        <>
          <Button variant="outlined" onClick={onClose} disabled={loading}>
            Hủy
          </Button>
          <Button type="submit" form="faculty-form" loading={loading}>
            {isEdit ? "Lưu thay đổi" : "Tạo khoa"}
          </Button>
        </>
      }
    >
      <Box
        id="faculty-form"
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "grid", gap: 2, pt: 1 }}
      >
        <Input
          label="Mã khoa"
          value={form.id}
          disabled={isEdit || loading}
          required
          maxLength={50}
          showCharCount
          error={Boolean(errors.id)}
          helperText={
            errors.id ||
            (isEdit ? "Mã khoa không thể thay đổi sau khi tạo" : undefined)
          }
          onChange={(event) => setField("id", event.target.value)}
        />
        <Input
          label="Tên khoa"
          value={form.name}
          disabled={loading}
          required
          maxLength={255}
          showCharCount
          error={Boolean(errors.name)}
          helperText={errors.name}
          onChange={(event) => setField("name", event.target.value)}
        />
        <Input
          label="Mô tả"
          value={form.description}
          disabled={loading}
          multiline
          minRows={3}
          onChange={(event) => setField("description", event.target.value)}
        />
        <FormControlLabel
          control={
            <Switch
              checked={form.isActive}
              disabled={loading}
              onChange={(event) => setField("isActive", event.target.checked)}
            />
          }
          label="Đang hoạt động"
        />
      </Box>
    </Dialog>
  );
}
