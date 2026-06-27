"use client";

import { Box, Typography, Paper, Divider } from "@mui/material";
import { RateReview as ReviewIcon } from "@mui/icons-material";

export interface FeedbackColumn {
  role: string;
  roleLabel: string;
  feedback: string;
  score?: number | null; // optional sub-score
}

interface ThreeColumnFeedbackProps {
  columns: FeedbackColumn[];
  title?: string;
  showScores?: boolean;
  readonly?: boolean;
}

const ROLE_COLORS: Record<string, "primary" | "info" | "warning" | "secondary"> = {
  gvhd: "primary",
  pbNgoai: "info",
  chutich: "warning",
};

const ROLE_ICONS: Record<string, string> = {
  gvhd: "GVHD",
  pbNgoai: "PB",
  chutich: "CT",
};

export function ThreeColumnFeedback({
  columns,
  title = "Nhận xét từ Hội đồng",
  showScores = false,
  readonly = false,
}: ThreeColumnFeedbackProps) {
  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <ReviewIcon sx={{ color: "text.secondary", fontSize: 18 }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns.length}, 1fr)`,
          gap: 2,
        }}
      >
        {columns.map((col) => {
          const colorKey = ROLE_COLORS[col.role] ?? "primary";

          return (
            <Box
              key={col.role}
              sx={{
                p: 1.5,
                border: "1px solid",
                borderColor: `${colorKey}.main`,
                borderRadius: 1.5,
                bgcolor: `${colorKey}.50`,
              }}
            >
              {/* Header */}
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 900,
                    color: `${colorKey}.dark`,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  {col.roleLabel}
                </Typography>
                {showScores && col.score !== undefined && col.score !== null && (
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 900, fontFamily: "monospace", color: `${colorKey}.main` }}
                  >
                    {col.score}/100
                  </Typography>
                )}
              </Box>

              {/* Content */}
              {readonly ? (
                <Box>
                  {col.feedback.split("\n").filter(Boolean).map((line, idx) => (
                    <Typography
                      key={idx}
                      variant="caption"
                      sx={{
                        display: "block",
                        mb: 0.5,
                        color: "text.secondary",
                        lineHeight: 1.5,
                      }}
                    >
                      • {line.trim()}
                    </Typography>
                  ))}
                  {!col.feedback && (
                    <Typography variant="caption" color="text.disabled" sx={{ fontStyle: "italic" }}>
                      (Không có nhận xét)
                    </Typography>
                  )}
                </Box>
              ) : (
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    lineHeight: 1.6,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {col.feedback || "(Chưa có nhận xét)"}
                </Typography>
              )}
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
}
