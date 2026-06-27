"use client";

import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
} from "@mui/material";
import {
  Shield as ShieldIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";

interface ThesisToGrade {
  id: string;
  studentName: string;
  topicName: string;
  defenseDate: string;
  role: string;
  scored: boolean;
}

const mockTheses: ThesisToGrade[] = [
  { id: "t1", studentName: "Nguyễn Văn Minh", topicName: "Ứng dụng AI trong y tế", defenseDate: "2026-12-10", role: "Ủy viên 1", scored: false },
  { id: "t2", studentName: "Trần Thị Lan", topicName: "Hệ thống IoT", defenseDate: "2026-12-10", role: "Ủy viên 1", scored: true },
  { id: "t3", studentName: "Lê Văn Hoàng", topicName: "Blockchain", defenseDate: "2026-12-11", role: "Ủy viên 1", scored: false },
];

export default function CouncilTopicsPage() {
  const router = useRouter();
  const [theses] = useState(mockTheses);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
          Phân công chấm điểm
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Danh sách luận văn được phân công chấm điểm trong Hội đồng của bạn.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {theses.map((thesis) => (
          <Grid item xs={12} md={6} lg={4} key={thesis.id}>
            <Card sx={{
              border: "2px solid",
              borderColor: thesis.scored ? "success.main" : "warning.main",
              borderRadius: 2,
            }}>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1.5 }}>
                  <Chip
                    icon={<ShieldIcon sx={{ fontSize: "14px !important" }} />}
                    label={thesis.role}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                  <Chip
                    label={thesis.scored ? "Đã chấm" : "Chưa chấm"}
                    size="small"
                    color={thesis.scored ? "success" : "warning"}
                  />
                </Box>

                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontSize: "0.95rem" }}>
                  {thesis.topicName}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  SV: {thesis.studentName}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: "block" }}>
                  Ngày bảo vệ: {new Date(thesis.defenseDate).toLocaleDateString("vi-VN")}
                </Typography>

                <Button
                  fullWidth
                  variant={thesis.scored ? "outlined" : "contained"}
                  color={thesis.scored ? "success" : "warning"}
                  onClick={() => router.push(`/council/grading/${thesis.id}`)}
                >
                  {thesis.scored ? "Xem lại phiếu" : "Chấm điểm"}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
