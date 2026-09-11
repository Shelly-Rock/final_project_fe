"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import { PageHeader } from "@/shared/components";
import { RoleGate } from "@/shared/components/PermissionGuard/PermissionGuard";
import { BarChart3 } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "@/shared/theme";
import { apiClient } from "@/shared/services/api-client";

interface SecretaryDashboard {
  students: number;
  teachers: number;
  projects: number;
  users: number;
  reports: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  projects_by_status: {
    pending: number;
    approved: number;
    rejected: number;
  };
}

export default function DashboardPage() {
  const [data, setData] = useState<SecretaryDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get<{ data: SecretaryDashboard }>(
          "/dashboard/secretary",
        );
        setData(response.data);
      } catch (e: unknown) {
        const msg =
          e instanceof Error ? e.message : "Không tải được dữ liệu dashboard";
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 3, display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!data) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Không tải được dữ liệu</Typography>
      </Box>
    );
  }

  const statCards = [
    { label: "Sinh viên", value: data.students, color: "#3b82f6" },
    { label: "Giảng viên", value: data.teachers, color: "#8b5cf6" },
    { label: "Đề tài", value: data.projects, color: "#f59e0b" },
    { label: "Tài khoản", value: data.users, color: "#10b981" },
  ];

  return (
    <RoleGate
      roles={["admin", "secretary"]}
      fallback={
        <Box sx={{ p: 3, width: "100%", textAlign: "center" }}>
          <Typography variant="h6" color="error">
            Bạn không có quyền truy cập trang này
          </Typography>
        </Box>
      }
    >
      <Box sx={{ p: 3, width: "100%" }}>
        <PageHeader
          title="Dashboard Thư ký"
          subtitle="Tổng quan thống kê hệ thống"
          illustration={<BarChart3 size={56} strokeWidth={1.5} />}
          showBgImage
        />

        <Grid container spacing={3}>
          {statCards.map((stat) => (
            <Grid item xs={12} sm={6} md={3} key={stat.label}>
              <Card
                elevation={0}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                }}
              >
                <CardContent>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {stat.label}
                  </Typography>
                  <Typography
                    variant="h3"
                    sx={{ fontWeight: 700, color: stat.color }}
                  >
                    {stat.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}

          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                Báo cáo tiến trình
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <StatRow
                  label="Tổng số báo cáo"
                  value={data.reports.total}
                  color="#6b7280"
                />
                <StatRow
                  label="Chờ duyệt"
                  value={data.reports.pending}
                  color="#f59e0b"
                />
                <StatRow
                  label="Đã duyệt"
                  value={data.reports.approved}
                  color="#10b981"
                />
                <StatRow
                  label="Từ chối"
                  value={data.reports.rejected}
                  color="#ef4444"
                />
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                Đề tài theo trạng thái
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <StatRow
                  label="Chờ duyệt"
                  value={data.projects_by_status.pending}
                  color="#f59e0b"
                />
                <StatRow
                  label="Đã duyệt"
                  value={data.projects_by_status.approved}
                  color="#10b981"
                />
                <StatRow
                  label="Từ chối"
                  value={data.projects_by_status.rejected}
                  color="#ef4444"
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </RoleGate>
  );
}

function StatRow({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        py: 1,
        px: 1.5,
        borderRadius: 1,
        bgcolor: "action.hover",
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h6" sx={{ fontWeight: 700, color }}>
        {value}
      </Typography>
    </Box>
  );
}
