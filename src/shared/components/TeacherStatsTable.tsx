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
  Tooltip,
  Avatar,
  LinearProgress,
  Divider,
} from "@mui/material";
import {
  School as SchoolIcon,
  Groups as GroupsIcon,
  Star as StarIcon,
  RateReview as ReviewIcon,
} from "@mui/icons-material";

export interface TeacherStat {
  id: string;
  name: string;
  email: string;
  department: string;
  thesisCount: number; // đề tài GVHD
  councilRoles: {
    chutich: number;
    thuky: number;
    uyvien: number;
    phanbienNgoai: number;
  };
  avgThesisScore?: number;
  avgCouncilScore?: number;
  totalRoles: number;
}

interface TeacherStatsTableProps {
  teachers: TeacherStat[];
  showScores?: boolean;
}

function rankLabel(total: number): { label: string; color: "success" | "info" | "warning" | "error" } {
  if (total >= 15) return { label: "Rất tích cực", color: "success" };
  if (total >= 8) return { label: "Tích cực", color: "info" };
  if (total >= 3) return { label: "Bình thường", color: "warning" };
  return { label: " Ít hoạt động", color: "error" };
}

function ScoreCell({ value, max = 10 }: { value?: number; max?: number }) {
  if (value === undefined || value === null) {
    return <Typography variant="caption" color="text.disabled">—</Typography>;
  }
  const pct = (value / max) * 100;
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <LinearProgress
        variant="determinate"
        value={pct}
        sx={{ flex: 1, height: 6, borderRadius: 3 }}
        color={pct >= 80 ? "success" : pct >= 60 ? "primary" : "warning"}
      />
      <Typography variant="caption" sx={{ fontFamily: "monospace", fontWeight: 700, minWidth: 28 }}>
        {value.toFixed(1)}
      </Typography>
    </Box>
  );
}

export function TeacherStatsTable({ teachers, showScores = true }: TeacherStatsTableProps) {
  return (
    <Box>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: "primary.50" }}>
              <TableCell sx={{ fontWeight: 700, minWidth: 220 }}>Giảng viên</TableCell>
              <TableCell sx={{ fontWeight: 700, textAlign: "center" }} align="center">Đề tài GVHD</TableCell>
              <TableCell sx={{ fontWeight: 700, textAlign: "center" }} align="center">CT HĐ</TableCell>
              <TableCell sx={{ fontWeight: 700, textAlign: "center" }} align="center">TK HĐ</TableCell>
              <TableCell sx={{ fontWeight: 700, textAlign: "center" }} align="center">UV HĐ</TableCell>
              <TableCell sx={{ fontWeight: 700, textAlign: "center" }} align="center">PB ngoài</TableCell>
              <TableCell sx={{ fontWeight: 700, textAlign: "center" }} align="center">Tổng vai trò</TableCell>
              {showScores && (
                <>
                  <TableCell sx={{ fontWeight: 700 }}>Điểm LV</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Điểm HĐ</TableCell>
                </>
              )}
              <TableCell sx={{ fontWeight: 700 }}>Mức độ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teachers.map((t) => {
              const rank = rankLabel(t.totalRoles);
              const { councilRoles } = t;

              return (
                <TableRow key={t.id} sx={{ "&:nth-of-type(odd)": { bgcolor: "grey.50" } }}>
                  {/* Teacher info */}
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main", fontSize: "0.75rem" }}>
                        {t.name.split(" ").slice(-1)[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                          {t.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontFamily: "monospace" }}>
                          {t.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  {/* Thesis count */}
                  <TableCell align="center">
                    <Tooltip title={`${t.thesisCount} đề tài hướng dẫn`}>
                      <Chip
                        icon={<SchoolIcon sx={{ fontSize: "14px !important" }} />}
                        label={t.thesisCount}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ fontWeight: 900, minWidth: 48 }}
                      />
                    </Tooltip>
                  </TableCell>

                  {/* Council roles */}
                  <TableCell align="center">
                    <Tooltip title="Chủ tịch HĐ">
                      <Chip
                        label={councilRoles.chutich}
                        size="small"
                        color={councilRoles.chutich > 0 ? "warning" : "default"}
                        sx={{ fontWeight: 900, minWidth: 32 }}
                      />
                    </Tooltip>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Thư ký HĐ">
                      <Chip
                        label={councilRoles.thuky}
                        size="small"
                        color={councilRoles.thuky > 0 ? "info" : "default"}
                        sx={{ fontWeight: 900, minWidth: 32 }}
                      />
                    </Tooltip>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Ủy viên HĐ">
                      <Chip
                        label={councilRoles.uyvien}
                        size="small"
                        color={councilRoles.uyvien > 0 ? "secondary" : "default"}
                        sx={{ fontWeight: 900, minWidth: 32 }}
                      />
                    </Tooltip>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Phản biện ngoài">
                      <Chip
                        label={councilRoles.phanbienNgoai}
                        size="small"
                        color={councilRoles.phanbienNgoai > 0 ? "primary" : "default"}
                        sx={{ fontWeight: 900, minWidth: 32 }}
                      />
                    </Tooltip>
                  </TableCell>

                  {/* Total roles */}
                  <TableCell align="center">
                    <Typography variant="body2" sx={{ fontWeight: 900, fontFamily: "monospace" }}>
                      {t.totalRoles}
                    </Typography>
                  </TableCell>

                  {/* Scores */}
                  {showScores && (
                    <>
                      <TableCell sx={{ minWidth: 100 }}>
                        <ScoreCell value={t.avgThesisScore} />
                      </TableCell>
                      <TableCell sx={{ minWidth: 100 }}>
                        <ScoreCell value={t.avgCouncilScore} />
                      </TableCell>
                    </>
                  )}

                  {/* Rank */}
                  <TableCell>
                    <Chip
                      label={rank.label}
                      color={rank.color}
                      size="small"
                      sx={{ fontWeight: 700, fontSize: "0.65rem" }}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Summary */}
      <Box sx={{ display: "flex", gap: 2, mt: 1.5, flexWrap: "wrap" }}>
        {[
          { label: "Tổng GV", value: teachers.length, color: "primary" },
          { label: "Tổng đề tài", value: teachers.reduce((s, t) => s + t.thesisCount, 0), color: "primary" },
          { label: "Tổng vai trò HĐ", value: teachers.reduce((s, t) => s + t.totalRoles, 0), color: "warning" },
          { label: "TB vai trò/GV", value: teachers.length > 0 ? (teachers.reduce((s, t) => s + t.totalRoles, 0) / teachers.length).toFixed(1) : "0", color: "info" },
        ].map((s) => (
          <Chip
            key={s.label}
            label={`${s.label}: ${s.value}`}
            size="small"
            variant="outlined"
            sx={{ fontWeight: 700 }}
          />
        ))}
      </Box>
    </Box>
  );
}
