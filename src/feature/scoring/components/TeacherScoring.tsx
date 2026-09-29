import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Typography,
  Grid,
  Tabs,
  Tab,
  CircularProgress,
  Chip,
  Alert,
} from "@mui/material";
import { Card, CardHeader, CardContentDiv } from "@/shared/components";
import { DataTable } from "@/shared/components";
import {
  CheckCircle,
  Clock,
  FileText,
  XCircle,
  AlertTriangle,
  Lock,
} from "lucide-react";
import {
  getMyScores,
  getMyStats,
  submitMyScore,
  updateMyScore,
  exportMyScoreWord,
  ScoringStats,
  Score,
  ScoringTypeLabels,
} from "../services";
import { toast } from "sonner";
import ScoringGroupDialog, {
  type SaveScorePayload,
  type ScoreGroup,
} from "./ScoringGroupDialog";

export default function TeacherScoringPage() {
  const [stats, setStats] = useState<ScoringStats | null>(null);
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"pending" | "submitted">(
    "pending",
  );
  const [selectedGroup, setSelectedGroup] = useState<ScoreGroup | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [scoresRes, statsRes] = await Promise.all([
        getMyScores({ page: 1, limit: 100 }), // Get all to group
        getMyStats(),
      ]);
      setScores(scoresRes.data || []);
      setStats(statsRes);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const groups = useMemo(() => {
    const map = new Map<string, ScoreGroup>();
    scores.forEach((s) => {
      const key = `${s.projectId}_${s.scoringType}_${s.role || ""}`;
      if (!map.has(key)) {
        map.set(key, {
          projectId: s.projectId,
          scoringType: s.scoringType,
          role: s.role,
          project: s.project ?? null,
          scores: [],
          isFullySubmitted: false,
          isLocked: s.isLocked,
          lockedReason: s.lockedReason,
        });
      }
      map.get(key)!.scores.push(s);
    });

    return Array.from(map.values()).map((g) => ({
      ...g,
      isFullySubmitted: g.scores.every(
        (s) =>
          s.status === "SUBMITTED" ||
          s.status === "PASSED" ||
          s.status === "FAILED",
      ),
    }));
  }, [scores]);

  const pendingGroups = groups.filter((g) => !g.isFullySubmitted);
  const submittedGroups = groups.filter((g) => g.isFullySubmitted);
  const displayGroups =
    activeTab === "pending" ? pendingGroups : submittedGroups;

  const getStatusBadge = (isFullySubmitted: boolean) => {
    if (isFullySubmitted) {
      return <Chip label="Đã nộp đủ" color="success" size="small" />;
    }
    return <Chip label="Đang chờ/Đang chấm" color="warning" size="small" />;
  };

  const getDaysRemaining = (deadline: string | null) => {
    if (!deadline) return null;
    const today = new Date();
    const target = new Date(deadline);
    const diff = target.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  };

  const handleSaveDraft = async (
    scoreId: number,
    payload: SaveScorePayload,
  ) => {
    await updateMyScore(scoreId, payload);
    await fetchData(); // refresh data silently

    // update current group score in state temporarily to avoid closing dialog
    if (selectedGroup) {
      const updatedScores = selectedGroup.scores.map((s) =>
        s.id === scoreId
          ? { ...s, ...payload, status: "IN_PROGRESS" as const }
          : s,
      );
      setSelectedGroup({ ...selectedGroup, scores: updatedScores });
    }
  };

  const handleSubmitScore = async (
    scoreId: number,
    payload: SaveScorePayload,
  ) => {
    await submitMyScore(scoreId, payload);
    await fetchData();

    if (selectedGroup) {
      const updatedScores = selectedGroup.scores.map((s) =>
        s.id === scoreId
          ? { ...s, ...payload, status: "SUBMITTED" as const }
          : s,
      );
      setSelectedGroup({ ...selectedGroup, scores: updatedScores });
    }
  };

  const handleExportScore = async (scoreId: number) => {
    try {
      const { blob } = await exportMyScoreWord(scoreId);
      const downloadBlob = new Blob([blob], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      const url = window.URL.createObjectURL(downloadBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Phieu_Cham_Diem_${scoreId}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          Chấm điểm khóa luận
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Quản lý các phiếu chấm điểm được phân công cho bạn
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardHeader
              title="Tổng phiếu cần chấm"
              action={<FileText size={20} color="#64748b" />}
            />
            <CardContentDiv padding={2}>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {stats?.total || 0}
              </Typography>
            </CardContentDiv>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardHeader
              title="Chưa hoàn thành"
              action={<Clock size={20} color="#f59e0b" />}
            />
            <CardContentDiv padding={2}>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: "#f59e0b" }}
              >
                {stats?.pending || 0}
              </Typography>
            </CardContentDiv>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardHeader
              title="Đã nộp"
              action={<CheckCircle size={20} color="#22c55e" />}
            />
            <CardContentDiv padding={2}>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: "#22c55e" }}
              >
                {stats?.submitted || 0}
              </Typography>
            </CardContentDiv>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardHeader
              title="Bị rớt"
              action={<XCircle size={20} color="#ef4444" />}
            />
            <CardContentDiv padding={2}>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: "#ef4444" }}
              >
                {stats?.failed || 0}
              </Typography>
            </CardContentDiv>
          </Card>
        </Grid>
      </Grid>

      {/* Rules Alert */}
      <Alert severity="warning" sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
          <AlertTriangle size={20} color="#ed6c02" />
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Quy tắc điểm liệt:
            </Typography>
            <Typography variant="body2" component="ul" sx={{ pl: 2, mt: 0.5 }}>
              <Typography component="li" variant="body2">
                <strong>GVHD:</strong> Nếu chấm dưới 4 điểm, đề tài bị loại ngay
                lập tức
              </Typography>
              <Typography component="li" variant="body2">
                <strong>Hội đồng:</strong> Nếu bất kỳ thành viên nào chấm dưới 4
                điểm, sinh viên bị loại
              </Typography>
            </Typography>
          </Box>
        </Box>
      </Alert>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={activeTab === "pending" ? 0 : 1}
          onChange={(_, v) => setActiveTab(v === 0 ? "pending" : "submitted")}
        >
          <Tab label={`Chưa chấm (${pendingGroups.length})`} />
          <Tab label={`Đã nộp đủ (${submittedGroups.length})`} />
        </Tabs>
      </Box>

      <Box>
        {displayGroups.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8, color: "text.secondary" }}>
            Không có đề tài nào trong mục này
          </Box>
        ) : (
          <DataTable
            columns={[
              {
                id: "project",
                label: "Đề tài",
                minWidth: 200,
                format: (_, row) => (
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {row.project?.projectCode || row.project?.projectId}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {row.project?.projectName}
                    </Typography>
                  </Box>
                ),
              },
              {
                id: "scoringType",
                label: "Loại chấm",
                format: (_, row) =>
                  `${ScoringTypeLabels[row.scoringType as keyof typeof ScoringTypeLabels]}${
                    row.role ? ` - ${row.role}` : ""
                  }`,
              },
              {
                id: "students",
                label: "Số SV",
                format: (_, row) => (
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {row.scores.length}
                  </Typography>
                ),
              },
              {
                id: "deadline",
                label: "Thời hạn",
                format: (_, row) => {
                  const deadline = row.scores[0]?.deadline;
                  const daysRemaining = getDaysRemaining(deadline);
                  return daysRemaining !== null ? (
                    <Chip
                      label={
                        daysRemaining <= 0 ? "Quá hạn" : `${daysRemaining} ngày`
                      }
                      color={
                        daysRemaining <= 0
                          ? "error"
                          : daysRemaining <= 1
                            ? "warning"
                            : "default"
                      }
                      size="small"
                    />
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      -
                    </Typography>
                  );
                },
              },
              {
                id: "status",
                label: "Trạng thái",
                format: (_, row) => getStatusBadge(row.isFullySubmitted),
              },
            ]}
            rows={displayGroups}
            rowKey="projectId"
            actions={[
              {
                id: "score",
                icon: (row) =>
                  row.isLocked ? <Lock size={16} /> : <FileText size={16} />,
                label: (row) => {
                  if (row.isLocked) return row.lockedReason || "Bị khóa";
                  return activeTab === "pending" ? "Chấm điểm" : "Xem chi tiết";
                },
                onClick: (row) => !row.isLocked && setSelectedGroup(row),
                color: (row) =>
                  row.isLocked
                    ? "inherit"
                    : activeTab === "pending"
                      ? "primary"
                      : "secondary",
                disabled: (row) => !!row.isLocked,
              },
            ]}
            showSearchInput={false}
            showFilterButton={false}
            showExportButton={false}
            showImportButton={false}
            emptyMessage="Không có dữ liệu"
          />
        )}
      </Box>

      <ScoringGroupDialog
        open={!!selectedGroup}
        group={selectedGroup}
        onClose={() => {
          setSelectedGroup(null);
          fetchData(); // refresh in case we saved draft and closed
        }}
        onSaveDraft={handleSaveDraft}
        onSubmitScore={handleSubmitScore}
        onExport={handleExportScore}
      />
    </Box>
  );
}
