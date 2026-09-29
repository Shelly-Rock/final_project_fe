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
import {
  committeeService,
  Committee,
  TeacherBasic,
  CommitteeStats,
} from "../services";
import { periodService } from "@/feature/registration-period/services";
import { toast } from "sonner";
import { CommitteeTable } from "./CommitteeTable";
import { CommitteeFormDialog } from "./CommitteeFormDialog";
import { CommitteeStats as CommitteeStatsComponent } from "./CommitteeStats";
import { ConfirmDialog } from "@/shared/components";

export default function CommitteeManagement() {
  const searchParams = useSearchParams();
  const facultyId = searchParams.get("facultyId") || undefined;
  const [periodId, setPeriodId] = useState<number | undefined>(undefined);
  const [periods, setPeriods] = useState<{ id: number; name: string }[]>([]);
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
        facultyId,
        periodId,
      });
      setCommittees(result.data);
      setPagination((prev) => ({ ...prev, total: result.total }));
    } catch {
      toast.error("Không thể tải danh sách hội đồng");
    } finally {
      setLoading(false);
    }
  }, [current, pageSize, facultyId, periodId]);

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

  const fetchTeachers = useCallback(async () => {
    try {
      const result = await committeeService.getAvailableTeachers(facultyId);
      setTeachers(result);
      const excluded = await committeeService.getExcludedTeachers();
      setExcludedTeacherIds(excluded);
    } catch {
      // ignore
    }
  }, [facultyId]);

  const fetchStats = useCallback(async () => {
    try {
      const result = await committeeService.getStats(facultyId, periodId);
      setStats(result);
    } catch {
      // ignore
    }
  }, [facultyId, periodId]);

  useEffect(() => {
    fetchCommittees();
    fetchTeachers();
    fetchStats();
    fetchPeriods();
  }, [fetchCommittees, fetchTeachers, fetchStats]);

  const openCreateModal = async () => {
    setEditingCommittee(null);
    try {
      const excluded = await committeeService.getExcludedTeachers();
      setExcludedTeacherIds(excluded);
    } catch {
      // keep current
    }
    setModalVisible(true);
  };

  const openEditModal = async (committee: Committee) => {
    setEditingCommittee(committee);
    // Khi sửa HĐ cụ thể, lấy danh sách GVHD bị loại trừ theo HĐ đó
    try {
      const excluded = await committeeService.getExcludedTeachers(committee.id);
      setExcludedTeacherIds(excluded);
    } catch {
      setExcludedTeacherIds([]);
    }
    setModalVisible(true);
  };

  const handleSubmit = async (data: {
    name: string;
    chairmanId?: number;
    secretaryId?: number;
    internal1Id?: number;
    internal2Id?: number;
    externalReviewerIds: number[];
    periodId?: number;
  }) => {
    try {
      setSubmitting(true);

      if (editingCommittee) {
        await committeeService.updateCommittee(editingCommittee.id, data);
        toast.success("Cập nhật hội đồng thành công");
      } else {
        if (!periodId) {
          toast.error("Vui lòng chọn đợt đăng ký trước khi tạo hội đồng");
          setSubmitting(false);
          return;
        }
        await committeeService.createCommittee({ ...data, periodId });
        toast.success("Tạo hội đồng thành công");
      }

      setModalVisible(false);
      fetchCommittees();
      fetchTeachers();
      fetchStats();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Không thể lưu hội đồng",
      );
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
      <CommitteeStatsComponent stats={stats} />

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
          <strong>Lưu ý:</strong> Giảng viên hướng dẫn tuyệt đối không được tham
          gia hội đồng chấm đề tài của mình. Phản biện ngoài có thể chấm ở nhiều
          hội đồng khác nhau.
        </Typography>
      </Alert>

      <CommitteeTable
        committees={committees}
        loading={loading}
        pagination={pagination}
        onEdit={openEditModal}
        onAdd={openCreateModal}
        onRefresh={fetchCommittees}
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
        excludedTeacherIds={excludedTeacherIds}
        periods={periods}
        periodId={periodId}
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
