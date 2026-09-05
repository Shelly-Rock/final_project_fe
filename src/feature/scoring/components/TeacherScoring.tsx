"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Grid,
  Tabs,
  Tab,
  CircularProgress,
  Chip,
  Alert,
  TextField,
  Button as MuiButton,
} from "@mui/material";
import { Card, CardHeader, CardContentDiv } from "@/shared/components";
import { DataTable } from "@/shared/components";
import { Dialog } from "@/shared/components";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Loader2,
  XCircle,
  AlertTriangle,
  BookOpen,
} from "lucide-react";
import {
  getMyScores,
  getMyStats,
  submitMyScore,
  updateMyScore,
  ScoringStatus,
  ScoringStats,
  Score,
  ScoringTypeLabels,
  ScoringStatusLabels,
  ScoringCriteria,
} from "../services";
import { toast } from "sonner";

export default function TeacherScoringPage() {
  const [stats, setStats] = useState<ScoringStats | null>(null);
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"pending" | "submitted">(
    "pending",
  );
  const [selectedScore, setSelectedScore] = useState<Score | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Scoring form state
  const [scoreValue, setScoreValue] = useState<number>(0);
  const [criteriaScores, setCriteriaScores] = useState<Record<string, number>>(
    {},
  );
  const [notes, setNotes] = useState("");
  const [strengths, setStrengths] = useState("");
  const [weaknesses, setWeaknesses] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsData, scoresData] = await Promise.all([
        getMyStats(),
        getMyScores({ limit: 100 }),
      ]);
      setStats(statsData);
      setScores(scoresData.data);
    } catch {
      toast.error("Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredScores = scores.filter((s) => {
    if (activeTab === "pending") {
      return s.status === "PENDING" || s.status === "IN_PROGRESS";
    }
    return (
      s.status === "SUBMITTED" || s.status === "FAILED" || s.status === "PASSED"
    );
  });

  const openScoreDialog = (score: Score) => {
    setSelectedScore(score);
    setScoreValue(score.score || 0);
    setCriteriaScores(score.criteriaScores || {});
    setNotes(score.notes || "");
    setStrengths(score.strengths || "");
    setWeaknesses(score.weaknesses || "");
  };

  const calculateTotalScore = () => {
    return ScoringCriteria.reduce(
      (sum: number, c: { key: string; weight: number }) => {
        const score = criteriaScores[c.key] || 0;
        return sum + score * (c.weight / 100);
      },
      0,
    );
  };

  const handleSubmitScore = async () => {
    if (!selectedScore) return;

    if (scoreValue < 4) {
      toast.warning("Điểm dưới 4 - Sinh viên sẽ bị loại khỏi Hội đồng!", {
        duration: 5000,
      });
    }

    try {
      setIsSubmitting(true);
      await submitMyScore(selectedScore.id, {
        score: scoreValue,
        criteriaScores,
        notes,
        strengths,
        weaknesses,
      });
      toast.success("Nộp phiếu chấm thành công!");
      setSelectedScore(null);
      fetchData();
    } catch {
      toast.error("Không thể nộp phiếu chấm");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!selectedScore) return;

    try {
      setIsSubmitting(true);
      await updateMyScore(selectedScore.id, {
        score: scoreValue,
        criteriaScores,
        notes,
        strengths,
        weaknesses,
        status: "IN_PROGRESS",
      });
      toast.success("Lưu nháp thành công!");
      setSelectedScore(null);
      fetchData();
    } catch {
      toast.error("Không thể lưu nháp");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: ScoringStatus) => {
    const colorMap: Record<
      ScoringStatus,
      | "default"
      | "primary"
      | "secondary"
      | "error"
      | "info"
      | "success"
      | "warning"
    > = {
      PENDING: "default",
      IN_PROGRESS: "warning",
      SUBMITTED: "success",
      FAILED: "error",
      PASSED: "success",
    };
    return (
      <Chip
        label={ScoringStatusLabels[status]}
        color={colorMap[status]}
        size="small"
      />
    );
  };

  const getDaysRemaining = (deadline: string | null) => {
    if (!deadline) return null;
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const days = Math.ceil(
      (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );
    return days;
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: "1400px", mx: "auto", py: 4, px: 2 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
          Phiếu chấm điểm độc lập
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Chấm điểm đề tài khóa luận của sinh viên
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardHeader
              title="Tổng số phiếu"
              action={<BookOpen size={20} color="#64748b" />}
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
              title="Chưa chấm"
              action={<Clock size={20} color="#f97316" />}
            />
            <CardContentDiv padding={2}>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: "#f97316" }}
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
          <Tab label={`Chưa chấm (${stats?.pending || 0})`} />
          <Tab label={`Đã nộp (${stats?.submitted || 0})`} />
        </Tabs>
      </Box>

      {activeTab === "pending" && (
        <Card>
          <CardHeader
            title="Danh sách phiếu chấm"
            subtitle="Danh sách các đề tài cần được chấm điểm"
          />
          <CardContentDiv padding={2}>
            {filteredScores.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 8, color: "text.secondary" }}>
                Không có phiếu chấm nào cần xử lý
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
                    id: "student",
                    label: "Sinh viên",
                    minWidth: 150,
                    format: (_, row) => (
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {row.student?.firstName} {row.student?.middleName}{" "}
                          {row.student?.lastName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {row.student?.studentId}
                        </Typography>
                      </Box>
                    ),
                  },
                  {
                    id: "scoringType",
                    label: "Loại",
                    format: (_, row) =>
                      `${ScoringTypeLabels[row.scoringType]}${row.role ? ` - ${row.role}` : ""}`,
                  },
                  {
                    id: "deadline",
                    label: "Thời hạn",
                    format: (_, row) => {
                      const daysRemaining = getDaysRemaining(row.deadline);
                      return daysRemaining !== null ? (
                        <Chip
                          label={
                            daysRemaining <= 0
                              ? "Quá hạn"
                              : `${daysRemaining} ngày`
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
                      ) : null;
                    },
                  },
                  {
                    id: "status",
                    label: "Trạng thái",
                    format: (_, row) => getStatusBadge(row.status),
                  },
                ]}
                rows={filteredScores}
                rowKey="id"
                actions={[
                  {
                    id: "score",
                    icon: <FileText size={16} />,
                    label: "Chấm điểm",
                    onClick: (row) => openScoreDialog(row),
                    color: "primary",
                  },
                ]}
                showSearchInput={false}
                showFilterButton={false}
                showExportButton={false}
                showImportButton={false}
                emptyMessage="Không có dữ liệu"
              />
            )}
          </CardContentDiv>
        </Card>
      )}

      {activeTab === "submitted" && (
        <Card>
          <CardHeader
            title="Đã nộp"
            subtitle="Danh sách các phiếu chấm đã nộp"
          />
          <CardContentDiv padding={2}>
            {filteredScores.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 8, color: "text.secondary" }}>
                Chưa có phiếu chấm nào được nộp
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
                          {row.project?.projectCode}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {row.project?.projectName}
                        </Typography>
                      </Box>
                    ),
                  },
                  {
                    id: "student",
                    label: "Sinh viên",
                    format: (_, row) =>
                      `${row.student?.firstName} ${row.student?.middleName} ${row.student?.lastName}`,
                  },
                  {
                    id: "scoringType",
                    label: "Loại",
                    format: (_, row) => ScoringTypeLabels[row.scoringType],
                  },
                  {
                    id: "score",
                    label: "Điểm",
                    format: (_, row) =>
                      row.score !== null ? (
                        <Typography
                          sx={{
                            fontWeight: 600,
                            color: row.score < 4 ? "#ef4444" : "#22c55e",
                          }}
                        >
                          {row.score}/10
                        </Typography>
                      ) : (
                        "-"
                      ),
                  },
                  {
                    id: "status",
                    label: "Trạng thái",
                    format: (_, row) => getStatusBadge(row.status),
                  },
                  {
                    id: "submittedAt",
                    label: "Ngày nộp",
                    format: (_, row) =>
                      row.submittedAt
                        ? new Date(row.submittedAt).toLocaleDateString("vi-VN")
                        : "-",
                  },
                ]}
                rows={filteredScores}
                rowKey="id"
                showSearchInput={false}
                showFilterButton={false}
                showExportButton={false}
                showImportButton={false}
                emptyMessage="Không có dữ liệu"
              />
            )}
          </CardContentDiv>
        </Card>
      )}

      {/* Score Dialog */}
      <Dialog
        open={!!selectedScore}
        onClose={() => setSelectedScore(null)}
        title="Phiếu chấm điểm"
        description={selectedScore?.project?.projectName}
        size="lg"
      >
        {selectedScore && (
          <Box sx={{ mt: 2 }}>
            {/* Project Info */}
            <Grid
              container
              spacing={2}
              sx={{
                mb: 3,
                p: 2,
                bgcolor: "background.default",
                borderRadius: 1,
              }}
            >
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">
                  Mã đề tài
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {selectedScore.project?.projectCode}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">
                  Sinh viên
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {selectedScore.student?.firstName}{" "}
                  {selectedScore.student?.middleName}{" "}
                  {selectedScore.student?.lastName}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">
                  Loại chấm
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {ScoringTypeLabels[selectedScore.scoringType]}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">
                  Thời hạn
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {selectedScore.deadline
                    ? new Date(selectedScore.deadline).toLocaleDateString(
                        "vi-VN",
                      )
                    : "Không có"}
                </Typography>
              </Grid>
            </Grid>

            {/* Criteria Scores */}
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Tiêu chí chấm điểm
            </Typography>
            <Box sx={{ mb: 3 }}>
              {ScoringCriteria.map(
                (criteria: {
                  key: string;
                  label: string;
                  description: string;
                  weight: number;
                }) => (
                  <Box
                    key={criteria.key}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {criteria.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ({criteria.weight}%)
                      </Typography>
                    </Box>
                    <TextField
                      type="number"
                      inputProps={{ min: 0, max: 10, step: 0.5 }}
                      value={criteriaScores[criteria.key] || ""}
                      onChange={(e) =>
                        setCriteriaScores({
                          ...criteriaScores,
                          [criteria.key]: parseFloat(e.target.value) || 0,
                        })
                      }
                      sx={{ width: 80 }}
                      size="small"
                    />
                    <Typography variant="body2" color="text.secondary">
                      /10
                    </Typography>
                  </Box>
                ),
              )}
            </Box>

            {/* Overall Score */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 2,
                bgcolor: "primary.main",
                color: "primary.contrastText",
                borderRadius: 1,
                mb: 3,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Tổng điểm
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {calculateTotalScore()}/10
                </Typography>
                {calculateTotalScore() < 4 && (
                  <Chip label="ĐIỂM LIỆT" color="error" size="small" />
                )}
              </Box>
            </Box>

            {/* Manual Score Override */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <Typography variant="body2" sx={{ flex: 1, fontWeight: 600 }}>
                Hoặc nhập điểm trực tiếp
              </Typography>
              <TextField
                type="number"
                inputProps={{ min: 0, max: 10, step: 0.5 }}
                value={scoreValue}
                onChange={(e) => setScoreValue(parseFloat(e.target.value) || 0)}
                sx={{ width: 80 }}
                size="small"
              />
            </Box>

            {/* Feedback */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Điểm mạnh
              </Typography>
              <TextField
                multiline
                rows={3}
                fullWidth
                value={strengths}
                onChange={(e) => setStrengths(e.target.value)}
                placeholder="Nhận xét về điểm mạnh của đề tài..."
                size="small"
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Điểm yếu / Cần cải thiện
              </Typography>
              <TextField
                multiline
                rows={3}
                fullWidth
                value={weaknesses}
                onChange={(e) => setWeaknesses(e.target.value)}
                placeholder="Nhận xét về điểm yếu cần cải thiện..."
                size="small"
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Ghi chú thêm
              </Typography>
              <TextField
                multiline
                rows={2}
                fullWidth
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ghi chú khác..."
                size="small"
              />
            </Box>
          </Box>
        )}

        <Box
          sx={{ display: "flex", gap: 1, justifyContent: "flex-end", mt: 2 }}
        >
          <MuiButton variant="outlined" onClick={() => setSelectedScore(null)}>
            Đóng
          </MuiButton>
          <MuiButton
            variant="outlined"
            onClick={handleSaveDraft}
            disabled={isSubmitting}
          >
            Lưu nháp
          </MuiButton>
          <MuiButton
            variant={scoreValue < 4 ? "contained" : "contained"}
            onClick={handleSubmitScore}
            disabled={isSubmitting || scoreValue === 0}
            color={scoreValue < 4 ? "error" : "primary"}
            startIcon={
              isSubmitting ? (
                <Loader2 className="animate-spin" size={16} />
              ) : scoreValue < 4 ? (
                <AlertCircle size={16} />
              ) : null
            }
          >
            {isSubmitting
              ? "Đang xử lý..."
              : scoreValue < 4
                ? "Nộp (Sinh viên sẽ bị loại)"
                : "Nộp phiếu chấm"}
          </MuiButton>
        </Box>
      </Dialog>
    </Box>
  );
}
