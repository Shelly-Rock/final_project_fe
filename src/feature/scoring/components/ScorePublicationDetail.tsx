"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  CheckCircle,
  Clock,
  Download,
  XCircle,
  AlertTriangle,
  Gavel,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContentDiv, CardHeader, Dialog } from "@/shared/components";
import {
  CommitteeRoleLabels,
  exportSummaryScoreSheetWord,
  finalizeMeeting,
  getTranscriptReview,
  publishTranscript,
  updateBonusScore,
  type CommitteeRole,
  type CommitteeSheetDetail,
  type GvhdSheetDetail,
  type ScoreSheetDetail,
  type TranscriptDetail,
  type TranscriptReview,
  getTranscript,
} from "../services";

// ─── Helpers ──────────────────────────────────────────────────
function fullName(
  s:
    | { lastName?: string; middleName?: string; firstName?: string }
    | null
    | undefined,
) {
  if (!s) return "—";
  return [s.lastName, s.middleName, s.firstName].filter(Boolean).join(" ");
}

function fmt(n: number | null | undefined) {
  return n == null ? "—" : n.toFixed(2);
}

function StatusChip({ status }: { status: string }) {
  const submitted = ["SUBMITTED", "PASSED", "FAILED"].includes(status);
  const failed = status === "FAILED";
  return (
    <Chip
      size="small"
      icon={
        submitted ? (
          failed ? (
            <XCircle size={12} />
          ) : (
            <CheckCircle size={12} />
          )
        ) : (
          <Clock size={12} />
        )
      }
      label={submitted ? (failed ? "Rớt" : "Đã nộp") : "Chờ nộp"}
      color={submitted ? (failed ? "error" : "success") : "default"}
      variant="outlined"
    />
  );
}

// ─── Score Sheet Card ──────────────────────────────────────────
function SheetCard({
  label,
  sheet,
  accent = false,
}: {
  label: string;
  sheet: ScoreSheetDetail | CommitteeSheetDetail | null;
  accent?: boolean;
}) {
  if (!sheet) {
    return (
      <Box
        sx={{
          p: 2,
          border: "1px dashed",
          borderColor: "divider",
          borderRadius: 2,
          opacity: 0.6,
        }}
      >
        <Typography variant="caption" color="text.secondary">
          {label} — Chưa được cấp phiếu
        </Typography>
      </Box>
    );
  }

  const isSubmitted = ["SUBMITTED", "PASSED", "FAILED"].includes(sheet.status);
  const isFailed =
    sheet.status === "FAILED" || (sheet.score !== null && sheet.score < 4);

  return (
    <Box
      sx={{
        p: 2,
        border: "1px solid",
        borderColor: accent ? "primary.main" : "divider",
        borderRadius: 2,
        bgcolor: accent ? "primary.50" : "background.paper",
        height: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 1,
        }}
      >
        <Box>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            {label}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {sheet.teacherName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {sheet.teacherCode}
          </Typography>
        </Box>
        <Box sx={{ textAlign: "right" }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              color: isFailed
                ? "error.main"
                : isSubmitted
                  ? "success.main"
                  : "text.disabled",
            }}
          >
            {fmt(sheet.score)}
          </Typography>
          <StatusChip status={sheet.status} />
        </Box>
      </Box>

      {isSubmitted && (sheet.strengths || sheet.weaknesses || sheet.notes) && (
        <>
          <Divider sx={{ my: 1 }} />
          <Grid container spacing={1}>
            {sheet.strengths && (
              <Grid item xs={12} sm={4}>
                <Typography
                  variant="caption"
                  color="success.main"
                  sx={{ fontWeight: 600 }}
                >
                  Ưu điểm
                </Typography>
                <Typography
                  variant="caption"
                  display="block"
                  color="text.secondary"
                >
                  {sheet.strengths}
                </Typography>
              </Grid>
            )}
            {sheet.weaknesses && (
              <Grid item xs={12} sm={4}>
                <Typography
                  variant="caption"
                  color="error.main"
                  sx={{ fontWeight: 600 }}
                >
                  Nhược điểm
                </Typography>
                <Typography
                  variant="caption"
                  display="block"
                  color="text.secondary"
                >
                  {sheet.weaknesses}
                </Typography>
              </Grid>
            )}
            {sheet.notes && (
              <Grid item xs={12} sm={4}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontWeight: 600 }}
                >
                  Nhận xét
                </Typography>
                <Typography
                  variant="caption"
                  display="block"
                  color="text.secondary"
                >
                  {sheet.notes}
                </Typography>
              </Grid>
            )}
          </Grid>
        </>
      )}
    </Box>
  );
}

// ─── Main Component ────────────────────────────────────────────
export function ScorePublicationDetailPage({
  projectId,
}: {
  projectId: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const facultyId = searchParams.get("facultyId") || undefined;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [confirmPublish, setConfirmPublish] = useState(false);
  const [confirmFinalize, setConfirmFinalize] = useState(false);

  // Review data (pre/post finalize)
  const [review, setReview] = useState<TranscriptReview | null>(null);
  // Detail data (post finalize only)
  const [detail, setDetail] = useState<TranscriptDetail | null>(null);
  const [bonus, setBonus] = useState("0");
  const [bonusNote, setBonusNote] = useState("");

  const isFinalized = review?.isFinalized ?? false;
  const readinessStatus = review?.readinessStatus;

  const backUrl = `/scoring/transcript${facultyId ? `?facultyId=${encodeURIComponent(facultyId)}` : ""}`;

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const reviewData = await getTranscriptReview(projectId);
      setReview(reviewData);

      // If finalized, also fetch the full transcript detail
      if (reviewData.isFinalized) {
        try {
          const detailData = await getTranscript(projectId);
          setDetail(detailData);
          setBonus(String(detailData.bonusScore ?? 0));
          setBonusNote(detailData.bonusNote ?? "");
        } catch {
          // detail not available yet, ok
        }
      }
    } catch {
      toast.error("Không thể tải dữ liệu phiếu chấm");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    load();
  }, [load]);

  // ── Actions ──
  const handleFinalize = async () => {
    try {
      setFinalizing(true);
      await finalizeMeeting(projectId);
      toast.success("Đã chốt điểm hội đồng thành công");
      setConfirmFinalize(false);
      await load();
    } catch (error) {
      toast.error((error as Error).message || "Không thể chốt điểm hội đồng");
    } finally {
      setFinalizing(false);
    }
  };

  const saveBonus = async () => {
    const value = Number(bonus);
    if (Number.isNaN(value) || value < 0 || value > 3) {
      toast.error("Điểm thưởng phải từ 0 đến 3");
      return;
    }
    try {
      setSaving(true);
      const updated = await updateBonusScore(projectId, {
        bonusScore: value,
        bonusNote,
      });
      setDetail(updated);
      toast.success("Đã lưu điểm thưởng");
    } catch (error) {
      toast.error((error as Error).message || "Không thể lưu điểm thưởng");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    try {
      setPublishing(true);
      const updated = await publishTranscript(projectId);
      setDetail(updated);
      setReview((prev) =>
        prev
          ? { ...prev, isPublished: true, readinessStatus: "PUBLISHED" }
          : prev,
      );
      setConfirmPublish(false);
      toast.success("Đã công bố bảng điểm cho sinh viên");
    } catch (error) {
      toast.error((error as Error).message || "Không thể công bố bảng điểm");
    } finally {
      setPublishing(false);
    }
  };

  const handleExportSummary = async () => {
    try {
      setExporting(true);
      const { blob } = await exportSummaryScoreSheetWord(projectId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Phieu_Tong_Hop_${review?.projectCode || projectId}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Đã xuất phiếu tổng hợp điểm");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Không thể xuất phiếu tổng hợp điểm",
      );
    } finally {
      setExporting(false);
    }
  };

  // ── Loading / Error ──
  if (loading && !review) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!review) {
    return <Alert severity="error">Không tìm thấy dữ liệu phiếu chấm.</Alert>;
  }

  // ── Readiness badge ──
  const readinessBadge: Record<
    string,
    {
      label: string;
      color: "default" | "warning" | "error" | "info" | "success";
    }
  > = {
    IN_PROGRESS: { label: "Đang chờ phiếu chấm", color: "warning" },
    BLOCKED_GVHD: { label: "Không đạt GVHD", color: "error" },
    AWAITING_FINALIZATION: { label: "Chờ chốt điểm", color: "warning" },
    READY: { label: "Sẵn sàng công bố", color: "info" },
    PUBLISHED: { label: "Đã công bố", color: "success" },
  };
  const badge = readinessBadge[readinessStatus ?? "IN_PROGRESS"];

  return (
    <Box>
      {/* ── Back button ── */}
      <Button
        variant="text"
        onClick={() => router.push(backUrl)}
        sx={{ mb: 2 }}
      >
        ← Danh sách bảng điểm
      </Button>

      {/* ── Header: project info + status ── */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          gap: 1,
          mb: 3,
          p: 2.5,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          bgcolor: "background.paper",
        }}
      >
        <Box>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontWeight: 600 }}
          >
            {review.projectCode}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
            {review.projectName}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Sinh viên: <strong>{fullName(review.student)}</strong>
            {review.student?.studentId ? ` · ${review.student.studentId}` : ""}
            {" · "}
            Lớp: <strong>{review.student?.className ?? "—"}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            GVHD: <strong>{review.supervisor.name}</strong> (
            {review.supervisor.code})
          </Typography>
        </Box>
        <Chip label={badge.label} color={badge.color} size="medium" />
      </Box>

      {/* ── Alert for AWAITING_FINALIZATION ── */}
      {readinessStatus === "AWAITING_FINALIZATION" && (
        <Alert
          severity="warning"
          icon={<AlertTriangle size={18} />}
          sx={{ mb: 3 }}
          action={
            <Button
              color="warning"
              variant="contained"
              size="small"
              startIcon={<Gavel size={14} />}
              onClick={() => setConfirmFinalize(true)}
              disabled={finalizing}
            >
              {finalizing ? "Đang chốt..." : "Chốt điểm hội đồng"}
            </Button>
          }
        >
          Tất cả phiếu chấm đã nộp đủ. Kiểm tra lại và chốt điểm hội đồng để
          tính điểm tổng hợp.
        </Alert>
      )}

      {/* ── SECTION 1: Phiếu GVHD ── */}
      <Box sx={{ mb: 3 }}>
        <Card>
          <CardHeader
            title="Phiếu điểm giảng viên hướng dẫn"
            subtitle="Giảng viên hướng dẫn · Trọng số 40%"
          />
          <CardContentDiv padding={2}>
            <SheetCard label="GVHD" sheet={review.gvhdSheet} accent />
          </CardContentDiv>
        </Card>
      </Box>

      {/* ── SECTION 2: Phiếu Phản biện ngoài ── */}
      <Box sx={{ mb: 3 }}>
        <Card>
          <CardHeader
            title="Phiếu điểm giảng viên phản biện ngoài"
            subtitle="Giảng viên phản biện ngoài · Trọng số 20%"
          />
          <CardContentDiv padding={2}>
            <SheetCard label="GVPB Ngoài" sheet={review.externalSheet} />
          </CardContentDiv>
        </Card>
      </Box>

      {/* ── SECTION 3: Phiếu Hội đồng (3 TV nội) ── */}
      <Box sx={{ mb: 3 }}>
        <Card>
          <CardHeader
            title="Phiếu điểm Hội đồng"
            subtitle={`3 thành viên nội bộ · Trọng số 40% · TB: ${fmt(review.internalAverage)}`}
          />
          <CardContentDiv padding={2}>
            {review.committeeSheets.length === 0 ? (
              <Typography color="text.secondary">
                Chưa có phiếu hội đồng nào
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {review.committeeSheets.map((sheet) => (
                  <Grid item xs={12} md={4} key={sheet.id}>
                    <SheetCard
                      label={
                        CommitteeRoleLabels[sheet.role as CommitteeRole] ??
                        sheet.role ??
                        ""
                      }
                      sheet={sheet}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </CardContentDiv>
        </Card>
      </Box>

      {/* ── SECTION 4: Điểm tổng hợp (chỉ khi đã finalize) ── */}
      {isFinalized && (
        <>
          <Box sx={{ mb: 3 }}>
            <Card>
              <CardHeader
                title="Tổng kết điểm"
                subtitle="Giảng viên hướng dẫn×40% + Giảng viên phản biện ngoài×20% + Hội đồng×40%"
              />
              <CardContentDiv padding={2}>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Box
                      sx={{
                        textAlign: "center",
                        p: 1.5,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Giảng viên hướng dẫn × 40%
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800 }}>
                        {fmt(review.gvhdSheet?.score)}
                      </Typography>
                      <Typography variant="caption" color="primary.main">
                        {review.gvhdSheet?.score != null
                          ? `= ${(review.gvhdSheet.score * 0.4).toFixed(2)}`
                          : ""}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box
                      sx={{
                        textAlign: "center",
                        p: 1.5,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Giảng viên phản biện ngoài × 20%
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800 }}>
                        {fmt(review.externalSheet?.score)}
                      </Typography>
                      <Typography variant="caption" color="primary.main">
                        {review.externalSheet?.score != null
                          ? `= ${(review.externalSheet.score * 0.2).toFixed(2)}`
                          : ""}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box
                      sx={{
                        textAlign: "center",
                        p: 1.5,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Hội đồng × 40%
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800 }}>
                        {fmt(review.internalAverage)}
                      </Typography>
                      <Typography variant="caption" color="primary.main">
                        {review.internalAverage != null
                          ? `= ${(review.internalAverage * 0.4).toFixed(2)}`
                          : ""}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box
                      sx={{
                        textAlign: "center",
                        p: 1.5,
                        border: "2px solid",
                        borderColor: "primary.main",
                        borderRadius: 2,
                        bgcolor: "primary.50",
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="primary.main"
                        sx={{ fontWeight: 700 }}
                      >
                        Điểm trọng số
                      </Typography>
                      <Typography
                        variant="h4"
                        sx={{ fontWeight: 900, color: "primary.main" }}
                      >
                        {fmt(detail?.weightedScore ?? review.weightedScore)}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                {/* Bonus + Final */}
                {(detail || review.finalScore != null) && (
                  <Box
                    sx={{ mt: 2, display: "flex", gap: 2, flexWrap: "wrap" }}
                  >
                    <Box
                      sx={{
                        flex: 1,
                        minWidth: 120,
                        p: 1.5,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                        textAlign: "center",
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Điểm cộng
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        +{fmt(detail?.bonusScore ?? review.bonusScore)}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        flex: 2,
                        minWidth: 160,
                        p: 1.5,
                        border: "2px solid",
                        borderColor: "success.main",
                        borderRadius: 2,
                        textAlign: "center",
                        bgcolor: "success.50",
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="success.main"
                        sx={{ fontWeight: 700 }}
                      >
                        Điểm tổng (tối đa 10)
                      </Typography>
                      <Typography
                        variant="h3"
                        sx={{ fontWeight: 900, color: "success.main" }}
                      >
                        {fmt(detail?.finalScore ?? review.finalScore)}
                      </Typography>
                      <Box sx={{ mt: 0.5 }}>
                        {review.isPublished ? (
                          <Chip
                            size="small"
                            color="success"
                            label="Đã công bố"
                          />
                        ) : (
                          <Chip
                            size="small"
                            color="warning"
                            label="Chưa công bố"
                          />
                        )}
                      </Box>
                    </Box>
                  </Box>
                )}
              </CardContentDiv>
            </Card>
          </Box>

          {/* ── Bonus score editor ── */}
          {detail?.canAwardBonus && (
            <Box sx={{ mb: 3 }}>
              <Card>
                <CardHeader
                  title="🎁 Điểm thưởng"
                  subtitle="Cộng tối đa 3 điểm sau khi tính trọng số"
                />
                <CardContentDiv padding={2}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        label="Điểm cộng"
                        type="number"
                        fullWidth
                        value={bonus}
                        inputProps={{ min: 0, max: 3, step: 0.1 }}
                        onChange={(e) => setBonus(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={9}>
                      <TextField
                        label="Lý do cộng điểm"
                        fullWidth
                        value={bonusNote}
                        onChange={(e) => setBonusNote(e.target.value)}
                      />
                    </Grid>
                  </Grid>
                  <Box
                    sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}
                  >
                    <Button
                      variant="outlined"
                      onClick={saveBonus}
                      disabled={saving}
                    >
                      {saving ? "Đang lưu..." : "Lưu điểm cộng"}
                    </Button>
                  </Box>
                </CardContentDiv>
              </Card>
            </Box>
          )}
        </>
      )}

      {/* ── Action buttons ── */}
      <Box
        sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, mt: 2 }}
      >
        {isFinalized && (
          <Tooltip title={!isFinalized ? "Cần chốt điểm trước" : ""}>
            <span>
              <Button
                variant="outlined"
                startIcon={<Download size={16} />}
                onClick={handleExportSummary}
                disabled={exporting || !isFinalized}
              >
                {exporting ? "Đang xuất..." : "Xuất phiếu tổng hợp"}
              </Button>
            </span>
          </Tooltip>
        )}
        {detail?.canPublish && (
          <Button
            variant="contained"
            color="success"
            onClick={() => setConfirmPublish(true)}
          >
            Công bố bảng điểm
          </Button>
        )}
      </Box>

      {/* ── Confirm Finalize Dialog ── */}
      <Dialog
        open={confirmFinalize}
        onClose={() => setConfirmFinalize(false)}
        title="Chốt điểm hội đồng"
        description={`Xác nhận chốt điểm cho đề tài "${review.projectName}"? Sau khi chốt, điểm của tất cả thành viên hội đồng sẽ được khóa và điểm tổng hợp sẽ được tính toán.`}
        actions={
          <>
            <Button onClick={() => setConfirmFinalize(false)}>Hủy</Button>
            <Button
              variant="contained"
              color="warning"
              onClick={handleFinalize}
              disabled={finalizing}
            >
              {finalizing ? "Đang chốt..." : "Xác nhận chốt điểm"}
            </Button>
          </>
        }
      />

      {/* ── Confirm Publish Dialog ── */}
      <Dialog
        open={confirmPublish}
        onClose={() => setConfirmPublish(false)}
        title="Công bố bảng điểm"
        description="Sinh viên sẽ thấy điểm tổng và nhận xét từ hội đồng. Không thể sửa điểm thưởng sau khi công bố."
        actions={
          <>
            <Button onClick={() => setConfirmPublish(false)}>Hủy</Button>
            <Button
              variant="contained"
              onClick={handlePublish}
              disabled={publishing}
            >
              {publishing ? "Đang công bố..." : "Công bố"}
            </Button>
          </>
        }
      />
    </Box>
  );
}
