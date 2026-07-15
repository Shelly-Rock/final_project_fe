"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
} from "@mui/material";
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
    // eslint-disable-next-line
    setFormData(studentToFormData(student));
  }, [student]);

  const handleChange =
    (field: keyof CreateStudentInput) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  // const handleSubmit = async () => {
  //   if (!formData.mssv || !formData.hoTen || !formData.gmail) {
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     if (student) {
  //       await studentService.update(student.id, formData);
  //     } else {
  //       await studentService.create(formData);
  //     }
  //     const students = await studentService.getAll();
  //     const latest = students[students.length - 1];
  //     onSave(latest);
  //     onClose();
  //   } catch {
  //     console.error("Failed to save student");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const khoaOptions = studentService.getKhoaOptions();
  // const khoaHocOptions = studentService.getKhoaHocOptions();
  // const lopOptions = studentService.getLopOptions();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {student ? "Sửa thông tin sinh viên" : "Thêm sinh viên mới"}
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 0 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="MSSV"
              value={formData.mssv}
              onChange={handleChange("mssv")}
              fullWidth
              required
              disabled={!!student}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Họ tên"
              value={formData.hoTen}
              onChange={handleChange("hoTen")}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email"
              type="email"
              value={formData.gmail}
              onChange={handleChange("gmail")}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Khoa"
              value={formData.khoa}
              onChange={handleChange("khoa")}
              fullWidth
              required
              select
            >
              {/* {khoaOptions.map((k) => (
                <MenuItem key={k} value={k}>
                  {k}
                </MenuItem>
              ))} */}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Khóa"
              value={formData.khoaHoc}
              onChange={handleChange("khoaHoc")}
              fullWidth
              required
              select
            >
              {/* {khoaHocOptions.map((k) => (
                <MenuItem key={k} value={k}>
                  {k}
                </MenuItem>
              ))} */}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Lớp"
              value={formData.lop}
              onChange={handleChange("lop")}
              fullWidth
              required
              select
            >
              {/* {lopOptions.map((l) => (
                <MenuItem key={l} value={l}>
                  {l}
                </MenuItem>
              ))} */}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Số điện thoại"
              value={formData.soDienThoai}
              onChange={handleChange("soDienThoai")}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Ngày sinh"
              type="date"
              value={formData.ngaySinh}
              onChange={handleChange("ngaySinh")}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Địa chỉ"
              value={formData.diaChi}
              onChange={handleChange("diaChi")}
              fullWidth
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Hủy
        </Button>
        <Button variant="contained" disabled={loading}>
          {loading ? "Đang lưu..." : "Lưu"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
