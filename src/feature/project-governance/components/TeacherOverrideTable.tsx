"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { Column, DataTable } from "@/shared/components";
import { toast } from "sonner";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { adminConfigService } from "../services/adminConfig.service";
import type { TeacherOverrideRow } from "../types";
import { MAX_STUDENTS_PER_TOPIC_CEILING } from "../constants";
import { errorMessage } from "../utils/governance";

interface TeacherOverrideTableProps {
  periodId: number;
  maxTopicLimit: number;
  maxStudentsPerTopic: number;
  onReloadStats?: () => void;
}

export function TeacherOverrideTable({
  periodId,
  maxTopicLimit,
  maxStudentsPerTopic,
  onReloadStats,
}: TeacherOverrideTableProps) {
  const [search, setSearch] = useState("");
  const debounced = useDebouncedValue(search, 450);
  const [rows, setRows] = useState<TeacherOverrideRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [total, setTotal] = useState(0);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [assignedQuota, setAssignedQuota] = useState("3");
  const [perTopicStudents, setPerTopicStudents] = useState("3");
  const [saving, setSaving] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const page1 = await adminConfigService.listTeacherOverrides({
        periodId,
        search: debounced.trim() || undefined,
        page: page + 1,
        limit: rowsPerPage,
      });
      setRows(page1.items ?? []);
      setTotal(page1.total ?? 0);
    } catch (error) {
      toast.error(errorMessage(error, "Không thể tải danh sách giảng viên."));
    } finally {
      setLoading(false);
    }
  }, [debounced, page, periodId, rowsPerPage]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  useEffect(() => {
    setPage(0);
    setSelectedKeys([]);
  }, [debounced, periodId]);

  const selectedTeacherIds = useMemo(
    () =>
      selectedKeys
        .map((key) => Number(key))
        .filter((value) => Number.isFinite(value)),
    [selectedKeys],
  );

  const bulkDisabledReason = useMemo(() => {
    const quota = Number(assignedQuota);
    const per = Number(perTopicStudents);
    if (!Number.isInteger(quota) || quota < 1 || quota > maxTopicLimit) {
      return `Chỉ tiêu phải nằm trong khoảng 1–${maxTopicLimit}.`;
    }
    if (
      !Number.isInteger(per) ||
      per < 1 ||
      per > MAX_STUDENTS_PER_TOPIC_CEILING
    ) {
      return `Sĩ số mỗi đề tài phải nằm trong 1–${MAX_STUDENTS_PER_TOPIC_CEILING}.`;
    }
    if (per > maxStudentsPerTopic) {
      return `Sĩ số không vượt quá cấu hình đợt (${maxStudentsPerTopic}).`;
    }
    return null;
  }, [assignedQuota, perTopicStudents, maxTopicLimit, maxStudentsPerTopic]);

  const handleBulkUpsert = async () => {
    if (selectedTeacherIds.length === 0) {
      toast.error("Vui lòng chọn ít nhất một giảng viên.");
      return;
    }
    if (bulkDisabledReason) {
      toast.error(bulkDisabledReason);
      return;
    }
    setSaving(true);
    try {
      const quota = Number(assignedQuota);
      await adminConfigService.upsertTeacherOverrides({
        periodId,
        teacherIds: selectedTeacherIds,
        assignedQuota: quota,
        maxStudentsPerTopic: Number(perTopicStudents),
      });
      toast.success(
        `Đã cập nhật chỉ tiêu cho ${selectedTeacherIds.length} giảng viên.`,
      );
      await fetch();
      onReloadStats?.();
    } catch (error) {
      toast.error(
        errorMessage(error, "Không thể cập nhật chỉ tiêu giảng viên."),
      );
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async (teacherId: number) => {
    setSaving(true);
    try {
      await adminConfigService.deleteTeacherOverride(teacherId, periodId);
      toast.success("Đã đưa chỉ tiêu giảng viên về mặc định đợt.");
      await fetch();
      onReloadStats?.();
    } catch (error) {
      toast.error(
        errorMessage(error, "Không thể đặt lại chỉ tiêu giảng viên."),
      );
    } finally {
      setSaving(false);
    }
  };

  const columns: Column<TeacherOverrideRow>[] = [
    {
      id: "name",
      label: "Giảng viên",
      minWidth: 220,
      sortable: false,
      format: (_, row) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {row.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.teacher_id} · {row.email}
          </Typography>
        </Box>
      ),
    },
    {
      id: "assignedQuota",
      label: "Chỉ tiêu",
      minWidth: 110,
      align: "center",
      sortable: false,
    },
    {
      id: "submittedTopics",
      label: "Đã nộp",
      minWidth: 90,
      align: "center",
      sortable: false,
    },
    {
      id: "remainingTopics",
      label: "Còn lại",
      minWidth: 90,
      align: "center",
      sortable: false,
    },
    {
      id: "isOverride",
      label: "Ghi đè",
      minWidth: 90,
      align: "center",
      sortable: false,
      format: (value) =>
        value ? (
          <Chip size="small" label="Đã ghi đè" color="warning" />
        ) : (
          <Chip size="small" label="Mặc định" variant="outlined" />
        ),
    },
    {
      id: "status",
      label: "Trạng thái",
      minWidth: 120,
      sortable: false,
      format: (value) =>
        value === "SUFFICIENT" ? (
          <Chip size="small" label="Đủ" color="success" />
        ) : (
          <Chip size="small" label="Chưa đủ" color="warning" />
        ),
    },
  ];

  return (
    <Box sx={{ display: "grid", gap: 2 }}>
      <Alert severity="info">
        Chọn một hoặc nhiều giảng viên để áp dụng cùng mức chỉ tiêu. Chỉ tiêu
        riêng có thể được đưa về mức mặc định của đợt bất kỳ lúc nào.
      </Alert>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "minmax(180px, 260px) minmax(140px, 180px) auto",
          },
          gap: 1.5,
          alignItems: "center",
        }}
      >
        <TextField
          label="Tìm GV"
          placeholder="Tên / Mã GV / Email"
          size="small"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          fullWidth
        />

        <TextField
          label="Chỉ tiêu mới"
          type="number"
          size="small"
          value={assignedQuota}
          onChange={(event) => setAssignedQuota(event.target.value)}
          disabled={saving}
          inputProps={{ min: 1, max: maxTopicLimit, step: 1 }}
          helperText={`≤ trần ${maxTopicLimit}`}
          fullWidth
        />

        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <TextField
            label="SV/đề tài"
            type="number"
            size="small"
            value={perTopicStudents}
            onChange={(event) => setPerTopicStudents(event.target.value)}
            disabled={saving}
            inputProps={{
              min: 1,
              max: MAX_STUDENTS_PER_TOPIC_CEILING,
              step: 1,
            }}
            sx={{ width: 160 }}
          />
          <Button
            variant="contained"
            onClick={handleBulkUpsert}
            disabled={
              saving || selectedTeacherIds.length === 0 || !!bulkDisabledReason
            }
          >
            {saving ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              `Áp dụng cho ${selectedTeacherIds.length} GV`
            )}
          </Button>
        </Box>
      </Box>

      {bulkDisabledReason && (
        <Alert severity="warning">{bulkDisabledReason}</Alert>
      )}

      <DataTable<TeacherOverrideRow>
        columns={columns}
        rows={rows}
        rowKey="id"
        totalCount={total}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsPerPageChange={(value) => {
          setRowsPerPage(value);
          setPage(0);
        }}
        loading={loading}
        selectable={!saving && !loading}
        selectedRowKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        emptyMessage="Không tìm thấy giảng viên nào phù hợp."
        showExportButton={false}
        showImportButton={false}
        showSearchInput={false}
        actions={[
          {
            id: "reset",
            label: "Đưa về mặc định",
            icon: <span className="bi bi-arrow-counterclockwise" />,
            onClick: (row) => handleReset(row.id),
            color: "inherit",
          },
        ]}
        headerActions={[
          {
            id: "refresh-override",
            label: "Làm mới",
            onClick: fetch,
            variant: "outlined",
            disabled: saving || loading,
          },
        ]}
      />
    </Box>
  );
}
