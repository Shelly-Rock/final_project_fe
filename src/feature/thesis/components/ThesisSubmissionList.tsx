"use client";

import {
  Box,
  Typography,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  LinearProgress,
  Alert,
} from "@mui/material";
import {
  Description as FileIcon,
  CheckCircle as CheckIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";
import type { ThesisSubmission } from "../constants";

interface ThesisSubmissionListProps {
  submissions: ThesisSubmission[];
}

export function ThesisSubmissionList({
  submissions,
}: ThesisSubmissionListProps) {
  const submittedCount = submissions.filter(
    (s) => s.status === "submitted",
  ).length;
  const progress = (submittedCount / submissions.length) * 100;

  return (
    <>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Tiến độ nộp bài
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ flexGrow: 1, height: 10, borderRadius: 5 }}
          />
          <Typography variant="body2" color="text.secondary">
            {submittedCount}/{submissions.length} đã nộp
          </Typography>
        </Box>
        {progress === 100 && (
          <Alert severity="success">
            Bạn đã hoàn thành tất cả các bài nộp!
          </Alert>
        )}
      </Paper>

      <Paper>
        <List>
          {submissions.map((submission) => (
            <ListItem
              key={submission.id}
              sx={{
                borderBottom: "1px solid",
                borderColor: "divider",
                "&:last-child": { borderBottom: "none" },
              }}
              secondaryAction={
                <Chip
                  icon={
                    submission.status === "submitted" ? (
                      <CheckIcon />
                    ) : (
                      <ScheduleIcon />
                    )
                  }
                  label={
                    submission.status === "submitted" ? "Đã nộp" : "Chờ nộp"
                  }
                  color={
                    submission.status === "submitted" ? "success" : "warning"
                  }
                  size="small"
                />
              }
            >
              <ListItemIcon>
                <FileIcon color="action" />
              </ListItemIcon>
              <ListItemText
                primary={submission.name}
                secondary={`Hạn chót: ${submission.deadline}${submission.file ? ` • ${submission.file}` : ""}`}
              />
              {submission.status === "pending" && (
                <Button size="small" variant="outlined" sx={{ mr: 2 }}>
                  Nộp bài
                </Button>
              )}
            </ListItem>
          ))}
        </List>
      </Paper>
    </>
  );
}
