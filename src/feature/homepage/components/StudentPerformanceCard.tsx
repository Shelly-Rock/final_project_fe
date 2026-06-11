"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import LinearProgress from "@mui/material/LinearProgress";
import Grid from "@mui/material/Grid2";
import { STUDENT_THESIS, PerformanceRating } from "../data";

// Star Rating Component
function StarRating({ rating, size = 20 }: { rating: number; size?: number }) {
  return (
    <Box sx={{ display: "flex", gap: 0.25 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <i
          key={star}
          className={star <= rating ? "bi bi-star-fill" : "bi bi-star"}
          style={{
            fontSize: size,
            color: star <= rating ? "#e89b33" : "#e0e0e0",
          }}
        />
      ))}
    </Box>
  );
}

// Performance Radar Chart (simplified with bars)
function PerformanceRadar({ performance }: { performance: PerformanceRating }) {
  const criteria = [
    {
      key: "communication",
      label: "Giao tiếp",
      value: performance.communication,
    },
    { key: "technical", label: "Kỹ thuật", value: performance.technical },
    { key: "punctuality", label: "Đúng hạn", value: performance.punctuality },
    { key: "quality", label: "Chất lượng", value: performance.quality },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      {criteria.map((item) => (
        <Box key={item.key}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 0.5,
            }}
          >
            <Typography variant="caption" color="text.secondary">
              {item.label}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <StarRating rating={item.value} size={14} />
              <Typography
                variant="caption"
                sx={{ fontWeight: 600, minWidth: 16, textAlign: "right" }}
              >
                {item.value}/5
              </Typography>
            </Box>
          </Box>
          <LinearProgress
            variant="determinate"
            value={(item.value / 5) * 100}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: "#f0f0f0",
              "& .MuiLinearProgress-bar": {
                bgcolor:
                  item.value >= 4
                    ? "#1dab60"
                    : item.value >= 3
                      ? "#e89b33"
                      : "#d13b3b",
                borderRadius: 3,
              },
            }}
          />
        </Box>
      ))}
    </Box>
  );
}

export function StudentPerformanceCard() {
  const daysLeft = Math.ceil(
    (new Date("2026-07-15").getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24),
  );

  return (
    <Card sx={{ p: 2, mb: 4 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 3 }}>
        <i
          className="bi bi-mortarboard"
          style={{ marginRight: 8, color: "#2a5bc0" }}
        />
        Đồ án của tôi
      </Typography>

      <Grid container spacing={4}>
        {/* Left Column - Thesis Info, Progress & Performance */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              {STUDENT_THESIS.title}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>GVHD:</strong> {STUDENT_THESIS.teacher}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Ngày bắt đầu:</strong> {STUDENT_THESIS.startDate}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Deadline:</strong> {STUDENT_THESIS.deadline}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="body2" color="text.secondary">
                Tiến độ tổng thể
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {STUDENT_THESIS.progress}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={STUDENT_THESIS.progress}
              sx={{ height: 12, borderRadius: 6 }}
            />
          </Box>

          <Grid container spacing={1.5} sx={{ mb: 3 }}>
            <Grid size={4}>
              <Box
                sx={{
                  textAlign: "center",
                  p: 2,
                  bgcolor: "background.default",
                  borderRadius: 1,
                }}
              >
                <Typography
                  variant="h5"
                  color="primary"
                  sx={{ fontWeight: 700 }}
                >
                  {STUDENT_THESIS.milestones.filter((m) => m.completed).length}/
                  {STUDENT_THESIS.milestones.length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Mốc hoàn thành
                </Typography>
              </Box>
            </Grid>
            <Grid size={4}>
              <Box
                sx={{
                  textAlign: "center",
                  p: 2,
                  bgcolor: "background.default",
                  borderRadius: 1,
                }}
              >
                <Typography
                  variant="h5"
                  color="warning.main"
                  sx={{ fontWeight: 700 }}
                >
                  {daysLeft}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Ngày đến deadline
                </Typography>
              </Box>
            </Grid>
            <Grid size={4}>
              <Box
                sx={{
                  textAlign: "center",
                  p: 2,
                  bgcolor: "background.default",
                  borderRadius: 1,
                }}
              >
                <Box
                  sx={{ display: "flex", justifyContent: "center", mb: 0.5 }}
                >
                  <StarRating
                    rating={STUDENT_THESIS.performance.overall}
                    size={18}
                  />
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Đánh giá GV
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Performance Rating Section */}
          <Box
            sx={{
              p: 2,
              bgcolor: "#fffbf0",
              borderRadius: 1,
              border: "1px solid",
              borderColor: "#e89b33",
            }}
          >
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, mb: 2, color: "#e89b33" }}
            >
              <i className="bi bi-bar-chart-fill" style={{ marginRight: 4 }} />
              Đánh giá từ Giảng viên
            </Typography>
            <PerformanceRadar performance={STUDENT_THESIS.performance} />
          </Box>
        </Grid>

        {/* Right Column - Milestones */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 500, mb: 2, color: "text.secondary" }}
          >
            Các mốc tiến độ
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {STUDENT_THESIS.milestones.map((milestone, index) => (
              <Box
                key={milestone.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 1.5,
                  bgcolor: "background.default",
                  borderRadius: 1,
                  opacity: milestone.completed ? 1 : 0.85,
                }}
              >
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    bgcolor: milestone.completed ? "success.main" : "grey.300",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  {milestone.completed ? "✓" : index + 1}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {milestone.name}
                  </Typography>
                  {milestone.date && (
                    <Typography variant="caption" color="text.secondary">
                      Hoàn thành: {milestone.date}
                    </Typography>
                  )}
                </Box>
                {!milestone.completed && milestone.progress > 0 && (
                  <Box sx={{ width: 120 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 0.5,
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Tiến độ
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 500 }}>
                        {milestone.progress}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={milestone.progress}
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Box>
                )}
                {!milestone.completed && milestone.progress === 0 && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ px: 2 }}
                  >
                    Chưa bắt đầu
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
}
