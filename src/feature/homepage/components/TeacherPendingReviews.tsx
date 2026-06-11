"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import { PENDING_THESES } from "../data";

export function TeacherPendingReviews() {
  return (
    <Card sx={{ p: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 2 }}>
        Chờ phản biện
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {PENDING_THESES.slice(0, 4).map((thesis) => (
          <Box key={thesis.id}>
            <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
              {thesis.title}
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="caption" color="text.secondary">
                {thesis.student}
              </Typography>
              <Chip
                label={thesis.status}
                size="small"
                color={
                  thesis.status === "Chờ duyệt"
                    ? "warning"
                    : thesis.status === "Chờ phản biện"
                      ? "info"
                      : "default"
                }
              />
            </Box>
          </Box>
        ))}
      </Box>
    </Card>
  );
}
