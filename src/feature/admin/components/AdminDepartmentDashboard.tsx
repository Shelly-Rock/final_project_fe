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
  Clock,
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

interface ScheduleSlot {
  time: string;
  period: string;
  title: string;
  room: string;
  status: "ongoing" | "preparing";
}

interface ScheduleSlot {
  time: string;
  period: string;
  title: string;
  room: string;
  status: "ongoing" | "preparing";
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
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    accent: "#2563eb",
    accentLight: "#60a5fa",
    progressColor: "#2563eb",
    text: "text-blue-400",
  },
  green: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    accent: "#4edea3",
    accentLight: "#6ffbbe",
    progressColor: "#4edea3",
    text: "text-emerald-400",
  },
  orange: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    accent: "#ffb95f",
    accentLight: "#ffd49a",
    progressColor: "#ffb95f",
    text: "text-amber-400",
  },
  purple: {
    bg: "bg-blue-400/10",
    border: "border-blue-400/30",
    accent: "#b4c5ff",
    accentLight: "#dbe1ff",
    progressColor: "#b4c5ff",
    text: "text-blue-300",
  },
};

const DepartmentCard: React.FC<{ dept: DepartmentCardData }> = ({ dept }) => {
  const color = departmentColors[dept.color];

  return (
    <div
      className={`p-4 rounded-xl bg-slate-700/20 border ${color.border} hover:border-opacity-100 transition-all flex flex-col justify-between h-full`}
    >
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded flex items-center justify-center font-bold text-xs text-white"
              style={{
                backgroundColor: color.accent + "20",
                color: color.accent,
              }}
            >
              {dept.abbr}
            </div>
            <div>
              <h2 className="text-xs font-bold text-slate-50">{dept.name}</h2>
              <span className="text-xs text-slate-400">
                {dept.totalProjects} ĐT • {dept.totalStudents} SV
              </span>
            </div>
          </div>

          {/* Mini Circular Progress */}
          <div className="relative w-9 h-9 flex items-center justify-center shrink-0">
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
            <span className="absolute text-[10px] font-bold text-slate-50">
              {dept.completionRate}%
            </span>
          </div>
        </div>

        {/* Stage Description & Progress */}
        <div className="mt-3.5 space-y-1.5">
          <div className="flex justify-between text-[10px] font-medium text-slate-400">
            <span>{dept.stageDescription}</span>
            <span style={{ color: color.accent }} className="font-bold">
              {dept.stageCount}/{dept.totalProjects}
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
                      : "#2d344c",
                }}
              />
            ))}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-600/20 text-[11px]">
          <span className="text-slate-400">
            Hội đồng: <b className="text-slate-50">{dept.councilCount}</b>
          </span>
          <span className="text-slate-400">
            GVHD: <b className="text-slate-50">{dept.teacherCount}</b>
          </span>
          <span style={{ color: color.accent }} className="font-semibold">
            {dept.status === "on-time"
              ? "Đúng tiến độ"
              : dept.status === "delayed"
                ? "20 trễ hạn"
                : "Theo chuẩn"}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 pt-2 border-t border-slate-600/20 flex items-center justify-between">
        <span className="text-[10px] text-slate-500 font-mono">
          {dept.location}
        </span>
        <button
          className="text-[11px] font-medium flex items-center gap-0.5 hover:gap-1 transition-all"
          style={{ color: color.accent }}
        >
          Chi tiết <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
};

const ScheduleCard: React.FC<{ slot: ScheduleSlot }> = ({ slot }) => {
  const isOngoing = slot.status === "ongoing";

  return (
    <div className="p-3 rounded-lg bg-slate-700/30 border border-slate-600/20 hover:border-slate-500/30 transition-colors flex items-center justify-between gap-3">
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="flex flex-col shrink-0 w-24">
          <span className="text-xs font-mono font-bold text-slate-50">
            {slot.time}
          </span>
          <span className="text-[10px] text-slate-500">{slot.period}</span>
        </div>
        <div className="w-px h-7 bg-slate-600/20 shrink-0" />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-50 truncate">
              {slot.title}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-slate-400">
            <MapPin size={13} />
            <span>{slot.room}</span>
          </div>
        </div>
      </div>
      <div className="shrink-0">
        {isOngoing ? (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Đang diễn ra
          </span>
        ) : (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            Chuẩn bị
          </span>
        )}
      </div>
    </div>
  );
};

const DayType = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
] as const;
type DayValue = (typeof DayType)[number];

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

        {/* Bottom Section: Schedule & Comparison Chart */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
          {/* Left: Schedule Timeline (7 columns) */}
          <div className="xl:col-span-7 p-4 rounded-xl bg-slate-800/50 border border-slate-700">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-700/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <Clock size={18} />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                    Lịch Bảo Vệ Đồ Án
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Tuần 19 • Khóa 2021-2025
                  </span>
                </div>
              </div>
              {/* Day Selector Pills */}
              <div className="flex items-center gap-1 bg-slate-900/50 p-1 rounded-lg border border-slate-700/50">
                {["T2 (Hôm nay)", "T3", "T4", "T5", "T6"].map((day, idx) => (
                  <button
                    key={`day-${day}`}
                    type="button"
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                      idx === 0
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Schedule Slots */}
            <div className="space-y-2">
              {scheduleSlots.map((slot, idx) => (
                <ScheduleCard key={idx} slot={slot} />
              ))}
            </div>

            {/* Footer Stats */}
            <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-400">
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />4
                  hội đồng hôm nay
                </span>
                <span>•</span>
                <span>10 phòng sẵn sàng</span>
              </div>
              <button className="text-blue-400 font-medium hover:underline flex items-center gap-1 text-xs">
                Xem toàn bộ lịch trình
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Right: Comparison Chart (5 columns) */}
          <div className="xl:col-span-5 p-4 rounded-xl bg-slate-800/50 border border-slate-700">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <BarChart3 size={18} className="text-emerald-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  So Sánh Tỷ Lệ Hoàn Thành 6 Khoa
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                KPI &gt; 70%
              </span>
            </div>

            {/* Progress Bars */}
            <div className="space-y-2.5">
              {[
                {
                  dept: "Kinh Tế & QTKD",
                  percent: 90,
                  count: "342/380",
                  color: "bg-amber-500",
                },
                {
                  dept: "CNTT & TT",
                  percent: 82,
                  count: "369/450",
                  color: "bg-emerald-500",
                },
                {
                  dept: "Điện - Điện Tử",
                  percent: 75,
                  count: "240/320",
                  color: "bg-amber-500",
                },
                {
                  dept: "Cơ Khí",
                  percent: 68,
                  count: "184/270",
                  color: "bg-blue-400",
                },
                {
                  dept: "Khoa Học Ứng Dụng",
                  percent: 80,
                  count: "120/150",
                  color: "bg-emerald-400",
                },
                {
                  dept: "Hóa Học & Môi Trường",
                  percent: 71,
                  count: "106/150",
                  color: "bg-amber-500",
                },
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-slate-300">
                      {item.dept}
                    </span>
                    <span
                      className={`font-bold ${item.color.replace("bg-", "text-")}`}
                    >
                      {item.percent}%{" "}
                      <span className="text-[10px] text-slate-500 font-normal">
                        ({item.count})
                      </span>
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-700 overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all`}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Quick Status */}
            <div className="mt-3 pt-2 border-t border-slate-700/50 flex items-center justify-between text-[11px]">
              <span className="text-slate-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                TB hoàn thành: <b className="text-white">77.6%</b>
              </span>
              <button className="text-xs text-blue-400 font-medium hover:underline flex items-center gap-0.5">
                Xuất biểu đồ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDepartmentDashboard;
