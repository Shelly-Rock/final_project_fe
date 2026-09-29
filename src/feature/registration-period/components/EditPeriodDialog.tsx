import { useState, useEffect } from "react";
import { Dialog, Input, Select, Button } from "@/shared/components";
import type { RegistrationPeriod, UpdatePeriodInput } from "../types";
import {
  semesters as semesterOptions,
  schoolYears as schoolYearOptions,
} from "../constants";

interface EditPeriodDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UpdatePeriodInput) => Promise<void>;
  period: RegistrationPeriod;
  loading?: boolean;
}

export function EditPeriodDialog({
  open,
  onClose,
  onSubmit,
  period,
  loading = false,
}: EditPeriodDialogProps) {
  const [semester, setSemester] = useState(period.semester);
  const [schoolYear, setSchoolYear] = useState(period.schoolYear);

  useEffect(() => {
    if (open) {
      setSemester(period.semester);
      setSchoolYear(period.schoolYear);
    }
  }, [open, period]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const data: UpdatePeriodInput = {
      name: formData.get("name") as string,
      semester: semester as "1" | "2" | "3",
      schoolYear: schoolYear,
      startDate: formData.get("startDate") as string,
      description: (formData.get("description") as string) || undefined,
    };

    await onSubmit(data);
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? () => {} : onClose}
      title="Chỉnh sửa đợt đăng ký"
      description="Cập nhật thông tin cơ bản cho đợt đăng ký"
      size="md"
      actions={
        <>
          <Button variant="outlined" onClick={onClose} disabled={loading}>
            Hủy
          </Button>
          <Button
            type="submit"
            form="edit-period-form"
            variant="contained"
            loading={loading}
          >
            Lưu thay đổi
          </Button>
        </>
      }
    >
      <form id="edit-period-form" onSubmit={handleSubmit}>
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
            defaultValue={period.name}
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
            defaultValue={period.startDate?.split("T")[0]}
            required
            fullWidth
          />

          <Input
            name="description"
            label="Mô tả (tùy chọn)"
            placeholder="Thông tin bổ sung về đợt đăng ký"
            defaultValue={period.description}
            multiline
            rows={3}
            fullWidth
          />
        </div>
      </form>
    </Dialog>
  );
}
