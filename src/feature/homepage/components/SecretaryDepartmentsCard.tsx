"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";

const SECRETARY_DEPARTMENTS = [
  {
    id: 1,
    name: "Công nghệ thông tin",
    code: "CNTT",
    thesisCount: 45,
    studentCount: 320,
  },
  {
    id: 2,
    name: "Kỹ thuật phần mềm",
    code: "KPM",
    thesisCount: 32,
    studentCount: 210,
  },
];

export function SecretaryDepartmentsCard() {
  return (
    <Card sx={{ p: 2 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
        Khoa bạn đang quản lý
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {SECRETARY_DEPARTMENTS.map((dept) => (
          <Box
            key={dept.id}
            sx={{
              p: 2,
              bgcolor: "background.default",
              borderRadius: 1,
              borderLeft: "4px solid",
              borderLeftColor: "primary.main",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {dept.name}
              </Typography>
              <Chip label={dept.code} size="small" />
            </Box>
            <Box sx={{ display: "flex", gap: 3 }}>
              <Box>
                <Typography variant="h6" color="primary">
                  {dept.thesisCount}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Đồ án
                </Typography>
              </Box>
              <Box>
                <Typography variant="h6" color="success.main">
                  {dept.studentCount}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Sinh viên
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Card>
  );
}
