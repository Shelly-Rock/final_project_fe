"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Chip,
  CircularProgress,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { Users } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContentDiv,
  CardHeader,
  DataTable,
} from "@/shared/components";
import type { Action, Column } from "@/shared/components";
import { getMeetings, type MeetingListItem } from "../services";

function studentName(row: MeetingListItem) {
  if (!row.student) return "-";
  return [row.student.lastName, row.student.middleName, row.student.firstName]
    .filter(Boolean)
    .join(" ");
}

function statusChip(row: MeetingListItem) {
  if (row.finalStatus === "PASSED") {
    return <Chip label="Đã chốt — Đạt" color="success" size="small" />;
  }
  if (row.finalStatus === "REJECTED_DEFENSE") {
    return <Chip label="Đã chốt — Không đạt" color="error" size="small" />;
  }
  if (row.finalStatus === "REJECTED_GVHD") {
    return <Chip label="Loại GVHD" color="error" size="small" />;
  }
  return <Chip label="Chưa chốt" color="warning" size="small" />;
}

export function CommitteeMeetingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<MeetingListItem[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [tab, setTab] = useState<"open" | "done">("open");

  const fetchMeetings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMeetings({
        page,
        limit: 20,
        finalized: tab === "done",
      });
      setRows(data.data);
      setTotal(data.meta.total);
    } catch {
      toast.error("Không thể tải danh sách họp hội đồng");
    } finally {
      setLoading(false);
    }
  }, [page, tab]);

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  const columns: Column<MeetingListItem>[] = [
    {
      id: "projectCode",
      label: "Đề tài",
      minWidth: 220,
      format: (_, row) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {row.projectCode}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.projectName}
          </Typography>
        </Box>
      ),
    },
    {
      id: "student",
      label: "Sinh viên",
      format: (_, row) => (
        <Box>
          <Typography variant="body2">{studentName(row)}</Typography>
          <Typography variant="caption" color="text.secondary">
            {row.student?.studentId}
          </Typography>
        </Box>
      ),
    },
    {
      id: "scoredCount",
      label: "Phiếu hội đồng",
      format: (_, row) => `${row.scoredCount}/${row.totalCount}`,
    },
    {
      id: "defenseAverage",
      label: "TB hội đồng",
      format: (_, row) =>
        row.defenseAverage !== null ? row.defenseAverage.toFixed(2) : "-",
    },
    {
      id: "finalStatus",
      label: "Trạng thái",
      format: (_, row) => statusChip(row),
    },
  ];

  const actions: Action<MeetingListItem>[] = [
    {
      id: "open",
      icon: <Users size={16} />,
      label: (row) => (row.isFinalized ? "Xem" : "Họp hội đồng"),
      color: "primary",
      onClick: (row) => router.push(`/scoring/meeting/${row.projectId}`),
    },
  ];

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={tab === "open" ? 0 : 1}
          onChange={(_, v) => {
            setTab(v === 0 ? "open" : "done");
            setPage(1);
          }}
        >
          <Tab label="Chưa chốt" />
          <Tab label="Đã chốt" />
        </Tabs>
      </Box>

      <Card>
        <CardHeader
          title="Họp hội đồng"
          subtitle="Đối chiếu phiếu chấm độc lập, chỉnh điểm sau thống nhất rồi nhấn OK để khóa"
        />
        <CardContentDiv padding={2}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress />
            </Box>
          ) : (
            <DataTable
              columns={columns}
              rows={rows}
              rowKey="projectId"
              actions={actions}
              loading={loading}
              showSearchInput={false}
              showFilterButton={false}
              showExportButton={false}
              showImportButton={false}
              emptyMessage="Không có đề tài họp hội đồng"
              totalCount={total}
              page={page - 1}
              rowsPerPage={20}
              onPageChange={(newPage) => setPage(newPage + 1)}
            />
          )}
        </CardContentDiv>
      </Card>
    </>
  );
}
