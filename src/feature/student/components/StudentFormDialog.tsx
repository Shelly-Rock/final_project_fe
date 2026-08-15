// ============================================================
// Student Form Dialog Component
// ============================================================
"use client";

import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import { Dialog, Input, Label, Button } from "@/shared/components";
import { DialogActions } from "@mui/material";
import type { Student, CreateStudentInput } from "../types";

interface StudentFormDialogProps {
  open: boolean;
  onClose: () => void;
  student?: Student | null;
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
    ngaySinh: student.ngaySinh || "",
    diaChi: student.diaChi || "",
  };
}

export function StudentFormDialog({
  open,
  onClose,
  student,
}: StudentFormDialogProps) {
  const [loading] = useState(false);
  const [formData, setFormData] = useState<CreateStudentInput>(emptyFormData);

  useEffect(() => {
    const timer = setTimeout(() => setFormData(studentToFormData(student)), 0);
    return () => clearTimeout(timer);
  }, [student]);

  const handleChange =
    (field: keyof CreateStudentInput) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={student ? "Sửa thông tin sinh viên" : "Thêm sinh viên mới"}
      size="sm"
    >
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
          <Input
            id="khoa"
            value={formData.khoa}
            onChange={handleChange("khoa")}
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
      </Grid>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button variant="text" onClick={onClose} disabled={loading}>
          Hủy
        </Button>
        <Button variant="contained" disabled={loading}>
          {loading ? "Đang lưu..." : "Lưu"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
