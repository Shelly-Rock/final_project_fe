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
  CommitteeRoleLabels,
  getTranscript,
  publishTranscript,
  updateBonusScore,
  type CommitteeRole,
  type TranscriptDetail,
} from "../services";

function studentName(detail: TranscriptDetail) {
  if (!detail.student) return "-";
  return [
    detail.student.lastName,
    detail.student.middleName,
    detail.student.firstName,
  ]
    .filter(Boolean)
    .join(" ");
}

export function ScorePublicationDetailPage({
  projectId,
}: {
  projectId: number;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [detail, setDetail] = useState<TranscriptDetail | null>(null);
  const [bonus, setBonus] = useState("0");
  const [bonusNote, setBonusNote] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getTranscript(projectId);
      setDetail(data);
      setBonus(String(data.bonusScore ?? 0));
      setBonusNote(data.bonusNote ?? "");
    } catch {
      toast.error("Không thể tải bảng điểm tổng hợp");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    load();
  }, [load]);

  const saveBonus = async () => {
    const value = Number(bonus);
    if (Number.isNaN(value) || value < 0 || value > 3) {
      toast.error("Điểm thưởng phải từ 0 đến 3");
      return;
    }
    try {
      setSaving(true);
      const data = await updateBonusScore(projectId, {
        bonusScore: value,
        bonusNote,
      });
      setDetail(data);
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
      const data = await publishTranscript(projectId);
      setDetail(data);
      setConfirmOpen(false);
      toast.success("Đã công bố bảng điểm cho sinh viên");
    } catch (error) {
      toast.error((error as Error).message || "Không thể công bố bảng điểm");
    } finally {
      setPublishing(false);
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
    return <Alert severity="error">Không tìm thấy bảng điểm tổng hợp.</Alert>;
  }

  return (
    <Box>
      <Button
        variant="text"
        onClick={() => router.push("/scoring/transcript")}
        sx={{ mb: 2 }}
      >
        ← Danh sách bảng điểm
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
                GVHD × 40%
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {detail.gvhdScore.toFixed(2)}
              </Typography>
              <Typography variant="caption">
                {(detail.gvhdScore * 0.4).toFixed(2)} điểm
              </Typography>
            </CardContentDiv>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContentDiv padding={2}>
              <Typography variant="caption" color="text.secondary">
                Phản biện ngoài × 20%
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {detail.externalScore.toFixed(2)}
              </Typography>
              <Typography variant="caption">
                {detail.externalTeacherName} ·{" "}
                {(detail.externalScore * 0.2).toFixed(2)} điểm
              </Typography>
            </CardContentDiv>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContentDiv padding={2}>
              <Typography variant="caption" color="text.secondary">
                3 thành viên × 40%
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {detail.othersAverage.toFixed(2)}
              </Typography>
              <Typography variant="caption">
                {(detail.othersAverage * 0.4).toFixed(2)} điểm
              </Typography>
            </CardContentDiv>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContentDiv padding={2}>
              <Typography variant="caption" color="text.secondary">
                Điểm trọng số
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {detail.weightedScore.toFixed(2)}
              </Typography>
            </CardContentDiv>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContentDiv padding={2}>
              <Typography variant="caption" color="text.secondary">
                Điểm cộng
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {detail.bonusScore.toFixed(2)}
              </Typography>
            </CardContentDiv>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContentDiv padding={2}>
              <Typography variant="caption" color="text.secondary">
                Điểm tổng (tối đa 10)
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {detail.finalScore.toFixed(2)}
              </Typography>
              <Box sx={{ mt: 1 }}>
                {detail.isPublished ? (
                  <Chip size="small" color="success" label="Đã công bố" />
                ) : (
                  <Chip size="small" color="warning" label="Chưa công bố" />
                )}
              </Box>
            </CardContentDiv>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mb: 3 }}>
        <Card>
          <CardHeader
            title="3 cột nhận xét hội đồng"
            subtitle="Ưu điểm, nhược điểm và ghi chú từ từng thành viên"
          />
          <CardContentDiv padding={2}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {detail.comments.map((row, index) => (
                <Box
                  key={`${row.teacherName}-${index}`}
                  sx={{
                    p: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                  }}
                >
                  <Typography sx={{ fontWeight: 600, mb: 1 }}>
                    {row.teacherName}
                    {row.role
                      ? ` · ${CommitteeRoleLabels[row.role as CommitteeRole]}`
                      : ""}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Typography variant="caption" color="text.secondary">
                        Ưu điểm
                      </Typography>
                      <Typography variant="body2">
                        {row.strengths || "-"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="caption" color="text.secondary">
                        Nhược điểm
                      </Typography>
                      <Typography variant="body2">
                        {row.weaknesses || "-"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="caption" color="text.secondary">
                        Nhận xét
                      </Typography>
                      <Typography variant="body2">
                        {row.notes || "-"}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              ))}
            </Box>
          </CardContentDiv>
        </Card>
      </Box>

      {detail.canAwardBonus && (
        <Box sx={{ mb: 3 }}>
          <Card>
            <CardHeader
              title="Điểm thưởng thư ký"
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
              <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
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

      {detail.canPublish && (
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" onClick={() => setConfirmOpen(true)}>
            Công bố bảng điểm
          </Button>
        </Box>
      )}

      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Công bố bảng điểm"
        description="Sinh viên sẽ thấy điểm tổng và 3 cột nhận xét hội đồng. Không sửa điểm thưởng sau khi công bố."
        actions={
          <>
            <Button onClick={() => setConfirmOpen(false)}>Hủy</Button>
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
