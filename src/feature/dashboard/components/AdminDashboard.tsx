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
import { adminDashboardService } from "../services/admin-dashboard.service";
import { Users, BookOpen, FileText, TrendingUp } from "lucide-react";
import { Box, Skeleton, Typography } from "@mui/material";

const COLORS = ["#fbbf24", "#10b981", "#ef4444"];

interface StatCardProps {
  label: string;
  value: number | undefined;
  icon: React.ReactNode;
}

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

export const AdminDashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<number>(0);

  const { data: dashboardStats, isLoading } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: () => adminDashboardService.getAdminStats(),
  });

  const { data: departmentStats } = useQuery({
    queryKey: ["admin-department-stats"],
    queryFn: () => adminDashboardService.getDepartmentStats(),
  });

  const projectStatusData = dashboardStats
    ? [
        { name: "Chờ duyệt", value: dashboardStats.projectStatus.pending },
        { name: "Đã duyệt", value: dashboardStats.projectStatus.approved },
        { name: "Từ chối", value: dashboardStats.projectStatus.rejected },
      ]
    : [];

  const reportStatusData = dashboardStats
    ? [
        { name: "Chờ duyệt", value: dashboardStats.reports.pending },
        { name: "Đã duyệt", value: dashboardStats.reports.approved },
        { name: "Từ chối", value: dashboardStats.reports.rejected },
      ]
    : [];

  const departmentMetrics =
    departmentStats?.map((dept) => ({
      name: dept.name,
      totalStudents: 0,
      totalTeachers: dept.teacherCount || 0,
      approvedProjects: dept.projects?.approved || 0,
      pendingProjects: dept.projects?.pending || 0,
      rejectedProjects: dept.projects?.rejected || 0,
      faculty: dept.faculty,
      secretary: dept.secretary,
    })) || [];

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
          Dashboard Quản trị
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
          Quản lý toàn bộ các khoa trong trường
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
          label="Tổng Giảng Viên"
          value={dashboardStats?.summary.totalTeachers}
          icon={<BookOpen size={24} style={{ color: "#8b5cf6" }} />}
        />
        <StatCard
          label="Tổng Đề Tài"
          value={dashboardStats?.summary.totalProjects}
          icon={<FileText size={24} style={{ color: "#10b981" }} />}
        />
        <StatCard
          label="Tổng Khoa"
          value={dashboardStats?.summary.totalDepartments}
          icon={<TrendingUp size={24} style={{ color: "#f59e0b" }} />}
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
                        <Tooltip />
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
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContentDiv>
                </Card>
              </div>
            ),
          },
          {
            label: "Theo Khoa",
            content: (
              <Card variant="elevation">
                <CardHeader title="Thống Kê Theo Khoa" />
                <CardContentDiv>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={departmentMetrics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="totalTeachers"
                        fill="#8b5cf6"
                        name="Giảng Viên"
                      />
                      <Bar
                        dataKey="approvedProjects"
                        fill="#10b981"
                        name="Đề Tài Đã Duyệt"
                      />
                      <Bar
                        dataKey="pendingProjects"
                        fill="#fbbf24"
                        name="Đề Tài Chờ Duyệt"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContentDiv>
              </Card>
            ),
          },
          {
            label: "Trạng Thái",
            content: (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
                  gap: "1rem",
                }}
              >
                <Card variant="elevation">
                  <CardHeader title="Phân Bố Đề Tài" />
                  <CardContentDiv>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={projectStatusData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContentDiv>
                </Card>

                <Card variant="elevation">
                  <CardHeader title="Phân Bố Báo Cáo" />
                  <CardContentDiv>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={reportStatusData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8b5cf6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContentDiv>
                </Card>
              </div>
            ),
          },
        ]}
        value={selectedTab}
        onChange={setSelectedTab}
      />

      {/* Department Table */}
      <Box sx={{ mt: 4 }}>
        <Card variant="elevation">
          <CardHeader title="Chi Tiết Các Khoa" />
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
                      Khoa
                    </th>
                    <th
                      style={{
                        padding: "12px 24px",
                        textAlign: "center",
                        fontWeight: 600,
                        color: "#374151",
                      }}
                    >
                      Giảng Viên
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
                    <th
                      style={{
                        padding: "12px 24px",
                        textAlign: "left",
                        fontWeight: 600,
                        color: "#374151",
                      }}
                    >
                      Thư Ký
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {departmentMetrics.map((dept, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid #e5e7eb" }}>
                      <td
                        style={{
                          padding: "16px 24px",
                          fontWeight: 500,
                          color: "#111827",
                        }}
                      >
                        {dept.name}
                      </td>
                      <td
                        style={{
                          padding: "16px 24px",
                          textAlign: "center",
                          color: "#4b5563",
                        }}
                      >
                        {dept.totalTeachers}
                      </td>
                      <td
                        style={{
                          padding: "16px 24px",
                          textAlign: "center",
                          color: "#4b5563",
                        }}
                      >
                        {dept.approvedProjects +
                          dept.pendingProjects +
                          dept.rejectedProjects}
                      </td>
                      <td
                        style={{
                          padding: "16px 24px",
                          textAlign: "center",
                          color: "#059669",
                          fontWeight: 500,
                        }}
                      >
                        {dept.approvedProjects}
                      </td>
                      <td
                        style={{
                          padding: "16px 24px",
                          textAlign: "center",
                          color: "#d97706",
                          fontWeight: 500,
                        }}
                      >
                        {dept.pendingProjects}
                      </td>
                      <td
                        style={{
                          padding: "16px 24px",
                          textAlign: "center",
                          color: "#dc2626",
                          fontWeight: 500,
                        }}
                      >
                        {dept.rejectedProjects}
                      </td>
                      <td style={{ padding: "16px 24px", color: "#4b5563" }}>
                        {dept.secretary}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </CardContentDiv>
        </Card>
      </Box>
    </Box>
  );
};
