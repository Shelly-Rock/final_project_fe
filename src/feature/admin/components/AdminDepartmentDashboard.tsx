"use client";

import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminDashboardService } from "@/feature/dashboard/services/admin-dashboard.service";
import {
  Search,
  Plus,
  ChevronRight,
  Users,
  BookOpen,
  BarChart3,
} from "lucide-react";

interface DepartmentCardData {
  id: string;
  name: string;
  abbr: string;
  icon: string;
  totalProjects: number;
  totalStudents: number;
  teacherCount: number;
  councilCount: number;
  completionRate: number;
  status: "on-time" | "delayed" | "warning";
  color: "blue" | "green" | "orange" | "purple";
  location: string;
  manager: string;
}

const departmentColors = {
  blue: {
    bg: "bg-blue-50 dark:bg-blue-950/20",
    border: "border-blue-200 dark:border-blue-800",
    accent: "#2563eb",
    light: "#dbeafe",
  },
  green: {
    bg: "bg-green-50 dark:bg-green-950/20",
    border: "border-green-200 dark:border-green-800",
    accent: "#16a34a",
    light: "#dcfce7",
  },
  orange: {
    bg: "bg-orange-50 dark:bg-orange-950/20",
    border: "border-orange-200 dark:border-orange-800",
    accent: "#ea580c",
    light: "#ffedd5",
  },
  purple: {
    bg: "bg-purple-50 dark:bg-purple-950/20",
    border: "border-purple-200 dark:border-purple-800",
    accent: "#9333ea",
    light: "#f3e8ff",
  },
};

const DepartmentCard: React.FC<{ dept: DepartmentCardData }> = ({ dept }) => {
  const color = departmentColors[dept.color];

  return (
    <div
      className={`p-4 rounded-xl ${color.bg} border ${color.border} hover:border-opacity-60 transition-all flex flex-col justify-between h-full`}
    >
      <div>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded bg-opacity-10 flex items-center justify-center font-bold text-sm"
              style={{ backgroundColor: color.accent, color: color.accent }}
            >
              {dept.abbr}
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">
                {dept.name}
              </h2>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {dept.totalProjects} ĐT • {dept.totalStudents} SV
              </span>
            </div>
          </div>

          {/* Mini Radial Chart */}
          <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                fill="none"
                r="14"
                stroke="currentColor"
                strokeWidth="3"
                className="text-gray-300 dark:text-gray-700"
              />
              <circle
                cx="18"
                cy="18"
                fill="none"
                r="14"
                stroke={color.accent}
                strokeDasharray={`${dept.completionRate}, 100`}
                strokeLinecap="round"
                strokeWidth="3"
              />
            </svg>
            <span className="absolute text-xs font-bold text-gray-900 dark:text-white">
              {dept.completionRate}%
            </span>
          </div>
        </div>

        {/* Visual Funnel Pipeline */}
        <div className="mt-3 space-y-2">
          <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-gray-400">
            <span>Giai đoạn</span>
            <span style={{ color: color.accent }} className="font-bold">
              {Math.round(dept.completionRate * 0.04)}/4
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1 h-1.5">
            {[1, 2, 3, 4].map((stage) => (
              <div
                key={stage}
                className="rounded-full"
                style={{
                  backgroundColor:
                    stage <= Math.ceil(dept.completionRate / 25)
                      ? color.accent
                      : "#e5e7eb",
                }}
              />
            ))}
          </div>
        </div>

        {/* Mini Stat Bar */}
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-200 dark:border-gray-700 text-xs">
          <span className="text-gray-600 dark:text-gray-400">
            Hội đồng:{" "}
            <b className="text-gray-900 dark:text-white">{dept.councilCount}</b>
          </span>
          <span className="text-gray-600 dark:text-gray-400">
            GVHD:{" "}
            <b className="text-gray-900 dark:text-white">{dept.teacherCount}</b>
          </span>
          <span className="font-semibold" style={{ color: color.accent }}>
            {dept.status === "on-time"
              ? "Đúng tiến độ"
              : dept.status === "delayed"
                ? "Trễ hạn"
                : "Cảnh báo"}
          </span>
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <span className="text-xs text-gray-500 dark:text-gray-500 font-mono">
          {dept.location}
        </span>
        <button
          className="text-xs font-medium flex items-center gap-0.5 hover:gap-1 transition-all"
          style={{ color: color.accent }}
        >
          Chi tiết <ChevronRight size={14} />
        </button>
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

  // Mock department data for the dashboard
  const mockDepartments: DepartmentCardData[] = useMemo(() => {
    return [
      {
        id: "1",
        name: "CNTT & Truyền thông",
        abbr: "IT",
        icon: "💻",
        totalProjects: 450,
        totalStudents: 580,
        teacherCount: 65,
        councilCount: 16,
        completionRate: 82,
        status: "on-time",
        color: "blue",
        location: "P. A1 • Nam TH",
        manager: "Nguyễn Văn A",
      },
      {
        id: "2",
        name: "Điện - Điện Tử",
        abbr: "EE",
        icon: "⚡",
        totalProjects: 320,
        totalStudents: 390,
        teacherCount: 48,
        councilCount: 12,
        completionRate: 75,
        status: "delayed",
        color: "green",
        location: "P. B2 • Huy LQ",
        manager: "Trần Thị B",
      },
      {
        id: "3",
        name: "Kinh Tế & QTKD",
        abbr: "BA",
        icon: "📊",
        totalProjects: 380,
        totalStudents: 460,
        teacherCount: 52,
        councilCount: 14,
        completionRate: 90,
        status: "on-time",
        color: "orange",
        location: "P. C1 • Mai NT",
        manager: "Lê Thị C",
      },
      {
        id: "4",
        name: "Cơ Khí Chế Tạo",
        abbr: "ME",
        icon: "🔧",
        totalProjects: 270,
        totalStudents: 320,
        teacherCount: 40,
        councilCount: 10,
        completionRate: 68,
        status: "warning",
        color: "purple",
        location: "X. D1 • Toàn VD",
        manager: "Phạm Văn D",
      },
      {
        id: "5",
        name: "Khoa Học Ứng Dụng",
        abbr: "AS",
        icon: "🔬",
        totalProjects: 150,
        totalStudents: 180,
        teacherCount: 35,
        councilCount: 8,
        completionRate: 80,
        status: "on-time",
        color: "blue",
        location: "P. E2 • Hòa VT",
        manager: "Võ Văn E",
      },
      {
        id: "6",
        name: "Hóa Học & Môi Trường",
        abbr: "CH",
        icon: "🧪",
        totalProjects: 150,
        totalStudents: 160,
        teacherCount: 30,
        councilCount: 8,
        completionRate: 71,
        status: "on-time",
        color: "green",
        location: "P. F1 • Lan TK",
        manager: "Nguyễn Thị F",
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

  const avgCompletion = Math.round(
    mockDepartments.reduce((sum, d) => sum + d.completionRate, 0) /
      mockDepartments.length,
  );

  const totalProjects = mockDepartments.reduce(
    (sum, d) => sum + d.totalProjects,
    0,
  );
  const totalStudents = mockDepartments.reduce(
    (sum, d) => sum + d.totalStudents,
    0,
  );
  const totalTeachers = mockDepartments.reduce(
    (sum, d) => sum + d.teacherCount,
    0,
  );

  if (statsLoading || deptLoading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/3 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-32 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Bảng Điều Hành Đồ Án
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              LIVE • {mockDepartments.length} Khoa
            </p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-0.5">
              {(["week", "month", "all"] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setActiveTimeRange(range)}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                    activeTimeRange === range
                      ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
                  }`}
                >
                  {range === "week"
                    ? "Tuần này"
                    : range === "month"
                      ? "Tháng này"
                      : "Cả đợt"}
                </button>
              ))}
            </div>
            <button className="h-10 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors flex items-center gap-2">
              <Plus size={18} />
              <span>Lập HĐ Mới</span>
            </button>
          </div>
        </div>

        {/* KPI Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Tổng Đề Tài
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {totalProjects}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  +8.2% so với tháng trước
                </p>
              </div>
              <div className="flex items-end gap-1 h-10">
                {[40, 50, 60, 80, 100].map((height, i) => (
                  <div
                    key={i}
                    className="w-1.5 rounded-t bg-blue-400"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Sinh Viên Đồ Án
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {totalStudents}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  ~1.3 SV/đề tài
                </p>
              </div>
              <Users size={32} className="text-green-500" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  GV Hướng Dẫn
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {totalTeachers}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  100% đủ tải
                </p>
              </div>
              <BookOpen size={32} className="text-orange-500" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Hoàn Thành TB
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {avgCompletion}%
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Đúng tiến độ
                </p>
              </div>
              <div className="relative w-14 h-14 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    fill="none"
                    r="14"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-gray-300 dark:text-gray-700"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    fill="none"
                    r="14"
                    stroke="#10b981"
                    strokeDasharray={`${avgCompletion}, 100`}
                    strokeLinecap="round"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Distribution Bar */}
        <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BarChart3 size={18} className="text-blue-600" />
              <span className="text-xs font-bold uppercase tracking-widest text-gray-900 dark:text-white">
                Tiến độ 4 giai đoạn ({totalProjects} đề tài)
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              {[
                { color: "bg-gray-400", label: "Đề cương (8%)" },
                { color: "bg-blue-500", label: "Nghiên cứu (42%)" },
                { color: "bg-orange-500", label: "Phản biện (28%)" },
                { color: "bg-green-500", label: "Bảo vệ (22%)" },
              ].map((item, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400"
                >
                  <span className={`w-2 h-2 rounded ${item.color}`} />
                  {item.label}
                </span>
              ))}
            </div>
          </div>
          <div className="w-full h-3 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden flex gap-0.5">
            <div
              className="bg-gray-400 h-full"
              style={{ width: "8%" }}
              title="Đề cương: 114 đề tài"
            />
            <div
              className="bg-blue-500 h-full"
              style={{ width: "42%" }}
              title="Nghiên cứu: 596 đề tài"
            />
            <div
              className="bg-orange-500 h-full"
              style={{ width: "28%" }}
              title="Phản biện: 398 đề tài"
            />
            <div
              className="bg-green-500 h-full"
              style={{ width: "22%" }}
              title="Bảo vệ: 312 đề tài"
            />
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Tìm kiếm khoa, giảng viên, hội đồng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Department Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDepartments.map((dept) => (
            <DepartmentCard key={dept.id} dept={dept} />
          ))}
        </div>

        {filteredDepartments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              Không tìm thấy khoa nào phù hợp với &quot;{searchQuery}&quot;
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDepartmentDashboard;
