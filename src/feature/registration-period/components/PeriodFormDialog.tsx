"use client";

import { useState } from "react";
import { Dialog } from "@/shared/components";
import { Input } from "@/shared/components";
import { Select } from "@/shared/components";
import { Button } from "@/shared/components";
import type { RegistrationPeriod, CreatePeriodInput } from "../types";
import { semesters, schoolYears } from "../constants";

const MIN_QUOTA = 3;
const MAX_QUOTA = 10;

interface PeriodFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePeriodInput) => Promise<void>;
  period?: RegistrationPeriod | null;
  loading?: boolean;
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
}: PeriodFormDialogProps) {
  const isEdit = !!period;
  const [defaultQuota, setDefaultQuota] = useState(
    period?.defaultQuota?.toString() || "",
  );
  const [quotaError, setQuotaError] = useState(false);

  // Reset state when dialog opens with a new period
  const handleQuotaChange = (value: string) => {
    setDefaultQuota(value);
    const numeric = value === "" ? null : parseInt(value, 10);
    setQuotaError(
      numeric !== null && (numeric < MIN_QUOTA || numeric > MAX_QUOTA),
    );
  };

  // Get numeric value for validation
  const numericQuota = defaultQuota === "" ? null : parseInt(defaultQuota, 10);

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

  const isValidQuota =
    numericQuota !== null &&
    numericQuota >= MIN_QUOTA &&
    numericQuota <= MAX_QUOTA;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate quota before submission
    if (!isValidQuota) {
      setQuotaError(true);
      return;
    }

    const formData = new FormData(e.currentTarget);

    const data: CreatePeriodInput = {
      name: formData.get("name") as string,
      semester: formData.get("semester") as "1" | "2" | "3",
      schoolYear: formData.get("schoolYear") as string,
      startDate: formData.get("startDate") as string,
      teacherDeadline: formData.get("teacherDeadline") as string,
      studentDeadline: formData.get("studentDeadline") as string,
      defaultQuota: numericQuota!,
      description: (formData.get("description") as string) || undefined,
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
