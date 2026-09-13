"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { Printer, Trophy } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContentDiv,
  CardHeader,
  DataTable,
  Dialog,
} from "@/shared/components";
import type { Action, Column } from "@/shared/components";
import {
  computeRankings,
  getPostDefenseList,
  setRevisionWindow,
  updateRank,
  type PostDefenseRow,
} from "../services";

function studentName(row: PostDefenseRow) {
  if (!row.student) return "-";
  return [row.student.lastName, row.student.middleName, row.student.firstName]
    .filter(Boolean)
    .join(" ");
}

export function PostDefenseRankingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [ranking, setRanking] = useState(false);
  const [rows, setRows] = useState<PostDefenseRow[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<PostDefenseRow | null>(null);
  const [rankValue, setRankValue] = useState("");
  const [rankNote, setRankNote] = useState("");
  const [deadline, setDeadline] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchRows = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getPostDefenseList({ page, limit: 50 });
      setRows(data.data);
      setTotal(data.meta.total);
    } catch {
      toast.error("Không thể tải danh sách xếp hạng");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  const handleRank = async () => {
    try {
      setRanking(true);
      const result = await computeRankings();
      toast.success(`Đã xếp hạng ${result.total} sinh viên đạt`);
      await fetchRows();
    } catch (error) {
      toast.error((error as Error).message || "Không thể xếp hạng");
    } finally {
      setRanking(false);
    }
  };

  const openOverride = (row: PostDefenseRow) => {
    setSelected(row);
    setRankValue(String(row.rankOverride ?? row.rank ?? ""));
    setRankNote(row.rankNote ?? "");
    const d = new Date(row.revisionDeadline);
    const pad = (n: number) => String(n).padStart(2, "0");
    setDeadline(
      `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`,
    );
  };

  const saveOverride = async () => {
    if (!selected) return;
    const rank = Number(rankValue);
    if (!Number.isInteger(rank) || rank < 1) {
      toast.error("Thứ hạng phải là số nguyên ≥ 1");
      return;
    }
    try {
      setSaving(true);
      await updateRank(selected.projectId, {
        rankOverride: rank,
        rankNote,
      });
      if (deadline) {
        await setRevisionWindow(
          selected.projectId,
          new Date(deadline).toISOString(),
        );
      }
      toast.success("Đã lưu thứ hạng thủ công");
      setSelected(null);
      await fetchRows();
    } catch (error) {
      toast.error((error as Error).message || "Không thể lưu thứ hạng");
    } finally {
      setSaving(false);
    }
  };

  const columns: Column<PostDefenseRow>[] = [
    {
      id: "rank",
      label: "Hạng",
      minWidth: 80,
      format: (_, row) => (
        <Typography sx={{ fontWeight: 700 }}>{row.rank ?? "-"}</Typography>
      ),
    },
    {
      id: "student",
      label: "Sinh viên",
      minWidth: 200,
      format: (_, row) => (
        <Box>
          <Typography variant="body2">{studentName(row)}</Typography>
          <Typography variant="caption" color="text.secondary">
            {row.student?.studentId} · {row.student?.className}
          </Typography>
        </Box>
      ),
    },
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
      id: "finalScore",
      label: "Điểm tổng",
      format: (_, row) => (
        <Typography sx={{ fontWeight: 700 }}>
          {row.finalScore != null ? row.finalScore.toFixed(2) : "-"}
        </Typography>
      ),
    },
    {
      id: "revision",
      label: "Chỉnh sửa hồ sơ",
      minWidth: 180,
      format: (_, row) =>
        row.latestRevisionFile ? (
          <Chip size="small" color="success" label={row.latestRevisionFile} />
        ) : (
          <Chip size="small" color="warning" label="Chưa nộp" />
        ),
    },
    {
      id: "rankOverride",
      label: "Thủ công",
      format: (_, row) =>
        row.rankOverride ? (
          <Chip size="small" label={`Hạng ${row.rankOverride}`} />
        ) : (
          "-"
        ),
    },
  ];

  const actions: Action<PostDefenseRow>[] = [
    {
      id: "override",
      icon: <Trophy size={16} />,
      label: "Xếp hạng thủ công",
      color: "primary",
      onClick: openOverride,
    },
  ];

  return (
    <>
      <Box sx={{ display: "flex", gap: 1, mb: 3, justifyContent: "flex-end" }}>
        <Button
          variant="outlined"
          startIcon={<Printer size={16} />}
          onClick={() => router.push("/scoring/post-defense/print")}
        >
          In biểu mẫu
        </Button>
        <Button
          variant="contained"
          startIcon={<Trophy size={16} />}
          onClick={handleRank}
          disabled={ranking}
        >
          {ranking ? "Đang xếp hạng..." : "Xếp hạng theo điểm"}
        </Button>
      </Box>

      <Card>
        <CardHeader
          title="Top sinh viên xuất sắc"
          subtitle="Sắp xếp theo điểm tổng. Đồng điểm: thư ký hệ thống quyết định thứ hạng thủ công."
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
              emptyMessage="Chưa có bảng điểm đã công bố để xếp hạng"
              totalCount={total}
              page={page - 1}
              rowsPerPage={50}
              onPageChange={(newPage) => setPage(newPage + 1)}
            />
          )}
        </CardContentDiv>
      </Card>

      <Dialog
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title="Xếp hạng thủ công & hạn chỉnh sửa"
        description={
          selected
            ? `${studentName(selected)} · điểm ${selected.finalScore?.toFixed(2) ?? "-"}`
            : ""
        }
        actions={
          <>
            <Button onClick={() => setSelected(null)}>Hủy</Button>
            <Button
              variant="contained"
              onClick={saveOverride}
              disabled={saving}
            >
              {saving ? "Đang lưu..." : "Lưu"}
            </Button>
          </>
        }
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="Thứ hạng"
            type="number"
            value={rankValue}
            inputProps={{ min: 1, step: 1 }}
            onChange={(e) => setRankValue(e.target.value)}
          />
          <TextField
            label="Lý do (đồng điểm)"
            value={rankNote}
            onChange={(e) => setRankNote(e.target.value)}
          />
          <TextField
            label="Hạn chỉnh sửa hồ sơ"
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Box>
      </Dialog>
    </>
  );
}
