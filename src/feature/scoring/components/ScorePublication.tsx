"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Alert,
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
import {
  getTranscripts,
  type TranscriptListItem,
  type TranscriptReadinessStatus,
} from "../services";

const readinessLabels: Record<TranscriptReadinessStatus, string> = {
  IN_PROGRESS: "Đang chờ phiếu chấm",
  BLOCKED_GVHD: "Không đạt GVHD",
  AWAITING_FINALIZATION: "Chờ chốt hội đồng",
  READY: "Sẵn sàng tổng hợp",
  PUBLISHED: "Đã công bố",
};

const readinessColors: Record<
  TranscriptReadinessStatus,
  "default" | "error" | "warning" | "info" | "success"
> = {
  IN_PROGRESS: "warning",
  BLOCKED_GVHD: "error",
  AWAITING_FINALIZATION: "warning",
  READY: "info",
  PUBLISHED: "success",
};

function studentName(row: TranscriptListItem) {
  if (!row.student) return "-";
  return [row.student.lastName, row.student.middleName, row.student.firstName]
    .filter(Boolean)
    .join(" ");
}

function formatScore(score: number | null) {
  return score === null ? "—" : score.toFixed(2);
}

export function ScorePublicationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const facultyId = searchParams.get("facultyId") || undefined;
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<TranscriptListItem[]>([]);
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
        includeInProgress: true,
        facultyId,
      });
      setRows(data.data);
      setTotal(data.meta.total);
    } catch {
      toast.error("Không thể tải danh sách tổng hợp điểm");
    } finally {
      setLoading(false);
    }
  }, [page, tab, facultyId]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  const columns: Column<TranscriptListItem>[] = [
    {
      id: "projectCode",
      label: "Đề tài",
      minWidth: 190,
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
      minWidth: 180,
      format: (_, row) => (
        <Box>
          <Typography variant="body2">{studentName(row)}</Typography>
          <Typography variant="caption" color="text.secondary">
            {row.student?.studentId ?? "Không có mã sinh viên"}
          </Typography>
        </Box>
      ),
    },
    {
      id: "progress",
      label: "Phiếu đã nộp",
      align: "center",
      minWidth: 120,
      format: (_, row) => `${row.submittedCount}/${row.requiredCount}`,
    },
    {
      id: "readinessStatus",
      label: "Trạng thái",
      minWidth: 175,
      format: (_, row) => (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
          <Chip
            label={readinessLabels[row.readinessStatus]}
            color={readinessColors[row.readinessStatus]}
            size="small"
          />
          {row.missingItems.length > 0 && (
            <Typography variant="caption" color="text.secondary">
              {row.missingItems.slice(0, 2).join("; ")}
              {row.missingItems.length > 2
                ? `; còn ${row.missingItems.length - 2} mục`
                : ""}
            </Typography>
          )}
        </Box>
      ),
    },
    {
      id: "weightedScore",
      label: "Điểm trọng số",
      align: "center",
      format: (_, row) => formatScore(row.weightedScore),
    },
    {
      id: "bonusScore",
      label: "Điểm cộng",
      align: "center",
      format: (_, row) => formatScore(row.bonusScore),
    },
    {
      id: "finalScore",
      label: "Điểm tổng",
      align: "center",
      format: (_, row) => (
        <Typography sx={{ fontWeight: 700 }}>
          {formatScore(row.finalScore)}
        </Typography>
      ),
    },
  ];

  const actions: Action<TranscriptListItem>[] = [
    {
      id: "open",
      icon: <FileText size={16} />,
      label: (row) => {
        if (row.readinessStatus === "AWAITING_FINALIZATION")
          return "Review & Chốt điểm";
        if (row.readinessStatus === "PUBLISHED") return "Xem bảng điểm";
        return "Tính & Công bố";
      },
      color: "primary",
      hidden: (row) =>
        row.readinessStatus === "IN_PROGRESS" ||
        row.readinessStatus === "BLOCKED_GVHD",
      onClick: (row) =>
        router.push(
          `/scoring/transcript/${row.projectId}${facultyId ? `?facultyId=${encodeURIComponent(facultyId)}` : ""}`,
        ),
    },
  ];

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs
          value={tab === "draft" ? 0 : 1}
          onChange={(_, value) => {
            setTab(value === 0 ? "draft" : "published");
            setPage(1);
          }}
        >
          <Tab label="Chưa công bố" />
          <Tab label="Đã công bố" />
        </Tabs>
      </Box>

      <Card>
        <CardHeader
          title="Tổng hợp điểm theo sinh viên"
          subtitle="Mỗi sinh viên có một bảng điểm riêng; điểm hội đồng lấy trung bình đúng ba thành viên nội bộ."
        />
        <CardContentDiv padding={2}>
          <Alert severity="info" sx={{ mb: 2 }}>
            Đủ điều kiện khi đã nộp phiếu giảng viên hướng dẫn, phản biện ngoài
            và ba thành viên hội đồng; sau đó thư ký hội đồng phải chốt điểm.
          </Alert>
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
              emptyMessage="Chưa có sinh viên được cấp phiếu chấm"
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
