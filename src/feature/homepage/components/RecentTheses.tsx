"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Chip from "@mui/material/Chip";
import { RECENT_THESES, STATUS_COLORS } from "../data";

export function RecentTheses() {
  return (
    <Card className="dashboard-card">
      <Box className="dashboard-card-header">
        <Typography className="dashboard-card-title">Đồ án gần đây</Typography>
        <Button size="small" endIcon={<span className="bi bi-arrow-right" />}>
          Xem tất cả
        </Button>
      </Box>
      <Box className="dashboard-card-body dashboard-table-wrap">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Đồ án</th>
              <th>GV hướng dẫn</th>
              <th>Tiến độ</th>
              <th>Trạng thái</th>
              <th>Hạn nộp</th>
            </tr>
          </thead>
          <tbody>
            {RECENT_THESES.map((t) => {
              const sc = STATUS_COLORS[t.status] ?? {
                bg: "#f3f4f6",
                color: "#6b7280",
              };
              return (
                <tr key={t.id}>
                  <td>
                    <Box className="dashboard-thesis-cell">
                      <Typography className="dashboard-thesis-title">
                        {t.title}
                      </Typography>
                      <Typography className="dashboard-thesis-meta">
                        <span className="bi bi-person" /> {t.student}
                        <span
                          className="bi bi-journal"
                          style={{ marginLeft: 12 }}
                        />{" "}
                        {t.major}
                      </Typography>
                    </Box>
                  </td>
                  <td>
                    <Typography className="dashboard-table-text">
                      {t.teacher}
                    </Typography>
                  </td>
                  <td>
                    <Box className="dashboard-progress-cell">
                      <LinearProgress
                        variant="determinate"
                        value={t.progress}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: "#e5e7eb",
                          "& .MuiLinearProgress-bar": {
                            backgroundColor:
                              t.progress === 100 ? "#1dab60" : "#2a5bc0",
                            borderRadius: 3,
                          },
                        }}
                      />
                      <Typography
                        component="span"
                        className="dashboard-progress-label"
                      >
                        {t.progress}%
                      </Typography>
                    </Box>
                  </td>
                  <td>
                    <Chip
                      label={t.status}
                      size="small"
                      sx={{
                        backgroundColor: sc.bg,
                        color: sc.color,
                        fontWeight: 500,
                        fontSize: "0.72rem",
                        border: "none",
                      }}
                    />
                  </td>
                  <td>
                    <Typography className="dashboard-table-text">
                      {t.due}
                    </Typography>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Box>
    </Card>
  );
}
