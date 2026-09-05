"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Box, Typography, Button, Alert } from "@mui/material";
import { Plus } from "lucide-react";
import { defenseService, DefenseSession } from "../services";
import { committeeService, type Committee } from "../../committee/services";
import { toast } from "sonner";
import { DefenseScheduleTable } from "./DefenseScheduleTable";
import { DefenseScheduleFormDialog } from "./DefenseScheduleFormDialog";
import { DefenseScheduleStats } from "./DefenseScheduleStats";
import { ConfirmDialog } from "@/shared/components";

export default function DefenseScheduleManagement() {
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

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    try {
      const result = await defenseService.getDefenseSessions({
        page: current,
        limit: pageSize,
      });
      setSessions(result.data);
      setPagination((prev) => ({ ...prev, total: result.total }));
    } catch {
      toast.error("Không thể tải danh sách lịch bảo vệ");
    } finally {
      setLoading(false);
    }
  }, [current, pageSize]);

  const fetchCommittees = useCallback(async () => {
    try {
      const result = await committeeService.getCommittees({ limit: 100 });
      setCommittees(result.data);
    } catch {
      // ignore
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const result = await defenseService.getStats();
      setStats(result);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    fetchSessions();
    fetchCommittees();
    fetchStats();
  }, [fetchSessions, fetchCommittees, fetchStats]);

  const openCreateModal = () => {
    setEditingSession(null);
    setModalVisible(true);
  };

  const openEditModal = (session: DefenseSession) => {
    setEditingSession(session);
    setModalVisible(true);
  };

  const handleSubmit = async (data: unknown) => {
    try {
      setSubmitting(true);

      if (editingSession) {
        await defenseService.updateDefenseSession(editingSession.id, data);
        toast.success("Cập nhật lịch bảo vệ thành công");
      } else {
        await defenseService.createDefenseSession(data);
        toast.success("Tạo lịch bảo vệ thành công");
      }

      setModalVisible(false);
      fetchSessions();
      fetchStats();
    } catch {
      toast.error("Không thể lưu lịch bảo vệ");
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

  const [deleteConfirm, setDeleteConfirm] = useState<{
    id: number;
    name: string;
  } | null>(null);

  return (
    <>
      <Box sx={{ mb: 4 }}>
        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={openCreateModal}
        >
          Tạo lịch bảo vệ
        </Button>
      </Box>

      <DefenseScheduleStats stats={stats} />

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
        onComplete={handleComplete}
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
