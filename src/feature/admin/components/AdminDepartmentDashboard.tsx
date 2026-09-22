"use client";

import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminDashboardService } from "@/feature/dashboard/services/admin-dashboard.service";
import { Card, CardHeader, CardContentDiv } from "@/shared/components/Card";
import {
  Search,
  Plus,
  ChevronRight,
  Calendar,
  Users,
  BookOpen,
  BarChart3,
  MapPin,
  Clock,
  TrendingUp,
  FileText,
  GraduationCap,
  Shield,
  Eye,
} from "lucide-react";
import { Box, Typography } from "@mui/material";

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

interface ScheduleSlot {
  id: string;
  time: string;
  period: string;
  title: string;
  room: string;
  status: "ongoing" | "preparing";
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
      className="p-6 rounded-lg hover:bg-surface-card/80 transition-all flex flex-col justify-between h-full shadow-md hover:shadow-lg"
      style={{
        background: "linear-gradient(135deg, #15213B 0%, #1C2D56 100%)",
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
              <h2 className="text-[12px] font-bold leading-tight">
                {dept.name}
              </h2>
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
            <span className="absolute text-[12px] font-bold">
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

const ScheduleCard: React.FC<{ slot: ScheduleSlot }> = ({ slot }) => {
  const isOngoing = slot.status === "ongoing";

  return (
    <div
      className="p-2.5 rounded-lg hover:bg-surface-subtle/60 transition-colors flex items-center justify-between gap-2 shadow-sm hover:shadow-md"
      style={{
        background: "linear-gradient(135deg, #15213B 0%, #1C2D56 100%)",
      }}
    >
      <div className="flex items-center gap-2 min-w-0">
        <div className="flex flex-col shrink-0 w-20">
          <span className="text-[10px] font-mono font-bold">{slot.time}</span>
          <span className="text-[9px] opacity-60">{slot.period}</span>
        </div>
        <div className="w-px h-5 bg-border-subtle/40 shrink-0" />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold truncate">
              {slot.title}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-0.5 text-[9px] opacity-70">
            <MapPin size={10} />
            <span>{slot.room}</span>
          </div>
        </div>
      </div>
      <div className="shrink-0">
        {isOngoing ? (
          <span className="px-1.5 py-0.5 rounded-full text-[8px] font-medium bg-emerald-400/15 text-emerald-400 flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
            Đang diễn ra
          </span>
        ) : (
          <span className="px-1.5 py-0.5 rounded-full text-[8px] font-medium bg-blue-400/15 text-blue-400 flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-blue-400" />
            Chuẩn bị
          </span>
        )}
      </div>
    </div>
  );
};

export const AdminDepartmentDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTimeRange, setActiveTimeRange] = useState<
    "week" | "month" | "all"
  >("week");

  const { isLoading: statsLoading } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: () => adminDashboardService.getAdminStats(),
  });

  const { isLoading: deptLoading } = useQuery({
    queryKey: ["admin-department-stats"],
    queryFn: () => adminDashboardService.getDepartmentStats(),
  });

  const scheduleSlots: ScheduleSlot[] = [
    {
      id: "1",
      time: "08:30 - 11:30",
      period: "Ca sáng",
      title: "HĐ-01 • CNTT & Trí Tuệ Nhân Tạo",
      room: "Phòng A2-101",
      status: "ongoing",
    },
    {
      id: "2",
      time: "10:00 - 12:00",
      period: "Ca sáng",
      title: "HĐ-02 • Tài Chính Doanh Nghiệp & Fintech",
      room: "Phòng C-301",
      status: "ongoing",
    },
    {
      id: "3",
      time: "13:30 - 16:30",
      period: "Ca chiều",
      title: "HĐ-03 • Điện Tử - Viễn Thông",
      room: "Phòng B2-204",
      status: "preparing",
    },
    {
      id: "4",
      time: "14:00 - 17:00",
      period: "Ca chiều",
      title: "HĐ-04 • Cơ Khí Tự Động Hóa & Robot",
      room: "Xưởng D-01",
      status: "preparing",
    },
  ];

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

  const filteredDepartments = useMemo(() => {
    return mockDepartments.filter(
      (dept) =>
        dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dept.abbr.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery, mockDepartments]);

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
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 2, mb: 0.5 }}
            >
              <h1 style={{ fontSize: "1.125rem", fontWeight: "bold" }}>
                Bảng Điều Hành Đồ Án
              </h1>
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  px: 2,
                  py: 0.5,
                  bgcolor: "emerald.500/10",
                  borderRadius: "9999px",
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
            </Box>
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
        {/* Toolbar */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "flex-start", md: "center" },
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 2,
              py: 1,
              borderRadius: 1,
              border: "1px solid",
              borderColor: "divider",
              backgroundColor: "background.paper",
              width: { xs: "100%", md: "auto" },
            }}
          >
            <Search size={18} style={{ color: "#2563eb", flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                border: "none",
                background: "transparent",
                outline: "none",
                fontSize: "0.75rem",
                fontFamily: "inherit",
              }}
            />
          </Box>
          <div className="flex items-center gap-1 bg-surface-subtle rounded-lg p-0.5">
            {(["week", "month", "all"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setActiveTimeRange(range)}
                className={`px-2 py-1 rounded text-[10px] font-semibold transition-all ${
                  activeTimeRange === range
                    ? "bg-primary text-on-primary shadow-sm"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {range === "week"
                  ? "Tuần"
                  : range === "month"
                    ? "Tháng"
                    : "Toàn bộ"}
              </button>
            ))}
          </div>
          <button className="h-8 px-3 rounded-lg bg-primary hover:bg-primary/90 text-on-primary text-[10px] font-semibold transition-colors flex items-center gap-1 whitespace-nowrap">
            <Plus size={14} />
            <span>Lập HĐ</span>
          </button>
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
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <BarChart3 size={14} className="text-primary" />
              <span className="text-[10px] font-bold uppercase">
                Tiến độ 4 giai đoạn ({totalProjects} đề tài)
              </span>
            </div>
            <div className="flex items-center gap-2 text-[9px]">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-surface-bright rounded-full" />
                Đề cương (8%)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                Nghiên cứu (42%)
              </span>
            </div>
          </div>
          <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden flex gap-0.5">
            <div className="bg-surface-bright h-full" style={{ width: "8%" }} />
            <div className="bg-primary h-full" style={{ width: "42%" }} />
            <div
              className="bg-tertiary-fixed h-full"
              style={{ width: "28%" }}
            />
            <div
              className="bg-secondary-fixed h-full"
              style={{ width: "22%" }}
            />
          </div>
        </div>

        {/* Department Cards Grid - 4 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {filteredDepartments.map((dept) => (
            <DepartmentCard key={dept.id} dept={dept} />
          ))}
        </div>

        {filteredDepartments.length === 0 && (
          <div className="text-center py-8">
            <p className="text-[11px] text-text-secondary opacity-70">
              Không tìm thấy khoa nào
            </p>
          </div>
        )}

        {/* Bottom Section: Schedule & Comparison */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", xl: "repeat(12, 1fr)" },
            gap: 3,
          }}
        >
          {/* Schedule */}
          <Box
            sx={{
              gridColumn: { xs: "1", xl: "span 7" },
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
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                mb: 3,
                pb: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: 1,
                    bgcolor: "primary/10",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "primary",
                  }}
                >
                  <Clock size={14} />
                </Box>
                <Box>
                  <h3
                    style={{
                      fontSize: "10px",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                    }}
                  >
                    Lịch Bảo Vệ Đồ Án
                  </h3>
                  <span
                    style={{
                      fontSize: "9px",
                      color: "text.secondary",
                      opacity: 0.7,
                    }}
                  >
                    Tuần 19 • Khóa 2021-2025
                  </span>
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  bgcolor: "surface.subtle",
                  p: 0.5,
                  borderRadius: 1,
                }}
              >
                {["T2", "T3", "T4", "T5", "T6"].map((day, idx) => (
                  <button
                    key={`day-${day}`}
                    style={{
                      paddingLeft: "6px",
                      paddingRight: "6px",
                      paddingTop: "4px",
                      paddingBottom: "4px",
                      borderRadius: "4px",
                      fontSize: "9px",
                      fontWeight: "600",
                      backgroundColor:
                        idx === 0 ? "var(--primary)" : "transparent",
                      color:
                        idx === 0
                          ? "var(--on-primary)"
                          : "var(--text-secondary)",
                    }}
                  >
                    {day}
                  </button>
                ))}
              </Box>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {scheduleSlots.map((slot, idx) => (
                <ScheduleCard key={idx} slot={slot} />
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
                <span style={{ color: "#4ade80", fontWeight: 500 }}>
                  4 hội đồng hôm nay
                </span>{" "}
                • 10 phòng sẵn sàng
              </span>
              <button
                style={{
                  color: "var(--primary)",
                  fontWeight: 500,
                  textDecoration: "underline",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                Xem toàn bộ
                <ChevronRight size={12} />
              </button>
            </Box>
          </Box>

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

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {[
                { dept: "Kinh Tế & QTKD", percent: 90, color: "bg-amber-500" },
                { dept: "CNTT & TT", percent: 82, color: "bg-emerald-500" },
                { dept: "Điện - Điện Tử", percent: 75, color: "bg-amber-500" },
                { dept: "Cơ Khí", percent: 68, color: "bg-blue-400" },
              ].map((item, idx) => (
                <Box key={idx}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "9px",
                      mb: 0.5,
                    }}
                  >
                    <span style={{ fontWeight: 500 }}>{item.dept}</span>
                    <span className={item.color.replace("bg-", "text-")}>
                      {item.percent}%
                    </span>
                  </Box>
                  <Box
                    sx={{
                      width: "100%",
                      height: "6px",
                      borderRadius: "9999px",
                      bgcolor: "surface.subtle",
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        height: "100%",
                        borderRadius: "9999px",
                        bgcolor: item.color.replace("bg-", ""),
                        width: `${item.percent}%`,
                      }}
                    />
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
    </Box>
  );
};

export default AdminDepartmentDashboard;
