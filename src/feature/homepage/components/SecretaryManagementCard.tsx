"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import { OVERLOADED_LECTURERS } from "../data";

export function SecretaryManagementCard() {
  return (
    <Card sx={{ p: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 2 }}>
        Giảng viên quá tải
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {OVERLOADED_LECTURERS.map((lecturer) => (
          <Box key={lecturer.id}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {lecturer.name}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "error.main",
                  fontWeight: 600,
                }}
              >
                {lecturer.thesisCount}/{lecturer.maxThreshold}
              </Typography>
            </Box>
            <Box sx={{ mt: 0.5 }}>
              <Box
                component="span"
                sx={{
                  fontSize: "0.7rem",
                  color: "error.main",
                  fontWeight: 500,
                }}
              >
                Quá {lecturer.thesisCount - lecturer.maxThreshold} đồ án
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Card>
  );
}
