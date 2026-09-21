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
    <div className="p-4 rounded-lg bg-surface-card/70 hover:bg-surface-card/80 transition-all flex flex-col justify-between h-full">
      <div>
        <div className="flex items-start justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <div
              className="w-6 h-6 rounded flex items-center justify-center font-bold text-[10px]"
              style={{
                backgroundColor: color.accent + "20",
                color: color.accent,
              }}
            >
              {dept.abbr}
            </div>
            <div>
              <h2 className="text-[10px] font-bold leading-tight">
                {dept.name}
              </h2>
              <span className="text-[9px] opacity-70 leading-tight">
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
            <span className="absolute text-[9px] font-bold">
              {dept.completionRate}%
            </span>
          </div>
        </div>

        <div className="mt-2 space-y-1">
          <div className="flex justify-between text-[9px] font-medium opacity-70">
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

        <div className="flex items-center justify-between mt-2 pt-1 text-[9px]">
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
        <span className="text-[8px] opacity-60 font-mono">{dept.location}</span>
        <button
          className="text-[9px] font-medium flex items-center gap-0.5 hover:gap-1 transition-all"
          style={{ color: color.accent }}
        >
          Chi tiết <ChevronRight size={12} />
        </button>
      </div>
    </div>
  );
};

const ScheduleCard: React.FC<{ slot: ScheduleSlot }> = ({ slot }) => {
  const isOngoing = slot.status === "ongoing";

  return (
    <div className="p-2.5 rounded-lg bg-surface-subtle/40 hover:bg-surface-subtle/60 transition-colors flex items-center justify-between gap-2">
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
    <div className="min-h-screen bg-surface text-text-primary">
      {/* Header */}
      <header className="bg-surface-card sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h1 className="text-lg font-bold">Bảng Điều Hành Đồ Án</h1>
              <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-medium text-emerald-400">
                  LIVE • {mockDepartments.length} Khoa
                </span>
              </div>
            </div>
            <p className="text-[11px] opacity-70">
              Quản lý đề tài, sinh viên, giảng viên hướng dẫn
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-surface-subtle rounded-lg text-[10px]">
              <Calendar size={14} className="text-emerald-400" />
              <span className="font-medium">Khóa 2021-2025 • Đợt 1</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto space-y-3 px-4 py-3">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
          <div className="flex-1 relative w-full md:w-auto">
            <Search
              className="absolute left-2.5 top-1/2 -translate-y-1/2 opacity-50"
              size={16}
            />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-surface-subtle text-[11px] placeholder:text-text-secondary focus:outline-none focus:bg-surface-card transition-colors"
            />
          </div>
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
        </div>

        {/* KPI Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          <div className="p-3 rounded-lg bg-surface-card/70">
            <p className="text-[10px] font-medium opacity-70">Tổng Đề Tài</p>
            <p className="text-2xl font-bold mt-1">{totalProjects}</p>
            <p className="text-[9px] text-emerald-400 mt-0.5">+8.2%</p>
          </div>

          <div className="p-3 rounded-lg bg-surface-card/70">
            <p className="text-[10px] font-medium opacity-70">Sinh Viên</p>
            <p className="text-2xl font-bold mt-1">{totalStudents}</p>
            <p className="text-[9px] text-emerald-400 mt-0.5">430 nhóm</p>
          </div>

          <div className="p-3 rounded-lg bg-surface-card/70">
            <p className="text-[10px] font-medium opacity-70">GVHD</p>
            <p className="text-2xl font-bold mt-1">{totalTeachers}</p>
            <p className="text-[9px] text-amber-400 mt-0.5">5.8 ĐT/GV</p>
          </div>

          <div className="p-3 rounded-lg bg-surface-card/70">
            <p className="text-[10px] font-medium opacity-70">Hội Đồng</p>
            <p className="text-2xl font-bold mt-1">48</p>
            <p className="text-[9px] text-emerald-400 mt-0.5">88.5%</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="p-3 rounded-lg bg-surface-card/70">
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
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-3">
          {/* Schedule */}
          <div className="xl:col-span-7 p-3 rounded-lg bg-surface-card/70">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Clock size={14} />
                </div>
                <div>
                  <h3 className="text-[10px] font-bold uppercase">
                    Lịch Bảo Vệ Đồ Án
                  </h3>
                  <span className="text-[9px] text-text-secondary opacity-70">
                    Tuần 19 • Khóa 2021-2025
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-0.5 bg-surface-subtle p-0.5 rounded-lg">
                {["T2", "T3", "T4", "T5", "T6"].map((day, idx) => (
                  <button
                    key={`day-${day}`}
                    className={`px-1.5 py-0.5 rounded text-[9px] font-semibold transition-all ${
                      idx === 0
                        ? "bg-primary text-on-primary shadow-sm"
                        : "text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              {scheduleSlots.map((slot, idx) => (
                <ScheduleCard key={idx} slot={slot} />
              ))}
            </div>

            <div className="mt-2 pt-2 flex items-center justify-between text-[9px]">
              <span className="text-text-secondary opacity-70">
                <span className="text-emerald-400 font-medium">
                  4 hội đồng hôm nay
                </span>{" "}
                • 10 phòng sẵn sàng
              </span>
              <button className="text-primary font-medium hover:underline flex items-center gap-0.5">
                Xem toàn bộ
                <ChevronRight size={12} />
              </button>
            </div>
          </div>

          {/* Comparison Chart */}
          <div className="xl:col-span-5 p-3 rounded-lg bg-surface-card/70">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5">
                <BarChart3 size={14} className="text-primary" />
                <h3 className="text-[10px] font-bold uppercase">
                  So Sánh Hoàn Thành 6 Khoa
                </h3>
              </div>
              <span className="text-[9px] font-mono text-text-secondary opacity-70">
                KPI &gt; 70%
              </span>
            </div>

            <div className="space-y-1.5">
              {[
                { dept: "Kinh Tế & QTKD", percent: 90, color: "bg-amber-500" },
                { dept: "CNTT & TT", percent: 82, color: "bg-emerald-500" },
                { dept: "Điện - Điện Tử", percent: 75, color: "bg-amber-500" },
                { dept: "Cơ Khí", percent: 68, color: "bg-blue-400" },
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-[9px] mb-0.5">
                    <span className="font-medium">{item.dept}</span>
                    <span className={item.color.replace("bg-", "text-")}>
                      {item.percent}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-surface-subtle overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full`}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-2 pt-2 flex items-center justify-between text-[9px]">
              <span className="text-text-secondary opacity-70">
                <span className="w-1 h-1 rounded-full bg-emerald-500 inline-block mr-1" />
                TB hoàn thành: <b>77.6%</b>
              </span>
              <button className="text-primary font-medium hover:underline">
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
