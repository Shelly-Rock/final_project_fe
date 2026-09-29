import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";
import { Dialog } from "@/shared/components";
import { Score, ScoringTypeLabels } from "../services";
import DynamicRubricForm from "./DynamicRubricForm";
import {
  RUBRIC_GVHD,
  RUBRIC_GVPB,
  RUBRIC_COMMITTEE,
} from "../services/rubrics.constant";
import { toast } from "sonner";

import { RubricCategory, RubricSection } from "../services/rubrics.constant";

export type SaveScorePayload = {
  score: number;
  criteriaScores: Record<string, number>;
  notes: string;
  strengths: string;
  weaknesses: string;
};

export type ScoreGroupProject = Score["project"] & {
  projectName?: string;
};

export interface ScoreGroup {
  projectId: number;
  scoringType: string;
  role: string | null;
  project: ScoreGroupProject | null;
  scores: Score[];
  isFullySubmitted: boolean;
  isLocked?: boolean;
  lockedReason?: string | null;
}

interface ScoringGroupDialogProps {
  open: boolean;
  group: ScoreGroup | null;
  onClose: () => void;
  onSaveDraft: (scoreId: number, payload: SaveScorePayload) => Promise<void>;
  onSubmitScore: (scoreId: number, payload: SaveScorePayload) => Promise<void>;
  onExport: (scoreId: number) => Promise<void>;
}

const getScoreRequestErrorMessage = (error: unknown, fallback: string) => {
  if (!axios.isAxiosError<{ message?: string | string[] }>(error)) {
    return fallback;
  }

  const message = error.response?.data?.message;
  return Array.isArray(message) ? message.join(", ") : message || fallback;
};

export default function ScoringGroupDialog({
  open,
  group,
  onClose,
  onSaveDraft,
  onSubmitScore,
  onExport,
}: ScoringGroupDialogProps) {
  const [selectedStudentId, setSelectedStudentId] = useState<number | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Form states
  const [criteriaScores, setCriteriaScores] = useState<Record<string, number>>(
    {},
  );
  const [notes, setNotes] = useState("");
  const [strengths, setStrengths] = useState("");
  const [weaknesses, setWeaknesses] = useState("");

  const currentScore = useMemo(() => {
    if (!group || !selectedStudentId) return null;
    return group.scores.find((s) => s.studentId === selectedStudentId) || null;
  }, [group, selectedStudentId]);

  const schema = useMemo(() => {
    if (!group) return null;
    if (group.scoringType === "GVHD") return RUBRIC_GVHD;
    if (group.role === "EXTERNAL_REVIEWER") return RUBRIC_GVPB;
    return RUBRIC_COMMITTEE;
  }, [group]);

  useEffect(() => {
    if (open && group && group.scores.length > 0) {
      setSelectedStudentId(group.scores[0].studentId);
    } else if (!open) {
      setSelectedStudentId("");
    }
  }, [open, group]);

  useEffect(() => {
    if (currentScore) {
      setCriteriaScores(currentScore.criteriaScores || {});
      setNotes(currentScore.notes || "");
      setStrengths(currentScore.strengths || "");
      setWeaknesses(currentScore.weaknesses || "");
    }
  }, [currentScore]);

  const isReadOnly =
    currentScore?.status === "SUBMITTED" ||
    currentScore?.status === "PASSED" ||
    currentScore?.status === "FAILED";

  const calculateTotal = () => {
    if (!schema) return 0;

    const calculateCategoryScore = (cat: RubricCategory) => {
      let sum = 0;
      cat.criteria.forEach((c) => {
        sum += criteriaScores[c.id] || 0;
      });
      const avg = cat.criteria.length > 0 ? sum / cat.criteria.length : 0;
      return avg * cat.weight;
    };

    const calculateSectionScore = (section: RubricSection) => {
      let sum = 0;
      section.categories.forEach((cat) => {
        sum += calculateCategoryScore(cat);
      });
      return sum;
    };

    const scoreA = schema.sections.find((s) => s.id === "A")
      ? calculateSectionScore(schema.sections.find((s) => s.id === "A")!)
      : 0;
    const scoreB = schema.sections.find((s) => s.id === "B")
      ? calculateSectionScore(schema.sections.find((s) => s.id === "B")!)
      : 0;

    return (
      scoreA * schema.grandTotalFormula.sectionAWeight +
      scoreB * schema.grandTotalFormula.sectionBWeight
    );
  };

  const handleSaveDraft = async () => {
    if (!currentScore) return;
    try {
      setIsSubmitting(true);
      const total = calculateTotal();
      await onSaveDraft(currentScore.id, {
        score: total,
        criteriaScores,
        notes,
        strengths,
        weaknesses,
      });
      toast.success("Đã lưu nháp thành công!");
    } catch (error: unknown) {
      toast.error(getScoreRequestErrorMessage(error, "Lỗi khi lưu nháp"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (!currentScore) return;
    const total = calculateTotal();
    if (total < 4) {
      if (
        !window.confirm(
          "Điểm dưới 4 sẽ khiến sinh viên bị loại. Bạn có chắc chắn muốn chốt điểm?",
        )
      ) {
        return;
      }
    } else {
      if (
        !window.confirm(
          "Sau khi chốt điểm, bạn sẽ không thể chỉnh sửa. Tiếp tục?",
        )
      ) {
        return;
      }
    }

    try {
      setIsSubmitting(true);
      await onSubmitScore(currentScore.id, {
        score: total,
        criteriaScores,
        notes,
        strengths,
        weaknesses,
      });
      toast.success("Chốt điểm thành công!");
    } catch (error: unknown) {
      toast.error(getScoreRequestErrorMessage(error, "Lỗi khi chốt điểm"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExport = async () => {
    if (!currentScore) return;
    try {
      setIsExporting(true);
      await onExport(currentScore.id);
    } catch {
      toast.error("Lỗi khi xuất file");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Phiếu chấm điểm"
      description={group?.project?.projectName}
      size="lg"
    >
      {group && (
        <Box sx={{ mt: 2 }}>
          {/* Header */}
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
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Họ tên sinh viên</InputLabel>
                <Select
                  value={selectedStudentId}
                  label="Họ tên sinh viên"
                  onChange={(e) =>
                    setSelectedStudentId(e.target.value as number)
                  }
                >
                  {group.scores.map((s) => (
                    <MenuItem key={s.studentId} value={s.studentId}>
                      {s.student?.firstName} {s.student?.middleName}{" "}
                      {s.student?.lastName}
                      {s.status === "SUBMITTED" ||
                      s.status === "PASSED" ||
                      s.status === "FAILED"
                        ? " (Đã chốt)"
                        : " (Nháp)"}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Mã số sinh viên"
                value={currentScore?.student?.studentId || ""}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Tên học phần"
                value={schema?.courseName || ""}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Tên đề tài"
                value={group.project?.projectName || ""}
                disabled
              />
            </Grid>
          </Grid>

          {isReadOnly && (
            <Alert severity="info" sx={{ mb: 3 }}>
              Phiếu điểm này đã được chốt và không thể chỉnh sửa.
            </Alert>
          )}

          {/* Dynamic Rubric */}
          {schema && currentScore && (
            <DynamicRubricForm
              schema={schema}
              criteriaScores={criteriaScores}
              setCriteriaScores={setCriteriaScores}
              readOnly={isReadOnly}
            />
          )}

          {/* Feedback */}
          <Box sx={{ mb: 3, mt: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Điểm mạnh
            </Typography>
            <TextField
              multiline
              rows={2}
              fullWidth
              value={strengths}
              onChange={(e) => setStrengths(e.target.value)}
              placeholder="Nhận xét về điểm mạnh..."
              size="small"
              disabled={isReadOnly}
            />
          </Box>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Kết luận (Những phần cần sửa đổi/bổ sung)
            </Typography>
            <TextField
              multiline
              rows={2}
              fullWidth
              value={weaknesses}
              onChange={(e) => setWeaknesses(e.target.value)}
              placeholder="Nhận xét về điểm yếu..."
              size="small"
              disabled={isReadOnly}
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
              disabled={isReadOnly}
            />
          </Box>
        </Box>
      )}

      {/* Actions */}
      <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end", mt: 2 }}>
        <Button variant="outlined" onClick={onClose}>
          Đóng
        </Button>

        <Button
          variant="outlined"
          color="info"
          onClick={handleExport}
          disabled={!currentScore || isExporting}
        >
          {isExporting ? "Đang xuất..." : "Xuất phiếu chấm"}
        </Button>

        {!isReadOnly && (
          <>
            <Button
              variant="outlined"
              onClick={handleSaveDraft}
              disabled={isSubmitting}
            >
              Lưu nháp
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={isSubmitting}
              color="primary"
            >
              Xác nhận chốt điểm
            </Button>
          </>
        )}
      </Box>
    </Dialog>
  );
}
