"use client";
import React, { useState, useEffect } from "react";
import { Alert, Grid } from "@mui/material";
import { Dialog, Input, Label, Button, Select } from "@/shared/components";
import { DialogActions } from "@mui/material";
import { Plus, Trash2 } from "lucide-react";
import type { Student, CreateStudentInput } from "../types";

interface StudentFormDialogProps {
  open: boolean;
  onClose: () => void;
  student?: Student | null;
  onSubmit?: (data: CreateStudentInput) => Promise<void>;
  faculties?: { id: string; name: string; isActive: boolean }[];
  facultiesLoading?: boolean;
}

interface ExtraField {
  id: number;
  key: string;
  value: string;
}

const emptyFormData: CreateStudentInput = {
  mssv: "",
  hoTen: "",
  gmail: "",
  khoa: "",
  khoaHoc: "",
  lop: "",
  soDienThoai: "",
  ngaySinh: "",
  diaChi: "",
};

function studentToFormData(
  student: Student | null | undefined,
): CreateStudentInput {
  if (!student) return emptyFormData;
  return {
    mssv: student.mssv,
    hoTen: student.hoTen,
    gmail: student.gmail,
    khoa: student.khoa,
    khoaHoc: student.khoaHoc,
    lop: student.lop,
    soDienThoai: student.soDienThoai || "",
    ngaySinh: student.ngaySinh?.slice(0, 10) || "",
    diaChi: student.diaChi || "",
  };
}

function extraDataToFields(extraData: Record<string, unknown> | undefined) {
  return Object.entries(extraData || {})
    .filter(([key]) => key !== "phone" && key !== "address")
    .map(([key, value], index) => ({
      id: index,
      key,
      value: typeof value === "string" ? value : JSON.stringify(value),
    }));
}

export function StudentFormDialog({
  open,
  onClose,
  student,
  onSubmit,
  faculties = [],
  facultiesLoading = false,
}: StudentFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [formData, setFormData] = useState<CreateStudentInput>(emptyFormData);
  const [extraFields, setExtraFields] = useState<ExtraField[]>([]);

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      setFormData(studentToFormData(student));
      setExtraFields(extraDataToFields(student?.extraData));
      setSubmitError("");
    }, 0);
    return () => clearTimeout(timer);
  }, [open, student]);

  const handleChange =
    (field: keyof CreateStudentInput) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = async () => {
    if (!onSubmit) return;
    if (
      !formData.mssv.trim() ||
      !formData.hoTen.trim() ||
      !formData.gmail.trim() ||
      !formData.khoa ||
      !formData.khoaHoc.trim() ||
      !formData.lop.trim()
    ) {
      setSubmitError("Vui lòng điền đầy đủ các trường bắt buộc.");
      return;
    }
    setSubmitError("");
    const extraData: Record<string, unknown> = {};
    for (const field of extraFields) {
      const key = field.key.trim();
      if (!key) continue;
      try {
        extraData[key] = JSON.parse(field.value);
      } catch {
        extraData[key] = field.value;
      }
    }
    if (extraFields.some((field) => !field.key.trim())) {
      setSubmitError("Vui lòng đặt tên cho thông tin bổ sung.");
      return;
    }
    setLoading(true);
    try {
      await onSubmit({ ...formData, extraData });
    } catch {
      // The page reports the API error and keeps the dialog open.
    } finally {
      setLoading(false);
    }
  };

  const facultyOptions = faculties
    .filter((faculty) => faculty.isActive || faculty.name === formData.khoa)
    .map((faculty) => ({ value: faculty.name, label: faculty.name }));
  if (
    formData.khoa &&
    !facultyOptions.some((option) => option.value === formData.khoa)
  ) {
    facultyOptions.push({ value: formData.khoa, label: formData.khoa });
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={student ? "Sửa thông tin sinh viên" : "Thêm sinh viên mới"}
      size="sm"
    >
      {submitError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {submitError}
        </Alert>
      )}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Label htmlFor="mssv" required>
            MSSV
          </Label>
          <Input
            id="mssv"
            value={formData.mssv}
            onChange={handleChange("mssv")}
            disabled={!!student}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Label htmlFor="hoTen" required>
            Họ tên
          </Label>
          <Input
            id="hoTen"
            value={formData.hoTen}
            onChange={handleChange("hoTen")}
          />
        </Grid>
        <Grid item xs={12}>
          <Label htmlFor="gmail" required>
            Email
          </Label>
          <Input
            id="gmail"
            type="email"
            value={formData.gmail}
            onChange={handleChange("gmail")}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Label htmlFor="khoa" required>
            Khoa
          </Label>
          <Select
            id="khoa"
            value={formData.khoa}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, khoa: value }))
            }
            options={facultyOptions}
            placeholder={facultiesLoading ? "Đang tải khoa..." : "Chọn khoa"}
            disabled={facultiesLoading || facultyOptions.length === 0}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Label htmlFor="khoaHoc" required>
            Khóa
          </Label>
          <Input
            id="khoaHoc"
            value={formData.khoaHoc}
            onChange={handleChange("khoaHoc")}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Label htmlFor="lop" required>
            Lớp
          </Label>
          <Input id="lop" value={formData.lop} onChange={handleChange("lop")} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Label htmlFor="soDienThoai">Số điện thoại</Label>
          <Input
            id="soDienThoai"
            value={formData.soDienThoai}
            onChange={handleChange("soDienThoai")}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Label htmlFor="ngaySinh">Ngày sinh</Label>
          <Input
            id="ngaySinh"
            type="date"
            value={formData.ngaySinh}
            onChange={handleChange("ngaySinh")}
          />
        </Grid>
        <Grid item xs={12}>
          <Label htmlFor="diaChi">Địa chỉ</Label>
          <Input
            id="diaChi"
            value={formData.diaChi}
            onChange={handleChange("diaChi")}
          />
        </Grid>
        <Grid item xs={12}>
          <Label>Thông tin bổ sung</Label>
          {extraFields.map((field, index) => (
            <Grid container spacing={1} key={field.id} sx={{ mb: 1 }}>
              <Grid item xs={5}>
                <Input
                  value={field.key}
                  placeholder="Tên trường"
                  onChange={(event) =>
                    setExtraFields((fields) =>
                      fields.map((currentField, currentIndex) =>
                        currentIndex === index
                          ? { ...currentField, key: event.target.value }
                          : currentField,
                      ),
                    )
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <Input
                  value={field.value}
                  placeholder="Giá trị"
                  onChange={(event) =>
                    setExtraFields((fields) =>
                      fields.map((currentField, currentIndex) =>
                        currentIndex === index
                          ? { ...currentField, value: event.target.value }
                          : currentField,
                      ),
                    )
                  }
                />
              </Grid>
              <Grid item xs={1} sx={{ display: "flex", alignItems: "center" }}>
                <Button
                  variant="text"
                  aria-label="Xóa trường"
                  onClick={() =>
                    setExtraFields((fields) =>
                      fields.filter(
                        (currentField) => currentField.id !== field.id,
                      ),
                    )
                  }
                  sx={{ minWidth: 0, px: 1, color: "error.main" }}
                >
                  <Trash2 size={16} />
                </Button>
              </Grid>
            </Grid>
          ))}
          <Button
            variant="outlined"
            leftIcon={<Plus size={16} />}
            onClick={() =>
              setExtraFields((fields) => [
                ...fields,
                { id: Date.now(), key: "", value: "" },
              ])
            }
          >
            Thêm thông tin
          </Button>
        </Grid>
      </Grid>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button variant="text" onClick={onClose} disabled={loading}>
          Hủy
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading ? "Đang lưu..." : "Lưu"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
