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
  IconButton,
  Tooltip,
  TextField,
  Button,
  Collapse,
  Alert,
} from "@mui/material";
import {
  KeyboardArrowUp as UpIcon,
  KeyboardArrowDown as DownIcon,
  SwapVert as SortIcon,
  Edit as EditIcon,
  Check as ConfirmIcon,
  Close as CancelIcon,
  Star as StarIcon,
} from "@mui/icons-material";
import { useState, useCallback } from "react";

export interface RankedStudent {
  id: string;
  mssv: string;
  studentName: string;
  topicName: string;
  finalScore: number;
  grade: string;
  overrideRank?: number | null; // set by secretary
  overrideNote?: string;
  status: "pass" | "fail";
}

interface RankingTableProps {
  students: RankedStudent[];
  onRankOverride?: (id: string, newRank: number, note: string) => void;
  onSortBy?: (field: keyof RankedStudent) => void;
  sortField?: keyof RankedStudent;
  sortDirection?: "asc" | "desc";
  compact?: boolean;
}

const GRADE_COLORS: Record<string, "success" | "info" | "primary" | "warning" | "error"> = {
  A: "success", B: "info", C: "primary", D: "warning", F: "error",
};

function computeAutoRank(students: RankedStudent[]): Map<string, number> {
  const sorted = [...students].sort((a, b) => b.finalScore - a.finalScore);
  const rankMap = new Map<string, number>();
  let rank = 1;
  let prevScore: number | null = null;
  let skipCount = 0;

  for (let i = 0; i < sorted.length; i++) {
    const s = sorted[i];
    if (prevScore !== null && s.finalScore < prevScore) {
      rank = i + 1;
    }
    rankMap.set(s.id, rank);
    prevScore = s.finalScore;
  }
  return rankMap;
}

export function RankingTable({
  students,
  onRankOverride,
  onSortBy,
  sortField,
  sortDirection = "desc",
  compact = false,
}: RankingTableProps) {
  const autoRankMap = computeAutoRank(students);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRank, setEditRank] = useState("");
  const [editNote, setEditNote] = useState("");

  const handleSort = useCallback((field: keyof RankedStudent) => {
    onSortBy?.(field);
  }, [onSortBy]);

  const handleStartEdit = useCallback((student: RankedStudent, autoRank: number) => {
    setEditingId(student.id);
    setEditRank(String(student.overrideRank ?? autoRank));
    setEditNote(student.overrideNote ?? "");
  }, []);

  const handleConfirmEdit = useCallback(() => {
    if (!editingId) return;
    const rank = parseInt(editRank);
    if (!isNaN(rank) && rank >= 1 && rank <= students.length) {
      onRankOverride?.(editingId, rank, editNote);
    }
    setEditingId(null);
  }, [editingId, editRank, editNote, students.length, onRankOverride]);

  const handleCancelEdit = useCallback(() => {
    setEditingId(null);
  }, []);

  const SortHeader = ({ field, label }: { field: keyof RankedStudent; label: string }) => (
    <TableCell
      sx={{ fontWeight: 700, cursor: "pointer", userSelect: "none" }}
      onClick={() => handleSort(field)}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        {label}
        {sortField === field ? (
          sortDirection === "desc" ? (
            <DownIcon sx={{ fontSize: 14 }} />
          ) : (
            <UpIcon sx={{ fontSize: 14 }} />
          )
        ) : (
          <SortIcon sx={{ fontSize: 14, opacity: 0.3 }} />
        )}
      </Box>
    </TableCell>
  );

  return (
    <Box>
      <TableContainer component={Paper} variant="outlined">
        <Table size={compact ? "small" : "medium"}>
          <TableHead>
            <TableRow sx={{ bgcolor: "primary.50" }}>
              <TableCell sx={{ fontWeight: 700, minWidth: 56 }}>Thứ hạng</TableCell>
              <SortHeader field="mssv" label="MSSV" />
              <SortHeader field="studentName" label="Sinh viên" />
              <SortHeader field="topicName" label="Đề tài" />
              <SortHeader field="finalScore" label="Điểm TB" />
              <TableCell sx={{ fontWeight: 700 }}>Loại</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Kết quả</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Ghi chú</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => {
              const autoRank = autoRankMap.get(student.id) ?? 0;
              const displayRank = student.overrideRank ?? autoRank;
              const hasOverride = student.overrideRank !== null && student.overrideRank !== undefined;
              const isEditing = editingId === student.id;

              const rankColor = (() => {
                if (hasOverride) return "warning";
                if (displayRank === 1) return "success";
                if (displayRank <= 3) return "info";
                return "default";
              })();

              return (
                <TableRow
                  key={student.id}
                  sx={{
                    "&:nth-of-type(odd)": { bgcolor: "grey.50" },
                    bgcolor: student.status === "fail" ? "error.50" : undefined,
                  }}
                >
                  {/* Rank */}
                  <TableCell>
                    {isEditing ? (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <TextField
                          type="number"
                          size="small"
                          value={editRank}
                          onChange={(e) => setEditRank(e.target.value)}
                          inputProps={{ min: 1, max: students.length }}
                          sx={{ width: 56 }}
                          autoFocus
                        />
                      </Box>
                    ) : (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        {displayRank <= 3 && (
                          <StarIcon sx={{ fontSize: 14, color: `${rankColor}.main` }} />
                        )}
                        <Chip
                          label={`#${displayRank}`}
                          color={rankColor}
                          size="small"
                          sx={{ fontWeight: 900, minWidth: 40 }}
                        />
                        {hasOverride && (
                          <Tooltip title={`Override: #{student.overrideRank} (gốc: #${autoRank})`}>
                            <Chip label="override" size="small" color="warning" variant="outlined" sx={{ fontSize: "0.55rem" }} />
                          </Tooltip>
                        )}
                      </Box>
                    )}
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: "monospace", fontWeight: 700 }}>
                      {student.mssv}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ fontWeight: 600, maxWidth: 160 }}>
                    <Typography variant="body2" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {student.studentName}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ maxWidth: 200 }}>
                    <Typography variant="caption" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>
                      {student.topicName}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: "monospace",
                        fontWeight: 900,
                        color: student.finalScore >= 50 ? "success.main" : "error.main",
                      }}
                    >
                      {student.finalScore.toFixed(2)}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={student.grade}
                      color={GRADE_COLORS[student.grade] ?? "default"}
                      size="small"
                      sx={{ fontWeight: 900 }}
                    />
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={student.status === "pass" ? "ĐẠT" : "RỚT"}
                      color={student.status === "pass" ? "success" : "error"}
                      size="small"
                      sx={{ fontWeight: 800 }}
                    />
                  </TableCell>

                  <TableCell>
                    {isEditing ? (
                      <TextField
                        size="small"
                        placeholder="Lý do override..."
                        value={editNote}
                        onChange={(e) => setEditNote(e.target.value)}
                        sx={{ minWidth: 120 }}
                      />
                    ) : (
                      <Typography variant="caption" color="text.secondary" sx={{ maxWidth: 150, display: "block" }}>
                        {student.overrideNote ?? "—"}
                      </Typography>
                    )}
                  </TableCell>

                  <TableCell>
                    {isEditing ? (
                      <Box sx={{ display: "flex", gap: 0.5 }}>
                        <Tooltip title="Xác nhận">
                          <IconButton size="small" color="success" onClick={handleConfirmEdit}>
                            <ConfirmIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Hủy">
                          <IconButton size="small" color="error" onClick={handleCancelEdit}>
                            <CancelIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    ) : (
                      <Tooltip title="Override thứ hạng">
                        <IconButton
                          size="small"
                          color="warning"
                          onClick={() => handleStartEdit(student, autoRank)}
                        >
                          <EditIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {!compact && (
        <Alert severity="info" sx={{ mt: 1 }}>
          <Typography variant="caption">
            <strong>Thứ hạng tự động</strong> được tính theo điểm tổng giảm dần. Click tiêu đề cột để sắp xếp.
            Override: Thư ký có thể điều chỉnh thứ hạng thủ công khi có điểm bằng nhau hoặc lý do đặc biệt.
          </Typography>
        </Alert>
      )}
    </Box>
  );
}
