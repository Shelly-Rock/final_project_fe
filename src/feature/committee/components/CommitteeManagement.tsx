"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Box, Typography, Button, Alert } from "@mui/material";
import { Plus } from "lucide-react";
import {
  committeeService,
  Committee,
  TeacherBasic,
  CommitteeStats,
} from "../services";
import { toast } from "sonner";
import { CommitteeTable } from "./CommitteeTable";
import { CommitteeFormDialog } from "./CommitteeFormDialog";
import { CommitteeStats as CommitteeStatsComponent } from "./CommitteeStats";
import { ConfirmDialog } from "@/shared/components";

export default function CommitteeManagement() {
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [teachers, setTeachers] = useState<TeacherBasic[]>([]);
  const [excludedTeacherIds, setExcludedTeacherIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [stats, setStats] = useState<CommitteeStats>({
    totalCommittees: 0,
    committeesWithFullMembers: 0,
    committeesMissingMembers: 0,
    totalExternalReviewers: 0,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [editingCommittee, setEditingCommittee] = useState<Committee | null>(
    null,
  );
  const [submitting, setSubmitting] = useState(false);

  const { current, pageSize } = pagination;

  const fetchCommittees = useCallback(async () => {
    setLoading(true);
    try {
      const result = await committeeService.getCommittees({
        page: current,
        limit: pageSize,
      });
      setCommittees(result.data);
      setPagination((prev) => ({ ...prev, total: result.total }));
    } catch {
      toast.error("Không thể tải danh sách hội đồng");
    } finally {
      setLoading(false);
    }
  }, [current, pageSize]);

  const fetchTeachers = useCallback(async () => {
    try {
      const result = await committeeService.getAvailableTeachers();
      setTeachers(result);
      const excluded = await committeeService.getExcludedTeachers();
      setExcludedTeacherIds(excluded);
    } catch {
      // ignore
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const result = await committeeService.getStats();
      setStats(result);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    fetchCommittees();
    fetchTeachers();
    fetchStats();
  }, [fetchCommittees, fetchTeachers, fetchStats]);

  const openCreateModal = () => {
    setEditingCommittee(null);
    setModalVisible(true);
  };

  const openEditModal = (committee: Committee) => {
    setEditingCommittee(committee);
    setModalVisible(true);
  };

  const handleSubmit = async (data: {
    name: string;
    chairmanId?: number;
    secretaryId?: number;
    internal1Id?: number;
    internal2Id?: number;
    externalReviewerIds: number[];
  }) => {
    try {
      setSubmitting(true);

      if (editingCommittee) {
        await committeeService.updateCommittee(editingCommittee.id, data);
        toast.success("Cập nhật hội đồng thành công");
      } else {
        await committeeService.createCommittee(data);
        toast.success("Tạo hội đồng thành công");
      }

      setModalVisible(false);
      fetchCommittees();
      fetchTeachers();
      fetchStats();
    } catch {
      toast.error("Không thể lưu hội đồng");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await committeeService.deleteCommittee(id);
      toast.success("Xóa hội đồng thành công");
      fetchCommittees();
      fetchStats();
    } catch {
      toast.error("Không thể xóa hội đồng");
    }
  };

  const availableTeachers = teachers.filter(
    (t) => !excludedTeacherIds.includes(t.id),
  );

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
          Thêm Hội đồng
        </Button>
      </Box>

      <CommitteeStatsComponent stats={stats} />

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Lưu ý:</strong> Giảng viên hướng dẫn tuyệt đối không được ngồi
          trong hội đồng chấm đề tài của mình. Phản biện ngoài có thể chấm ở
          nhiều hội đồng khác nhau.
        </Typography>
      </Alert>

      <CommitteeTable
        committees={committees}
        loading={loading}
        pagination={pagination}
        onEdit={openEditModal}
        onDelete={(row) => setDeleteConfirm({ id: row.id, name: row.name })}
        onPageChange={(page) =>
          setPagination({ ...pagination, current: page + 1 })
        }
        onRowsPerPageChange={(pageSize) =>
          setPagination({ ...pagination, pageSize })
        }
      />

      <CommitteeFormDialog
        open={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmit}
        committee={editingCommittee}
        loading={submitting}
        availableTeachers={availableTeachers}
        allTeachers={teachers}
      />

      <ConfirmDialog
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Xóa hội đồng này?"
        description={`Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa hội đồng "${deleteConfirm?.name}"?`}
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
