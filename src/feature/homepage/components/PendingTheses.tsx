"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import { PENDING_THESES, STATUS_COLORS } from "../data";

function getStatusColors(status: string) {
  return STATUS_COLORS[status] ?? { bg: "#f3f4f6", color: "#6b7280" };
}

export function PendingTheses() {
  return (
    <Card className="dashboard-card pending-theses-card" sx={{ p: 2, mb: 4 }}>
      <Box className="dashboard-card-header" sx={{ px: 1, pt: 0.5, pb: 1.5 }}>
        <Typography className="dashboard-card-title">
          <i
            className="bi bi-exclamation-triangle"
            style={{ marginRight: 8, color: "#d13b3b" }}
          />
          Đồ án cần xử lý
        </Typography>
        <Chip
          label={`${PENDING_THESES.length} cần xử lý`}
          size="small"
          sx={{
            backgroundColor: "#ffebeb",
            color: "#d13b3b",
            fontWeight: 600,
            fontSize: "0.7rem",
          }}
        />
      </Box>
      <Box className="dashboard-card-body dashboard-table-wrap" sx={{ px: 1 }}>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Đồ án</th>
              <th>Sinh viên</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {PENDING_THESES.map((thesis) => {
              const colors = getStatusColors(thesis.status);
              return (
                <tr key={thesis.id}>
                  <td>
                    <Typography className="dashboard-thesis-title">
                      {thesis.title}
                    </Typography>
                  </td>
                  <td>
                    <Typography className="dashboard-table-text">
                      {thesis.student}
                    </Typography>
                  </td>
                  <td>
                    <Chip
                      label={thesis.status}
                      size="small"
                      sx={{
                        backgroundColor: colors.bg,
                        color: colors.color,
                        fontWeight: 500,
                        fontSize: "0.7rem",
                        border: "none",
                      }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <Button
          fullWidth
          size="small"
          endIcon={<span className="bi bi-arrow-right" />}
          sx={{ mt: 2, color: "#2a5bc0", fontWeight: 600 }}
        >
          Xem tất cả đồ án
        </Button>
      </Box>
    </Card>
  );
}
