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
import {
  Alert,
  Box,
  Typography,
  Grid,
  TextField,
  Paper,
  Chip,
} from "@mui/material";
import { Dialog } from "@/shared/components";
import { Select, MultiSelect } from "@/shared/components";
import { Input } from "@/shared/components";
import { Button } from "@/shared/components";
import { Clock } from "lucide-react";
import type { AvailableProjectsResponse, DefenseSession } from "../services";
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
  facultyId?: string;
  periodId?: number;
}

export function DefenseScheduleFormDialog({
  open,
  onClose,
  onSubmit,
  session,
  loading = false,
  committees,
  facultyId,
  periodId,
}: DefenseScheduleFormDialogProps) {
  const isEdit = !!session;
  const prevOpenRef = useRef<boolean>(open);

  const [availableGroups, setAvailableGroups] = useState<
    {
      key: string;
      topicId: number | null;
      id: number;
      projectCode?: string;
      name: string;
      projectIds: number[];
      supervisorIds?: number[];
      studentNames?: string;
      students?: { name: string; mssv: string }[];
      conflictingTeacherNames?: string[];
    }[]
  >([]);
  const [excludedGroups, setExcludedGroups] = useState<
    AvailableProjectsResponse["excluded"]
  >([]);

  const [topicIds, setTopicIds] = useState<number[]>([]);
  const [formData, setFormData] = useState({
    committeeId: null as number | null,
    defenseDate: dayjs().format("YYYY-MM-DD"),
    startTime: "08:00",
    room: "",
    durationMinutes: 15,
    projectIds: [] as number[],
  });

  const groupIdToProjectIds = useMemo(() => {
    const m = new Map<number, number[]>();
    for (const g of availableGroups) m.set(g.id, g.projectIds);
    return m;
  }, [availableGroups]);

  const selectedCommittee = useMemo(
    () =>
      formData.committeeId
        ? (committees.find((c) => c.id === formData.committeeId) ?? null)
        : null,
    [committees, formData.committeeId],
  );

  const excludedSupervisorIds = useMemo(() => {
    if (!selectedCommittee) return new Set<number>();
    const ids = [
      selectedCommittee.chairmanId,
      selectedCommittee.secretaryId,
      selectedCommittee.internal1Id,
      selectedCommittee.internal2Id,
    ].flatMap((id) => (id != null ? [id] : []));
    for (const reviewer of selectedCommittee.externalReviewers || []) {
      ids.push(reviewer.id);
    }
    return new Set(ids);
  }, [selectedCommittee]);

  const visibleGroups = useMemo(
    () =>
      availableGroups.filter(
        (group) =>
          !group.supervisorIds?.some(
            (supervisorId) =>
              supervisorId != null && excludedSupervisorIds.has(supervisorId),
          ),
      ),
    [availableGroups, excludedSupervisorIds],
  );

  const conflictingCurrentGroups = useMemo(
    () =>
      isEdit
        ? availableGroups.filter((group) =>
            group.supervisorIds?.some((id) => excludedSupervisorIds.has(id)),
          )
        : [],
    [availableGroups, excludedSupervisorIds, isEdit],
  );

  const visibleGroupIds = useMemo(
    () => new Set(visibleGroups.map((group) => group.id)),
    [visibleGroups],
  );

  // ---- Fetch available topics/groups ----
  useEffect(() => {
    if (!open) return;
    const activeCommitteeId =
      session?.committeeId ?? formData.committeeId ?? undefined;
    let cancelled = false;

    import("../services").then(({ defenseService }) => {
      defenseService
        .getAvailableProjects(
          facultyId,
          periodId,
          activeCommitteeId ?? undefined,
        )
        .then((response: AvailableProjectsResponse) => {
          if (cancelled) return;
          const groups = response.available || [];
          setExcludedGroups(response.excluded || []);
          const normalized: typeof availableGroups = (groups || []).map(
            (g) => ({
              key:
                g.key ||
                (g.topicId != null ? `topic:${g.topicId}` : `project:${g.id}`),
              topicId: g.topicId ?? null,
              id: g.id ?? g.topicId ?? g.projectIds?.[0] ?? 0,
              projectCode: g.projectCode,
              name: g.name ?? "",
              projectIds: g.projectIds ?? (g.id != null ? [g.id] : []),
              supervisorIds: Array.isArray(g.supervisorIds)
                ? g.supervisorIds
                    .filter(
                      (supervisorId): supervisorId is number =>
                        supervisorId != null,
                    )
                    .map((supervisorId) => Number(supervisorId))
                : [],
              studentNames: g.studentNames ?? "",
              students: g.students ?? [],
            }),
          );
          const existingGroupsByKey = new Map<
            string,
            (typeof normalized)[number]
          >();
          for (const p of session?.projects ?? []) {
            const topicId = p.topicId ?? null;
            const key =
              topicId != null ? `topic:${topicId}` : `project:${p.projectId}`;
            const existing = existingGroupsByKey.get(key);
            if (existing) {
              if (!existing.projectIds.includes(p.projectId)) {
                existing.projectIds.push(p.projectId);
              }
              const supervisorId = p.teacherId;
              if (supervisorId != null && existing.supervisorIds) {
                existing.supervisorIds.push(supervisorId);
              }
              const studentName = p.studentName || "";
              existing.studentNames = [existing.studentNames, studentName]
                .filter(Boolean)
                .join(", ");
              existing.students = [
                ...(existing.students || []),
                { name: studentName, mssv: p.studentMssv || "" },
              ];
            } else {
              existingGroupsByKey.set(key, {
                key,
                topicId,
                id: topicId ?? p.projectId,
                projectCode: p.topicCode ?? p.projectCode,
                name: p.topicName ?? p.projectName,
                projectIds: [p.projectId],
                supervisorIds: p.teacherId != null ? [p.teacherId] : [],
                studentNames: p.studentName,
                students: [{ name: p.studentName, mssv: p.studentMssv || "" }],
              });
            }
          }
          const byKey = new Map<string, (typeof normalized)[number]>();
          for (const g of normalized) byKey.set(g.key, g);
          for (const [k, v] of existingGroupsByKey)
            if (!byKey.has(k)) byKey.set(k, v);
          const merged = [...byKey.values()];
          setAvailableGroups(merged);
          // derive selected group ids from current projectIds if editing
          const currentIds = new Set(formData.projectIds);
          if (currentIds.size === 0 && session?.projects?.length) {
            const fromSession = new Set(
              (session.projects || []).map((p) => p.projectId),
            );
            const selectedKeys = new Set<number>();
            for (const g of merged)
              if (g.projectIds.some((pid) => fromSession.has(pid)))
                selectedKeys.add(g.id);
            setTopicIds([...selectedKeys]);
          } else if (currentIds.size > 0) {
            const selectedKeys = new Set<number>();
            for (const g of merged)
              if (g.projectIds.some((pid) => currentIds.has(pid)))
                selectedKeys.add(g.id);
            setTopicIds([...selectedKeys]);
          }
        });
    });

    return () => {
      cancelled = true;
    };
  }, [open, facultyId, periodId, session, formData.committeeId]);

  // ---- Reset form khi dialog mở ----
  useEffect(() => {
    if (open && !prevOpenRef.current) {
      if (session) {
        const ids = (session.projects || []).map(
          (p: { projectId: number }) => p.projectId,
        );
        setFormData({
          committeeId: session.committeeId,
          defenseDate: session.defenseDate,
          startTime: session.startTime,
          room: session.room || "",
          durationMinutes: session.durationMinutes,
          projectIds: ids,
        });
        const existingTopicIds = (session.projects || [])
          .map((project) =>
            project.topicId != null ? project.topicId : project.projectId,
          )
          .filter((value, index, values) => values.indexOf(value) === index);
        setTopicIds(existingTopicIds);
      } else {
        setFormData({
          committeeId: null,
          defenseDate: dayjs().format("YYYY-MM-DD"),
          startTime: "08:00",
          room: "",
          durationMinutes: 15,
          projectIds: [],
        });
        setTopicIds([]);
      }
    }
    prevOpenRef.current = open;
  }, [open, session]);

  useEffect(() => {
    if (isEdit) return;
    if (excludedSupervisorIds.size === 0) return;
    const cleaned = topicIds.filter((id) => visibleGroupIds.has(id));
    if (cleaned.length === topicIds.length) return;
    setTopicIds(cleaned);
    const nextProjectIds: number[] = [];
    for (const id of cleaned) {
      const projectIds = groupIdToProjectIds.get(id) || [];
      nextProjectIds.push(...projectIds);
    }
    setFormData((prev) => ({ ...prev, projectIds: nextProjectIds }));
  }, [
    topicIds,
    visibleGroupIds,
    excludedSupervisorIds,
    isEdit,
    groupIdToProjectIds,
  ]);

  // Keep projectIds in sync when topicIds changes (group -> expand to projectIds)
  const handleTopicChange = (values: string[]) => {
    const ids = values.map(Number);
    setTopicIds(ids);
    const expanded: number[] = [];
    for (const tid of ids) {
      const pids = groupIdToProjectIds.get(tid);
      if (pids) expanded.push(...pids);
      else expanded.push(tid);
    }
    setFormData((prev) => ({ ...prev, projectIds: expanded }));
  };

  // Số đề tài = số đề tài (nhóm theo topic) đã chọn
  const projectCount = topicIds.length || formData.projectIds.length;

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
              onChange={(v) => {
                const nextCommitteeId = v ? Number(v) : null;
                setFormData({
                  ...formData,
                  committeeId: nextCommitteeId,
                  projectIds: [],
                });
                setTopicIds([]);
                setAvailableGroups([]);
              }}
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

        {/* Chọn đề tài - gom theo đề tài (topic), không lặp theo sinh viên */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Đề tài bảo vệ
          </Typography>
          {(excludedGroups.length > 0 ||
            conflictingCurrentGroups.length > 0) && (
            <Alert severity="warning" sx={{ mb: 1.5 }}>
              <Typography variant="body2" fontWeight={600}>
                {excludedGroups.length + conflictingCurrentGroups.length} đề tài
                bị loại do xung đột lợi ích.
              </Typography>
              <Typography variant="caption">
                Giảng viên hướng dẫn không được tham gia hội đồng chấm đề tài
                của mình.
                {[...excludedGroups, ...conflictingCurrentGroups]
                  .slice(0, 3)
                  .map(
                    (group) =>
                      ` ${group.projectCode || group.name} (${group.conflictingTeacherNames?.join(", ") || "giảng viên trong hội đồng"}).`,
                  )}
              </Typography>
            </Alert>
          )}
          <MultiSelect
            placeholder="Chọn các đề tài để bảo vệ..."
            value={topicIds.map(String)}
            menuProps={{
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "left",
              },
              transformOrigin: {
                vertical: "top",
                horizontal: "left",
              },
              PaperProps: {
                sx: {
                  maxHeight: 280,
                  width: "min(650px, calc(100vw - 48px))",
                  minWidth: 0,
                  maxWidth: "calc(100vw - 48px)",
                  "& .MuiMenuItem-root": {
                    whiteSpace: "normal",
                    overflowWrap: "anywhere",
                    minWidth: 0,
                  },
                },
              },
            }}
            onChange={(v) => handleTopicChange(v as string[])}
            options={visibleGroups.map((g) => ({
              value: String(g.id),
              label: `${g.projectCode || "N/A"} - ${g.name}${g.studentNames ? ` (SV: ${g.studentNames})` : ""}`,
            }))}
          />
          {!isEdit && formData.committeeId && visibleGroups.length === 0 ? (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 1, display: "block" }}
            >
              Không còn đề tài hợp lệ cho hội đồng này. Các đề tài do thành viên
              hội đồng hướng dẫn đã được lọc bỏ.
            </Typography>
          ) : null}
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
