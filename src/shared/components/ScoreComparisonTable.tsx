"use client";

import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  IconButton,
  Tooltip,
  Alert,
} from "@mui/material";
import {
  Edit as EditIcon,
  CheckCircle as ApproveIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import { useState, useCallback } from "react";
import type { AuditEntry } from "./AuditLogPanel";

export interface ScoreCriteria {
  id: string;
  label: string;
  maxScore: number;
}

export interface MemberScore {
  role: string;
  roleLabel: string;
  scores: Record<string, number>; // criteriaId → score
  total: number;
  confirmed: boolean;
}

interface ScoreComparisonTableProps {
  criteria: ScoreCriteria[];
  members: MemberScore[];
  finalScores: Record<string, number>; // criteriaId → final
  finalTotal: number;
  editable?: boolean;
  isLocked?: boolean;
  onScoreOverride?: (criteriaId: string, newScore: number) => void;
  onFinalize?: () => void;
  auditEntries?: AuditEntry[];
}

export function ScoreComparisonTable({
  criteria,
  members,
  finalScores,
  finalTotal,
  editable = false,
  isLocked = false,
  onScoreOverride,
  onFinalize,
}: ScoreComparisonTableProps) {
  const [editingCell, setEditingCell] = useState<{ criteriaId: string; score: number } | null>(null);
  const [editValue, setEditValue] = useState("");

  const maxTotal = criteria.reduce((s, c) => s + c.maxScore, 0);

  const handleStartEdit = useCallback((criteriaId: string, currentScore: number) => {
    if (!editable || isLocked) return;
    setEditingCell({ criteriaId, score: currentScore });
    setEditValue(String(currentScore));
  }, [editable, isLocked]);

  const handleSaveEdit = useCallback(() => {
    if (!editingCell) return;
    const val = Number(editValue);
    if (!isNaN(val) && val >= 0) {
      onScoreOverride?.(editingCell.criteriaId, val);
    }
    setEditingCell(null);
  }, [editingCell, editValue, onScoreOverride]);

  const ROLE_COLORS: Record<string, string> = {
    chutich: "primary",
    pth: "info",
    uv1: "warning",
    uv2: "secondary",
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Bảng so sánh điểm
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Mỗi ô = điểm của 1 thành viên cho 1 tiêu chí.{" "}
            {editable && !isLocked && (
              <strong>Chủ tịch có thể sửa điểm.</strong>
            )}
          </Typography>
        </Box>
        {editable && !isLocked && onFinalize && (
          <Chip
            icon={<ApproveIcon />}
            label="Chốt điểm nháp"
            color="success"
            onClick={onFinalize}
            sx={{ fontWeight: 700 }}
          />
        )}
        {isLocked && (
          <Chip
            icon={<WarningIcon />}
            label="Đã chốt"
            color="default"
            sx={{ fontWeight: 700 }}
          />
        )}
      </Box>

      {/* Legend */}
      <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
        {members.map((m) => (
          <Chip
            key={m.role}
            label={m.roleLabel}
            size="small"
            color={ROLE_COLORS[m.role] as "primary" | "info" | "warning" | "secondary"}
            variant="outlined"
            sx={{ fontSize: "0.65rem" }}
          />
        ))}
        <Chip label="Điểm CT ghi đè" size="small" color="success" sx={{ fontSize: "0.65rem" }} variant="outlined" />
        {editable && !isLocked && (
          <Chip label="Click để sửa" size="small" color="warning" sx={{ fontSize: "0.65rem" }} variant="outlined" />
        )}
      </Box>

      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: "primary.50" }}>
              <TableCell sx={{ fontWeight: 700, minWidth: 160 }}>Tiêu chí</TableCell>
              {members.map((m) => (
                <TableCell key={m.role} sx={{ fontWeight: 700, textAlign: "center", minWidth: 80 }} align="center">
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.25 }}>
                    <Typography variant="caption" sx={{ fontWeight: 900 }}>
                      {m.roleLabel}
                    </Typography>
                    {m.confirmed && (
                      <ApproveIcon sx={{ fontSize: 12, color: "success.main" }} />
                    )}
                  </Box>
                </TableCell>
              ))}
              <TableCell sx={{ fontWeight: 700, textAlign: "center", bgcolor: "success.50" }} align="center">
                Điểm chốt
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {criteria.map((c) => {
              const cellValues = members.map((m) => ({
                role: m.role,
                score: m.scores[c.id] ?? null,
              }));
              const final = finalScores[c.id] ?? null;
              const avg = (() => {
                const vals = cellValues.map((v) => v.score).filter((v): v is number => v !== null);
                if (vals.length === 0) return null;
                return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10;
              })();
              const maxForCriteria = c.maxScore;

              return (
                <TableRow key={c.id}>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {c.label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Tối đa: {c.maxScore}
                    </Typography>
                  </TableCell>

                  {cellValues.map(({ role, score }) => {
                    const isOver = score !== null && score > maxForCriteria;
                    const isLow = score !== null && score < maxForCriteria * 0.5;
                    const isChairman = role === "chutich";
                    const isEditing = editingCell?.criteriaId === c.id;

                    return (
                      <TableCell
                        key={role}
                        align="center"
                        sx={{
                          bgcolor: isChairman && score !== null ? "success.50" : undefined,
                          cursor: editable && !isLocked ? "pointer" : "default",
                          "&:hover": editable && !isLocked ? { bgcolor: "action.hover" } : undefined,
                        }}
                        onClick={() => !isEditing && handleStartEdit(c.id, score ?? 0)}
                      >
                        {isEditing && editable ? (
                          <TextField
                            type="number"
                            size="small"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={handleSaveEdit}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSaveEdit();
                              if (e.key === "Escape") setEditingCell(null);
                            }}
                            autoFocus
                            inputProps={{ min: 0, max: maxForCriteria }}
                            sx={{ width: 70 }}
                            error={Number(editValue) > maxForCriteria}
                          />
                        ) : (
                          <Typography
                            variant="body2"
                            sx={{
                              fontFamily: "monospace",
                              fontWeight: 700,
                              color: score === null
                                ? "text.disabled"
                                : isOver
                                ? "error.main"
                                : isLow
                                ? "warning.main"
                                : "success.main",
                            }}
                          >
                            {score ?? "-"}
                          </Typography>
                        )}
                      </TableCell>
                    );
                  })}

                  {/* Final column */}
                  <TableCell align="center" sx={{ bgcolor: "success.50", fontWeight: 900 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: "monospace",
                        fontWeight: 900,
                        color: final !== null ? "success.main" : "text.disabled",
                      }}
                    >
                      {final !== null ? `${final} (TB ${avg})` : "-"}
                    </Typography>
                  </TableCell>
                </TableRow>
              );
            })}

            {/* Total row */}
            <TableRow sx={{ bgcolor: "grey.100" }}>
              <TableCell sx={{ fontWeight: 900 }}>Tổng cộng</TableCell>
              {members.map(({ role, total }) => {
                const member = members.find((m) => m.role === role);
                const isLow = total < maxTotal * 0.5;
                return (
                  <TableCell key={role} align="center" sx={{ fontWeight: 900 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: "monospace",
                        fontWeight: 900,
                        color: isLow ? "warning.main" : "success.main",
                      }}
                    >
                      {total > 0 ? total : "-"}
                    </Typography>
                  </TableCell>
                );
              })}
              <TableCell align="center" sx={{ bgcolor: "success.main", color: "white", fontWeight: 900 }}>
                <Typography variant="body2" sx={{ fontFamily: "monospace", fontWeight: 900, color: "white" }}>
                  {finalTotal > 0 ? `${finalTotal} / ${maxTotal}` : "-"}
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {editable && !isLocked && (
        <Alert severity="warning" sx={{ mt: 1.5 }}>
          <Typography variant="caption">
            <strong>Chế độ Chủ tịch:</strong> Bạn có thể chỉnh sửa điểm bất kỳ ô nào trong bảng.
            Mọi thay đổi sẽ được ghi vào nhật ký (Audit Log). Nhấn "Chốt điểm nháp" để xác nhận kết quả cuối cùng.
          </Typography>
        </Alert>
      )}
    </Box>
  );
}
