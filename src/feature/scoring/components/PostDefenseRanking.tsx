"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Medal,
  Printer,
  RefreshCw,
  Trophy,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { DataTable, Dialog } from "@/shared/components";
import type { Action, Column, HeaderAction } from "@/shared/components";
import { GRADIENT_STYLES } from "@/shared/constants/gradients";
import { ScoringStatCard } from "./ScoringStats";
import {
  computeRankings,
  getPostDefenseList,
  setRevisionWindow,
  updateRank,
  type PostDefenseRow,
} from "../services";

const C = {
  blue: "#2a78d6",
  orange: "#eb6834",
  green: "#1baf7a",
  yellow: "#eda100",
  red: "#e34948",
  silver: "#64748b",
};

function studentName(row: PostDefenseRow) {
  if (!row.student) return "-";
  return [row.student.lastName, row.student.middleName, row.student.firstName]
    .filter(Boolean)
    .join(" ");
}

function effectiveRank(row: PostDefenseRow) {
  return row.rankOverride ?? row.rank;
}

function medalColor(rank: number) {
  if (rank === 1) return C.yellow;
  if (rank === 2) return C.silver;
  if (rank === 3) return C.orange;
  return null;
}

function RankBadge({ rank }: { rank: number | null }) {
  if (rank == null) {
    return (
      <Typography variant="body2" color="text.secondary">
        —
      </Typography>
    );
  }
  const color = medalColor(rank);
  return (
    <Box
      sx={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 800,
        fontSize: 13,
        bgcolor: color ? `${color}22` : "action.hover",
        color: color ?? "text.secondary",
        border: "1.5px solid",
        borderColor: color ?? "divider",
      }}
    >
      {rank}
    </Box>
  );
}

function formatDeadline(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function PostDefenseRankingPage() {
  const router = useRouter();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const ink = theme.palette.text.primary;
  const muted = theme.palette.text.secondary;
  const cardSx = {
    p: 2.5,
    borderRadius: 3,
    border: "1px solid",
    borderColor: "divider",
    bgcolor: isDark ? "#1e293b" : "background.paper",
    backgroundImage: isDark ? GRADIENT_STYLES.darkGradient : "none",
    boxShadow: isDark ? "none" : "0 1px 3px rgba(0,0,0,0.06)",
    height: "100%",
  };

  const [loading, setLoading] = useState(true);
  const [ranking, setRanking] = useState(false);
  const [rows, setRows] = useState<PostDefenseRow[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
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
      Number.isNaN(d.getTime())
        ? ""
        : `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`,
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

  const rankedCount = rows.filter((r) => effectiveRank(r) != null).length;
  const unrankedCount = rows.filter((r) => effectiveRank(r) == null).length;
  const submittedCount = rows.filter((r) => r.latestRevisionFile).length;
  const pendingRev = rows.length - submittedCount;

  const top3 = useMemo(() => {
    return [1, 2, 3]
      .map((n) => rows.find((r) => effectiveRank(r) === n) ?? null)
      .filter((r): r is PostDefenseRow => r != null);
  }, [rows]);

  const filtered = useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.toLowerCase();
    return rows.filter(
      (r) =>
        studentName(r).toLowerCase().includes(q) ||
        r.projectCode.toLowerCase().includes(q) ||
        r.projectName.toLowerCase().includes(q) ||
        (r.student?.studentId ?? "").toLowerCase().includes(q) ||
        (r.student?.className ?? "").toLowerCase().includes(q),
    );
  }, [rows, search]);

  const podiumOrder = useMemo(() => {
    const byRank = (n: number) =>
      top3.find((r) => effectiveRank(r) === n) ?? null;
    return [byRank(2), byRank(1), byRank(3)];
  }, [top3]);

  const columns: Column<PostDefenseRow>[] = [
    {
      id: "rank",
      label: "Hạng",
      minWidth: 72,
      align: "center",
      format: (_, row) => <RankBadge rank={effectiveRank(row)} />,
    },
    {
      id: "student",
      label: "Sinh viên",
      minWidth: 200,
      format: (_, row) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {studentName(row)}
          </Typography>
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
          <Typography variant="caption" color="text.secondary" noWrap>
            {row.projectName}
          </Typography>
        </Box>
      ),
    },
    {
      id: "finalScore",
      label: "Điểm tổng",
      align: "center",
      format: (_, row) => (
        <Typography
          sx={{
            fontWeight: 800,
            color:
              row.finalScore != null && row.finalScore >= 9
                ? C.green
                : row.finalScore != null && row.finalScore >= 8
                  ? C.blue
                  : ink,
          }}
        >
          {row.finalScore != null ? row.finalScore.toFixed(2) : "—"}
        </Typography>
      ),
    },
    {
      id: "bonusScore",
      label: "Cộng",
      align: "center",
      format: (_, row) =>
        row.bonusScore ? (
          <Typography sx={{ fontWeight: 700, color: C.yellow }}>
            +{row.bonusScore}
          </Typography>
        ) : (
          <Typography variant="body2" color="text.secondary">
            —
          </Typography>
        ),
    },
    {
      id: "revision",
      label: "Chỉnh sửa hồ sơ",
      minWidth: 200,
      format: (_, row) => (
        <Box>
          {row.latestRevisionFile ? (
            <Chip
              size="small"
              label={row.latestRevisionFile}
              sx={{
                bgcolor: isDark ? "rgba(27,175,122,0.18)" : "#ecfdf5",
                color: C.green,
                fontWeight: 600,
                maxWidth: 180,
              }}
            />
          ) : (
            <Chip
              size="small"
              label="Chưa nộp"
              sx={{
                bgcolor: isDark ? "rgba(237,161,0,0.18)" : "#fffbeb",
                color: C.yellow,
                fontWeight: 600,
              }}
            />
          )}
          {row.revisionDeadline && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mt: 0.5 }}
            >
              Hạn {formatDeadline(row.revisionDeadline)}
            </Typography>
          )}
        </Box>
      ),
    },
    {
      id: "rankOverride",
      label: "Thủ công",
      format: (_, row) =>
        row.rankOverride ? (
          <Chip
            size="small"
            label={`Hạng ${row.rankOverride}`}
            sx={{
              bgcolor: isDark ? "rgba(74,58,167,0.2)" : "#f5f3ff",
              color: "#4a3aa7",
              fontWeight: 700,
            }}
          />
        ) : (
          <Typography variant="body2" color="text.secondary">
            —
          </Typography>
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

  const headerActions: HeaderAction[] = [
    {
      id: "refresh",
      icon: <RefreshCw size={16} />,
      label: "Làm mới",
      variant: "outlined",
      onClick: fetchRows,
    },
    {
      id: "print",
      icon: <Printer size={16} />,
      label: "In biểu mẫu",
      variant: "outlined",
      onClick: () => router.push("/scoring/post-defense/print"),
    },
    {
      id: "rank",
      icon: <Trophy size={16} />,
      label: ranking ? "Đang xếp hạng..." : "Xếp hạng theo điểm",
      variant: "contained",
      disabled: ranking,
      onClick: handleRank,
    },
  ];

  return (
    <>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(5, 1fr)",
          },
          gap: 2,
          mb: 2.5,
        }}
      >
        <ScoringStatCard
          label="Tổng sinh viên"
          value={total}
          subtext="Đã công bố điểm"
          icon={<Users size={18} />}
          iconColor={C.blue}
        />
        <ScoringStatCard
          label="Đã xếp hạng"
          value={rankedCount}
          subtext="Có thứ hạng trên bảng"
          icon={<Trophy size={18} />}
          iconColor={C.yellow}
        />
        <ScoringStatCard
          label="Chưa xếp hạng"
          value={unrankedCount}
          subtext="Cần chạy xếp hạng"
          icon={<Clock size={18} />}
          iconColor={C.orange}
        />
        <ScoringStatCard
          label="Đã nộp chỉnh sửa"
          value={submittedCount}
          subtext="Hồ sơ sau bảo vệ"
          icon={<CheckCircle size={18} />}
          iconColor={C.green}
        />
        <ScoringStatCard
          label="Chưa nộp hồ sơ"
          value={pendingRev}
          subtext="Cần đôn đốc sinh viên"
          icon={<AlertTriangle size={18} />}
          iconColor={C.red}
        />
      </Box>

      {top3.length > 0 && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1.15fr 1fr" },
            gap: 2,
            mb: 2.5,
            alignItems: "stretch",
          }}
        >
          {podiumOrder.map((row, i) => {
            if (!row) {
              return (
                <Box
                  key={`empty-${i}`}
                  sx={{ display: { xs: "none", md: "block" } }}
                />
              );
            }
            const rank = effectiveRank(row) ?? 0;
            const color = medalColor(rank) ?? C.blue;
            const isFirst = rank === 1;
            return (
              <Paper
                key={row.projectId}
                elevation={0}
                sx={{
                  ...cardSx,
                  p: isFirst ? 3 : 2.5,
                  borderColor: `${color}55`,
                  cursor: "pointer",
                  "&:hover": { borderColor: color },
                }}
                onClick={() => openOverride(row)}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      width: isFirst ? 44 : 36,
                      height: isFirst ? 44 : 36,
                      borderRadius: "50%",
                      bgcolor: `${color}22`,
                      color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {isFirst ? <Trophy size={22} /> : <Medal size={18} />}
                  </Box>
                  <Typography
                    sx={{
                      fontSize: 11,
                      fontWeight: 800,
                      letterSpacing: 0.6,
                      color,
                    }}
                  >
                    HẠNG {rank}
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: isFirst ? 20 : 16,
                    color: ink,
                    lineHeight: 1.3,
                  }}
                >
                  {studentName(row)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {row.student?.studentId} · {row.student?.className}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ mt: 1, color: muted, fontWeight: 600 }}
                  noWrap
                >
                  {row.projectCode}
                </Typography>
                <Typography
                  sx={{
                    mt: 1.5,
                    fontWeight: 800,
                    fontSize: isFirst ? 28 : 22,
                    color,
                    lineHeight: 1,
                  }}
                >
                  {row.finalScore != null ? row.finalScore.toFixed(2) : "—"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Điểm tổng kết
                </Typography>
              </Paper>
            );
          })}
        </Box>
      )}

      <Box sx={{ mb: 1.5 }}>
        <Typography sx={{ fontWeight: 700, fontSize: 16, color: ink }}>
          Bảng xếp hạng
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Sắp xếp theo điểm tổng. Đồng điểm: thư ký quyết định thứ hạng thủ
          công.
        </Typography>
      </Box>

      {loading && rows.length === 0 ? (
        <Paper elevation={0} sx={{ ...cardSx, py: 8, textAlign: "center" }}>
          <CircularProgress />
        </Paper>
      ) : (
        <DataTable
          columns={columns}
          rows={filtered}
          rowKey="projectId"
          actions={actions}
          headerActions={headerActions}
          loading={loading}
          showSearchInput
          searchValue={search}
          onSearchChange={setSearch}
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

      <Dialog
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title="Xếp hạng thủ công & hạn chỉnh sửa"
        description={
          selected
            ? `${studentName(selected)} · điểm ${selected.finalScore?.toFixed(2) ?? "—"}`
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
