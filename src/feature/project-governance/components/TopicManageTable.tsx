"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  Chip,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { toast } from "sonner";
import { DataTable, type Column } from "@/shared/components";
import { Select } from "@/shared/components/Select";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { topicManageService } from "../services/topicManage.service";
import { periodService } from "@/feature/registration-period/services/period.service";
import type {
  ManagedTopicRow,
  TopicManageParams,
  ProjectStatus,
  TopicStatus,
} from "../types";
import {
  PROJECT_STATUS_COLORS,
  PROJECT_STATUS_LABELS,
  TOPIC_STATUS_COLORS,
  TOPIC_STATUS_LABELS,
} from "../constants";
import { errorMessage, formatDateTime } from "../utils/governance";
import { ForceEditTopicDialog } from "./ForceEditTopicDialog";
import { ManualAssignDialog } from "./ManualAssignDialog";
import { SupplementalTopicDialog } from "./SupplementalTopicDialog";
import { TopicAuditDialog } from "./TopicAuditDialog";
import { BulkModerationDialog } from "./BulkModerationDialog";

const PROJECT_STATUS_OPTIONS: Array<{ value: ProjectStatus; label: string }> = (
  Object.keys(PROJECT_STATUS_LABELS) as ProjectStatus[]
).map((value) => ({
  value,
  label: PROJECT_STATUS_LABELS[value],
}));

const TOPIC_STATUS_OPTIONS: Array<{ value: TopicStatus; label: string }> = (
  Object.keys(TOPIC_STATUS_LABELS) as TopicStatus[]
).map((value) => ({
  value,
  label: TOPIC_STATUS_LABELS[value],
}));

export function TopicManageTable() {
  const [periods, setPeriods] = useState<Array<{ id: number; name: string }>>(
    [],
  );
  const [periodId, setPeriodId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 450);

  const [facultyId, setFacultyId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [status, setStatus] = useState("");
  const [registrationStatus, setRegistrationStatus] = useState("");
  const [isSupplemental, setIsSupplemental] = useState("");

  const [rows, setRows] = useState<ManagedTopicRow[]>([]);
  const [total, setTotal] = useState(0);
  const [facultyOptions, setFacultyOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const [departmentOptions, setDepartmentOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const [teacherOptions, setTeacherOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [loading, setLoading] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const [forceTopic, setForceTopic] = useState<ManagedTopicRow | null>(null);
  const [assignTopic, setAssignTopic] = useState<ManagedTopicRow | null>(null);
  const [auditTopic, setAuditTopic] = useState<ManagedTopicRow | null>(null);
  const [supplementalOpen, setSupplementalOpen] = useState(false);
  const [bulkAction, setBulkAction] = useState<"APPROVE" | "REJECT" | null>(
    null,
  );
  const [exporting, setExporting] = useState(false);
  const [generatingCodes, setGeneratingCodes] = useState(false);

  useEffect(() => {
    let active = true;
    periodService
      .getAll()
      .then((items) => {
        if (!active) return;
        setPeriods(items.map((p) => ({ id: p.id, name: p.name })));
        setPeriodId((current) => {
          if (current !== null || !items.length) return current;
          const preferred =
            items.find((p) => p.status === "open") ??
            items.find((p) => p.status === "upcoming") ??
            items[0];
          return preferred.id;
        });
      })
      .catch(() => {
        if (active) toast.error("Không thể tải danh sách đợt đồ án.");
      });
    return () => {
      active = false;
    };
  }, []);

  const requestIdRef = useRef(0);
  const exportingRef = useRef(false);
  const generatingCodesRef = useRef(false);

  const selectedIds = useMemo(
    () => selectedKeys.map((k) => Number(k)).filter((n) => Number.isFinite(n)),
    [selectedKeys],
  );

  const buildFilterParams = useCallback((): TopicManageParams => {
    const params: TopicManageParams = {};
    if (periodId) params.periodId = periodId;
    const q = debouncedSearch.trim();
    if (q) params.search = q;
    if (facultyId) params.facultyId = facultyId;
    if (departmentId) params.departmentId = departmentId;
    if (teacherId) params.teacherId = Number(teacherId);
    if (status) params.status = status as TopicStatus;
    if (registrationStatus)
      params.registrationStatus = registrationStatus as ProjectStatus;
    if (isSupplemental === "true") params.isSupplemental = true;
    if (isSupplemental === "false") params.isSupplemental = false;
    return params;
  }, [
    debouncedSearch,
    departmentId,
    facultyId,
    isSupplemental,
    periodId,
    registrationStatus,
    status,
    teacherId,
  ]);

  const buildParams = useCallback(
    (): TopicManageParams => ({
      ...buildFilterParams(),
      page: page + 1,
      limit: rowsPerPage,
    }),
    [buildFilterParams, page, rowsPerPage],
  );

  const fetchTopics = useCallback(async () => {
    if (!periodId) {
      setRows([]);
      setTotal(0);
      return;
    }

    const requestId = ++requestIdRef.current;
    setLoading(true);
    try {
      const res = await topicManageService.listManaged(buildParams());
      if (requestId !== requestIdRef.current) return;

      setRows(res.items ?? []);
      setTotal(res.total ?? 0);
      setFacultyOptions(
        (res.facets?.faculties ?? []).map((item) => ({
          value: item.id,
          label: item.name,
        })),
      );
      setDepartmentOptions(
        (res.facets?.departments ?? []).map((item) => ({
          value: item.id,
          label: item.name,
        })),
      );
      setTeacherOptions(
        (res.facets?.teachers ?? []).map((item) => ({
          value: String(item.id),
          label: `${item.name} (${item.teacherId})`,
        })),
      );
    } catch (error) {
      if (requestId === requestIdRef.current) {
        toast.error(errorMessage(error, "Không thể tải danh sách đề tài."));
      }
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  }, [buildParams, periodId]);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics, refreshKey]);

  useEffect(() => {
    setPage(0);
  }, [
    debouncedSearch,
    facultyId,
    departmentId,
    teacherId,
    status,
    registrationStatus,
    isSupplemental,
  ]);

  useEffect(() => {
    setFacultyId((current) => {
      if (!current) return current;
      return facultyOptions.some((option) => option.value === current)
        ? current
        : "";
    });
    setDepartmentId((current) => {
      if (!current) return current;
      return departmentOptions.some((option) => option.value === current)
        ? current
        : "";
    });
    setTeacherId((current) => {
      if (!current) return current;
      return teacherOptions.some((option) => option.value === current)
        ? current
        : "";
    });
  }, [facultyOptions, departmentOptions, teacherOptions]);

  useEffect(() => {
    setPage(0);
    setSelectedKeys([]);
  }, [periodId]);

  useEffect(() => {
    setSelectedKeys([]);
  }, [page, rowsPerPage, total]);

  const handleExport = async () => {
    if (!periodId) return;
    if (exportingRef.current) return;
    exportingRef.current = true;
    setExporting(true);
    try {
      const name = await topicManageService.exportExcel(buildFilterParams());
      toast.success(`Đã xuất Excel: ${name}`);
    } catch (error) {
      toast.error(errorMessage(error, "Không thể xuất Excel."));
    } finally {
      setExporting(false);
      exportingRef.current = false;
    }
  };

  const handleGenerateCodes = async () => {
    if (!periodId) return;
    if (generatingCodesRef.current) return;
    generatingCodesRef.current = true;
    setGeneratingCodes(true);
    try {
      const result = await topicManageService.generateCodes({
        periodId,
        topicIds: selectedIds.length ? selectedIds : undefined,
      });
      const detail = result.samples.length
        ? ` Ví dụ: ${result.samples.map((s) => s.code).join(", ")}`
        : "";
      toast.success(
        `Đã sinh ${result.generated} mã, bỏ qua ${result.skipped}.${detail}`,
      );
      setSelectedKeys([]);
      setRefreshKey((v) => v + 1);
    } catch (error) {
      toast.error(errorMessage(error, "Không thể sinh mã đề tài."));
    } finally {
      setGeneratingCodes(false);
      generatingCodesRef.current = false;
    }
  };

  const busy = exporting || generatingCodes || loading;

  const columns: Column<ManagedTopicRow>[] = [
    {
      id: "code",
      label: "Mã đề tài",
      minWidth: 150,
      sortable: false,
      format: (_, row) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {row.code ?? "—"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            #{row.id} · {formatDateTime(row.createdAt)}
          </Typography>
        </Box>
      ),
    },
    {
      id: "name",
      label: "Tên đề tài",
      minWidth: 260,
      sortable: false,
      format: (_, row) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {row.name}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {row.description}
          </Typography>
          {row.isSupplemental && (
            <Chip size="small" label="Bổ sung" color="info" sx={{ mt: 0.5 }} />
          )}
        </Box>
      ),
    },
    {
      id: "teacher",
      label: "GVHD",
      minWidth: 180,
      sortable: false,
      format: (_, row) =>
        row.teacher ? (
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {row.teacher.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row.teacher.teacherId} · {row.teacher.departmentName ?? "—"}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block" }}
            >
              {row.teacher.facultyName ?? "—"}
            </Typography>
          </Box>
        ) : (
          "—"
        ),
    },
    {
      id: "maxStudents",
      label: "Sĩ số",
      minWidth: 110,
      align: "center",
      sortable: false,
      format: (_, row) => `${row.occupiedStudents}/${row.maxStudents}`,
    },
    {
      id: "students",
      label: "Danh sách SV",
      minWidth: 220,
      sortable: false,
      format: (_, row) =>
        row.students.length === 0 ? (
          <Typography variant="caption" color="text.secondary">
            {row.registrationHeadline}
          </Typography>
        ) : (
          <Box sx={{ display: "grid", gap: 0.5 }}>
            {row.students.map((s) => (
              <Tooltip
                key={s.projectId}
                title={`${s.studentCode ?? "—"} · ${s.className ?? "—"} · ${s.statusLabel}`}
              >
                <Chip
                  size="small"
                  variant="outlined"
                  label={`${s.studentCode ?? s.name ?? `#${s.projectId}`} · ${s.statusLabel}`}
                />
              </Tooltip>
            ))}
            <Typography variant="caption" color="text.secondary">
              {row.registrationHeadline}
            </Typography>
          </Box>
        ),
    },
    {
      id: "status",
      label: "Trạng thái đề tài",
      minWidth: 130,
      sortable: false,
      format: (value) => (
        <Chip
          size="small"
          label={TOPIC_STATUS_LABELS[value as TopicStatus] ?? String(value)}
          color={TOPIC_STATUS_COLORS[value as TopicStatus] ?? "default"}
        />
      ),
    },
    {
      id: "registrationSummary",
      label: "Trạng thái đăng ký",
      minWidth: 150,
      sortable: false,
      format: (_, row) => {
        const s = row.registrationSummary;
        const dominant: ProjectStatus | null =
          s.waitingSecretary > 0
            ? "WAITING_SECRETARY"
            : s.pending > 0
              ? "PENDING"
              : s.approved > 0 || s.assigned > 0
                ? "APPROVED"
                : s.rejected > 0
                  ? "REJECTED"
                  : null;
        if (!dominant)
          return <Chip size="small" label="—" variant="outlined" />;
        return (
          <Chip
            size="small"
            label={PROJECT_STATUS_LABELS[dominant]}
            color={PROJECT_STATUS_COLORS[dominant]}
          />
        );
      },
    },
  ];

  return (
    <Box sx={{ display: "grid", gap: 1.5 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "220px 1fr 160px 160px",
          },
          gap: 1,
          alignItems: "center",
        }}
      >
        <Select
          label="Đợt đồ án"
          size="small"
          value={periodId ? String(periodId) : ""}
          onChange={(v) => setPeriodId(Number(v) || null)}
          options={periods.map((p) => ({ value: String(p.id), label: p.name }))}
        />
        <TextField
          size="small"
          placeholder="Tìm mã / tên đề tài / tên GV / mã SV"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          spellCheck={false}
          fullWidth
        />
        <Select
          label="Khoa"
          size="small"
          value={facultyId}
          onChange={setFacultyId}
          options={[{ value: "", label: "Tất cả khoa" }, ...facultyOptions]}
        />
        <Select
          label="Bộ môn"
          size="small"
          value={departmentId}
          onChange={setDepartmentId}
          options={[{ value: "", label: "Tất cả BM" }, ...departmentOptions]}
        />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(5, minmax(0, 1fr))",
          },
          gap: 1,
        }}
      >
        <Select
          label="Giảng viên hướng dẫn"
          size="small"
          value={teacherId}
          onChange={setTeacherId}
          options={[
            { value: "", label: "Tất cả giảng viên" },
            ...teacherOptions,
          ]}
        />
        <Select
          label="Trạng thái đề tài"
          size="small"
          value={status}
          onChange={setStatus}
          options={[
            { value: "", label: "Tất cả" },
            ...TOPIC_STATUS_OPTIONS.map((o) => ({
              value: o.value,
              label: o.label,
            })),
          ]}
        />
        <Select
          label="Trạng thái đăng ký"
          size="small"
          value={registrationStatus}
          onChange={setRegistrationStatus}
          options={[
            { value: "", label: "Tất cả" },
            ...PROJECT_STATUS_OPTIONS.map((o) => ({
              value: o.value,
              label: o.label,
            })),
          ]}
        />
        <Select
          label="Bổ sung"
          size="small"
          value={isSupplemental}
          onChange={setIsSupplemental}
          options={[
            { value: "", label: "Tất cả" },
            { value: "true", label: "Chỉ đề tài bổ sung" },
            { value: "false", label: "Không bổ sung" },
          ]}
        />
        <Button
          variant="outlined"
          onClick={() => {
            setFacultyId("");
            setDepartmentId("");
            setTeacherId("");
            setStatus("");
            setRegistrationStatus("");
            setIsSupplemental("");
            setSearch("");
          }}
        >
          Xóa lọc
        </Button>
      </Box>

      <DataTable<ManagedTopicRow>
        columns={columns}
        rows={rows}
        rowKey="id"
        totalCount={total}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsPerPageChange={(v) => {
          setRowsPerPage(v);
          setPage(0);
          setSelectedKeys([]);
        }}
        loading={loading}
        selectable={!busy}
        selectedRowKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        emptyMessage={
          !periodId
            ? "Vui lòng chọn đợt đồ án."
            : "Không có đề tài nào khớp bộ lọc."
        }
        showExportButton={false}
        showImportButton={false}
        showSearchInput={false}
        actions={[
          {
            id: "audit",
            label: "Lịch sử",
            icon: <span className="bi bi-clock-history" />,
            onClick: (row) => setAuditTopic(row),
          },
          {
            id: "force",
            label: "Force edit",
            icon: <span className="bi bi-pencil-square" />,
            onClick: (row) => setForceTopic(row),
          },
          {
            id: "assign",
            label: "Gán SV",
            icon: <span className="bi bi-person-plus" />,
            onClick: (row) => setAssignTopic(row),
            disabled: (row) => row.remainingSlots <= 0 || busy,
          },
        ]}
        headerActions={[
          {
            id: "refresh",
            label: "Làm mới",
            onClick: () => setRefreshKey((v) => v + 1),
            variant: "outlined",
            disabled: busy,
          },
          {
            id: "bulk-approve",
            label: `Duyệt (${selectedIds.length})`,
            onClick: () => {
              if (busy) return;
              if (!selectedIds.length) {
                toast.error("Vui lòng chọn ít nhất một đề tài.");
                return;
              }
              setBulkAction("APPROVE");
            },
            variant: "contained",
            disabled: busy,
          },
          {
            id: "bulk-reject",
            label: `Từ chối (${selectedIds.length})`,
            onClick: () => {
              if (busy) return;
              if (!selectedIds.length) {
                toast.error("Vui lòng chọn ít nhất một đề tài.");
                return;
              }
              setBulkAction("REJECT");
            },
            variant: "outlined",
            disabled: busy,
          },
          {
            id: "export",
            label: exporting ? "Đang xuất..." : "Xuất Excel",
            onClick: handleExport,
            variant: "outlined",
            disabled: busy,
          },
          {
            id: "gen-code",
            label: generatingCodes
              ? "Đang sinh mã..."
              : selectedIds.length
                ? `Sinh mã (${selectedIds.length})`
                : "Sinh mã (toàn đợt)",
            onClick: handleGenerateCodes,
            variant: "outlined",
            disabled: busy,
          },
          {
            id: "supplemental",
            label: "Đề tài bổ sung",
            onClick: () => {
              if (busy) return;
              if (!periodId) {
                toast.error("Vui lòng chọn đợt đồ án trước.");
                return;
              }
              setSupplementalOpen(true);
            },
            variant: "contained",
            disabled: busy,
          },
        ]}
      />

      <ForceEditTopicDialog
        open={!!forceTopic}
        topic={forceTopic}
        onClose={() => setForceTopic(null)}
        onSaved={() => setRefreshKey((v) => v + 1)}
      />
      <ManualAssignDialog
        open={!!assignTopic}
        topic={assignTopic}
        onClose={() => setAssignTopic(null)}
        onSaved={() => setRefreshKey((v) => v + 1)}
      />
      <TopicAuditDialog
        open={!!auditTopic}
        topic={auditTopic}
        onClose={() => setAuditTopic(null)}
      />
      <SupplementalTopicDialog
        open={supplementalOpen}
        periodId={periodId}
        onClose={() => setSupplementalOpen(false)}
        onCreated={() => setRefreshKey((v) => v + 1)}
      />
      <BulkModerationDialog
        open={!!bulkAction}
        action={bulkAction ?? "APPROVE"}
        topicIds={selectedIds}
        onClose={() => setBulkAction(null)}
        onCompleted={() => {
          setSelectedKeys([]);
          setRefreshKey((v) => v + 1);
        }}
      />
    </Box>
  );
}
