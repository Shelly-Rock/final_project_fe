"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  adminDashboardService,
  type DepartmentStats,
} from "@/feature/dashboard/services/admin-dashboard.service";
import { facultyService } from "@/feature/admin/services";
import type { Faculty } from "@/feature/admin/types";
import { AdminDepartmentOperations } from "./AdminDepartmentOperations";
import { Card, CardContentDiv } from "@/shared/components/Card";
import { Users, BookOpen, BarChart3, FileText, Eye } from "lucide-react";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { getCardBackground } from "@/shared/constants/gradients";

interface DepartmentCardData {
  id: string;
  name: string;
  abbr: string;
  facultyId: string | null;
  facultyName: string;
  totalProjects: number;
  totalStudents: number;
  teacherCount: number;
  councilCount: number;
  completionRate: number;
  stageDescription: string;
  stageCount: number;
  pendingProjects: number;
  status: "on-time" | "delayed" | "warning";
  color: "blue" | "green" | "orange" | "purple";
  location: string;
}

interface FacultyGroup {
  faculty: Faculty | null;
  facultyId: string | null;
  facultyName: string;
  departments: DepartmentCardData[];
}

/** Dữ liệu hiển thị cho card KHOA (gom từ các bộ môn thuộc khoa) */
interface FacultyCardData {
  id: string;
  name: string;
  abbr: string;
  description: string | null;
  isActive: boolean;
  departmentCount: number;
  teacherCount: number;
  totalProjects: number;
  approvedProjects: number;
  pendingProjects: number;
  completionRate: number;
  status: "on-time" | "delayed" | "warning";
  statusLabel: string;
  color: "blue" | "green" | "orange" | "purple";
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

const colorOrder: DepartmentCardData["color"][] = [
  "blue",
  "green",
  "orange",
  "purple",
];

const getProjectsTotal = (dept: DepartmentStats) => {
  if (typeof dept.projects === "number") return dept.projects;
  return dept.projects?.total ?? 0;
};

const getProjectsApproved = (dept: DepartmentStats) => {
  if (typeof dept.projects === "number") return dept.projects;
  return dept.projects?.approved ?? 0;
};

const getProjectsPending = (dept: DepartmentStats) => {
  if (typeof dept.projects === "number") return 0;
  return dept.projects?.pending ?? 0;
};

const getTeacherCount = (dept: DepartmentStats) => {
  return dept.teacherCount ?? dept.teachers ?? 0;
};

const getDepartmentAbbr = (id: string, name: string) => {
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

const FacultyCard: React.FC<{ faculty: FacultyCardData }> = ({ faculty }) => {
  const color = departmentColors[faculty.color];
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const router = useRouter();

  const openDetail = () => {
    router.push(
      `/department/faculties?facultyId=${encodeURIComponent(faculty.id)}`,
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
                {faculty.departmentCount} BM • {faculty.totalProjects} ĐT
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
                strokeDasharray={`${faculty.completionRate}, 100`}
                strokeDashoffset="0"
                strokeLinecap="round"
                strokeWidth="3.5"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold leading-none">
              {faculty.completionRate}%
            </span>
          </div>
        </div>

        <div className="mt-2 space-y-1">
          <div className="flex justify-between text-[12px] font-medium opacity-70">
            <span>Đề tài đã duyệt</span>
            <span style={{ color: color.accent }} className="font-bold">
              {faculty.approvedProjects}/{faculty.totalProjects}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-0.5 h-1">
            {[1, 2, 3, 4].map((stage) => (
              <div
                key={stage}
                className="rounded-full"
                style={{
                  backgroundColor:
                    stage <= Math.ceil(faculty.completionRate / 25)
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
            Chờ duyệt: <b>{faculty.pendingProjects}</b>
          </span>
          <span className="opacity-70">
            GVHD: <b>{faculty.teacherCount}</b>
          </span>
          <span style={{ color: color.accent }} className="font-semibold">
            {faculty.statusLabel}
          </span>
        </div>
      </div>

      <div className="mt-2 pt-1 flex items-center justify-between">
        <span className="text-[12px] opacity-60 font-mono">
          {faculty.abbr}
          {faculty.isActive ? "" : " • Tạm ngưng"}
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

  const { data: deptStats, isLoading: deptLoading } = useQuery({
    queryKey: ["admin-department-stats"],
    queryFn: () => adminDashboardService.getDepartmentStats(),
  });

  const { data: faculties } = useQuery({
    queryKey: ["admin-faculties"],
    queryFn: () => facultyService.getAll(),
  });

  const departmentCards = useMemo<DepartmentCardData[]>(() => {
    return (deptStats ?? []).map((dept, index) => {
      const totalProjects = getProjectsTotal(dept);
      const stageCount = getProjectsApproved(dept);
      const completionRate = totalProjects
        ? Math.round((stageCount / totalProjects) * 100)
        : 0;

      return {
        id: dept.id,
        name: dept.name,
        abbr: getDepartmentAbbr(dept.id, dept.name),
        facultyId: dept.faculty_id ?? null,
        facultyName: dept.faculty || "Chưa rõ khoa",
        totalProjects,
        totalStudents: 0,
        teacherCount: getTeacherCount(dept),
        councilCount: 0,
        completionRate,
        stageDescription: "Đề tài đã duyệt",
        stageCount,
        pendingProjects: getProjectsPending(dept),
        status:
          completionRate >= 80
            ? "on-time"
            : completionRate >= 60
              ? "warning"
              : "delayed",
        color: colorOrder[index % colorOrder.length],
        location: dept.faculty || "Chưa rõ khoa",
      } satisfies DepartmentCardData;
    });
  }, [deptStats]);

  // Gom bộ môn theo khoa. Khoa mới tạo chưa có bộ môn vẫn xuất hiện (số liệu 0)
  // để admin thấy ngay khoa vừa thêm trên dashboard.
  const facultyGroups = useMemo<FacultyGroup[]>(() => {
    const facultyList = faculties ?? [];
    const groups = new Map<string, FacultyGroup>();

    facultyList.forEach((faculty) => {
      groups.set(faculty.id, {
        faculty,
        facultyId: faculty.id,
        facultyName: faculty.name,
        departments: [],
      });
    });

    departmentCards.forEach((dept) => {
      const key = dept.facultyId ?? "__unassigned__";
      if (!groups.has(key)) {
        groups.set(key, {
          faculty: null,
          facultyId: dept.facultyId,
          facultyName: dept.facultyName,
          departments: [],
        });
      }
      groups.get(key)?.departments.push(dept);
    });

    return Array.from(groups.values());
  }, [faculties, departmentCards]);

  // Mỗi khoa -> một card, tổng hợp số liệu từ các bộ môn thuộc khoa.
  const facultyCards = useMemo<FacultyCardData[]>(() => {
    return facultyGroups.map((group, index) => {
      const depts = group.departments;

      const totalProjects = depts.reduce((sum, d) => sum + d.totalProjects, 0);
      const approvedProjects = depts.reduce((sum, d) => sum + d.stageCount, 0);
      const pendingProjects = depts.reduce(
        (sum, d) => sum + d.pendingProjects,
        0,
      );
      const teacherCount = depts.reduce((sum, d) => sum + d.teacherCount, 0);

      const completionRate = totalProjects
        ? Math.round((approvedProjects / totalProjects) * 100)
        : 0;

      const status: FacultyCardData["status"] =
        completionRate >= 80
          ? "on-time"
          : completionRate >= 60
            ? "warning"
            : "delayed";

      return {
        id: group.facultyId ?? "__unassigned__",
        name: group.facultyName,
        abbr: getDepartmentAbbr(
          group.facultyId ?? group.facultyName,
          group.facultyName,
        ),
        description: group.faculty?.description ?? null,
        isActive: group.faculty?.isActive ?? true,
        departmentCount: depts.length,
        teacherCount,
        totalProjects,
        approvedProjects,
        pendingProjects,
        completionRate,
        status,
        statusLabel: !group.faculty?.isActive
          ? "Tạm ngưng"
          : status === "on-time"
            ? "Đúng tiến độ"
            : status === "delayed"
              ? "Trễ hạn"
              : "Cảnh báo",
        color: colorOrder[index % colorOrder.length],
      } satisfies FacultyCardData;
    });
  }, [facultyGroups]);

  const departments = departmentCards;

  const totalProjects = dashboardStats?.summary.totalProjects ?? 0;
  const totalStudents = dashboardStats?.summary.totalStudents ?? 0;
  const totalTeachers = dashboardStats?.summary.totalTeachers ?? 0;

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
              LIVE • {facultyCards.length} Khoa • {departments.length} Bộ môn
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
            subtext={`${departments.length} bộ môn`}
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
          {facultyCards.map((faculty) => (
            <FacultyCard key={faculty.id} faculty={faculty} />
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
