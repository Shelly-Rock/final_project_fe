"use client";

import { useState, useEffect, useRef } from "react";
import { Box, Typography, Grid, Alert } from "@mui/material";
import { Dialog } from "@/shared/components";
import { Input } from "@/shared/components";
import { Select } from "@/shared/components";
import { MultiSelect } from "@/shared/components";
import { Button } from "@/shared/components";
import type { Committee, TeacherBasic } from "../services";

interface CommitteeFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    chairmanId?: number;
    secretaryId?: number;
    internal1Id?: number;
    internal2Id?: number;
    externalReviewerIds: number[];
  }) => Promise<void>;
  committee?: Committee | null;
  loading?: boolean;
  availableTeachers: TeacherBasic[];
  allTeachers: TeacherBasic[];
}

export function CommitteeFormDialog({
  open,
  onClose,
  onSubmit,
  committee,
  loading = false,
  availableTeachers,
  allTeachers,
}: CommitteeFormDialogProps) {
  const isEdit = !!committee;
  const prevOpenRef = useRef<boolean>(open);

  const [formData, setFormData] = useState({
    name: "",
    chairmanId: null as number | null,
    secretaryId: null as number | null,
    internal1Id: null as number | null,
    internal2Id: null as number | null,
    externalReviewerIds: [] as number[],
  });

  // Reset state when dialog opens
  useEffect(() => {
    if (open && !prevOpenRef.current) {
      if (committee) {
        setFormData({
          name: committee.name,
          chairmanId: committee.chairmanId,
          secretaryId: committee.secretaryId,
          internal1Id: committee.internal1Id,
          internal2Id: committee.internal2Id,
          externalReviewerIds: committee.externalReviewers.map(
            (er: { id: number }) => er.id,
          ),
        });
      } else {
        setFormData({
          name: "",
          chairmanId: null,
          secretaryId: null,
          internal1Id: null,
          internal2Id: null,
          externalReviewerIds: [],
        });
      }
    }
    prevOpenRef.current = open;
  }, [open, committee]);

  const handleSubmit = async () => {
    if (!formData.name) {
      return;
    }

    await onSubmit({
      name: formData.name,
      chairmanId: formData.chairmanId ?? undefined,
      secretaryId: formData.secretaryId ?? undefined,
      internal1Id: formData.internal1Id ?? undefined,
      internal2Id: formData.internal2Id ?? undefined,
      externalReviewerIds: formData.externalReviewerIds,
    });
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? () => {} : onClose}
      title={isEdit ? "Sửa Hội đồng" : "Tạo Hội đồng mới"}
      description={
        isEdit
          ? "Cập nhật thông tin hội đồng bảo vệ"
          : "Thiết lập thông tin cho hội đồng bảo vệ mới"
      }
      size="lg"
      actions={
        <>
          <Button variant="outlined" onClick={onClose} disabled={loading}>
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading || !formData.name}
            loading={loading}
          >
            {isEdit ? "Lưu thay đổi" : "Tạo mới"}
          </Button>
        </>
      }
    >
      <Box sx={{ mt: 2 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Tên hội đồng <span style={{ color: "red" }}>*</span>
          </Typography>
          <Input
            placeholder="VD: Hội đồng chấm luận văn KHDL 2026"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            fullWidth
          />
        </Box>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Chủ tịch
            </Typography>
            <Select
              placeholder="Chọn chủ tịch"
              value={
                formData.chairmanId ? String(formData.chairmanId) : undefined
              }
              onChange={(v) =>
                setFormData({ ...formData, chairmanId: v ? Number(v) : null })
              }
              options={availableTeachers.map((t) => ({
                value: String(t.id),
                label: `${t.name} (${t.teacherId})`,
              }))}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Thư ký
            </Typography>
            <Select
              placeholder="Chọn thư ký"
              value={
                formData.secretaryId ? String(formData.secretaryId) : undefined
              }
              onChange={(v) =>
                setFormData({ ...formData, secretaryId: v ? Number(v) : null })
              }
              options={availableTeachers.map((t) => ({
                value: String(t.id),
                label: `${t.name} (${t.teacherId})`,
              }))}
              fullWidth
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Phản biện trong 1
            </Typography>
            <Select
              placeholder="Chọn phản biện trong 1"
              value={
                formData.internal1Id ? String(formData.internal1Id) : undefined
              }
              onChange={(v) =>
                setFormData({ ...formData, internal1Id: v ? Number(v) : null })
              }
              options={availableTeachers.map((t) => ({
                value: String(t.id),
                label: `${t.name} (${t.teacherId})`,
              }))}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Phản biện trong 2
            </Typography>
            <Select
              placeholder="Chọn phản biện trong 2"
              value={
                formData.internal2Id ? String(formData.internal2Id) : undefined
              }
              onChange={(v) =>
                setFormData({ ...formData, internal2Id: v ? Number(v) : null })
              }
              options={availableTeachers.map((t) => ({
                value: String(t.id),
                label: `${t.name} (${t.teacherId})`,
              }))}
              fullWidth
            />
          </Grid>
        </Grid>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Phản biện ngoài (có thể chọn nhiều)
          </Typography>
          <MultiSelect
            placeholder="Chọn phản biện ngoài"
            value={formData.externalReviewerIds.map(String)}
            onChange={(v) =>
              setFormData({ ...formData, externalReviewerIds: v.map(Number) })
            }
            options={allTeachers.map((t) => ({
              value: String(t.id),
              label: `${t.name} (${t.teacherId}) - ${t.department || "Không có khoa"}`,
            }))}
          />
        </Box>

        <Alert severity="warning">
          <Typography variant="body2">
            <strong>Quy tắc thành viên:</strong> Thành viên cố định (Chủ tịch,
            Thư ký, Phản biện trong) chỉ được thuộc một hội đồng. Phản biện
            ngoài có thể thuộc nhiều hội đồng.
          </Typography>
        </Alert>
      </Box>
    </Dialog>
  );
}
