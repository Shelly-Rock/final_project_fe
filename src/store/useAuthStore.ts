"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ROLE, COUNCIL_ROLE, type Role, type CouncilRole } from "@/core/permissions/types";
import type { RoleUser } from "@/core/permissions/types";

export interface AuthUser extends RoleUser {
  accessToken?: string;
  refreshToken?: string;
  avatar?: string;
  department?: string;
  mssv?: string; // student only
  councilRole?: CouncilRole; // council only
}

interface AuthState {
  _hasHydrated: boolean;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setHasHydrated: (state: boolean) => void;
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (user: AuthUser) => void;
  logout: () => void;
  switchRole: (role: Role) => void;
  clearError: () => void;
}

// Default demo users for role switching
export const DEMO_USERS: Record<Role, AuthUser> = {
  [ROLE.ADMIN]: {
    id: "admin-001",
    name: "Nguyễn Văn Admin",
    email: "admin@khoa.edu.vn",
    role: ROLE.ADMIN,
    department: "Khoa Công nghệ Thông tin",
  },
  [ROLE.SECRETARY]: {
    id: "sec-001",
    name: "Phạm Thị Thư Ký",
    email: "thuky@khoa.edu.vn",
    role: ROLE.SECRETARY,
    department: "Phòng Đào tạo Sau đại học",
  },
  [ROLE.TEACHER]: {
    id: "gv-001",
    name: "TS. Trần Đình Giảng",
    email: "tdgiang@khoa.edu.vn",
    role: ROLE.TEACHER,
    department: "Khoa Công nghệ Thông tin",
  },
  [ROLE.STUDENT]: {
    id: "sv-001",
    name: "Lê Hoàng Sinh Viên",
    email: "lhsvien@khoa.edu.vn",
    role: ROLE.STUDENT,
    mssv: "CH2024001",
    department: "Khoa Công nghệ Thông tin",
  },
  [ROLE.COUNCIL]: {
    id: "hd-001",
    name: "PGS.TS. Hoàng Văn Hội Đồng",
    email: "hvhoi-dong@khoa.edu.vn",
    role: ROLE.COUNCIL,
    department: "Hội đồng bảo vệ Luận văn",
    councilRole: COUNCIL_ROLE.CHAIRMAN,
  },
};

// Extended demo accounts — more teachers / council members for full testing
export const DEMO_TEACHERS: AuthUser[] = [
  {
    id: "gv-001",
    name: "TS. Trần Đình Giảng",
    email: "tdgiang@khoa.edu.vn",
    role: ROLE.TEACHER,
    department: "Khoa Công nghệ Thông tin",
  },
  {
    id: "gv-002",
    name: "PGS.TS. Nguyễn Thị Mai",
    email: "ntmai@khoa.edu.vn",
    role: ROLE.TEACHER,
    department: "Khoa Công nghệ Thông tin",
  },
  {
    id: "gv-003",
    name: "ThS. Vũ Minh Tuấn",
    email: "vmtuan@khoa.edu.vn",
    role: ROLE.TEACHER,
    department: "Khoa Hệ thống Thông tin",
  },
  {
    id: "gv-004",
    name: "TS. Bùi Thu Hà",
    email: "bthuha@khoa.edu.vn",
    role: ROLE.TEACHER,
    department: "Khoa Mạng & An toàn",
  },
  {
    id: "gv-005",
    name: "PGS.TS. Đặng Văn Lợi",
    email: "dvloi@khoa.edu.vn",
    role: ROLE.TEACHER,
    department: "Khoa Công nghệ Phần mềm",
  },
];

export const DEMO_COUNCIL_MEMBERS: AuthUser[] = [
  {
    id: "hd-001",
    name: "PGS.TS. Hoàng Văn Hội Đồng",
    email: "hvhoi-dong@khoa.edu.vn",
    role: ROLE.COUNCIL,
    department: "Khoa CNTT",
    councilRole: COUNCIL_ROLE.CHAIRMAN,
  },
  {
    id: "hd-002",
    name: "TS. Lê Thị Thư Ký HĐ",
    email: "ltthuky-hd@khoa.edu.vn",
    role: ROLE.COUNCIL,
    department: "Khoa CNTT",
    councilRole: COUNCIL_ROLE.SECRETARY,
  },
  {
    id: "hd-003",
    name: "TS. Phạm Đức Thành",
    email: "pdthanh@khoa.edu.vn",
    role: ROLE.COUNCIL,
    department: "Khoa CNTT",
    councilRole: COUNCIL_ROLE.INTERNAL_REVIEWER,
  },
  {
    id: "hd-004",
    name: "TS. Ngô Thị Lan",
    email: "ntlan@khoa.edu.vn",
    role: ROLE.COUNCIL,
    department: "Khoa CNTT",
    councilRole: COUNCIL_ROLE.MEMBER,
  },
  {
    id: "hd-005",
    name: "GS.TS. Trần Quang Minh (Ngoài trường)",
    email: "tqminh-uit@vnu.edu.vn",
    role: ROLE.COUNCIL,
    department: "Trường ĐH Công nghệ - ĐHQG",
    councilRole: COUNCIL_ROLE.EXTERNAL_REVIEWER,
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      _hasHydrated: false,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setHasHydrated: (state) => set({ _hasHydrated: state }),

      setUser: (user) =>
        set({ user, isAuthenticated: !!user, error: null }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error, isLoading: false }),

      login: (user) => set({ user, isAuthenticated: true, isLoading: false, error: null }),

      logout: () =>
        set({ user: null, isAuthenticated: false, isLoading: false, error: null }),

      switchRole: (role) => {
        const demoUser = DEMO_USERS[role];
        if (demoUser) {
          set({ user: demoUser, isAuthenticated: true, error: null });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
