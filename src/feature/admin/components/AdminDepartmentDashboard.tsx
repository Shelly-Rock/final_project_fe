"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  adminDashboardService,
  type FacultyStats,
} from "@/feature/dashboard/services/admin-dashboard.service";
import { AdminDepartmentOperations } from "./AdminDepartmentOperations";
import { Card, CardContentDiv } from "@/shared/components/Card";
import { Users, BookOpen, BarChart3, FileText, Eye } from "lucide-react";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { getCardBackground } from "@/shared/constants/gradients";

const departmentColors = {
  blue: {
    accent: "#2563eb",
    progressColor: "#2563eb",
  },
  green: {
    accent: "#4edea3",
    progressColor: "#4edea3",
  },
  orange: {
    accent: "#ffb95f",
    progressColor: "#ffb95f",
  },
  purple: {
    accent: "#b4c5ff",
    progressColor: "#b4c5ff",
  },
};

const colorOrder = ["blue", "green", "orange", "purple"] as const;
type CardColor = (typeof colorOrder)[number];

const getFacultyAbbr = (id: string, name: string) => {
  const fromId = id.split("_").filter(Boolean).at(-1);
  if (fromId) return fromId.slice(0, 4).toUpperCase();

  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};

const getFacultyStatusLabel = (rate: number, isActive: boolean) => {
  if (!isActive) return "Tạm ngưng";
  if (rate >= 80) return "Đúng tiến độ";
  if (rate >= 60) return "Cảnh báo";
  return "Trễ hạn";
};

const FacultyCard: React.FC<{
  faculty: FacultyStats;
  color: CardColor;
}> = ({ faculty, color: colorKey }) => {
  const color = departmentColors[colorKey];
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const router = useRouter();

  const totalProjects = faculty.projects.total;
  const approvedProjects = faculty.projects.approved;
  const pendingProjects = faculty.projects.pending;
  const teacherCount = faculty.teacher_count;
  const departmentCount = faculty.department_count;
  const completionRate = totalProjects
    ? Math.round((approvedProjects / totalProjects) * 100)
    : 0;
  const abbr = getFacultyAbbr(faculty.id, faculty.name);
  const statusLabel = getFacultyStatusLabel(completionRate, faculty.is_active);

  const openDetail = () => {
    // Bấm card khoa -> mở thẳng trang bộ môn đầu tiên của khoa (giống
    // dashboard của thư ký). Khoa chưa có bộ môn thì quay lại trang quản lý khoa.
    const firstDepartmentId = faculty.department_ids?.[0];
    router.push(
      firstDepartmentId
        ? `/department/${encodeURIComponent(firstDepartmentId)}`
        : `/department/faculties?facultyId=${encodeURIComponent(faculty.id)}`,
    );
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={openDetail}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openDetail();
        }
      }}
      className="rounded-lg hover:bg-surface-card/80 transition-all flex flex-col justify-between h-full shadow-md hover:shadow-lg cursor-pointer"
      style={{
        background: getCardBackground(theme),
        border: isDark
          ? "1px solid rgba(255, 255, 255, 0.12)"
          : `1px solid ${theme.palette.divider}`,
        borderRadius: "8px",
        color: isDark ? "#ffff" : theme.palette.text.primary,
        padding: "12px",
        minHeight: "150px",
      }}
    >
      <div>
        <div className="flex items-start justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <div>
              <p
                className="text-[12px] font-bold leading-tight"
                style={{ color: isDark ? "#ffff" : theme.palette.text.primary }}
              >
                {faculty.name}
              </p>
              <span className="text-[12px] opacity-70 leading-tight">
                {departmentCount} BM • {totalProjects} ĐT
              </span>
            </div>
          </div>

          <div className="relative w-11 h-11 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                fill="none"
                r="14"
                stroke={isDark ? "#2d344c" : theme.palette.divider}
                strokeWidth="3.5"
              />
              <circle
                cx="18"
                cy="18"
                fill="none"
                r="14"
                stroke={color.accent}
                strokeDasharray={`${completionRate}, 100`}
                strokeDashoffset="0"
                strokeLinecap="round"
                strokeWidth="3.5"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold leading-none">
              {completionRate}%
            </span>
          </div>
        </div>

        <div className="mt-2 space-y-1">
          <div className="flex justify-between text-[12px] font-medium opacity-70">
            <span>Đề tài đã duyệt</span>
            <span style={{ color: color.accent }} className="font-bold">
              {approvedProjects}/{totalProjects}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-0.5 h-1">
            {[1, 2, 3, 4].map((stage) => (
              <div
                key={stage}
                className="rounded-full"
                style={{
                  backgroundColor:
                    stage <= Math.ceil(completionRate / 25)
                      ? color.accent
                      : isDark
                        ? "rgba(100, 116, 139, 0.3)"
                        : theme.palette.divider,
                }}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mt-2 pt-1 text-[12px]">
          <span className="opacity-70">
            Chờ duyệt: <b>{pendingProjects}</b>
          </span>
          <span className="opacity-70">
            GVHD: <b>{teacherCount}</b>
          </span>
          <span style={{ color: color.accent }} className="font-semibold">
            {statusLabel}
          </span>
        </div>
      </div>

      <div className="mt-2 pt-1 flex items-center justify-between">
        <span className="text-[12px] opacity-60 font-mono">
          {abbr}
          {faculty.is_active ? "" : " • Tạm ngưng"}
        </span>
        <button
          type="button"
          aria-label={`Xem chi tiết ${faculty.name}`}
          className="flex items-center justify-center transition-all hover:scale-110"
          style={{ color: color.accent }}
          onClick={(e) => {
            e.stopPropagation();
            openDetail();
          }}
        >
          <Eye size={16} />
        </button>
      </div>
    </div>
  );
};

interface StatCardProps {
  label: string;
  value: number | string;
  subtext: string;
  subtextColor?: string;
  icon?: React.ReactNode;
  iconColor?: string;
}

const StatCard = ({
  label,
  value,
  subtext,
  subtextColor = "success.main",
  icon,
  iconColor = "#3b82f6",
}: StatCardProps) => {
  const theme = useTheme();

  return (
    <Card
      variant="soft"
      sx={{
        background: getCardBackground(theme),
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "none",
        color: "#fff",
      }}
    >
      <CardContentDiv padding={2}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 1.5,
            mb: 1,
          }}
        >
          <Typography variant="body2" sx={{ color: "#fff" }}>
            {label}
          </Typography>
          {icon && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 32,
                height: 32,
                borderRadius: 1.5,
                backgroundColor: `${iconColor}15`,
                color: iconColor,
              }}
            >
              {icon}
            </Box>
          )}
        </Box>

        <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#fff" }}>
            {value}
          </Typography>
          <Typography variant="body2" sx={{ color: "#fff" }}>
            {subtext}
          </Typography>
        </Box>

        <Box
          sx={{
            mt: 1.5,
            height: 4,
            width: "100%",
            borderRadius: 999,
            backgroundColor: `${iconColor}30`,
          }}
        />
      </CardContentDiv>
    </Card>
  );
};

export const AdminDepartmentDashboard: React.FC = () => {
  const theme = useTheme();
  const router = useRouter();

  const { data: dashboardStats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: () => adminDashboardService.getAdminStats(),
  });

  const { data: facultyStats, isLoading: facultyLoading } = useQuery({
    queryKey: ["admin-faculty-stats"],
    queryFn: () => adminDashboardService.getFacultyStats(),
  });

  const facultyCards = facultyStats ?? [];
  const departmentCount = facultyCards.reduce(
    (sum, f) => sum + f.department_count,
    0,
  );

  const totalProjects = dashboardStats?.summary.totalProjects ?? 0;
  const totalStudents = dashboardStats?.summary.totalStudents ?? 0;
  const totalTeachers = dashboardStats?.summary.totalTeachers ?? 0;

  if (statsLoading || facultyLoading) {
    return (
      <Box
        sx={{
          p: 3,
          minHeight: "100vh",
          bgcolor: "background.default",
        }}
      >
        <Box
          sx={{
            height: 32,
            width: "33%",
            borderRadius: 1,
            bgcolor: "action.hover",
            animation: "pulse 2s infinite",
          }}
        />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(4, minmax(0, 1fr))",
            },
            gap: 2,
            mt: 2,
          }}
        >
          {[1, 2, 3, 4].map((i) => (
            <Box
              key={i}
              sx={{
                height: 128,
                borderRadius: 2,
                bgcolor: "action.hover",
                animation: "pulse 2s infinite",
              }}
            />
          ))}
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <Box
        sx={{
          maxWidth: "7xl",
          mx: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 3,
          px: 4,
          py: 3,
        }}
      >
        {/* Status Indicator */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              px: 2,
              py: 0.5,
              bgcolor: "emerald.500/10",
              borderRadius: "9999px",
              width: "fit-content",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: "#10b981",
                animation: "pulse 2s infinite",
              }}
            />
            <span
              style={{
                fontSize: "11px",
                fontWeight: 500,
                color: "#4ade80",
              }}
            >
              LIVE • {facultyCards.length} Khoa • {departmentCount} Bộ môn
            </span>
          </Box>

          <Button
            variant="contained"
            onClick={() => router.push("/department/faculties")}
            sx={{
              borderRadius: 2,
              px: 2.5,
              py: 0.75,
              textTransform: "none",
              fontWeight: 700,
              backgroundColor: "#2563eb",
              boxShadow: "0 8px 20px rgba(37, 99, 235, 0.24)",
              "&:hover": {
                backgroundColor: "#1d4ed8",
                boxShadow: "0 10px 24px rgba(37, 99, 235, 0.3)",
              },
            }}
          >
            Quản lý Khoa
          </Button>
        </Box>

        {/* KPI Stats Cards */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: 2,
          }}
        >
          <StatCard
            label="Tổng Đề Tài"
            value={totalProjects}
            subtext="Toàn hệ thống"
            subtextColor="success.main"
            icon={<FileText size={18} />}
            iconColor="#10b981"
          />
          <StatCard
            label="Sinh Viên"
            value={totalStudents}
            subtext="Toàn hệ thống"
            subtextColor="success.main"
            icon={<Users size={18} />}
            iconColor="#3b82f6"
          />
          <StatCard
            label="GVHD"
            value={totalTeachers}
            subtext="5.8 ĐT/GV"
            subtextColor="warning.main"
            icon={<BookOpen size={18} />}
            iconColor="#8b5cf6"
          />
          <StatCard
            label="Khoa"
            value={facultyCards.length}
            subtext={`${departmentCount} bộ môn`}
            subtextColor="success.main"
            icon={<BarChart3 size={18} />}
            iconColor="#f59e0b"
          />
        </Box>

        {/* Progress Bar */}
        <div
          className="p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          style={{
            background: getCardBackground(theme),
            border: `1px solid ${theme.palette.divider}`,
          }}
        ></div>

        {/* Faculty Cards Grid - 4 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {facultyCards.map((faculty, index) => (
            <FacultyCard
              key={faculty.id}
              faculty={faculty}
              color={colorOrder[index % colorOrder.length]}
            />
          ))}
        </div>

        {facultyCards.length === 0 && (
          <Typography
            color="text.secondary"
            sx={{ textAlign: "center", py: 4 }}
          >
            Chưa có khoa nào. Hãy tạo khoa tại trang Quản lý Khoa.
          </Typography>
        )}

        <AdminDepartmentOperations />
      </Box>
    </Box>
  );
};

export default AdminDepartmentDashboard;
