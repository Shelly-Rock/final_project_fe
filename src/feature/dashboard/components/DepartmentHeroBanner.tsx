"use client";

import { Box, Grid, Typography, Button } from "@mui/material";
import { Download, Plus, ArrowLeft } from "lucide-react";

interface DepartmentHeroBannerProps {
  departmentName: string;
  departmentCode: string;
  onBack: () => void;
  onExport: () => void;
  onAddTopic: () => void;
}

export const DepartmentHeroBanner = ({
  departmentName,
  departmentCode,
  onBack,
  onExport,
  onAddTopic,
}: DepartmentHeroBannerProps) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Button
        startIcon={<ArrowLeft size={20} />}
        onClick={onBack}
        sx={{ mb: 2 }}
      >
        Quay lại
      </Button>
      <Box
        sx={{
          p: 3,
          borderRadius: 2,
          background:
            "linear-gradient(135deg, rgba(15, 23, 42, 0.75) 0%, rgba(30, 58, 138, 0.45) 50%, rgba(15, 23, 42, 0.85) 100%)",
          border: "1px solid",
          borderColor: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(16px)",
        }}
      >
        <Grid container spacing={3} alignItems="flex-start">
          <Grid item xs={12} sm="auto">
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: 2,
                background:
                  "linear-gradient(to br, rgba(59, 130, 246, 0.3) 0%, rgba(99, 102, 241, 0.3) 100%)",
                border: "2px solid",
                borderColor: "rgba(255,255,255,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "32px",
                  color: "#3b82f6",
                }}
              >
                🏢
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm>
            <Box sx={{ mb: 1 }}>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 1 }}>
                {/* Status Badge - KEEP THIS */}
                <Box
                  sx={{
                    px: 2.5,
                    py: 0.75,
                    borderRadius: "9999px",
                    bgcolor: "rgba(16, 185, 129, 0.1)",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      bgcolor: "#10b981",
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: "12px",
                      color: "#10b981",
                      fontWeight: 600,
                    }}
                  >
                    Đang hoạt động
                  </Typography>
                </Box>
                <Box
                  sx={{
                    px: 2.5,
                    py: 0.75,
                    borderRadius: "9999px",
                    bgcolor: "rgba(148, 163, 184, 0.1)",
                    border: "1px solid rgba(148, 163, 184, 0.3)",
                  }}
                >
                  <Typography sx={{ fontSize: "12px", color: "#94a3b8" }}>
                    Mã BM: {departmentCode}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              {departmentName}
            </Typography>
            <Typography sx={{ color: "text.secondary", maxWidth: 400 }}>
              Cổng quản lý, theo dõi thống kê và báo cáo tiến độ đề tài NCKH, đồ
              án chuyên ngành cấp khoa.
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sm="auto"
            sx={{
              display: "flex",
              gap: 1,
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            {/* Add Topic Button */}
            <Button
              variant="contained"
              startIcon={<Plus size={18} />}
              onClick={onAddTopic}
            >
              Thêm đề tài
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
