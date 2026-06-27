"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Role } from "@/core/permissions/types";

// ---------- Types ----------
export interface DeadlineConfig {
  id: string;
  key: string;
  label: string;
  description: string;
  deadline: string; // ISO date string
  alertDays: number; // days before deadline to start showing alert
  enabled: boolean;
  roles: Role[]; // which roles are affected
}

export interface QuotaConfig {
  maxTopicsPerTeacher: number; // max thesis topics a teacher can supervise
  maxStudentsPerTopic: number; // max students per thesis topic
  maxCouncilMembers: number; // members per council
  councilRoles: {
    chutich: number; // number of chairmen needed
    thuky: number;
    uyvien: number;
    phanbienNgoai: number;
  };
}

export interface AppConfigState {
  _hasHydrated: boolean;
  version: string;
  academicYear: string;
  semester: string;
  deadlines: DeadlineConfig[];
  quota: QuotaConfig;
  isMaintenance: boolean;
  maintenanceMessage: string;

  // Actions
  setHasHydrated: (state: boolean) => void;
  updateDeadline: (key: string, updates: Partial<DeadlineConfig>) => void;
  toggleDeadline: (key: string) => void;
  updateQuota: (updates: Partial<QuotaConfig>) => void;
  setMaintenance: (enabled: boolean, message?: string) => void;
  resetConfig: () => void;
}

// ---------- Defaults ----------
const DEFAULT_DEADLINES: DeadlineConfig[] = [
  {
    id: "dl-1",
    key: "topic_registration",
    label: "Đăng ký đề tài",
    description: "Sinh viên đăng ký đề tài luận văn",
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    alertDays: 7,
    enabled: true,
    roles: ["student"],
  },
  {
    id: "dl-2",
    key: "topic_approval",
    label: "Duyệt đề tài",
    description: "GV và Thư ký duyệt đề tài đăng ký",
    deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
    alertDays: 5,
    enabled: true,
    roles: ["teacher", "secretary"],
  },
  {
    id: "dl-3",
    key: "first_submission",
    label: "Nộp bài lần 1",
    description: "SV nộp bản draft đầu tiên",
    deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    alertDays: 14,
    enabled: true,
    roles: ["student"],
  },
  {
    id: "dl-4",
    key: "council_grading",
    label: "Chấm điểm HĐ",
    description: "Hội đồng chấm điểm bảo vệ",
    deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    alertDays: 7,
    enabled: true,
    roles: ["council"],
  },
  {
    id: "dl-5",
    key: "revision_submit",
    label: "Nộp bài chỉnh sửa",
    description: "SV nộp bài chỉnh sửa sau bảo vệ",
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    alertDays: 3,
    enabled: true,
    roles: ["student"],
  },
  {
    id: "dl-6",
    key: "final_score",
    label: "Công bố điểm cuối",
    description: "Thư ký công bố điểm tổng kết",
    deadline: new Date(Date.now() + 100 * 24 * 60 * 60 * 1000).toISOString(),
    alertDays: 7,
    enabled: false,
    roles: ["secretary"],
  },
];

const DEFAULT_QUOTA: QuotaConfig = {
  maxTopicsPerTeacher: 5,
  maxStudentsPerTopic: 3,
  maxCouncilMembers: 5,
  councilRoles: {
    chutich: 1,
    thuky: 1,
    uyvien: 3,
    phanbienNgoai: 0,
  },
};

const INITIAL_STATE = {
  version: "1.0.0",
  academicYear: "2025-2026",
  semester: "Học kỳ 2",
  deadlines: DEFAULT_DEADLINES,
  quota: DEFAULT_QUOTA,
  isMaintenance: false,
  maintenanceMessage: "Hệ thống đang bảo trì. Vui lòng quay lại sau.",
};

export const useAppConfigStore = create<AppConfigState>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,
      _hasHydrated: false,

      setHasHydrated: (state) => set({ _hasHydrated: state }),

      updateDeadline: (key, updates) =>
        set((state) => ({
          deadlines: state.deadlines.map((dl) =>
            dl.key === key ? { ...dl, ...updates } : dl
          ),
        })),

      toggleDeadline: (key) =>
        set((state) => ({
          deadlines: state.deadlines.map((dl) =>
            dl.key === key ? { ...dl, enabled: !dl.enabled } : dl
          ),
        })),

      updateQuota: (updates) =>
        set((state) => ({
          quota: { ...state.quota, ...updates },
        })),

      setMaintenance: (enabled, message) =>
        set({
          isMaintenance: enabled,
          maintenanceMessage: message ?? INITIAL_STATE.maintenanceMessage,
        }),

      resetConfig: () => set(INITIAL_STATE),
    }),
    {
      name: "app-config-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
