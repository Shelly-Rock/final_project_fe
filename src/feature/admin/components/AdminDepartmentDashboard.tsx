"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  adminDashboardService,
  type DepartmentStats,
} from "@/feature/dashboard/services/admin-dashboard.service";
import { AdminDepartmentOperations } from "./AdminDepartmentOperations";
import { Card, CardContentDiv } from "@/shared/components/Card";
import { Users, BookOpen, BarChart3, FileText, Eye } from "lucide-react";
import { Box, Typography, useTheme } from "@mui/material";
import { getCardBackground } from "@/shared/constants/gradients";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
  Label,
} from "recharts";

interface DepartmentCardData {
  id: string;
  name: string;
  abbr: string;
  totalProjects: number;
  totalStudents: number;
  teacherCount: number;
  councilCount: number;
  completionRate: number;
  stageDescription: string;
  stageCount: number;
  status: "on-time" | "delayed" | "warning";
  color: "blue" | "green" | "orange" | "purple";
  location: string;
}

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

const DepartmentCard: React.FC<{ dept: DepartmentCardData }> = ({ dept }) => {
  const color = departmentColors[dept.color];
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const router = useRouter();

  const openDetail = () => {
    router.push(`/department/${encodeURIComponent(dept.id)}`);
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
        border: isDark ? "none" : `1px solid ${theme.palette.divider}`,
        padding: "12px",
        minHeight: "150px",
      }}
    >
      <div>
        <div className="flex items-start justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <div
              className="w-6 h-6 rounded flex items-center justify-center font-bold text-[12px]"
              style={{
                backgroundColor: color.accent + "20",
                color: color.accent,
              }}
            >
              {dept.abbr}
            </div>
            <div>
              <p className="text-[12px] font-bold leading-tight">{dept.name}</p>
              <span className="text-[12px] opacity-70 leading-tight">
                {dept.totalProjects} ĐT • {dept.totalStudents} SV
              </span>
            </div>
          </div>

          <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
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
                strokeDasharray={`${dept.completionRate}, 100`}
                strokeDashoffset="0"
                strokeLinecap="round"
                strokeWidth="3.5"
              />
            </svg>
            <span className="absolute text-[12px] font-bold ">
              {dept.completionRate}%
            </span>
          </div>
        </div>

        <div className="mt-2 space-y-1">
          <div className="flex justify-between text-[12px] font-medium opacity-70">
            <span>{dept.stageDescription}</span>
            <span style={{ color: color.accent }} className="font-bold">
              {dept.stageCount}/{dept.totalProjects}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-0.5 h-1">
            {[1, 2, 3, 4].map((stage) => (
              <div
                key={stage}
                className="rounded-full"
                style={{
                  backgroundColor:
                    stage <= Math.ceil(dept.completionRate / 25)
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
            Hội đồng: <b>{dept.councilCount}</b>
          </span>
          <span className="opacity-70">
            GVHD: <b>{dept.teacherCount}</b>
          </span>
          <span style={{ color: color.accent }} className="font-semibold">
            {dept.status === "on-time"
              ? "Đúng tiến độ"
              : dept.status === "delayed"
                ? "Trễ hạn"
                : "Cảnh báo"}
          </span>
        </div>
      </div>

      <div className="mt-2 pt-1 flex items-center justify-between">
        <span className="text-[12px] opacity-60 font-mono">
          {dept.location}
        </span>
        <button
          type="button"
          aria-label={`Xem chi tiết ${dept.name}`}
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
  subtextColor = "text-emerald-400",
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
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      }}
    >
      <CardContentDiv padding={3}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 1.5,
          }}
        >
          <Typography
            variant="caption"
            sx={{ display: "block", opacity: 0.7, fontWeight: 500 }}
          >
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
                borderRadius: 1,
                backgroundColor: `${iconColor}15`,
              }}
            >
              <Box sx={{ color: iconColor, display: "flex", fontSize: 18 }}>
                {icon}
              </Box>
            </Box>
          )}
        </Box>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 0.5 }}>
          {value}
        </Typography>
        <Typography
          variant="caption"
          sx={{ display: "block", fontSize: "9px", className: subtextColor }}
        >
          {subtext}
        </Typography>
      </CardContentDiv>
    </Card>
  );
};

export const AdminDepartmentDashboard: React.FC = () => {
  const theme = useTheme();

  const { isLoading: statsLoading } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: () => adminDashboardService.getAdminStats(),
  });

  const { data: deptStats, isLoading: deptLoading } = useQuery({
    queryKey: ["admin-department-stats"],
    queryFn: () => adminDashboardService.getDepartmentStats(),
  });

  const fallbackDepartments: DepartmentCardData[] = useMemo(() => {
    return [
      {
        id: "1",
        name: "CNTT & Truyền thông",
        abbr: "IT",
        totalProjects: 450,
        totalStudents: 580,
        teacherCount: 65,
        councilCount: 16,
        completionRate: 82,
        stageDescription: "Phản biện & Bảo vệ",
        stageCount: 320,
        status: "on-time",
        color: "blue",
        location: "P. A1 • Nam TH",
      },
      {
        id: "2",
        name: "Điện - Điện Tử",
        abbr: "EE",
        totalProjects: 320,
        totalStudents: 390,
        teacherCount: 48,
        councilCount: 12,
        completionRate: 75,
        stageDescription: "Chế tạo mạch & Lab",
        stageCount: 240,
        status: "delayed",
        color: "green",
        location: "P. B2 • Huy LQ",
      },
      {
        id: "3",
        name: "Kinh Tế & QTKD",
        abbr: "BA",
        totalProjects: 380,
        totalStudents: 460,
        teacherCount: 52,
        councilCount: 14,
        completionRate: 90,
        stageDescription: "Bản thảo & Turnitin",
        stageCount: 342,
        status: "on-time",
        color: "orange",
        location: "P. C1 • Mai NT",
      },
      {
        id: "4",
        name: "Cơ Khí Chế Tạo",
        abbr: "ME",
        totalProjects: 270,
        totalStudents: 320,
        teacherCount: 40,
        councilCount: 10,
        completionRate: 68,
        stageDescription: "Gia công mô hình xưởng",
        stageCount: 190,
        status: "warning",
        color: "purple",
        location: "X. D1 • Toàn VD",
      },
      {
        id: "5",
        name: "Khoa Học Ứng Dụng",
        abbr: "AS",
        totalProjects: 150,
        totalStudents: 180,
        teacherCount: 35,
        councilCount: 8,
        completionRate: 80,
        stageDescription: "Thí nghiệm",
        stageCount: 120,
        status: "on-time",
        color: "blue",
        location: "P. E2 • Hòa VT",
      },
      {
        id: "6",
        name: "Hóa Học & Môi Trường",
        abbr: "CH",
        totalProjects: 150,
        totalStudents: 160,
        teacherCount: 30,
        councilCount: 8,
        completionRate: 71,
        stageDescription: "Phân tích & Báo cáo",
        stageCount: 106,
        status: "on-time",
        color: "green",
        location: "P. F1 • Lan TK",
      },
    ];
  }, []);

  const departments = useMemo(() => {
    if (!deptStats?.length) return fallbackDepartments;

    const colors: DepartmentCardData["color"][] = [
      "blue",
      "green",
      "orange",
      "purple",
    ];

    return deptStats.map((d: DepartmentStats, i) => {
      const fallback = fallbackDepartments[i];
      const total = d.projects?.total ?? fallback?.totalProjects ?? 0;
      const approved = d.projects?.approved ?? fallback?.stageCount ?? 0;
      const rate = total
        ? Math.round((approved / total) * 100)
        : (fallback?.completionRate ?? 0);

      return {
        id: d.id,
        name: d.name || fallback?.name || "Khoa",
        abbr:
          fallback?.abbr ||
          d.id.replace(/^BM_?/i, "").slice(0, 2).toUpperCase() ||
          "K",
        totalProjects: total,
        totalStudents: fallback?.totalStudents ?? 0,
        teacherCount: d.teacherCount ?? fallback?.teacherCount ?? 0,
        councilCount: fallback?.councilCount ?? 0,
        completionRate: rate,
        stageDescription: fallback?.stageDescription || d.faculty || "Đề tài",
        stageCount: approved,
        status: rate >= 75 ? "on-time" : rate >= 60 ? "warning" : "delayed",
        color: fallback?.color ?? colors[i % 4],
        location:
          fallback?.location ||
          [d.faculty, d.secretary].filter(Boolean).join(" • "),
      } satisfies DepartmentCardData;
    });
  }, [deptStats, fallbackDepartments]);

  const totalProjects = 1420;
  const totalStudents = 1850;
  const totalTeachers = 245;

  if (statsLoading || deptLoading) {
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
            LIVE • {departments.length} Khoa
          </span>
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
            subtext="+8.2%"
            subtextColor="text-emerald-400"
            icon={<FileText size={18} />}
            iconColor="#10b981"
          />
          <StatCard
            label="Sinh Viên"
            value={totalStudents}
            subtext="430 nhóm"
            subtextColor="text-emerald-400"
            icon={<Users size={18} />}
            iconColor="#3b82f6"
          />
          <StatCard
            label="GVHD"
            value={totalTeachers}
            subtext="5.8 ĐT/GV"
            subtextColor="text-amber-400"
            icon={<BookOpen size={18} />}
            iconColor="#8b5cf6"
          />
          <StatCard
            label="Hội Đồng"
            value={48}
            subtext="88.5%"
            subtextColor="text-emerald-400"
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

        {/* Department Cards Grid - 4 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {departments.map((dept) => (
            <DepartmentCard key={dept.id} dept={dept} />
          ))}
        </div>

        <AdminDepartmentOperations />
      </Box>
    </Box>
  );
};

export default AdminDepartmentDashboard;
