"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import LinearProgress from "@mui/material/LinearProgress";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid2";

const MY_THESES = [
  {
    id: 1,
    title: "Hệ thống quản lý học tập LMS",
    student: "Nguyễn Văn A",
    mssv: "SV001",
    progress: 75,
    status: "Đang thực hiện",
  },
  {
    id: 2,
    title: "Ứng dụng AI trong y tế",
    student: "Trần Thị B",
    mssv: "SV002",
    progress: 45,
    status: "Đang thực hiện",
  },
  {
    id: 3,
    title: "Website thương mại điện tử",
    student: "Lê Văn C",
    mssv: "SV003",
    progress: 90,
    status: "Sắp bảo vệ",
  },
  {
    id: 4,
    title: "App di động giao hàng",
    student: "Phạm Thị D",
    mssv: "SV004",
    progress: 30,
    status: "Đang thực hiện",
  },
];

const MY_STUDENTS = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    mssv: "SV001",
    avatar: "A",
    thesis: "Hệ thống LMS",
    progress: 75,
  },
  {
    id: 2,
    name: "Trần Thị B",
    mssv: "SV002",
    avatar: "B",
    thesis: "AI trong y tế",
    progress: 45,
  },
  {
    id: 3,
    name: "Lê Văn C",
    mssv: "SV003",
    avatar: "C",
    thesis: "Website TMĐT",
    progress: 90,
  },
  {
    id: 4,
    name: "Phạm Thị D",
    mssv: "SV004",
    avatar: "D",
    thesis: "App giao hàng",
    progress: 30,
  },
];

export function TeacherMyStudentsCard() {
  return (
    <Card sx={{ p: 2 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
        Đồ án & Sinh viên của tôi
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 500, mb: 1.5, color: "text.secondary" }}
          >
            Đồ án đang hướng dẫn
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {MY_THESES.map((thesis) => (
              <Box
                key={thesis.id}
                sx={{
                  p: 1.5,
                  bgcolor: "background.default",
                  borderRadius: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 500, mb: 0.5 }}
                    >
                      {thesis.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {thesis.student} • {thesis.mssv}
                    </Typography>
                  </Box>
                  <Chip
                    label={thesis.status}
                    size="small"
                    color={thesis.progress >= 80 ? "success" : "default"}
                  />
                </Box>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}
                >
                  <LinearProgress
                    variant="determinate"
                    value={thesis.progress}
                    sx={{ flex: 1, height: 6, borderRadius: 3 }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 600, minWidth: 40 }}
                  >
                    {thesis.progress}%
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 500, mb: 1.5, color: "text.secondary" }}
          >
            Sinh viên ({MY_STUDENTS.length})
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {MY_STUDENTS.map((student) => (
              <Box
                key={student.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  p: 1.5,
                  bgcolor: "background.default",
                  borderRadius: 1,
                }}
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    fontSize: "0.85rem",
                    bgcolor: "primary.main",
                  }}
                >
                  {student.avatar}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 500, lineHeight: 1.2 }}
                  >
                    {student.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {student.thesis}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "right" }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {student.progress}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {student.mssv}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
}
