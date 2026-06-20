"use client";

import { useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Stack,
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid,
  Rating,
} from "@mui/material";
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { FilterBar } from "@/shared/components";
import {
  mockScores,
  mockSupervisorScores,
  mockReviewerScores,
  mockFinalScores,
  getScoreColorSafe as getScoreColor,
  getLetterGrade,
} from "@/feature/thesis/constants";
import { StatusBadge } from "@/feature/thesis/components/registration/RegistrationStatusBadge";
import type { ThesisScore, SupervisorScore, ReviewerScore, FinalScore } from "@/feature/thesis/types";

interface ScoreListProps {
  scores?: ThesisScore[];
  onViewDetail?: (score: ThesisScore) => void;
  onEdit?: (score: ThesisScore) => void;
}

export function ScoreList({
  scores = mockScores,
  onViewDetail,
  onEdit,
}: ScoreListProps) {
  const [tab, setTab] = useState(0);
  const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "pending">("all");

  const filteredScores = scores.filter((score) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "completed") return score.finalScore !== null;
    return score.finalScore === null;
  });

  // Stats
  const stats = {
    total: scores.length,
    graded: scores.filter((s) => s.finalScore !== null).length,
    pending: scores.filter((s) => s.finalScore === null).length,
    avgScore:
      scores.filter((s) => s.finalScore !== null).length > 0
        ? scores
            .filter((s) => s.finalScore !== null)
            .reduce((sum, s) => sum + (s.finalScore || 0), 0) /
          scores.filter((s) => s.finalScore !== null).length
        : 0,
  };

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab label="Tổng hợp điểm" />
          <Tab label="Điểm GVHD" />
          <Tab label="Điểm phản biện" />
          <Tab label="Điểm hội đồng" />
        </Tabs>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="primary">
                {stats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tổng sinh viên
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="success.main">
                {stats.graded}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Đã chấm điểm
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="warning.main">
                {stats.pending}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Chưa có điểm
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="info.main">
                {stats.avgScore.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Điểm trung bình
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {tab === 0 && (
        <>
          <FilterBar
            totalCount={scores.length}
            filteredCount={filteredScores.length}
          >
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={statusFilter}
                label="Trạng thái"
                onChange={(e) =>
                  setStatusFilter(e.target.value as "all" | "completed" | "pending")
                }
              >
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="completed">Đã chấm</MenuItem>
                <MenuItem value="pending">Chưa chấm</MenuItem>
              </Select>
            </FormControl>
          </FilterBar>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "grey.100" }}>
                  <TableCell sx={{ fontWeight: 600 }}>STT</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Sinh viên</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Đề tài</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Điểm quá trình</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Điểm báo cáo</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Điểm bảo vệ</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Điểm cuối</TableCell>
                  <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredScores.map((score, index) => (
                  <TableRow key={score.id} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {score.student}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 200 }}>
                      <Tooltip title={score.thesis}>
                        <Typography variant="body2" noWrap>
                          {score.thesis}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      {score.processScore !== null ? (
                        <Chip
                          label={score.processScore}
                          color={getScoreColor(score.processScore)}
                          size="small"
                        />
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          —
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {score.reportScore !== null ? (
                        <Chip
                          label={score.reportScore}
                          color={getScoreColor(score.reportScore)}
                          size="small"
                        />
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          —
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {score.defenseScore !== null ? (
                        <Chip
                          label={score.defenseScore}
                          color={getScoreColor(score.defenseScore)}
                          size="small"
                        />
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          —
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {score.finalScore !== null ? (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Chip
                            label={score.finalScore}
                            color={getScoreColor(score.finalScore)}
                            size="small"
                          />
                          <Typography variant="caption" color="text.secondary">
                            ({getLetterGrade(score.finalScore)})
                          </Typography>
                        </Box>
                      ) : (
                        <Chip label="Chưa có" size="small" />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Xem chi tiết">
                        <IconButton
                          size="small"
                          onClick={() => onViewDetail?.(score)}
                        >
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Chỉnh sửa">
                        <IconButton
                          size="small"
                          onClick={() => onEdit?.(score)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {tab === 1 && (
        <SupervisorScoreTable scores={mockSupervisorScores} />
      )}

      {tab === 2 && (
        <ReviewerScoreTable scores={mockReviewerScores} />
      )}

      {tab === 3 && (
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography color="text.secondary">
            Điểm hội đồng sẽ được cập nhật sau buổi bảo vệ
          </Typography>
        </Paper>
      )}
    </Box>
  );
}

function SupervisorScoreTable({ scores }: { scores: SupervisorScore[] }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: "grey.100" }}>
            <TableCell sx={{ fontWeight: 600 }}>STT</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Đề tài</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Tiến độ</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Kỹ năng</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Thái độ</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Báo cáo</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Tổng</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {scores.map((score, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>Đề tài {score.registrationId}</TableCell>
              <TableCell>
                <Chip label={score.progressScore} size="small" color={getScoreColor(score.progressScore)} />
              </TableCell>
              <TableCell>
                <Chip label={score.skillScore} size="small" color={getScoreColor(score.skillScore)} />
              </TableCell>
              <TableCell>
                <Chip label={score.attitudeScore} size="small" color={getScoreColor(score.attitudeScore)} />
              </TableCell>
              <TableCell>
                <Chip label={score.reportScore} size="small" color={getScoreColor(score.reportScore)} />
              </TableCell>
              <TableCell>
                <Chip label={score.totalScore} size="small" color={getScoreColor(score.totalScore)} variant="outlined" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function ReviewerScoreTable({ scores }: { scores: ReviewerScore[] }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: "grey.100" }}>
            <TableCell sx={{ fontWeight: 600 }}>STT</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>SV</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Phản biện</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Nội dung</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Phương pháp</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Kết quả</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Trình bày</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Tổng</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {scores.map((score, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>SV {score.registrationId}</TableCell>
              <TableCell>{score.reviewerName}</TableCell>
              <TableCell>
                <Chip label={score.contentScore} size="small" color={getScoreColor(score.contentScore)} />
              </TableCell>
              <TableCell>
                <Chip label={score.methodologyScore} size="small" color={getScoreColor(score.methodologyScore)} />
              </TableCell>
              <TableCell>
                <Chip label={score.resultScore} size="small" color={getScoreColor(score.resultScore)} />
              </TableCell>
              <TableCell>
                <Chip label={score.presentationScore} size="small" color={getScoreColor(score.presentationScore)} />
              </TableCell>
              <TableCell>
                <Chip label={score.totalScore} size="small" color={getScoreColor(score.totalScore)} variant="outlined" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
