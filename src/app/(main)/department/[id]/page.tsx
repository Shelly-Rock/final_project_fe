"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Box,
  Grid,
  Card as MuiCard,
  CircularProgress,
  Typography,
  Button,
  useTheme,
  Theme,
} from "@mui/material";
import { PageHeader } from "@/shared/components";
import { RoleGate } from "@/shared/components/PermissionGuard/PermissionGuard";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useUserRole } from "@/shared/hooks/useUserRole";
import { ROLE } from "@/core/permissions/types";
import {
  facultyService,
  FacultySummary,
  FacultyProgressStats,
} from "@/feature/dashboard/services/department.service";
import { FacultyDetailSecretary } from "@/feature/dashboard/components/DepartmentDetailSecretary";
import { FacultyUpcomingEvents } from "@/feature/dashboard/components/FacultyUpcomingEvents";

const SYSTEM_BLUE = "#2563eb";

const getCardBackground = (theme: Theme) => {
  const isDark = theme.palette.mode === "dark";
  return isDark
    ? "linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 58, 138, 0.4) 100%)"
    : theme.palette.background.paper;
};

export default function DepartmentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const facultyId = params.id as string;
  const userRole = useUserRole();
  const theme = useTheme();

  const [department, setDepartment] = useState<FacultySummary | null>(null);
  const [progressStats, setProgressStats] =
    useState<FacultyProgressStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (userRole === ROLE.SECRETARY) {
          // Secretary view is handled by FacultyDetailSecretary component
        } else {
          const [deptData, statsData] = await Promise.all([
            facultyService.getFacultyDetail(facultyId),
            facultyService.getFacultyProgressStats(facultyId),
          ]);
          setDepartment(deptData);
          setProgressStats(statsData);
        }
      } catch (e: unknown) {
        const msg =
          e instanceof Error ? e.message : "Không tải được dữ liệu chi tiết";
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [facultyId, userRole]);

  if (loading) {
    return (
      <Box sx={{ p: 3, display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (userRole === ROLE.SECRETARY) {
    return <FacultyDetailSecretary />;
  }

  if (!department || !progressStats) {
    return (
      <Box sx={{ p: 3 }}>
        <Button
          startIcon={<ArrowLeft size={20} />}
          onClick={() => router.push("/department")}
          sx={{ mb: 2 }}
        >
          Quay lại
        </Button>
        <Typography color="error">Không tìm thấy dữ liệu</Typography>
      </Box>
    );
  }

  return (
    <RoleGate roles={["admin"]}>
      <Box sx={{ p: 3, width: "100%" }}>
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowLeft size={20} />}
            onClick={() => router.push("/department")}
            sx={{ mb: 2 }}
          >
            Quay lại
          </Button>
          <PageHeader
            title={`${department.faculty_name}`}
            subtitle="Thống kê tiến độ và báo cáo của khoa"
            showBgImage
          />
        </Box>

        {/* Summary Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <MuiCard
              elevation={0}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                p: 2,
                background: getCardBackground(theme),
              }}
            >
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Giảng viên
              </Typography>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: "#8b5cf6" }}
              >
                {department.teachers}
              </Typography>
            </MuiCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <MuiCard
              elevation={0}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                p: 2,
                background: getCardBackground(theme),
              }}
            >
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Tổng đề tài
              </Typography>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: "#6b7280" }}
              >
                {department.projects.total}
              </Typography>
            </MuiCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <MuiCard
              elevation={0}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                p: 2,
                background: getCardBackground(theme),
              }}
            >
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Tổng báo cáo
              </Typography>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: "#3b82f6" }}
              >
                {progressStats.summary.total}
              </Typography>
            </MuiCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <MuiCard
              elevation={0}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                p: 2,
                background: getCardBackground(theme),
              }}
            >
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Chờ duyệt
              </Typography>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: "#f59e0b" }}
              >
                {progressStats.summary.pending}
              </Typography>
            </MuiCard>
          </Grid>
        </Grid>

        {/* Progress Reports Chart */}
        <MuiCard
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            p: 3,
            background: getCardBackground(theme),
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
            Tiến độ báo cáo theo tháng
          </Typography>

          {progressStats.series.length === 0 ? (
            <Typography
              color="text.secondary"
              sx={{ py: 4, textAlign: "center" }}
            >
              Chưa có dữ liệu báo cáo
            </Typography>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart
                data={progressStats.series.map((item) => ({
                  ...item,
                  total: item.pending + item.approved + item.rejected,
                }))}
              >
                <defs>
                  <linearGradient
                    id="systemBlueArea"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={SYSTEM_BLUE}
                      stopOpacity={0.32}
                    />
                    <stop
                      offset="95%"
                      stopColor={SYSTEM_BLUE}
                      stopOpacity={0.04}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.12)"
                      : "#e5e7eb"
                  }
                />
                <XAxis
                  dataKey="label"
                  stroke={theme.palette.mode === "dark" ? "#ffff" : "#64748b"}
                  tick={{
                    fill: theme.palette.mode === "dark" ? "#ffff" : "#64748b",
                  }}
                />
                <YAxis
                  stroke={theme.palette.mode === "dark" ? "#ffff" : "#64748b"}
                  tick={{
                    fill: theme.palette.mode === "dark" ? "#ffff" : "#64748b",
                  }}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(15, 23, 42, 0.95)"
                        : "rgba(255,255,255,0.95)",
                    border: `1px solid ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.12)" : "#e5e7eb"}`,
                    borderRadius: "8px",
                    color: theme.palette.mode === "dark" ? "#ffff" : "#0f172a",
                  }}
                  labelStyle={{
                    color: theme.palette.mode === "dark" ? "#ffff" : "#0f172a",
                  }}
                  formatter={(value) => [value, "Tổng báo cáo"]}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  name="Tổng báo cáo"
                  stroke={SYSTEM_BLUE}
                  fill="url(#systemBlueArea)"
                  strokeWidth={3}
                  dot={{ r: 4, fill: SYSTEM_BLUE, stroke: SYSTEM_BLUE }}
                  activeDot={{
                    r: 6,
                    fill: SYSTEM_BLUE,
                    stroke: "#ffff",
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </MuiCard>

        {/* Summary Table */}
        {progressStats.series.length > 0 && (
          <MuiCard
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              p: 3,
              mt: 3,
              background: getCardBackground(theme),
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Chi tiết báo cáo
            </Typography>
            <Box sx={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  fontSize: "0.875rem",
                  borderCollapse: "collapse",
                }}
              >
                <thead
                  style={{
                    backgroundColor: "#2563eb",
                    borderBottom: "2px solid #1d4ed8",
                  }}
                >
                  <tr>
                    <th
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        fontWeight: 700,
                        color: "#ffffff",
                      }}
                    >
                      Tháng
                    </th>
                    <th
                      style={{
                        padding: "12px 16px",
                        textAlign: "center",
                        fontWeight: 700,
                        color: "#ffffff",
                      }}
                    >
                      Chờ duyệt
                    </th>
                    <th
                      style={{
                        padding: "12px 16px",
                        textAlign: "center",
                        fontWeight: 700,
                        color: "#ffffff",
                      }}
                    >
                      Đã duyệt
                    </th>
                    <th
                      style={{
                        padding: "12px 16px",
                        textAlign: "center",
                        fontWeight: 700,
                        color: "#ffffff",
                      }}
                    >
                      Từ chối
                    </th>
                    <th
                      style={{
                        padding: "12px 16px",
                        textAlign: "center",
                        fontWeight: 700,
                        color: "#ffffff",
                      }}
                    >
                      Tổng
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {progressStats.series.map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid #e5e7eb" }}>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontWeight: 500,
                          color: "#111827",
                        }}
                      >
                        {row.label}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          textAlign: "center",
                          color: "#f59e0b",
                          fontWeight: 500,
                        }}
                      >
                        {row.pending}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          textAlign: "center",
                          color: "#10b981",
                          fontWeight: 500,
                        }}
                      >
                        {row.approved}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          textAlign: "center",
                          color: "#ef4444",
                          fontWeight: 500,
                        }}
                      >
                        {row.rejected}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          textAlign: "center",
                          fontWeight: 600,
                          color: "#111827",
                        }}
                      >
                        {row.total}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </MuiCard>
        )}
        <FacultyUpcomingEvents facultyId={facultyId} />
      </Box>
    </RoleGate>
  );
}
