"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardContentDiv } from "@/shared/components/Card";
import { Tabs } from "@/shared/components/Tabs";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { secretaryDashboardService } from "../services/secretary-dashboard.service";
import { Users, BookOpen, FileText, AlertCircle } from "lucide-react";
import { Box, Skeleton, Typography } from "@mui/material";

const COLORS = ["#fbbf24", "#10b981", "#ef4444"];

interface StatCardProps {
  label: string;
  value: number | undefined;
  icon: React.ReactNode;
}

interface CustomPieTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number }>;
}

const CustomPieTooltip: React.FC<CustomPieTooltipProps> = ({
  active,
  payload,
}) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0];
    return (
      <Box
        sx={{
          backgroundColor: "#1f2937",
          border: "1px solid #374151",
          borderRadius: "6px",
          padding: "12px 16px",
          color: "#f3f4f6",
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
          {name}
        </Typography>
        <Typography variant="body2" sx={{ color: "#10b981", fontWeight: 600 }}>
          {value}
        </Typography>
      </Box>
    );
  }
  return null;
};

const StatCard = ({ label, value, icon: Icon }: StatCardProps) => (
  <Card variant="elevation">
    <CardHeader
      title={label}
      action={<Box sx={{ fontSize: 24 }}>{Icon}</Box>}
    />
    <CardContentDiv>
      <Typography variant="h4" sx={{ fontWeight: "bold" }}>
        {value || 0}
      </Typography>
    </CardContentDiv>
  </Card>
);

export const SecretaryDashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<number>(0);

  const { data: dashboardStats, isLoading } = useQuery({
    queryKey: ["secretary-dashboard"],
    queryFn: () => secretaryDashboardService.getSecretaryStats(),
  });

  const { data: departmentDetails } = useQuery({
    queryKey: ["secretary-department-details"],
    queryFn: () => secretaryDashboardService.getSecretaryDepartmentDetails(),
  });

  const reportStatusData = dashboardStats
    ? [
        { name: "Chờ duyệt", value: dashboardStats.reports.pending },
        { name: "Đã duyệt", value: dashboardStats.reports.approved },
        { name: "Từ chối", value: dashboardStats.reports.rejected },
      ]
    : [];

  const projectStatusData = dashboardStats
    ? [
        { name: "Chờ duyệt", value: dashboardStats.projectStatus.pending },
        { name: "Đã duyệt", value: dashboardStats.projectStatus.approved },
        { name: "Từ chối", value: dashboardStats.projectStatus.rejected },
      ]
    : [];

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1rem",
          }}
        >
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} variant="rectangular" height={150} />
          ))}
        </div>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Dashboard Thư Ký
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
          Quản lý khoa: {dashboardStats?.department.name}
        </Typography>
      </Box>

      {/* Summary Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <StatCard
          label="Tổng Sinh Viên"
          value={dashboardStats?.summary.totalStudents}
          icon={<Users size={24} style={{ color: "#3b82f6" }} />}
        />
        <StatCard
          label="Giảng Viên Khoa"
          value={dashboardStats?.summary.totalTeachers}
          icon={<BookOpen size={24} style={{ color: "#8b5cf6" }} />}
        />
        <StatCard
          label="Đề Tài Khoa"
          value={dashboardStats?.summary.totalProjects}
          icon={<FileText size={24} style={{ color: "#10b981" }} />}
        />
        <StatCard
          label="Báo Cáo Chờ Duyệt"
          value={dashboardStats?.reports.pending}
          icon={<AlertCircle size={24} style={{ color: "#f59e0b" }} />}
        />
      </div>

      {/* Charts Tab */}
      <Tabs
        items={[
          {
            label: "Tổng Quan",
            content: (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
                  gap: "1rem",
                }}
              >
                <Card variant="elevation">
                  <CardHeader title="Trạng Thái Đề Tài" />
                  <CardContentDiv>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={projectStatusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {projectStatusData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomPieTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContentDiv>
                </Card>

                <Card variant="elevation">
                  <CardHeader title="Trạng Thái Báo Cáo" />
                  <CardContentDiv>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={reportStatusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {reportStatusData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomPieTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContentDiv>
                </Card>
              </div>
            ),
          },
          {
            label: "Chi Tiết Giáo Viên",
            content: (
              <Card variant="elevation">
                <CardHeader title="Danh Sách Giáo Viên" />
                <CardContentDiv>
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
                              padding: "12px 24px",
                              textAlign: "left",
                              fontWeight: 600,
                              color: "#374151",
                            }}
                          >
                            Tên
                          </th>
                          <th
                            style={{
                              padding: "12px 24px",
                              textAlign: "left",
                              fontWeight: 600,
                              color: "#374151",
                            }}
                          >
                            Email
                          </th>
                          <th
                            style={{
                              padding: "12px 24px",
                              textAlign: "center",
                              fontWeight: 600,
                              color: "#374151",
                            }}
                          >
                            Chức vụ
                          </th>
                          <th
                            style={{
                              padding: "12px 24px",
                              textAlign: "center",
                              fontWeight: 600,
                              color: "#374151",
                            }}
                          >
                            Đề Tài
                          </th>
                          <th
                            style={{
                              padding: "12px 24px",
                              textAlign: "center",
                              fontWeight: 600,
                              color: "#374151",
                            }}
                          >
                            Đã Duyệt
                          </th>
                          <th
                            style={{
                              padding: "12px 24px",
                              textAlign: "center",
                              fontWeight: 600,
                              color: "#374151",
                            }}
                          >
                            Chờ Duyệt
                          </th>
                          <th
                            style={{
                              padding: "12px 24px",
                              textAlign: "center",
                              fontWeight: 600,
                              color: "#374151",
                            }}
                          >
                            Từ Chối
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {departmentDetails?.teachers?.map((teacher, idx) => (
                          <tr
                            key={idx}
                            style={{ borderBottom: "1px solid #e5e7eb" }}
                          >
                            <td
                              style={{
                                padding: "16px 24px",
                                fontWeight: 500,
                                color: "#111827",
                              }}
                            >
                              {teacher.name}
                            </td>
                            <td
                              style={{ padding: "16px 24px", color: "#4b5563" }}
                            >
                              {teacher.email}
                            </td>
                            <td
                              style={{
                                padding: "16px 24px",
                                textAlign: "center",
                                color: "#4b5563",
                              }}
                            >
                              {teacher.position || "N/A"}
                            </td>
                            <td
                              style={{
                                padding: "16px 24px",
                                textAlign: "center",
                                color: "#4b5563",
                              }}
                            >
                              {teacher.projects.total}
                            </td>
                            <td
                              style={{
                                padding: "16px 24px",
                                textAlign: "center",
                                color: "#059669",
                                fontWeight: 500,
                              }}
                            >
                              {teacher.projects.byStatus.approved}
                            </td>
                            <td
                              style={{
                                padding: "16px 24px",
                                textAlign: "center",
                                color: "#d97706",
                                fontWeight: 500,
                              }}
                            >
                              {teacher.projects.byStatus.pending}
                            </td>
                            <td
                              style={{
                                padding: "16px 24px",
                                textAlign: "center",
                                color: "#dc2626",
                                fontWeight: 500,
                              }}
                            >
                              {teacher.projects.byStatus.rejected}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Box>
                </CardContentDiv>
              </Card>
            ),
          },
        ]}
        value={selectedTab}
        onChange={setSelectedTab}
      />
    </Box>
  );
};
