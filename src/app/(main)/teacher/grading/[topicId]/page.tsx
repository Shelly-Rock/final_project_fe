"use client";

import { useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Alert,
  Snackbar,
  Divider,
  Grid,
  IconButton,
} from "@mui/material";
import {
  ArrowBack as BackIcon,
  Save as SaveIcon,
  Send as SendIcon,
  CheckCircle as DoneIcon,
} from "@mui/icons-material";
import { CountdownTimer } from "@/shared/components/CountdownTimer";

const GRADING_DEADLINE = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

interface ThesisInfo {
  id: string;
  title: string;
  studentName: string;
  mssv: string;
  lecturer: string;
}

interface ScoreEntry {
  criteriaId: string;
  label: string;
  description: string;
  maxScore: number;
  score: number | null;
  comment: string;
}

const GRADING_CRITERIA: ScoreEntry[] = [
  { criteriaId: "c1", label: "Nội dung & Khoa học", description: "Đánh giá tính khoa học, độ sâu, phạm vi nghiên cứu", maxScore: 25, score: null, comment: "" },
  { criteriaId: "c2", label: "Phương pháp nghiên cứu", description: "Phương pháp áp dụng phù hợp, có căn cứ khoa học", maxScore: 20, score: null, comment: "" },
  { criteriaId: "c3", label: "Kết quả & Thực nghiệm", description: "Kết quả đạt được, tính khả thi, thực nghiệm", maxScore: 25, score: null, comment: "" },
  { criteriaId: "c4", label: "Trình bày & Văn phong", description: "Bố cục, văn phong, hình thức trình bày luận văn", maxScore: 15, score: null, comment: "" },
  { criteriaId: "c5", label: "Đóng góp & Ứng dụng", description: "Tính mới, đóng góp khoa học, khả năng ứng dụng thực tiễn", maxScore: 15, score: null, comment: "" },
];

const mockThesis: ThesisInfo = {
  id: "t1",
  title: "Ứng dụng AI trong y tế — Hệ thống chẩn đoán ung thư phổi",
  studentName: "Nguyễn Văn Minh",
  mssv: "CN200101",
  lecturer: "TS. Nguyễn Văn A",
};

export default function TeacherGradingPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.topicId as string;

  const [scores, setScores] = useState<ScoreEntry[]>(GRADING_CRITERIA);
  const [generalComment, setGeneralComment] = useState("");
  const [saved, setSaved] = useState(false);
  const [sent, setSent] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" });

  const totalScore = scores.reduce((sum, s) => sum + (s.score ?? 0), 0);
  const maxTotal = scores.reduce((sum, s) => sum + s.maxScore, 0);
  const percentage = Math.round((totalScore / maxTotal) * 100);
  const hasAllScores = scores.every((s) => s.score !== null);
  const hasComments = scores.every((s) => s.comment.trim().length > 0) && generalComment.trim().length > 0;
  const canSubmit = hasAllScores && hasComments;

  const handleScoreChange = useCallback((id: string, value: number) => {
    setScores((prev) =>
      prev.map((s) => (s.criteriaId === id ? { ...s, score: value } : s))
    );
    setSaved(false);
  }, []);

  const handleCommentChange = useCallback((id: string, value: string) => {
    setScores((prev) =>
      prev.map((s) => (s.criteriaId === id ? { ...s, comment: value } : s))
    );
    setSaved(false);
  }, []);

  const handleSave = useCallback(() => {
    setSaved(true);
    setSnackbar({ open: true, message: "Đã lưu nháp!", severity: "success" });
  }, []);

  const handleSubmit = useCallback(() => {
    if (!canSubmit) return;
    setSent(true);
    setSnackbar({ open: true, message: "Đã gửi phiếu chấm! Kết quả sẽ được thông báo.", severity: "success" });
  }, [canSubmit]);

  const gradeColor = (pct: number) =>
    pct >= 80 ? "success" : pct >= 60 ? "warning" : "error";

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <IconButton onClick={() => router.push("/teacher/topics")}>
          <BackIcon />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Chấm điểm luận văn
          </Typography>
          <Typography variant="body2" color="text.secondary">
            GVHD chấm điểm choSV. Thời hạn: 7 ngày kể từ ngày SV nộp bài.
          </Typography>
        </Box>
        {sent && (
          <Button
            variant="outlined"
            startIcon={<DoneIcon />}
            disabled
            color="success"
          >
            Đã gửi
          </Button>
        )}
      </Box>

      {/* Deadline countdown */}
      {!sent && (
        <Box sx={{ mb: 3, maxWidth: 400 }}>
          <CountdownTimer
            deadline={GRADING_DEADLINE}
            label="Thời gian còn lại để chấm điểm:"
          />
        </Box>
      )}

      <Grid container spacing={3}>
        {/* Main: Score form */}
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                Thông tin luận văn
              </Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>Đề tài:</strong> {mockThesis.title}
                </Typography>
                <Typography variant="caption">
                  <strong>SV:</strong> {mockThesis.studentName} ({mockThesis.mssv}) &nbsp;|&nbsp;
                  <strong>GVHD:</strong> {mockThesis.lecturer}
                </Typography>
              </Alert>

              <Divider sx={{ my: 2 }} />

              {/* Criteria */}
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                Tiêu chí chấm điểm
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {scores.map((s) => {
                  const isOver = s.score !== null && s.score > s.maxScore;
                  return (
                    <Box
                      key={s.criteriaId}
                      sx={{
                        p: 2,
                        border: "1px solid",
                        borderColor: isOver ? "error.main" : "divider",
                        borderRadius: 1,
                        bgcolor: sent ? "grey.50" : "background.paper",
                        opacity: sent ? 0.7 : 1,
                      }}
                    >
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {s.label}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {s.description}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <TextField
                            type="number"
                            size="small"
                            placeholder="0"
                            value={s.score ?? ""}
                            onChange={(e) => handleScoreChange(s.criteriaId, Number(e.target.value))}
                            inputProps={{ min: 0, max: s.maxScore }}
                            sx={{ width: 80 }}
                            disabled={sent}
                            error={isOver}
                          />
                          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>
                            / {s.maxScore}
                          </Typography>
                        </Box>
                      </Box>
                      {!sent && (
                        <TextField
                          fullWidth
                          size="small"
                          placeholder={`Nhận xét cho "${s.label}"...`}
                          value={s.comment}
                          onChange={(e) => handleCommentChange(s.criteriaId, e.target.value)}
                          sx={{ mt: 1 }}
                        />
                      )}
                      {sent && s.comment && (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                          Nhận xét: {s.comment}
                        </Typography>
                      )}
                    </Box>
                  );
                })}
              </Box>

              {/* General comment */}
              {!sent && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                    Nhận xét chung
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={generalComment}
                    onChange={(e) => setGeneralComment(e.target.value)}
                    placeholder="Nhập nhận xét chung về luận văn..."
                  />
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar: Total + Actions */}
        <Grid item xs={12} md={4}>
          {/* Score summary */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                Tổng kết điểm
              </Typography>

              <Box sx={{ textAlign: "center", mb: 2 }}>
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 900,
                    fontFamily: "monospace",
                    color: `${gradeColor(percentage)}.main`,
                  }}
                >
                  {sent ? "—" : totalScore}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  / {maxTotal} điểm
                </Typography>
                {sent ? (
                  <Typography variant="body2" color="text.secondary">Đã gửi</Typography>
                ) : (
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 700, color: `${gradeColor(percentage)}.main` }}
                  >
                    {percentage}%
                  </Typography>
                )}
              </Box>

              {/* Criteria breakdown */}
              <Divider sx={{ my: 1.5 }} />
              {scores.map((s) => (
                <Box key={s.criteriaId} sx={{ display: "flex", justifyContent: "space-between", mb: 0.75 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ maxWidth: "60%" }}>
                    {s.label}
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700, fontFamily: "monospace" }}>
                    {sent ? "—" : s.score ?? 0}/{s.maxScore}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>

          {/* Actions */}
          {!sent && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Button
                variant="outlined"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                fullWidth
                disabled={saved}
              >
                {saved ? "Đã lưu!" : "Lưu nháp"}
              </Button>
              <Button
                variant="contained"
                color="success"
                startIcon={<SendIcon />}
                onClick={handleSubmit}
                fullWidth
                disabled={!canSubmit}
              >
                Gửi phiếu chấm
              </Button>
              {!canSubmit && (
                <Alert severity="warning">
                  <Typography variant="caption">
                    Cần nhập đầy đủ điểm và nhận xét cho tất cả tiêu chí.
                  </Typography>
                </Alert>
              )}
            </Box>
          )}
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
