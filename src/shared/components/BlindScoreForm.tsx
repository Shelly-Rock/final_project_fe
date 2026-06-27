"use client";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Tooltip,
  Divider,
  Chip,
} from "@mui/material";
import {
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as HiddenIcon,
  Send as SendIcon,
  CheckCircle as DoneIcon,
} from "@mui/icons-material";
import { useState, useCallback } from "react";

export interface ScoreCriteria {
  id: string;
  label: string;
  description: string;
  maxScore: number;
}

export interface ScoreValue {
  criteriaId: string;
  score: number | null;
  comment: string;
}

interface BlindScoreFormProps {
  thesisTitle: string;
  studentName: string;
  councilRole: string; // "chutich" | "pth" | "uv1" | "uv2"
  criteria: ScoreCriteria[];
  onSubmit: (scores: ScoreValue[]) => void;
  submittedScores?: ScoreValue[];
  submittedAt?: string;
  readonly?: boolean;
}

export function BlindScoreForm({
  thesisTitle,
  studentName,
  councilRole,
  criteria,
  onSubmit,
  submittedScores = [],
  submittedAt,
  readonly = false,
}: BlindScoreFormProps) {
  const [scores, setScores] = useState<ScoreValue[]>(() =>
    criteria.map((c) => {
      const existing = submittedScores.find((s) => s.criteriaId === c.id);
      return { criteriaId: c.id, score: existing?.score ?? null, comment: existing?.comment ?? "" };
    })
  );
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitted, setSubmitted] = useState(!!submittedAt);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submittedAtState, setSubmittedAtState] = useState(submittedAt);

  const totalScore = scores.reduce((sum, s) => sum + (s.score ?? 0), 0);
  const maxTotal = criteria.reduce((sum, c) => sum + c.maxScore, 0);
  const hasAllScores = scores.every((s) => s.score !== null && s.score !== undefined);
  const hasComments = scores.every((s) => s.comment.trim().length > 0);

  const isValid = hasAllScores && hasComments;

  const handleScoreChange = useCallback((criteriaId: string, value: number) => {
    setScores((prev) =>
      prev.map((s) => (s.criteriaId === criteriaId ? { ...s, score: value } : s))
    );
  }, []);

  const handleCommentChange = useCallback((criteriaId: string, value: string) => {
    setScores((prev) =>
      prev.map((s) => (s.criteriaId === criteriaId ? { ...s, comment: value } : s))
    );
  }, []);

  const handleSubmit = useCallback(() => {
    if (!isValid) return;
    setConfirmOpen(true);
  }, [isValid]);

  const handleConfirmSubmit = useCallback(() => {
    onSubmit(scores);
    setSubmitted(true);
    setSubmittedAtState(new Date().toISOString());
    setConfirmOpen(false);
    setShowConfirm(true);
    setTimeout(() => setShowConfirm(false), 4000);
  }, [scores, onSubmit]);

  const ROLE_LABELS: Record<string, string> = {
    chutich: "Chủ tịch",
    pth: "Phó Chủ tịch",
    uv1: "Ủy viên 1",
    uv2: "Ủy viên 2",
  };

  return (
    <Card>
      <CardContent>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Phiếu chấm điểm
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {thesisTitle}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Sinh viên: {studentName}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 0.5 }}>
            <Chip
              label={`Vai trò: ${ROLE_LABELS[councilRole] ?? councilRole}`}
              size="small"
              color="primary"
              variant="outlined"
            />
            {submitted && (
              <Chip
                icon={<DoneIcon />}
                label={`Đã gửi lúc ${submittedAtState ? new Date(submittedAtState).toLocaleTimeString("vi-VN") : ""}`}
                size="small"
                color="success"
              />
            )}
          </Box>
        </Box>

        {/* Blind notice */}
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="caption">
            <strong>Chế độ ẩn điểm:</strong> Điểm của bạn sẽ được ẩn cho đến khi tất cả 4 thành viên HĐ đều gửi phiếu. Không ai có thể xem điểm của người khác trước khi đủ.
          </Typography>
        </Alert>

        {/* Already submitted */}
        {submitted && (
          <Alert severity="success" sx={{ mb: 2 }} icon={<DoneIcon />}>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              Bạn đã gửi phiếu chấm thành công!
            </Typography>
            <Typography variant="caption">
              Điểm của bạn sẽ được công khai khi đủ 4 phiếu.
            </Typography>
          </Alert>
        )}

        {/* Confirm sent notification */}
        {showConfirm && (
          <Alert severity="success" sx={{ mb: 2 }}>
            <Typography variant="body2">Đã gửi phiếu chấm thành công!</Typography>
          </Alert>
        )}

        {/* Score inputs */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {criteria.map((c) => {
            const scoreEntry = scores.find((s) => s.criteriaId === c.id);
            const currentScore = scoreEntry?.score;
            const isOverMax = currentScore !== null && currentScore !== undefined && currentScore > c.maxScore;

            return (
              <Box
                key={c.id}
                sx={{
                  p: 2,
                  border: "1px solid",
                  borderColor: isOverMax ? "error.main" : "divider",
                  borderRadius: 1,
                  bgcolor: submitted ? "grey.50" : "background.paper",
                  opacity: submitted ? 0.7 : 1,
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {c.label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {c.description}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {submitted && (
                      <Tooltip title="Điểm đã được gửi (đang ẩn cho đến khi đủ 4 phiếu)">
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <HiddenIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                          <Typography variant="body2" sx={{ fontWeight: 900, fontFamily: "monospace" }}>
                            ??
                          </Typography>
                        </Box>
                      </Tooltip>
                    )}
                    {!submitted && (
                      <>
                        <TextField
                          type="number"
                          size="small"
                          placeholder="0"
                          value={currentScore ?? ""}
                          onChange={(e) => handleScoreChange(c.id, Number(e.target.value))}
                          inputProps={{ min: 0, max: c.maxScore }}
                          sx={{ width: 80 }}
                          error={isOverMax}
                          disabled={submitted}
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                          / {c.maxScore}
                        </Typography>
                      </>
                    )}
                  </Box>
                </Box>

                {!submitted && (
                  <TextField
                    fullWidth
                    size="small"
                    placeholder={`Nhận xét cho tiêu chí "${c.label}"...`}
                    value={scoreEntry?.comment ?? ""}
                    onChange={(e) => handleCommentChange(c.id, e.target.value)}
                    disabled={submitted}
                    sx={{ mt: 1 }}
                  />
                )}

                {submitted && scoreEntry?.comment && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block", fontStyle: "italic" }}>
                    Nhận xét: {scoreEntry.comment}
                  </Typography>
                )}
              </Box>
            );
          })}
        </Box>

        {/* Total */}
        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Tổng điểm:
            </Typography>
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
              {submitted ? (
                <Typography variant="h5" sx={{ fontWeight: 900, color: "text.secondary", fontFamily: "monospace" }}>
                  ??
                </Typography>
              ) : (
                <>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 900,
                      color: totalScore / maxTotal >= 0.5 ? "success.main" : "error.main",
                      fontFamily: "monospace",
                    }}
                  >
                    {totalScore}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">/ {maxTotal}</Typography>
                </>
              )}
            </Box>
          </Box>

          {!submitted && (
            <Button
              variant="contained"
              startIcon={<SendIcon />}
              onClick={handleSubmit}
              disabled={!isValid}
              size="large"
            >
              Gửi phiếu chấm
            </Button>
          )}

          {submitted && (
            <Chip
              icon={<LockIcon />}
              label="Đã khóa"
              color="default"
              sx={{ fontWeight: 700 }}
            />
          )}
        </Box>

        {!submitted && !isValid && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            <Typography variant="caption">
              Vui lòng nhập đầy đủ điểm và nhận xét cho tất cả tiêu chí trước khi gửi.
            </Typography>
          </Alert>
        )}
      </CardContent>

      {/* Confirm dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Xác nhận gửi phiếu chấm</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="caption">
              Sau khi gửi, bạn <strong>không thể sửa</strong> điểm. Hãy kiểm tra kỹ trước khi xác nhận.
            </Typography>
          </Alert>
          <Typography variant="body2">
            Tổng điểm bạn đã nhập: <strong>{totalScore}/{maxTotal}</strong>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Quay lại sửa</Button>
          <Button variant="contained" onClick={handleConfirmSubmit} startIcon={<SendIcon />}>
            Xác nhận gửi
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
