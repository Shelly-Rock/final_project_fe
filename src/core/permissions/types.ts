export const ROLE = {
  ADMIN: "admin",
  SECRETARY: "secretary",
  TEACHER: "teacher",
  STUDENT: "student",
} as const;

export type Role = (typeof ROLE)[keyof typeof ROLE];

export const ROLE_LABELS: Record<Role, string> = {
  [ROLE.ADMIN]: "Quản trị viên",
  [ROLE.SECRETARY]: "Thư ký",
  [ROLE.TEACHER]: "Giảng viên",
  [ROLE.STUDENT]: "Sinh viên",
};

export const ROLE_COLORS: Record<
  Role,
  { bg: string; color: string; border: string }
> = {
  [ROLE.ADMIN]: { bg: "#fee2e2", color: "#dc2626", border: "#fecaca" },
  [ROLE.SECRETARY]: { bg: "#dbeafe", color: "#2563eb", border: "#bfdbfe" },
  [ROLE.TEACHER]: { bg: "#dcfce7", color: "#16a34a", border: "#bbf7d0" },
  [ROLE.STUDENT]: { bg: "#f3e8ff", color: "#9333ea", border: "#e9d5ff" },
};

export const ROLE_HIERARCHY: Record<Role, number> = {
  [ROLE.ADMIN]: 100,
  [ROLE.SECRETARY]: 75,
  [ROLE.TEACHER]: 50,
  [ROLE.STUDENT]: 25,
};

// ---------- Actions ----------
export const ACTION = {
  CREATE: "create",
  READ: "read",
  UPDATE: "update",
  DELETE: "delete",
  MANAGE: "manage",
  APPROVE: "approve",
  SUBMIT: "submit",
  REVIEW: "review",
  EXPORT: "export",
  IMPORT: "import",
} as const;

export type Action = (typeof ACTION)[keyof typeof ACTION];

// ---------- Resources ----------
export const RESOURCE = {
  // User & Auth
  USER: "user",
  ROLE: "role",
  PERMISSION: "permission",

  // Thesis / Project
  THESIS: "thesis",
  THESIS_TOPIC: "thesis_topic",
  THESIS_SUBMISSION: "thesis_submission",
  THESIS_REVIEW: "thesis_review",
  THESIS_SCORE: "thesis_score",
  THESIS_DEFENSE: "thesis_defense",

  // Organization
  DEPARTMENT: "department",
  MAJOR: "major",
  CLASS: "class",
  COURSE: "course",
  STUDENT: "student",

  // Communication
  ANNOUNCEMENT: "announcement",
  NOTIFICATION: "notification",
  COMMENT: "comment",
  DOCUMENT: "document",

  // Reports & Stats
  REPORT: "report",
  STATISTIC: "statistic",

  // System
  SETTING: "setting",
  AUDIT_LOG: "audit_log",
  CONFIG: "config",
} as const;

export type Resource = (typeof RESOURCE)[keyof typeof RESOURCE];

// ---------- Permission definition ----------
export interface Permission {
  action: Action | Action[];
  resource: Resource | Resource[];
}

// ---------- User with role ----------
export interface RoleUser {
  id: string;
  name?: string;
  email?: string;
  role: Role;
}

// ---------- Ability check options ----------
export interface AbilityCheck {
  action: Action;
  resource: Resource;
  field?: string;
}
