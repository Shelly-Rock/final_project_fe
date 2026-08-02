"use client";

import { useState, useEffect, useRef } from "react";
import { Box, Typography, Divider } from "@mui/material";
import { Dialog } from "@/shared/components";
import { Input } from "@/shared/components";
import { Select } from "@/shared/components";
import { Button } from "@/shared/components";
import type { RegistrationPeriod, CreatePeriodInput } from "../types";
import { semesters, schoolYears } from "../constants";

const MIN_QUOTA = 3;
const MAX_QUOTA = 10;
const MIN_STUDENTS = 1;
const MAX_STUDENTS = 10;

interface PeriodFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePeriodInput) => Promise<void>;
  period?: RegistrationPeriod | null;
  loading?: boolean;
  secretaryDepartment?: string; // Ngành của thư ký đang đăng nhập
}

const semesterOptions = semesters.map((s) => ({
  value: s.value,
  label: s.label,
}));

const schoolYearOptions = schoolYears.map((s) => ({
  value: s.value,
  label: s.label,
}));

export function PeriodFormDialog({
  open,
  onClose,
  onSubmit,
  period,
  loading = false,
  secretaryDepartment,
}: PeriodFormDialogProps) {
  const isEdit = !!period;
  const prevOpenRef = useRef<boolean>(open);

  const [defaultQuota, setDefaultQuota] = useState("");
  const [quotaError, setQuotaError] = useState(false);

  // State cho sĩ số tối đa theo ngành
  const [departmentMaxStudents, setDepartmentMaxStudents] = useState("3");
  const [studentsError, setStudentsError] = useState(false);

  // Reset state when dialog opens
  useEffect(() => {
    // Chỉ reset khi dialog vừa được mở (open từ false -> true)
    if (open && !prevOpenRef.current) {
      setDefaultQuota(period?.defaultQuota?.toString() || "");
      setDepartmentMaxStudents(
        period?.departmentStudentLimits?.[0]?.maxStudents?.toString() || "3",
      );
      setQuotaError(false);
      setStudentsError(false);
    }
    prevOpenRef.current = open;
  }, [open, period]);

  // Validate quota
  const handleQuotaChange = (value: string) => {
    setDefaultQuota(value);
    const numeric = value === "" ? null : parseInt(value, 10);
    setQuotaError(
      numeric !== null && (numeric < MIN_QUOTA || numeric > MAX_QUOTA),
    );
  };

  // Validate department max students
  const handleDepartmentStudentsChange = (value: string) => {
    setDepartmentMaxStudents(value);
    const numeric = value === "" ? null : parseInt(value, 10);
    setStudentsError(
      numeric !== null && (numeric < MIN_STUDENTS || numeric > MAX_STUDENTS),
    );
  };

  const numericQuota = defaultQuota === "" ? null : parseInt(defaultQuota, 10);
  const numericStudents =
    departmentMaxStudents === "" ? null : parseInt(departmentMaxStudents, 10);

  const getQuotaHelperText = () => {
    if (defaultQuota === "") {
      return `Chỉ tiêu mặc định cho mỗi giảng viên (${MIN_QUOTA}-${MAX_QUOTA})`;
    }
    if (numericQuota !== null && numericQuota < MIN_QUOTA) {
      return `Chỉ tiêu tối thiểu là ${MIN_QUOTA} đề tài`;
    }
    if (numericQuota !== null && numericQuota > MAX_QUOTA) {
      return `Chỉ tiêu tối đa là ${MAX_QUOTA} đề tài`;
    }
    return `Chỉ tiêu mặc định cho mỗi giảng viên (${MIN_QUOTA}-${MAX_QUOTA})`;
  };

  const getStudentsHelperText = () => {
    if (departmentMaxStudents === "") {
      return `Số sinh viên tối đa trên mỗi đề tài (${MIN_STUDENTS}-${MAX_STUDENTS})`;
    }
    if (numericStudents !== null && numericStudents < MIN_STUDENTS) {
      return `Số sinh viên tối thiểu là ${MIN_STUDENTS}`;
    }
    if (numericStudents !== null && numericStudents > MAX_STUDENTS) {
      return `Số sinh viên tối đa là ${MAX_STUDENTS}`;
    }
    return "Số sinh viên tối đa trên mỗi đề tài";
  };

  const isValidQuota =
    numericQuota !== null &&
    numericQuota >= MIN_QUOTA &&
    numericQuota <= MAX_QUOTA;

  const isValidStudents =
    numericStudents !== null &&
    numericStudents >= MIN_STUDENTS &&
    numericStudents <= MAX_STUDENTS;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isValidQuota) {
      setQuotaError(true);
      return;
    }

    if (!isValidStudents) {
      setStudentsError(true);
      return;
    }

    const formData = new FormData(e.currentTarget);

    // Tạo cấu hình sĩ số theo ngành của thư ký
    const departmentStudentLimits = secretaryDepartment
      ? [{ department: secretaryDepartment, maxStudents: numericStudents! }]
      : [];

    const data: CreatePeriodInput = {
      name: formData.get("name") as string,
      semester: formData.get("semester") as "1" | "2" | "3",
      schoolYear: formData.get("schoolYear") as string,
      startDate: formData.get("startDate") as string,
      teacherDeadline: formData.get("teacherDeadline") as string,
      studentDeadline: formData.get("studentDeadline") as string,
      defaultQuota: numericQuota!,
      description: (formData.get("description") as string) || undefined,
      departmentStudentLimits:
        departmentStudentLimits.length > 0
          ? departmentStudentLimits
          : undefined,
    };

    await onSubmit(data);
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? () => {} : onClose}
      title={isEdit ? "Chỉnh sửa đợt đăng ký" : "Tạo đợt đăng ký mới"}
      description={
        isEdit
          ? "Cập nhật thông tin đợt đăng ký đề tài"
          : "Thiết lập thông tin cho đợt đăng ký mới"
      }
      size="lg"
      actions={
        <>
          <Button variant="outlined" onClick={onClose} disabled={loading}>
            Hủy
          </Button>
          <Button
            type="submit"
            form="period-form"
            variant="contained"
            loading={loading}
          >
            {isEdit ? "Lưu thay đổi" : "Tạo mới"}
          </Button>
        </>
      }
    >
      <form id="period-form" onSubmit={handleSubmit}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            marginTop: 16,
          }}
        >
          <Input
            name="name"
            label="Tên đợt đăng ký"
            placeholder="VD: Đợt đăng ký HK1 2026-2027"
            defaultValue={period?.name}
            required
            fullWidth
          />

          <div style={{ display: "flex", gap: 16 }}>
            <Select
              name="semester"
              label="Học kỳ"
              options={semesterOptions}
              defaultValue={period?.semester || "1"}
              required
              fullWidth
            />
            <Select
              name="schoolYear"
              label="Năm học"
              options={schoolYearOptions}
              defaultValue={period?.schoolYear || "2025-2026"}
              required
              fullWidth
            />
          </div>

          <div style={{ display: "flex", gap: 16 }}>
            <Input
              name="startDate"
              label="Ngày bắt đầu"
              type="date"
              placeholder=""
              defaultValue={period?.startDate?.split("T")[0]}
              required
              fullWidth
            />
            <Input
              name="defaultQuota"
              label="Chỉ tiêu mặc định"
              type="number"
              value={defaultQuota}
              onChange={(e) => handleQuotaChange(e.target.value)}
              helperText={getQuotaHelperText()}
              error={quotaError}
              required
              fullWidth
            />
          </div>

          <div style={{ display: "flex", gap: 16 }}>
            <Input
              name="teacherDeadline"
              label="Hạn giảng viên nộp đề tài"
              type="date"
              placeholder=""
              defaultValue={period?.teacherDeadline?.split("T")[0]}
              required
              fullWidth
            />
            <Input
              name="studentDeadline"
              label="Hạn sinh viên đăng ký"
              type="date"
              placeholder=""
              defaultValue={period?.studentDeadline?.split("T")[0]}
              required
              fullWidth
            />
          </div>

          <Divider sx={{ my: 1 }} />

          {/* Cấu hình sĩ số tối đa cho ngành */}
          <Box>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              Số lượng sinh viên tối đa
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Số lượng sinh viên tối đa trên mỗi đề tài. Giảng viên thuộc ngành
              này chỉ được nhập sĩ số trong khoảng cho phép.
            </Typography>

            <Box sx={{ maxWidth: 300 }}>
              <Input
                name="departmentMaxStudents"
                label="Sĩ số tối đa"
                type="number"
                value={departmentMaxStudents}
                onChange={(e) => handleDepartmentStudentsChange(e.target.value)}
                helperText={getStudentsHelperText()}
                error={studentsError}
                required
                fullWidth
                inputProps={{
                  min: MIN_STUDENTS,
                  max: MAX_STUDENTS,
                }}
              />
            </Box>

            {secretaryDepartment && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mt: 1 }}
              >
                Ngành: {secretaryDepartment}
              </Typography>
            )}

            {isEdit &&
              period?.departmentStudentLimits &&
              period.departmentStudentLimits.length > 0 && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mt: 1 }}
                >
                  Ngành áp dụng: {period.departmentStudentLimits[0].department}{" "}
                  - Sĩ số tối đa:{" "}
                  {period.departmentStudentLimits[0].maxStudents}
                </Typography>
              )}
          </Box>

          <Input
            name="description"
            label="Mô tả (tùy chọn)"
            placeholder="Thông tin bổ sung về đợt đăng ký"
            defaultValue={period?.description}
            multiline
            rows={3}
            fullWidth
          />
        </div>
      </form>
    </Dialog>
  );
}
