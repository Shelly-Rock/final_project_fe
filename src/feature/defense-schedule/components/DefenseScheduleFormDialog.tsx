"use client";

import { useState, useEffect, useRef } from "react";
import { Box, Typography, Grid, TextField } from "@mui/material";
import { Dialog } from "@/shared/components";
import { Select } from "@/shared/components";
import { Input } from "@/shared/components";
import { Button } from "@/shared/components";
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

  const [formData, setFormData] = useState({
    committeeId: null as number | null,
    defenseDate: dayjs().format("YYYY-MM-DD"),
    startTime: "08:00",
    room: "",
    durationMinutes: 15,
  });

  // Reset state when dialog opens
  useEffect(() => {
    if (open && !prevOpenRef.current) {
      if (session) {
        setFormData({
          committeeId: session.committeeId,
          defenseDate: session.defenseDate,
          startTime: session.startTime,
          room: session.room || "",
          durationMinutes: session.durationMinutes,
        });
      } else {
        setFormData({
          committeeId: null,
          defenseDate: dayjs().format("YYYY-MM-DD"),
          startTime: "08:00",
          room: "",
          durationMinutes: 15,
        });
      }
    }
    prevOpenRef.current = open;
  }, [open, session]);

  const handleSubmit = async () => {
    if (!isEdit && !formData.committeeId) {
      return;
    }
    if (!formData.defenseDate) {
      return;
    }
    if (!formData.startTime) {
      return;
    }

    await onSubmit({
      committeeId: formData.committeeId ?? undefined,
      defenseDate: formData.defenseDate,
      startTime: formData.startTime,
      room: formData.room,
      durationMinutes: formData.durationMinutes,
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
              options={committees.map((c: { id: number; name: string }) => ({
                value: String(c.id),
                label: c.name,
              }))}
              fullWidth
            />
          </Box>
        )}

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
            />
          </Grid>
        </Grid>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Phòng
          </Typography>
          <Input
            placeholder="VD: A101"
            value={formData.room}
            onChange={(e) => setFormData({ ...formData, room: e.target.value })}
            fullWidth
          />
        </Box>

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
      </Box>
    </Dialog>
  );
}
