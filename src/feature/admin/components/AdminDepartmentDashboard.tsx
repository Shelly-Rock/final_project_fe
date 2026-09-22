"use client";

import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminDashboardService } from "@/feature/dashboard/services/admin-dashboard.service";
import { Card, CardContentDiv } from "@/shared/components/Card";
import {
  ChevronRight,
  Calendar,
  Users,
  BookOpen,
  BarChart3,
  FileText,
  Eye,
} from "lucide-react";
import { Box, Typography } from "@mui/material";
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

  return (
    <div
      className=" rounded-lg hover:bg-surface-card/80 transition-all flex flex-col justify-between h-full shadow-md hover:shadow-lg"
      style={{
        background: "linear-gradient(135deg, #15213B 0%, #1C2D56 100%)",
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
                stroke="#2d344c"
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
                      : "rgba(100, 116, 139, 0.3)",
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
          className="flex items-center justify-center transition-all hover:scale-110"
          style={{ color: color.accent }}
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
}: StatCardProps) => (
  <Card
    variant="soft"
    sx={{
      background: "linear-gradient(135deg, #15213B 0%, #1C2D56 100%)",
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

export const AdminDepartmentDashboard: React.FC = () => {
  const { isLoading: statsLoading } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: () => adminDashboardService.getAdminStats(),
  });

  const { isLoading: deptLoading } = useQuery({
    queryKey: ["admin-department-stats"],
    queryFn: () => adminDashboardService.getDepartmentStats(),
  });

  const mockDepartments: DepartmentCardData[] = useMemo(() => {
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

  const totalProjects = 1420;
  const totalStudents = 1850;
  const totalTeachers = 245;

  if (statsLoading || deptLoading) {
    return (
      <div className="p-6 space-y-4 bg-slate-900 min-h-screen">
        <div className="h-8 bg-slate-800 rounded w-1/3 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-32 bg-slate-800 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "surface", color: "text.primary" }}>
      {/* Header */}
      <Box
        component="header"
        sx={{ bgcolor: "surface.card", display: "flex", zIndex: 40 }}
      >
        <Box
          sx={{
            maxWidth: "7xl",
            mx: "auto",
            px: 4,
            py: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Box>
            <h4
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                color: "var(--text-primary)",
                margin: 0,
              }}
            >
              Bảng Điều Hành Đồ Án
            </h4>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                px: 2.5,
                py: 1,
                bgcolor: "surface.subtle",
                borderRadius: 1,
                fontSize: "10px",
              }}
            >
              <Calendar size={14} style={{ color: "#4ade80" }} />
              <span style={{ fontWeight: 500 }}>Khóa 2021-2025 • Đợt 1</span>
            </Box>
          </Box>
        </Box>
      </Box>

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
            LIVE • {mockDepartments.length} Khoa
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
            background: "linear-gradient(135deg, #15213B 0%, #1C2D56 100%)",
          }}
        ></div>

        {/* Department Cards Grid - 4 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {mockDepartments.map((dept) => (
            <DepartmentCard key={dept.id} dept={dept} />
          ))}
        </div>

        {/* Comparison Chart */}
        <Box
          sx={{
            gridColumn: { xs: "1", xl: "span 5" },
            p: 3,
            borderRadius: 1,
            background: "linear-gradient(135deg, #15213B 0%, #1C2D56 100%)",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            "&:hover": {
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            },
            transition: "box-shadow 0.3s ease",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2.5,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <BarChart3 size={14} className="text-primary" />
              <h3
                style={{
                  fontSize: "10px",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              >
                So Sánh Hoàn Thành 6 Khoa
              </h3>
            </Box>
            <span
              style={{
                fontSize: "9px",
                fontFamily: "monospace",
                color: "var(--text-secondary)",
                opacity: 0.7,
              }}
            >
              KPI &gt; 70%
            </span>
          </Box>

          <Box sx={{ mt: 3 }}>
            {[
              { dept: "Kinh Tế & QTKD", percent: 90, color: "#0ea5e9" },
              { dept: "CNTT & TT", percent: 82, color: "#0ea5e9" },
              { dept: "Điện - Điện Tử", percent: 75, color: "#0ea5e9" },
              { dept: "Cơ Khí", percent: 68, color: "#0ea5e9" },
              { dept: "Khoa Học", percent: 80, color: "#0ea5e9" },
              { dept: "Hóa Học", percent: 71, color: "#0ea5e9" },
            ].map((item, idx) => (
              <Box key={idx} sx={{ mb: 2.5 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 0.8,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: "#cbd5e1",
                      fontSize: "12px",
                      minWidth: "140px",
                    }}
                  >
                    {item.dept}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 700,
                      color: item.percent >= 70 ? "#4ade80" : "#fbbf24",
                      fontSize: "12px",
                      minWidth: "40px",
                      textAlign: "right",
                    }}
                  >
                    {item.percent}%
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: "100%",
                    height: "28px",
                    backgroundColor: "#1e293b",
                    borderRadius: "12px",
                    overflow: "hidden",
                    position: "relative",
                    boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  <Box
                    sx={{
                      height: "100%",
                      width: `${item.percent}%`,
                      background:
                        "linear-gradient(90deg, rgb(37, 99, 235) 0%, rgb(37, 99, 235) 100%)",
                      borderRadius: "12px",
                      transition:
                        "width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
                      boxShadow:
                        "0 0 16px rgba(37, 99, 235, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.15)",
                      position: "relative",
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        background:
                          "linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, transparent 100%)",
                        borderRadius: "12px",
                      },
                    }}
                  />
                  {item.percent >= 70 && (
                    <Box
                      sx={{
                        position: "absolute",
                        right: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#fff",
                        fontSize: "12px",
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        pointerEvents: "none",
                      }}
                    >
                      ✓
                    </Box>
                  )}
                </Box>
              </Box>
            ))}
          </Box>

          <Box
            sx={{
              mt: 2,
              pt: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: "9px",
            }}
          >
            <span style={{ color: "var(--text-secondary)", opacity: 0.7 }}>
              <span
                style={{
                  width: "4px",
                  height: "4px",
                  borderRadius: "50%",
                  backgroundColor: "#4ade80",
                  display: "inline-block",
                  marginRight: "4px",
                }}
              />
              TB hoàn thành: <b>77.6%</b>
            </span>
            <button
              style={{
                color: "var(--primary)",
                fontWeight: 500,
                textDecoration: "underline",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              Xuất biểu đồ
            </button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDepartmentDashboard;
