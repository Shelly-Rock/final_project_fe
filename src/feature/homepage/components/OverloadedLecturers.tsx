"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import { OVERLOADED_LECTURERS } from "../data";

export function OverloadedLecturers() {
  return (
    <Card
      className="dashboard-card overloaded-lecturers-card"
      sx={{ p: 2, mb: 4 }}
    >
      <Box className="dashboard-card-header" sx={{ px: 1, pt: 0.5, pb: 1.5 }}>
        <Typography className="dashboard-card-title">
          <i
            className="bi bi-person-exclamation"
            style={{ marginRight: 8, color: "#e89b33" }}
          />
          Giảng viên quá tải
        </Typography>
      </Box>
      <Box className="dashboard-card-body" sx={{ px: 1 }}>
        <Box className="lecturers-list">
          {OVERLOADED_LECTURERS.map((lecturer) => {
            const isOverloaded = lecturer.thesisCount > lecturer.maxThreshold;
            return (
              <Box key={lecturer.id} className="lecturer-item">
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    background: isOverloaded ? "#ffebeb" : "#e8efff",
                    color: isOverloaded ? "#d13b3b" : "#2a5bc0",
                  }}
                >
                  {lecturer.name.charAt(lecturer.name.lastIndexOf(" ") + 1)}
                </Avatar>
                <Box className="lecturer-info">
                  <Typography className="lecturer-name">
                    {lecturer.name}
                  </Typography>
                  <Box className="lecturer-count" sx={{ display: "flex", alignItems: "center" }}>
                    {lecturer.thesisCount} đồ án
                    {isOverloaded && (
                      <Chip
                        label="Quá tải"
                        size="small"
                        sx={{
                          ml: 1,
                          height: 18,
                          fontSize: "0.65rem",
                          backgroundColor: "#ffebeb",
                          color: "#d13b3b",
                          fontWeight: 600,
                        }}
                      />
                    )}
                  </Box>
                </Box>
                <Box
                  className="lecturer-progress"
                  sx={{
                    color: isOverloaded ? "#d13b3b" : "#2a5bc0",
                    fontWeight: 700,
                  }}
                >
                  {Math.round(
                    (lecturer.thesisCount / lecturer.maxThreshold) * 100,
                  )}
                  %
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Card>
  );
}
