"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  adminDashboardService,
  type DepartmentStats,
} from "@/feature/dashboard/services/admin-dashboard.service";
import { Card, CardContentDiv } from "@/shared/components/Card";
import { Users, BookOpen, BarChart3, FileText, Eye } from "lucide-react";
import { Box, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { getCardBackground } from "@/shared/constants/gradients";

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
    lightAccent: "#2563eb",
  },
  green: {
    accent: "#4edea3",
    lightAccent: "#059669",
  },
  orange: {
    accent: "#ffb95f",
    lightAccent: "#d97706",
  },
  purple: {
    accent: "#b4c5ff",
    lightAccent: "#7c3aed",
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

const DepartmentCard: React.FC<{
  dept: DepartmentCardData;
  onOpen: () => void;
}> = ({ dept, onOpen }) => {
  const theme = useTheme();
  const color = departmentColors[dept.color];
  const accent =
    theme.palette.mode === "dark" ? color.accent : color.lightAccent;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen();
        }
      }}
      className="rounded-lg hover:bg-surface-card/80 transition-all flex flex-col justify-between h-full shadow-md hover:shadow-lg cursor-pointer"
      style={{
        background: getCardBackground(theme),
        border: `1px solid ${theme.palette.divider}`,
        color: theme.palette.text.primary,
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
                backgroundColor: `${accent}20`,
                color: accent,
              }}
            >
              {dept.abbr}
            </div>
            <div>
              <p
                className="text-[12px] font-bold leading-tight"
                style={{ color: theme.palette.text.primary }}
              >
                {dept.name}
              </p>
              <span
                className="text-[12px] leading-tight"
                style={{ color: theme.palette.text.secondary }}
              >
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
                stroke={theme.palette.divider}
                strokeWidth="3.5"
              />
              <circle
                cx="18"
                cy="18"
                fill="none"
                r="14"
                stroke={accent}
                strokeDasharray={`${dept.completionRate}, 100`}
                strokeDashoffset="0"
                strokeLinecap="round"
                strokeWidth="3.5"
              />
            </svg>
            <span
              className="absolute text-[12px] font-bold"
              style={{ color: theme.palette.text.primary }}
            >
              {dept.completionRate}%
            </span>
          </div>
        </div>

        <div className="mt-2 space-y-1">
          <div
            className="flex justify-between text-[12px] font-medium"
            style={{ color: theme.palette.text.secondary }}
          >
            <span>{dept.stageDescription}</span>
            <span style={{ color: accent }} className="font-bold">
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
                      ? accent
                      : theme.palette.divider,
                }}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mt-2 pt-1 text-[12px]">
          <span style={{ color: theme.palette.text.secondary }}>
            Hội đồng: <b>{dept.councilCount}</b>
          </span>
          <span style={{ color: theme.palette.text.secondary }}>
            GVHD: <b>{dept.teacherCount}</b>
          </span>
          <span style={{ color: accent }} className="font-semibold">
            {dept.status === "on-time"
              ? "Đúng tiến độ"
              : dept.status === "delayed"
                ? "Trễ hạn"
                : "Cảnh báo"}
          </span>
        </div>
      </div>

      <div className="mt-2 pt-1 flex items-center justify-between">
        <span
          className="text-[12px] font-mono"
          style={{ color: theme.palette.text.secondary }}
        >
          {dept.location}
        </span>
        <button
          type="button"
          aria-label={`Xem chi tiết ${dept.name}`}
          className="flex items-center justify-center transition-all hover:scale-110"
          style={{ color: accent }}
          onClick={(event) => {
            event.stopPropagation();
            onOpen();
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
            sx={{ display: "block", color: "text.secondary", fontWeight: 500 }}
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
                backgroundColor: alpha(iconColor, 0.1),
              }}
            >
              <Box sx={{ color: iconColor, display: "flex", fontSize: 18 }}>
                {icon}
              </Box>
            </Box>
          )}
        </Box>
        <Typography
          variant="h5"
          sx={{ color: "text.primary", fontWeight: "bold", mb: 0.5 }}
        >
          {value}
        </Typography>
        <Typography
          variant="caption"
          sx={{ display: "block", color: subtextColor, fontSize: "9px" }}
        >
          {subtext}
        </Typography>
      </CardContentDiv>
    </Card>
  );
};

export const AdminDepartmentDashboard: React.FC = () => {
  const router = useRouter();
  const theme = useTheme();

  const { data: dashboardStats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: () => adminDashboardService.getAdminStats(),
  });

  const { data: departmentStats, isLoading: deptLoading } = useQuery({
    queryKey: ["admin-department-stats"],
    queryFn: () => adminDashboardService.getDepartmentStats(),
  });

  const departments: DepartmentCardData[] = useMemo(() => {
    return (departmentStats ?? []).map((dept, index) => {
      const totalProjects = getProjectsTotal(dept);
      const stageCount = getProjectsApproved(dept);
      const completionRate = totalProjects
        ? Math.round((stageCount / totalProjects) * 100)
        : 0;

      return {
        id: dept.id,
        name: dept.name,
        abbr: getDepartmentAbbr(dept.id, dept.name),
        totalProjects,
        totalStudents: 0,
        teacherCount: getTeacherCount(dept),
        councilCount: 0,
        completionRate,
        stageDescription: "Đề tài đã duyệt",
        stageCount,
        status:
          completionRate >= 80
            ? "on-time"
            : completionRate >= 60
              ? "warning"
              : "delayed",
        color: colorOrder[index % colorOrder.length],
        location: dept.faculty || "Chưa rõ khoa",
      };
    });
  }, [departmentStats]);

  const totalProjects = dashboardStats?.summary.totalProjects ?? 0;
  const totalStudents = dashboardStats?.summary.totalStudents ?? 0;
  const totalTeachers = dashboardStats?.summary.totalTeachers ?? 0;
  const averageCompletionRate = departments.length
    ? Math.round(
        departments.reduce((sum, dept) => sum + dept.completionRate, 0) /
          departments.length,
      )
    : 0;

  const openDepartment = (departmentId: string) => {
    router.push(`/department/${encodeURIComponent(departmentId)}`);
  };

  if (statsLoading || deptLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Box
          sx={{
            height: 32,
            width: "33%",
            bgcolor: "divider",
            borderRadius: 1,
            animation: "pulse 2s ease-in-out infinite",
          }}
        />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: 2,
          }}
        >
          {[1, 2, 3, 4].map((i) => (
            <Box
              key={i}
              sx={{
                height: 128,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                animation: "pulse 2s ease-in-out infinite",
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
          maxWidth: 1280,
          mx: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 3,
          px: 4,
          py: 3,
        }}
      >
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            px: 2,
            py: 0.5,
            bgcolor: alpha(theme.palette.success.main, 0.1),
            border: "1px solid",
            borderColor: alpha(theme.palette.success.main, 0.2),
            borderRadius: "9999px",
            width: "fit-content",
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: theme.palette.success.main,
              animation: "pulse 2s infinite",
            }}
          />
          <span
            style={{
              fontSize: "11px",
              fontWeight: 500,
              color: theme.palette.success.main,
            }}
          >
            LIVE • {departments.length} Khoa/Bộ môn
          </span>
        </Box>

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
            subtext="Đang quản lý"
            subtextColor="warning.main"
            icon={<BookOpen size={18} />}
            iconColor="#8b5cf6"
          />
          <StatCard
            label="Khoa/Bộ môn"
            value={departments.length}
            subtext={`${averageCompletionRate}% TB hoàn thành`}
            subtextColor="success.main"
            icon={<BarChart3 size={18} />}
            iconColor="#f59e0b"
          />
        </Box>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {departments.map((dept) => (
            <DepartmentCard
              key={dept.id}
              dept={dept}
              onOpen={() => openDepartment(dept.id)}
            />
          ))}
        </div>

        <Box
          sx={{
            p: 3,
            borderRadius: 2,
            background: getCardBackground(theme),
            border: "1px solid",
            borderColor: "divider",
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
                So Sánh Hoàn Thành Theo Khoa/Bộ môn
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
            {departments.map((item) => (
              <Box key={item.id} sx={{ mb: 2.5 }}>
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
                      color: "text.secondary",
                      fontSize: "12px",
                      minWidth: "140px",
                    }}
                  >
                    {item.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 700,
                      color: item.completionRate >= 70 ? "#4ade80" : "#fbbf24",
                      fontSize: "12px",
                      minWidth: "40px",
                      textAlign: "right",
                    }}
                  >
                    {item.completionRate}%
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: "100%",
                    height: "28px",
                    backgroundColor: theme.palette.divider,
                    borderRadius: "12px",
                    overflow: "hidden",
                    position: "relative",
                    boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  <Box
                    sx={{
                      height: "100%",
                      width: `${item.completionRate}%`,
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
                  {item.completionRate >= 70 && (
                    <Box
                      sx={{
                        position: "absolute",
                        right: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: theme.palette.common.white,
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
              TB hoàn thành: <b>{averageCompletionRate}%</b>
            </span>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDepartmentDashboard;
