"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { toast } from "sonner";
import { Card, CardContentDiv, CardHeader, Dialog } from "@/shared/components";
import {
  adjustMeetingScore,
  CommitteeRoleLabels,
  finalizeMeeting,
  getMeeting,
  ScoringStatusLabels,
  type CommitteeRole,
  type MeetingCommitteeScore,
  type MeetingDetail,
} from "../services";

function studentName(detail: MeetingDetail) {
  if (!detail.student) return "-";
  return [
    detail.student.lastName,
    detail.student.middleName,
    detail.student.firstName,
  ]
    .filter(Boolean)
    .join(" ");
}

function formatScore(value: number | null | undefined) {
  if (value === null || value === undefined) return "-";
  return value.toFixed(2);
}

interface DraftRow {
  score: string;
  notes: string;
  strengths: string;
  weaknesses: string;
}

export function CommitteeMeetingDetailPage({
  projectId,
}: {
  projectId: number;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [finalizing, setFinalizing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [detail, setDetail] = useState<MeetingDetail | null>(null);
  const [drafts, setDrafts] = useState<Record<number, DraftRow>>({});

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMeeting(projectId);
      setDetail(data);
      const next: Record<number, DraftRow> = {};
      data.committeeScores.forEach((row) => {
        next[row.id] = {
          score: row.score !== null ? String(row.score) : "",
          notes: row.notes ?? "",
          strengths: row.strengths ?? "",
          weaknesses: row.weaknesses ?? "",
        };
      });
      setDrafts(next);
    } catch {
      toast.error("Không thể tải phiên họp hội đồng");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    load();
  }, [load]);

  const updateDraft = (id: number, patch: Partial<DraftRow>) => {
    setDrafts((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  };

  const saveRow = async (row: MeetingCommitteeScore) => {
    const draft = drafts[row.id];
    const score = Number(draft?.score);
    if (Number.isNaN(score) || score < 0 || score > 10) {
      toast.error("Điểm phải từ 0 đến 10");
      return;
    }
    try {
      setSavingId(row.id);
      await adjustMeetingScore(row.id, {
        score,
        notes: draft.notes,
        strengths: draft.strengths,
        weaknesses: draft.weaknesses,
      });
      toast.success("Đã lưu điểm sau thống nhất");
      await load();
    } catch {
      toast.error("Không thể lưu điểm");
    } finally {
      setSavingId(null);
    }
  };

  const handleFinalize = async () => {
    try {
      setFinalizing(true);
      await finalizeMeeting(projectId);
      toast.success("Đã chốt điểm hội đồng");
      setConfirmOpen(false);
      await load();
    } catch (error) {
      const message =
        (error as { message?: string })?.message ||
        "Không thể chốt điểm hội đồng";
      toast.error(message);
    } finally {
      setFinalizing(false);
    }
  };

  if (loading && !detail) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!detail) {
    return <Alert severity="error">Không tìm thấy phiên họp hội đồng.</Alert>;
  }

  const missingScores = detail.committeeScores.filter((row) => {
    const value = drafts[row.id]?.score;
    return value === undefined || value === "" || Number.isNaN(Number(value));
  }).length;

  return (
    <Box>
      <Button
        variant="text"
        onClick={() => router.push("/scoring/meeting")}
        sx={{ mb: 2 }}
      >
        ← Danh sách họp hội đồng
      </Button>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContentDiv padding={2}>
              <Typography variant="caption" color="text.secondary">
                Đề tài
              </Typography>
              <Typography sx={{ fontWeight: 700 }}>
                {detail.projectCode}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {detail.projectName}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {studentName(detail)} · {detail.student?.studentId}
              </Typography>
            </CardContentDiv>
          </Card>
        </Grid>
        <Grid item xs={12} md={2}>
          <Card>
            <CardContentDiv padding={2}>
              <Typography variant="caption" color="text.secondary">
                Điểm GVHD
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color:
                    (detail.gvhdScore?.score ?? 0) < 4 ? "#ef4444" : "#22c55e",
                }}
              >
                {formatScore(detail.gvhdScore?.score)}
              </Typography>
            </CardContentDiv>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContentDiv padding={2}>
              <Typography variant="caption" color="text.secondary">
                TB hội đồng
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {formatScore(detail.defenseAverage)}
              </Typography>
            </CardContentDiv>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContentDiv padding={2}>
              <Typography variant="caption" color="text.secondary">
                Điểm tổng (GVHD + HĐ)/2
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {formatScore(detail.finalScorePreview)}
              </Typography>
              <Box sx={{ mt: 1 }}>
                {detail.isFinalized ? (
                  <Chip
                    size="small"
                    color={detail.isFinalPassed ? "success" : "error"}
                    label={
                      detail.isFinalPassed
                        ? "Đã chốt — Đạt"
                        : "Đã chốt — Không đạt"
                    }
                  />
                ) : (
                  <Chip size="small" color="warning" label="Chưa chốt" />
                )}
              </Box>
            </CardContentDiv>
          </Card>
        </Grid>
      </Grid>

      {detail.gvhdPassed === false && (
        <Alert severity="error" sx={{ mb: 3 }}>
          GVHD không đạt. Không thể chốt điểm hội đồng.
        </Alert>
      )}

      {!detail.isFinalized && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Hội đồng đối chiếu phiếu chấm độc lập, chỉnh điểm sau khi thống nhất,
          rồi nhấn OK để khóa kết quả.
        </Alert>
      )}

      <Card>
        <CardHeader
          title="Điểm thành viên hội đồng"
          subtitle="Có thể sửa điểm đã nộp cho đến khi nhấn OK"
        />
        <CardContentDiv padding={2}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {detail.committeeScores.map((row) => {
              const draft = drafts[row.id] ?? {
                score: "",
                notes: "",
                strengths: "",
                weaknesses: "",
              };
              const roleLabel = row.role
                ? CommitteeRoleLabels[row.role as CommitteeRole]
                : "Thành viên";
              return (
                <Box
                  key={row.id}
                  sx={{
                    p: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 2,
                      mb: 2,
                      flexWrap: "wrap",
                    }}
                  >
                    <Box>
                      <Typography sx={{ fontWeight: 600 }}>
                        {row.teacherName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {roleLabel} · {row.teacherCode}
                      </Typography>
                    </Box>
                    <Chip
                      size="small"
                      label={ScoringStatusLabels[row.status]}
                    />
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        label="Điểm"
                        type="number"
                        fullWidth
                        value={draft.score}
                        disabled={!row.canEdit}
                        inputProps={{ min: 0, max: 10, step: 0.1 }}
                        onChange={(e) =>
                          updateDraft(row.id, { score: e.target.value })
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={9}>
                      <TextField
                        label="Ghi chú"
                        fullWidth
                        value={draft.notes}
                        disabled={!row.canEdit}
                        onChange={(e) =>
                          updateDraft(row.id, { notes: e.target.value })
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Ưu điểm"
                        fullWidth
                        multiline
                        minRows={2}
                        value={draft.strengths}
                        disabled={!row.canEdit}
                        onChange={(e) =>
                          updateDraft(row.id, { strengths: e.target.value })
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Nhược điểm"
                        fullWidth
                        multiline
                        minRows={2}
                        value={draft.weaknesses}
                        disabled={!row.canEdit}
                        onChange={(e) =>
                          updateDraft(row.id, { weaknesses: e.target.value })
                        }
                      />
                    </Grid>
                  </Grid>
                  {row.canEdit && (
                    <Box
                      sx={{
                        mt: 2,
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Button
                        variant="outlined"
                        onClick={() => saveRow(row)}
                        disabled={savingId === row.id}
                      >
                        {savingId === row.id ? "Đang lưu..." : "Lưu điểm"}
                      </Button>
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>
        </CardContentDiv>
      </Card>

      {detail.canFinalize && (
        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            onClick={() => setConfirmOpen(true)}
            disabled={missingScores > 0 || detail.gvhdPassed === false}
          >
            OK — Chốt điểm
          </Button>
        </Box>
      )}

      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Chốt điểm hội đồng"
        description="Sau khi OK, điểm hội đồng sẽ bị khóa và không sửa được nữa."
        actions={
          <>
            <Button onClick={() => setConfirmOpen(false)}>Hủy</Button>
            <Button
              variant="contained"
              onClick={handleFinalize}
              disabled={finalizing}
            >
              {finalizing ? "Đang chốt..." : "OK"}
            </Button>
          </>
        }
      />
    </Box>
  );
}
