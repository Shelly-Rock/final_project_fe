"use client";

import { Box, Typography, Paper, Divider, Tooltip, Chip } from "@mui/material";
import { Help as HelpIcon } from "@mui/icons-material";

interface WeightedScoreFormulaProps {
  gvhdScore: number; // 0-100
  pbNgoaiScore: number; // 0-100
  hoiDongAvg: number; // average of CT + TK + PB trong
  bonusScore?: number; // 0-3
  readonly?: boolean;
  compact?: boolean;
}

function computeFinalScore(
  gvhdScore: number,
  pbNgoaiScore: number,
  hoiDongAvg: number,
  bonusScore: number = 0
): number {
  const raw = gvhdScore * 0.4 + pbNgoaiScore * 0.2 + hoiDongAvg * 0.4;
  return Math.min(100, Math.max(0, raw + bonusScore));
}

export function WeightedScoreFormula({
  gvhdScore,
  pbNgoaiScore,
  hoiDongAvg,
  bonusScore = 0,
  readonly = false,
  compact = false,
}: WeightedScoreFormulaProps) {
  const finalScore = computeFinalScore(gvhdScore, pbNgoaiScore, hoiDongAvg, bonusScore);

  const formulaText = `Điểm = (GVHD × 0.4) + (PB ngoài × 0.2) + (HĐ × 0.4) + Cộng`;

  const breakdown = [
    {
      label: "GVHD (40%)",
      value: gvhdScore,
      weight: 0.4,
      color: "primary",
      contribution: gvhdScore * 0.4,
    },
    {
      label: "PB ngoài (20%)",
      value: pbNgoaiScore,
      weight: 0.2,
      color: "info",
      contribution: pbNgoaiScore * 0.2,
    },
    {
      label: "Hội đồng (40%)",
      value: hoiDongAvg,
      weight: 0.4,
      color: "warning",
      contribution: hoiDongAvg * 0.4,
    },
    {
      label: "Điểm cộng",
      value: bonusScore,
      weight: null,
      color: "success",
      contribution: bonusScore,
      isBonus: true,
    },
  ];

  if (compact) {
    return (
      <Tooltip
        title={
          <Box sx={{ p: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, display: "block", mb: 1 }}>
              {formulaText}
            </Typography>
            {breakdown.map((b) => (
              <Typography key={b.label} variant="caption" sx={{ display: "block" }}>
                {b.label}: {b.value} × {b.weight ?? 1} = {b.contribution}
              </Typography>
            ))}
            <Divider sx={{ my: 0.5 }} />
            <Typography variant="caption" sx={{ fontWeight: 700 }}>
              = {finalScore.toFixed(2)}/100
            </Typography>
          </Box>
        }
        arrow
      >
        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, cursor: "help" }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 900,
              fontFamily: "monospace",
              color: finalScore >= 50 ? "success.main" : "error.main",
            }}
          >
            {finalScore.toFixed(1)}
          </Typography>
          <HelpIcon sx={{ fontSize: 14, color: "text.secondary" }} />
        </Box>
      </Tooltip>
    );
  }

  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          Công thức tính điểm tổng
        </Typography>
        <Chip
          label="Hover để xem chi tiết"
          size="small"
          variant="outlined"
          sx={{ fontSize: "0.6rem" }}
        />
      </Box>

      {/* Formula bar */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr) 40px 1fr",
          alignItems: "center",
          gap: 1,
          p: 1.5,
          bgcolor: "grey.50",
          borderRadius: 1,
          mb: 1.5,
        }}
      >
        <Typography variant="caption" sx={{ fontWeight: 700, color: "primary.main", textAlign: "center" }}>
          GVHD × 0.4
        </Typography>
        <Typography variant="caption" sx={{ fontWeight: 700, color: "info.main", textAlign: "center" }}>
          PB ngoài × 0.2
        </Typography>
        <Typography variant="caption" sx={{ fontWeight: 700, color: "warning.main", textAlign: "center" }}>
          HĐ × 0.4
        </Typography>
        <Typography variant="caption" sx={{ textAlign: "center" }}>+</Typography>
        <Typography variant="caption" sx={{ fontWeight: 700, color: "success.main", textAlign: "center" }}>
          Cộng (max 3)
        </Typography>
      </Box>

      {/* Breakdown */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {breakdown.map((b) => (
          <Box
            key={b.label}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 1,
              borderRadius: 1,
              bgcolor: `${b.color}.50`,
              border: "1px solid",
              borderColor: `${b.color}.200`,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: `${b.color}.main`,
                  flexShrink: 0,
                }}
              />
              <Typography variant="caption" sx={{ fontWeight: 700 }}>
                {b.label}
              </Typography>
              {b.weight !== null && (
                <Chip
                  label={`× ${b.weight}`}
                  size="small"
                  sx={{ height: 16, fontSize: "0.6rem", fontFamily: "monospace" }}
                />
              )}
              {b.isBonus && (
                <Chip
                  label="max 3"
                  size="small"
                  color="warning"
                  sx={{ height: 16, fontSize: "0.6rem" }}
                />
              )}
            </Box>
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
              <Typography
                variant="caption"
                sx={{ fontWeight: 900, fontFamily: "monospace", color: `${b.color}.main` }}
              >
                {b.value}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                × {b.weight ?? 1} ={" "}
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 900, fontFamily: "monospace" }}>
                {b.contribution.toFixed(1)}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      <Divider sx={{ my: 1.5 }} />

      {/* Result */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          Điểm tổng (thang 100):
        </Typography>
        <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 900,
              fontFamily: "monospace",
              color: finalScore >= 50 ? "success.main" : finalScore >= 30 ? "warning.main" : "error.main",
            }}
          >
            {finalScore.toFixed(2)}
          </Typography>
          <Typography variant="body2" color="text.secondary">/ 100</Typography>
        </Box>
      </Box>

      {/* Grade */}
      <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
        {[
          { grade: "A", min: 90, color: "success" },
          { grade: "B", min: 80, color: "info" },
          { grade: "C", min: 70, color: "primary" },
          { grade: "D", min: 50, color: "warning" },
          { grade: "F", min: 0, color: "error" },
        ].map((g) => (
          <Chip
            key={g.grade}
            label={`${g.grade}: ≥${g.min}`}
            size="small"
            color={g.min <= finalScore ? (g.color as "success" | "info" | "primary" | "warning" | "error") : "default"}
            sx={{ fontSize: "0.6rem", fontWeight: 700 }}
          />
        ))}
      </Box>
    </Paper>
  );
}
