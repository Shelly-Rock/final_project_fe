"use client";

import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminDashboardService } from "@/feature/dashboard/services/admin-dashboard.service";
import {
  Search,
  Plus,
  ChevronRight,
  Calendar,
  Users,
  BookOpen,
  BarChart3,
  MapPin,
} from "lucide-react";

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
    bg: "bg-[#1e3a8a]/20 dark:bg-blue-950/40",
    border: "border-blue-600/30 dark:border-blue-500/30",
    accent: "#3b82f6",
    accentLight: "#60a5fa",
    progressColor: "#3b82f6",
  },
  green: {
    bg: "bg-[#10b981]/20 dark:bg-emerald-950/40",
    border: "border-emerald-600/30 dark:border-emerald-500/30",
    accent: "#10b981",
    accentLight: "#34d399",
    progressColor: "#10b981",
  },
  orange: {
    bg: "bg-[#f59e0b]/20 dark:bg-amber-950/40",
    border: "border-amber-600/30 dark:border-amber-500/30",
    accent: "#f59e0b",
    accentLight: "#fbbf24",
    progressColor: "#f59e0b",
  },
  purple: {
    bg: "bg-[#a78bfa]/20 dark:bg-purple-950/40",
    border: "border-purple-600/30 dark:border-purple-500/30",
    accent: "#a78bfa",
    accentLight: "#c4b5fd",
    progressColor: "#a78bfa",
  },
};

const DepartmentCard: React.FC<{ dept: DepartmentCardData }> = ({ dept }) => {
  const color = departmentColors[dept.color];

  return (
    <div
      className={`p-4 rounded-xl bg-slate-800/50 border ${color.border} hover:border-opacity-100 transition-all flex flex-col justify-between h-full`}
    >
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded flex items-center justify-center font-bold text-sm text-white"
              style={{ backgroundColor: color.accent }}
            >
              {dept.abbr}
            </div>
            <div>
              <h2 className="text-xs font-bold text-white">{dept.name}</h2>
              <span className="text-xs text-gray-400">
                {dept.totalProjects} ĐT • {dept.totalStudents} SV
              </span>
            </div>
          </div>

          {/* Mini Circular Progress */}
          <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
            <svg
              className="w-full h-full -rotate-90"
              viewBox="0 0 36 36"
              style={{ filter: "drop-shadow(0 0 8px rgba(0,0,0,0.3))" }}
            >
              <circle
                cx="18"
                cy="18"
                fill="none"
                r="14"
                stroke="#374151"
                strokeWidth="2.5"
              />
              <circle
                cx="18"
                cy="18"
                fill="none"
                r="14"
                stroke={color.progressColor}
                strokeDasharray={`${dept.completionRate}, 100`}
                strokeDashoffset="0"
                strokeLinecap="round"
                strokeWidth="2.5"
              />
            </svg>
            <span className="absolute text-[11px] font-bold text-white">
              {dept.completionRate}%
            </span>
          </div>
        </div>

        {/* Stage Description & Progress */}
        <div className="mt-3 space-y-2">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-gray-400">{dept.stageDescription}</span>
            <span style={{ color: color.accentLight }} className="font-bold">
              {dept.stageCount}/450
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
                      ? color.progressColor
                      : "#4b5563",
                }}
              />
            ))}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-gray-700 text-xs">
          <span className="text-gray-400">
            Hội đồng: <b className="text-white">{dept.councilCount}</b>
          </span>
          <span className="text-gray-400">
            GVHD: <b className="text-white">{dept.teacherCount}</b>
          </span>
          <span style={{ color: color.accentLight }} className="font-semibold">
            {dept.status === "on-time"
              ? "Đúng tiến độ"
              : dept.status === "delayed"
                ? "20 trễ hạn"
                : "Theo chuẩn"}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 pt-2 border-t border-gray-700 flex items-center justify-between">
        <span className="text-xs text-gray-500 font-mono">{dept.location}</span>
        <button
          className="text-xs font-medium flex items-center gap-0.5 hover:gap-1 transition-all"
          style={{ color: color.accentLight }}
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

  const avgCompletion = Math.round(
    mockDepartments.reduce((sum, d) => sum + d.completionRate, 0) /
      mockDepartments.length,
  );

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
    <div className="min-h-screen bg-slate-900 p-6">
      {/* Header Bar */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-slate-950/80 backdrop-blur-sm border-b border-slate-800 z-40 flex items-center justify-between px-6">
        <div className="flex items-center gap-3 flex-1">
          <Search size={20} className="text-slate-500" />
          <input
            type="text"
            placeholder="Tìm kiếm nhanh đề tài, giảng viên, hội đồng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white">
            <Calendar size={16} className="text-emerald-500" />
            <span className="font-medium">Khóa 2021-2025 • Đợt 1</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6 mt-20">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Bảng Điều Hành Đồ Án
            </h1>
            <p className="text-slate-400 mt-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              LIVE • {mockDepartments.length} Khoa
            </p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg p-0.5">
              {(["week", "month", "all"] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setActiveTimeRange(range)}
                  className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                    activeTimeRange === range
                      ? "bg-slate-700 text-white"
                      : "text-slate-400 hover:text-white"
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
          {/* Card 1: Tổng Đề Tài */}
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-400">
                  Tổng Đề Tài
                </p>
                <p className="text-3xl font-bold text-white mt-2">
                  {totalProjects}
                </p>
                <p className="text-xs text-emerald-500 mt-1">+8.2%</p>
                <p className="text-xs text-slate-500 mt-1">
                  100% duyệt đề cương
                </p>
              </div>
              <div className="flex items-end gap-1 h-12">
                {[40, 50, 60, 80, 100].map((height, i) => (
                  <div
                    key={i}
                    className="w-1.5 rounded-t bg-blue-500/60"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Sinh Viên Đồ Án */}
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-400">
                  Sinh Viên Đồ Án
                </p>
                <p className="text-3xl font-bold text-white mt-2">
                  {totalStudents}
                </p>
                <p className="text-xs text-emerald-500 mt-1">430 nhóm</p>
                <p className="text-xs text-slate-500 mt-1">
                  Tỷ lệ 1.3 SV/đề tài
                </p>
              </div>
              <Users size={40} className="text-emerald-500/70" />
            </div>
          </div>

          {/* Card 3: GV Hướng Dẫn */}
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-400">
                  GV Hướng Dẫn
                </p>
                <p className="text-3xl font-bold text-white mt-2">
                  {totalTeachers}
                </p>
                <p className="text-xs text-amber-500 mt-1">5.8 ĐT/GV</p>
                <p className="text-xs text-slate-500 mt-1">
                  100% đủ tải giảng dạy
                </p>
              </div>
              <BookOpen size={40} className="text-amber-500/70" />
            </div>
          </div>

          {/* Card 4: Hội Đồng Bảo Vệ */}
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-400">
                  Hội Đồng Bảo Vệ
                </p>
                <p className="text-3xl font-bold text-white mt-2">48</p>
                <p className="text-xs text-emerald-500 mt-1">88.5% đúng hạn</p>
                <p className="text-xs text-slate-500 mt-1">12 HĐ chấm chéo</p>
              </div>
              <div className="relative w-14 h-14 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    fill="none"
                    r="14"
                    stroke="#374151"
                    strokeWidth="3"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    fill="none"
                    r="14"
                    stroke="#10b981"
                    strokeDasharray="88, 100"
                    strokeLinecap="round"
                    strokeWidth="3"
                  />
                </svg>
                <span className="absolute text-xs font-bold text-white">
                  88%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Distribution Bar */}
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BarChart3 size={18} className="text-blue-500" />
              <span className="text-xs font-bold uppercase tracking-widest text-white">
                Tiến độ 4 giai đoạn toàn trường ({totalProjects} đề tài)
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              {[
                { color: "w-2 h-2 bg-gray-500", label: "Đề cương (8%)" },
                { color: "w-2 h-2 bg-blue-500", label: "Nghiên cứu (42%)" },
                { color: "w-2 h-2 bg-amber-500", label: "Phản biện (28%)" },
                { color: "w-2 h-2 bg-emerald-500", label: "Bảo vệ (22%)" },
              ].map((item, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1.5 text-slate-400"
                >
                  <span className={`rounded-full ${item.color}`} />
                  {item.label}
                </span>
              ))}
            </div>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-700 overflow-hidden flex gap-0.5">
            <div
              className="bg-gray-500 h-full"
              style={{ width: "8%" }}
              title="Đề cương: 114 đề tài"
            />
            <div
              className="bg-blue-500 h-full"
              style={{ width: "42%" }}
              title="Nghiên cứu: 596 đề tài"
            />
            <div
              className="bg-amber-500 h-full"
              style={{ width: "28%" }}
              title="Phản biện: 398 đề tài"
            />
            <div
              className="bg-emerald-500 h-full"
              style={{ width: "22%" }}
              title="Bảo vệ: 312 đề tài"
            />
          </div>
        </div>

        {/* Department Cards Grid - 4 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredDepartments.map((dept) => (
            <DepartmentCard key={dept.id} dept={dept} />
          ))}
        </div>

        {filteredDepartments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">
              Không tìm thấy khoa nào phù hợp với `{searchQuery}`
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDepartmentDashboard;
