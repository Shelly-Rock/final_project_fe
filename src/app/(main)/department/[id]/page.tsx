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
} from "@mui/material";
import { PageHeader } from "@/shared/components";
import { RoleGate } from "@/shared/components/PermissionGuard/PermissionGuard";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useUserRole } from "@/shared/hooks/useUserRole";
import { ROLE } from "@/core/permissions/types";
import {
  departmentService,
  DepartmentSummary,
  DepartmentProgressStats,
  DepartmentSecretaryDetail,
} from "@/feature/dashboard/services/department.service";
import { DepartmentDetailSecretary } from "@/feature/dashboard/components/DepartmentDetailSecretary";

const STATUS_COLORS = {
  pending: "#f59e0b",
  approved: "#10b981",
  rejected: "#ef4444",
};

export default function DepartmentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const departmentId = params.id as string;
  const userRole = useUserRole();

  const [department, setDepartment] = useState<DepartmentSummary | null>(null);
  const [secretaryDetail, setSecretaryDetail] =
    useState<DepartmentSecretaryDetail | null>(null);
  const [progressStats, setProgressStats] =
    useState<DepartmentProgressStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (userRole === ROLE.SECRETARY) {
          const detail =
            await departmentService.getDepartmentSecretaryDetail(departmentId);
          setSecretaryDetail(detail);
        } else {
          const [deptData, statsData] = await Promise.all([
            departmentService.getDepartmentDetail(departmentId),
            departmentService.getDepartmentProgressStats(departmentId),
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
  }, [departmentId, userRole]);

  if (loading) {
    return (
      <Box sx={{ p: 3, display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (userRole === ROLE.SECRETARY) {
    return <DepartmentDetailSecretary />;
  }

  if (!department || !progressStats) {
    return (
      <Box sx={{ p: 3 }}>
        <Button
          startIcon={<ArrowLeft size={20} />}
          onClick={() => router.back()}
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
            onClick={() => router.back()}
            sx={{ mb: 2 }}
          >
            Quay lại
          </Button>
          <PageHeader
            title={`${department.department_name}`}
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
              <BarChart data={progressStats.series}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255,255,255,0.95)",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                  formatter={(value) => value}
                />
                <Legend />
                <Bar
                  dataKey="pending"
                  fill={STATUS_COLORS.pending}
                  name="Chờ duyệt"
                />
                <Bar
                  dataKey="approved"
                  fill={STATUS_COLORS.approved}
                  name="Đã duyệt"
                />
                <Bar
                  dataKey="rejected"
                  fill={STATUS_COLORS.rejected}
                  name="Từ chối"
                />
              </BarChart>
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
                    backgroundColor: "#f3f4f6",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  <tr>
                    <th
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        fontWeight: 600,
                        color: "#374151",
                      }}
                    >
                      Tháng
                    </th>
                    <th
                      style={{
                        padding: "12px 16px",
                        textAlign: "center",
                        fontWeight: 600,
                        color: "#374151",
                      }}
                    >
                      Chờ duyệt
                    </th>
                    <th
                      style={{
                        padding: "12px 16px",
                        textAlign: "center",
                        fontWeight: 600,
                        color: "#374151",
                      }}
                    >
                      Đã duyệt
                    </th>
                    <th
                      style={{
                        padding: "12px 16px",
                        textAlign: "center",
                        fontWeight: 600,
                        color: "#374151",
                      }}
                    >
                      Từ chối
                    </th>
                    <th
                      style={{
                        padding: "12px 16px",
                        textAlign: "center",
                        fontWeight: 600,
                        color: "#374151",
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
      </Box>
    </RoleGate>
  );
}
