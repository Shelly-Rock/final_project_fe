"use client";

import {
  Paper,
  Typography,
  Box,
  Chip,
  Stack,
  Divider,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import {
  Person as PersonIcon,
  School as ThesisIcon,
  CalendarMonth as DateIcon,
  Room as RoomIcon,
  Groups as CouncilIcon,
  Star as ScoreIcon,
} from "@mui/icons-material";
import { getScoreColorSafe as getScoreColor, getLetterGrade } from "@/feature/thesis/constants";
import type { ThesisDefense, DefenseSchedule, CouncilMember } from "@/feature/thesis/types";

interface DefenseDetailCardProps {
  defense: ThesisDefense;
  schedule?: DefenseSchedule;
  councilScores?: Array<{
    memberName: string;
    totalScore: number;
  }>;
}

export function DefenseDetailCard({
  defense,
  schedule,
  councilScores = [],
}: DefenseDetailCardProps) {
  const avgCouncilScore =
    councilScores.length > 0
      ? councilScores.reduce((sum, s) => sum + s.totalScore, 0) / councilScores.length
      : defense.score;

  return (
    <Paper sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
        <Box>
          <Typography variant="h5" gutterBottom>
            Chi tiết bảo vệ
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Chip label={`Mã: ${defense.id}`} size="small" variant="outlined" />
            <Chip
              label={
                defense.status === "completed"
                  ? "Hoàn thành"
                  : defense.status === "scheduled"
                    ? "Đã xếp lịch"
                    : "Chờ xếp lịch"
              }
              color={
                defense.status === "completed"
                  ? "success"
                  : defense.status === "scheduled"
                    ? "info"
                    : "warning"
              }
            />
          </Stack>
        </Box>
        {defense.score != null && (
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h3" color={getScoreColor(defense.score ?? 0)}>
              {defense.score}
            </Typography>
            <Chip
              label={getLetterGrade(defense.score ?? 0)}
              color={getScoreColor(defense.score ?? 0)}
              size="medium"
            />
          </Box>
        )}
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Student Info */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Thông tin sinh viên
              </Typography>
              <Stack spacing={1}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <PersonIcon fontSize="small" color="action" />
                  <Typography variant="body2">{defense.student}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <ThesisIcon fontSize="small" color="action" />
                  <Typography variant="body2">{defense.thesis}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Thông tin bảo vệ
              </Typography>
              <Stack spacing={1}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <DateIcon fontSize="small" color="action" />
                  <Typography variant="body2">{defense.date}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <RoomIcon fontSize="small" color="action" />
                  <Typography variant="body2">{defense.room}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CalendarIcon fontSize="small" color="action" />
                  <Typography variant="body2">{defense.time}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Council Info */}
      {schedule && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Hội đồng bảo vệ
          </Typography>
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                {schedule.councilName}
              </Typography>
              <List>
                {schedule.councilMembers.map((member) => (
                  <ListItem key={member.id}>
                    <ListItemAvatar>
                      <Avatar>{member.name.charAt(0)}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={member.name}
                      secondary={member.department}
                    />
                    <Chip
                      label={
                        member.role === "chairman"
                          ? "Chủ tịch"
                          : member.role === "secretary"
                            ? "Thư ký"
                            : "Thành viên"
                      }
                      size="small"
                      color={
                        member.role === "chairman"
                          ? "primary"
                          : member.role === "secretary"
                            ? "secondary"
                            : "default"
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Council Scores */}
      {councilScores.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Điểm thành viên hội đồng
          </Typography>
          <Stack spacing={2}>
            {councilScores.map((score) => (
              <Box
                key={score.memberName}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 2,
                  bgcolor: "grey.50",
                  borderRadius: 1,
                }}
              >
                <Typography variant="body2">{score.memberName}</Typography>
                <Chip
                  label={score.totalScore}
                  color={getScoreColor(score.totalScore)}
                />
              </Box>
            ))}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 2,
                bgcolor: "primary.light",
                borderRadius: 1,
              }}
            >
              <Typography variant="body2" fontWeight={600}>
                Điểm trung bình hội đồng
              </Typography>
              <Chip
                label={avgCouncilScore?.toFixed(2)}
                color={getScoreColor(avgCouncilScore || 0)}
                sx={{ fontWeight: 600 }}
              />
            </Box>
          </Stack>
        </Box>
      )}

      {/* Progress */}
      {defense.status !== "completed" && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Tiến độ bảo vệ
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <LinearProgress
              variant="determinate"
              value={
                defense.status === "scheduled"
                  ? 25
                  : defense.status === "defending"
                    ? 75
                    : 0
              }
              sx={{ flex: 1, height: 10, borderRadius: 5 }}
            />
            <Typography variant="body2" color="text.secondary">
              {defense.status === "scheduled"
                ? "Đã xếp lịch"
                : defense.status === "defending"
                  ? "Đang bảo vệ"
                  : "Chờ xếp lịch"}
            </Typography>
          </Box>
        </Box>
      )}
    </Paper>
  );
}

function CalendarIcon({ fontSize, color = "action" }: { fontSize?: "small" | "inherit" | "large" | "medium"; color?: string }) {
  return <DateIcon fontSize={fontSize} color={color as "inherit" | "disabled" | "action" | "primary" | "secondary" | "error" | undefined} />;
}
