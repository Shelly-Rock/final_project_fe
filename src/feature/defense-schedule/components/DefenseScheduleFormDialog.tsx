"use client";

// ============================================================
// DefenseScheduleFormDialog — Form tạo / sửa lịch bảo vệ
//
// Logic đặc thù (Nghiệp vụ Giai đoạn 3):
//  - Tự động tính "Thời gian dự kiến kết thúc" khi Thư ký chỉnh
//    giờ bắt đầu hoặc thời gian mỗi đề tài.
//  - Công thức: Giờ bắt đầu + (Số đề tài × Số phút/đề tài)
// ============================================================

import { useState, useEffect, useRef, useMemo } from "react";
import { Box, Typography, Grid, TextField, Paper, Chip } from "@mui/material";
import { Dialog } from "@/shared/components";
import { Select, MultiSelect } from "@/shared/components";
import { Input } from "@/shared/components";
import { Button } from "@/shared/components";
import { Clock } from "lucide-react";
import type { DefenseSession } from "../services";
import type { Committee } from "../../committee/services";
import dayjs from "dayjs";

interface DefenseScheduleFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    committeeId?: number;
    defenseDate: string;
    startTime: string;
    room: string;
    durationMinutes: number;
    projectIds?: number[];
  }) => Promise<void>;
  session?: DefenseSession | null;
  loading?: boolean;
  committees: Committee[];
}

export function DefenseScheduleFormDialog({
  open,
  onClose,
  onSubmit,
  session,
  loading = false,
  committees,
}: DefenseScheduleFormDialogProps) {
  const isEdit = !!session;
  const prevOpenRef = useRef<boolean>(open);

  const [availableProjects, setAvailableProjects] = useState<
    { id: number; projectCode?: string; name: string; studentName?: string }[]
  >([]);

  const [formData, setFormData] = useState({
    committeeId: null as number | null,
    defenseDate: dayjs().format("YYYY-MM-DD"),
    startTime: "08:00",
    room: "",
    durationMinutes: 15,
    projectIds: [] as number[],
  });

  // ---- Fetch available projects ----
  useEffect(() => {
    if (open) {
      import("../services").then(({ defenseService }) => {
        defenseService.getAvailableProjects().then((projects) => {
          setAvailableProjects(projects);
        });
      });
    }
  }, [open]);

  // ---- Reset form khi dialog mở ----
  useEffect(() => {
    if (open && !prevOpenRef.current) {
      if (session) {
        setFormData({
          committeeId: session.committeeId,
          defenseDate: session.defenseDate,
          startTime: session.startTime,
          room: session.room || "",
          durationMinutes: session.durationMinutes,
          projectIds: (session.projects || []).map(
            (p: { projectId: number }) => p.projectId,
          ),
        });
      } else {
        setFormData({
          committeeId: null,
          defenseDate: dayjs().format("YYYY-MM-DD"),
          startTime: "08:00",
          room: "",
          durationMinutes: 15,
          projectIds: [],
        });
      }
    }
    prevOpenRef.current = open;
  }, [open, session]);

  // Số đề tài = số đề tài đã chọn trong form
  const projectCount = formData.projectIds.length;

  // ---- Tính Thời gian dự kiến kết thúc ----
  const estimatedEndTime = useMemo(() => {
    if (!formData.startTime || !formData.defenseDate) return null;
    if (projectCount === 0) return null;

    const totalMinutes = projectCount * formData.durationMinutes;
    const start = dayjs(
      `${formData.defenseDate} ${formData.startTime}`,
      "YYYY-MM-DD HH:mm",
    );
    if (!start.isValid()) return null;

    return start.add(totalMinutes, "minute").format("HH:mm");
  }, [
    formData.startTime,
    formData.defenseDate,
    formData.durationMinutes,
    projectCount,
  ]);

  // ---- Submit ----
  const handleSubmit = async () => {
    if (!isEdit && !formData.committeeId) return;
    if (!formData.defenseDate) return;
    if (!formData.startTime) return;

    await onSubmit({
      committeeId: formData.committeeId ?? undefined,
      defenseDate: formData.defenseDate,
      startTime: formData.startTime,
      room: formData.room,
      durationMinutes: formData.durationMinutes,
      projectIds: formData.projectIds,
    });
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? () => {} : onClose}
      title={isEdit ? "Sửa lịch bảo vệ" : "Tạo lịch bảo vệ mới"}
      description={
        isEdit
          ? "Cập nhật thông tin lịch bảo vệ"
          : "Thiết lập thông tin cho lịch bảo vệ mới"
      }
      size="md"
      actions={
        <>
          <Button variant="outlined" onClick={onClose} disabled={loading}>
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading || (!isEdit && !formData.committeeId)}
            loading={loading}
          >
            {isEdit ? "Lưu thay đổi" : "Tạo mới"}
          </Button>
        </>
      }
    >
      <Box sx={{ mt: 2 }}>
        {/* Chọn Hội đồng (chỉ khi tạo mới) */}
        {!isEdit && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Hội đồng <span style={{ color: "red" }}>*</span>
            </Typography>
            <Select
              placeholder="Chọn hội đồng"
              value={
                formData.committeeId ? String(formData.committeeId) : undefined
              }
              onChange={(v) =>
                setFormData({ ...formData, committeeId: v ? Number(v) : null })
              }
              options={committees.map((c) => ({
                value: String(c.id),
                label: c.name,
              }))}
              fullWidth
            />
          </Box>
        )}

        {/* Ngày & Giờ bắt đầu */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Ngày bảo vệ <span style={{ color: "red" }}>*</span>
            </Typography>
            <TextField
              type="date"
              value={formData.defenseDate}
              onChange={(e) =>
                setFormData({ ...formData, defenseDate: e.target.value })
              }
              fullWidth
              InputLabelProps={{ shrink: true }}
              size="small"
            />
          </Grid>

          <Grid item xs={6}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Giờ bắt đầu <span style={{ color: "red" }}>*</span>
            </Typography>
            <TextField
              type="time"
              value={formData.startTime}
              onChange={(e) =>
                setFormData({ ...formData, startTime: e.target.value })
              }
              fullWidth
              InputLabelProps={{ shrink: true }}
              size="small"
            />
          </Grid>
        </Grid>

        {/* Chọn đề tài */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Đề tài bảo vệ
          </Typography>
          <MultiSelect
            placeholder="Chọn các đề tài để bảo vệ..."
            value={formData.projectIds.map(String)}
            onChange={(v) =>
              setFormData({
                ...formData,
                projectIds: (v as string[]).map(Number),
              })
            }
            options={availableProjects.map((p) => ({
              value: String(p.id),
              label: `${p.projectCode || "N/A"} - ${p.name} (SV: ${p.studentName})`,
            }))}
          />
        </Box>

        {/* Thời gian mỗi đề tài */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Thời gian mỗi đề tài (phút)
          </Typography>
          <Select
            value={String(formData.durationMinutes)}
            onChange={(v) =>
              setFormData({ ...formData, durationMinutes: Number(v) })
            }
            options={[
              { value: "10", label: "10 phút" },
              { value: "15", label: "15 phút" },
              { value: "20", label: "20 phút" },
              { value: "30", label: "30 phút" },
            ]}
            fullWidth
          />
        </Box>

        {/* === Thời gian dự kiến kết thúc (Auto-calculated) === */}
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 2,
            bgcolor: "action.hover",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Clock size={20} color="#1976d2" />
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Thời gian dự kiến kết thúc
            </Typography>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}
            >
              {estimatedEndTime ? (
                <>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 700, color: "primary.main" }}
                  >
                    {estimatedEndTime}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ({projectCount} đề tài × {formData.durationMinutes} phút)
                  </Typography>
                </>
              ) : (
                <Chip
                  label={
                    projectCount === 0
                      ? "Chọn Hội đồng để xem số đề tài"
                      : "Nhập giờ bắt đầu để tính"
                  }
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>
          </Box>
        </Paper>

        {/* Phòng thi */}
        <Box sx={{ mb: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Phòng bảo vệ
          </Typography>
          <Input
            placeholder="VD: A101"
            value={formData.room}
            onChange={(e) => setFormData({ ...formData, room: e.target.value })}
            fullWidth
          />
        </Box>
      </Box>
    </Dialog>
  );
}
