import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { Dialog, Input, Select, Button } from "@/shared/components";
import type { CreatePeriodInput } from "../types";
import {
  semesters as semesterOptions,
  schoolYears as schoolYearOptions,
} from "../constants";

interface CreatePeriodDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePeriodInput) => Promise<void>;
  loading?: boolean;
}

export function CreatePeriodDialog({
  open,
  onClose,
  onSubmit,
  loading = false,
}: CreatePeriodDialogProps) {
  const [semester, setSemester] = useState(semesterOptions[0].value);
  const [schoolYear, setSchoolYear] = useState(schoolYearOptions[0].value);

  useEffect(() => {
    if (open) {
      setSemester(semesterOptions[0].value);
      setSchoolYear(schoolYearOptions[0].value);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const data: Partial<CreatePeriodInput> = {
      name: formData.get("name") as string,
      semester: semester as "1" | "2" | "3",
      schoolYear: schoolYear,
      startDate: formData.get("startDate") as string,
      description: (formData.get("description") as string) || undefined,
    };

    await onSubmit(data as CreatePeriodInput);
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? () => {} : onClose}
      title="Tạo đợt đăng ký mới"
      description="Thiết lập thông tin cơ bản cho đợt đăng ký mới"
      size="md"
      actions={
        <>
          <Button variant="outlined" onClick={onClose} disabled={loading}>
            Hủy
          </Button>
          <Button
            type="submit"
            form="create-period-form"
            variant="contained"
            loading={loading}
          >
            Tạo đợt đăng ký
          </Button>
        </>
      }
    >
      <form id="create-period-form" onSubmit={handleSubmit}>
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
            placeholder="VD: Đợt đăng ký KLTN Học kỳ 1 2026-2027"
            required
            fullWidth
          />

          <div style={{ display: "flex", gap: 16 }}>
            <Select
              name="semester"
              label="Học kỳ"
              options={semesterOptions}
              value={semester}
              onChange={(val) => setSemester(val as "1" | "2" | "3")}
              required
              fullWidth
            />
            <Select
              name="schoolYear"
              label="Năm học"
              options={schoolYearOptions}
              value={schoolYear}
              onChange={(val) => setSchoolYear(val)}
              required
              fullWidth
            />
          </div>

          <Input
            name="startDate"
            label="Ngày bắt đầu"
            type="date"
            placeholder=""
            required
            fullWidth
          />

          <Input
            name="description"
            label="Mô tả (tùy chọn)"
            placeholder="Thông tin bổ sung về đợt đăng ký"
            multiline
            rows={3}
            fullWidth
          />
        </div>
      </form>
    </Dialog>
  );
}
