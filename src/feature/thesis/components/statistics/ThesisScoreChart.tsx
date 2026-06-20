"use client";

import {
  Box,
  Paper,
  Typography,
} from "@mui/material";
import {
  mockThesisStatistics,
  getScoreDistributionPercentages,
} from "@/feature/thesis/constants";

export function ThesisScoreChart() {
  const stats = mockThesisStatistics;
  const percentages = getScoreDistributionPercentages(stats.scoreDistribution);
  
  const grades = ["A+", "A", "B+", "B", "C+", "C", "D", "F"];
  const colors: Record<string, string> = {
    "A+": "#2e7d32",
    "A": "#4caf50",
    "B+": "#2196f3",
    "B": "#03a9f4",
    "C+": "#ff9800",
    "C": "#ff5722",
    "D": "#f44336",
    "F": "#9e0000",
  };

  // Find max percentage for scaling
  const maxPercentage = Math.max(...Object.values(percentages));

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Phân bố điểm
      </Typography>
      
      <Box sx={{ mt: 3 }}>
        {grades.map((grade) => {
          const count = stats.scoreDistribution[grade] || 0;
          const percentage = percentages[grade] || 0;
          
          if (count === 0) return null;
          
          return (
            <Box key={grade} sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                <Typography variant="body2" fontWeight={500}>
                  {grade}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {count} SV ({percentage}%)
                </Typography>
              </Box>
              <Box
                sx={{
                  height: 24,
                  bgcolor: "grey.200",
                  borderRadius: 1,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    height: "100%",
                    width: `${(percentage / maxPercentage) * 100}%`,
                    bgcolor: colors[grade] || "grey.500",
                    transition: "width 0.5s ease-in-out",
                  }}
                />
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Legend */}
      <Box sx={{ mt: 3, display: "flex", justifyContent: "center", gap: 2, flexWrap: "wrap" }}>
        {grades.map((grade) => (
          <Box key={grade} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                bgcolor: colors[grade] || "grey.500",
              }}
            />
            <Typography variant="caption">{grade}</Typography>
          </Box>
        ))}
      </Box>

      {/* Summary Stats */}
      <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: "divider" }}>
        <Box sx={{ display: "flex", justifyContent: "space-around" }}>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h5" color="primary">
              {stats.averageScore.toFixed(1)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Điểm trung bình
            </Typography>
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h5" color="success.main">
              {Math.max(...Object.entries(stats.scoreDistribution)
                .filter(([_, count]) => count > 0)
                .map(([grade]) => grade === "A+" ? 10 : grade === "A" ? 9 : grade === "B+" ? 8.5 : grade === "B" ? 7.5 : grade === "C+" ? 6.5 : grade === "C" ? 5.5 : grade === "D" ? 4.5 : 3.5)).toFixed(1)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Điểm cao nhất
            </Typography>
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h5" color="info.main">
              {Object.values(stats.scoreDistribution).reduce((a, b) => a + b, 0)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Tổng SV
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}
