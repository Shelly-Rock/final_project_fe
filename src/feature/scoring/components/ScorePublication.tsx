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
import { FileText } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContentDiv,
  CardHeader,
  DataTable,
} from "@/shared/components";
import type { Action, Column } from "@/shared/components";
import { getTranscripts, type TranscriptDetail } from "../services";

function studentName(row: TranscriptDetail) {
  if (!row.student) return "-";
  return [row.student.lastName, row.student.middleName, row.student.firstName]
    .filter(Boolean)
    .join(" ");
}

export function ScorePublicationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<TranscriptDetail[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [tab, setTab] = useState<"draft" | "published">("draft");

  const fetchRows = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getTranscripts({
        page,
        limit: 20,
        published: tab === "published",
      });
      setRows(data.data);
      setTotal(data.meta.total);
    } catch {
      toast.error("Không thể tải danh sách bảng điểm");
    } finally {
      setLoading(false);
    }
  }, [page, tab]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  const columns: Column<TranscriptDetail>[] = [
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
      id: "weightedScore",
      label: "Điểm trọng số",
      format: (_, row) => row.weightedScore.toFixed(2),
    },
    {
      id: "bonusScore",
      label: "Điểm cộng",
      format: (_, row) => row.bonusScore.toFixed(2),
    },
    {
      id: "finalScore",
      label: "Điểm tổng",
      format: (_, row) => (
        <Typography sx={{ fontWeight: 700 }}>
          {row.finalScore.toFixed(2)}
        </Typography>
      ),
    },
    {
      id: "isPublished",
      label: "Công bố",
      format: (_, row) =>
        row.isPublished ? (
          <Chip label="Đã công bố" color="success" size="small" />
        ) : (
          <Chip label="Chưa công bố" color="warning" size="small" />
        ),
    },
  ];

  const actions: Action<TranscriptDetail>[] = [
    {
      id: "open",
      icon: <FileText size={16} />,
      label: (row) => (row.isPublished ? "Xem bảng điểm" : "Tính & công bố"),
      color: "primary",
      onClick: (row) => router.push(`/scoring/transcript/${row.projectId}`),
    },
  ];

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={tab === "draft" ? 0 : 1}
          onChange={(_, v) => {
            setTab(v === 0 ? "draft" : "published");
            setPage(1);
          }}
        >
          <Tab label="Chưa công bố" />
          <Tab label="Đã công bố" />
        </Tabs>
      </Box>

      <Card>
        <CardHeader
          title="Bảng điểm tổng hợp"
          subtitle="GVHD 40% + Phản biện ngoài 20% + 3 thành viên hội đồng 40%, cộng điểm thưởng rồi công bố"
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
              emptyMessage="Không có bảng điểm sau khi chốt hội đồng"
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
