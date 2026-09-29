"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import {
  Typography,
  Alert,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { periodService } from "@/feature/registration-period/services";
import { defenseService, DefenseSession } from "../services";
import { committeeService, type Committee } from "../../committee/services";
import { toast } from "sonner";
import { DefenseScheduleTable } from "./DefenseScheduleTable";
import { DefenseScheduleFormDialog } from "./DefenseScheduleFormDialog";
import { DefenseScheduleStats } from "./DefenseScheduleStats";
import { ConfirmDialog } from "@/shared/components";

export default function DefenseScheduleManagement() {
  const searchParams = useSearchParams();
  const facultyId = searchParams.get("facultyId") || undefined;
  const [periodId, setPeriodId] = useState<number | undefined>(undefined);
  const [periods, setPeriods] = useState<{ id: number; name: string }[]>([]);
  const [sessions, setSessions] = useState<DefenseSession[]>([]);
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [stats, setStats] = useState({
    totalSessions: 0,
    scheduled: 0,
    completed: 0,
    cancelled: 0,
    totalProjectsDefended: 0,
    averageScore: null as number | null,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [editingSession, setEditingSession] = useState<DefenseSession | null>(
    null,
  );
  const [submitting, setSubmitting] = useState(false);

  const { current, pageSize } = pagination;

  const fetchPeriods = useCallback(async () => {
    try {
      const result = await periodService.getAll();
      setPeriods(result.map((p) => ({ id: p.id, name: p.name })));
      setPeriodId(
        (current) => current ?? result.find((p) => p.status === "open")?.id,
      );
    } catch {
      // ignore
    }
  }, []);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    try {
      const result = await defenseService.getDefenseSessions({
        page: current,
        limit: pageSize,
        facultyId,
        periodId,
      });
      setSessions(result.data);
      setPagination((prev) => ({ ...prev, total: result.total }));
    } catch {
      toast.error("Không thể tải danh sách lịch bảo vệ");
    } finally {
      setLoading(false);
    }
  }, [current, pageSize, facultyId, periodId]);

  const fetchCommittees = useCallback(async () => {
    try {
      const result = await committeeService.getCommittees({
        limit: 100,
        facultyId,
        periodId,
      });
      setCommittees(result.data);
    } catch {
      // ignore
    }
  }, [facultyId, periodId]);

  const fetchStats = useCallback(async () => {
    try {
      const result = await defenseService.getStats(facultyId, periodId);
      setStats(result);
    } catch {
      // ignore
    }
  }, [facultyId, periodId]);

  useEffect(() => {
    fetchSessions();
    fetchCommittees();
    fetchStats();
    fetchPeriods();
  }, [fetchSessions, fetchCommittees, fetchStats, fetchPeriods]);

  const openCreateModal = () => {
    if (!periodId) {
      toast.error("Vui lòng chọn đợt đăng ký trước khi tạo lịch bảo vệ");
      return;
    }
    setEditingSession(null);
    setModalVisible(true);
  };

  const openEditModal = (session: DefenseSession) => {
    setEditingSession(session);
    setModalVisible(true);
  };

  const handleSubmit = async (data: {
    committeeId?: number;
    defenseDate: string;
    startTime: string;
    room: string;
    durationMinutes: number;
    projectIds?: number[];
  }) => {
    try {
      setSubmitting(true);

      if (editingSession) {
        await defenseService.updateDefenseSession(editingSession.id, data);
        toast.success("Cập nhật lịch bảo vệ thành công");
      } else {
        if (!data.committeeId) {
          toast.error("Vui lòng chọn hội đồng");
          setSubmitting(false);
          return;
        }
        await defenseService.createDefenseSession({
          committeeId: data.committeeId,
          defenseDate: data.defenseDate,
          startTime: data.startTime,
          room: data.room,
          durationMinutes: data.durationMinutes,
          projectIds: data.projectIds,
        });
        toast.success("Tạo lịch bảo vệ thành công");
      }

      setModalVisible(false);
      fetchSessions();
      fetchStats();
    } catch (error: unknown) {
      toast.error(
        (error as { message?: string })?.message || "Không thể lưu lịch bảo vệ",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await defenseService.deleteDefenseSession(id);
      toast.success("Xóa lịch bảo vệ thành công");
      fetchSessions();
      fetchStats();
    } catch {
      toast.error("Không thể xóa lịch bảo vệ");
    }
  };

  const handleComplete = async (id: number) => {
    try {
      await defenseService.completeDefenseSession(id);
      toast.success("Đánh dấu hoàn thành thành công");
      fetchSessions();
      fetchStats();
    } catch {
      toast.error("Không thể đánh dấu hoàn thành");
    }
  };

  const [exportingId, setExportingId] = useState<number | null>(null);

  const handleExportWord = async (id: number) => {
    setExportingId(id);
    try {
      await defenseService.downloadScheduleWord(id);
      toast.success("Đã tải xuống file lịch bảo vệ");
    } catch {
      toast.error("Không thể xuất file lịch bảo vệ. Vui lòng thử lại.");
    } finally {
      setExportingId(null);
    }
  };

  const [deleteConfirm, setDeleteConfirm] = useState<{
    id: number;
    name: string;
  } | null>(null);

  return (
    <>
      <DefenseScheduleStats stats={stats} />

      <Box sx={{ mt: 3, mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
        <FormControl size="small" sx={{ minWidth: 300 }}>
          <InputLabel>Chọn đợt đăng ký</InputLabel>
          <Select
            label="Chọn đợt đăng ký"
            value={periodId ?? ""}
            onChange={(e) => {
              const val = e.target.value;
              setPeriodId(val === "" ? undefined : Number(val));
              setPagination((p) => ({ ...p, current: 1 }));
            }}
          >
            <MenuItem value="">
              <em>Tất cả đợt</em>
            </MenuItem>
            {periods.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Tự động tính toán:</strong> Hệ thống tự động tính toán thời
          gian kết thúc dự kiến (15 phút/đề tài) và hỗ trợ xuất file Word lịch
          bảo vệ.
        </Typography>
      </Alert>

      <DefenseScheduleTable
        sessions={sessions}
        loading={loading}
        pagination={pagination}
        onEdit={openEditModal}
        onDelete={(row) =>
          setDeleteConfirm({ id: row.id, name: row.committeeName })
        }
        onAdd={openCreateModal}
        onRefresh={fetchSessions}
        onComplete={handleComplete}
        onExportWord={handleExportWord}
        exportingId={exportingId}
        onPageChange={(page) =>
          setPagination({ ...pagination, current: page + 1 })
        }
        onRowsPerPageChange={(pageSize) =>
          setPagination({ ...pagination, pageSize })
        }
      />

      <DefenseScheduleFormDialog
        open={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmit}
        session={editingSession}
        loading={submitting}
        committees={committees}
        facultyId={facultyId}
        periodId={periodId}
      />

      <ConfirmDialog
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Xóa lịch bảo vệ này?"
        description={`Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa lịch bảo vệ "${deleteConfirm?.name}"?`}
        variant="danger"
        onConfirm={() => {
          if (deleteConfirm) {
            handleDelete(deleteConfirm.id);
            setDeleteConfirm(null);
          }
        }}
      />
    </>
  );
}
