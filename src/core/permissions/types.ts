export const ROLE = {
  ADMIN: "admin",
  SECRETARY: "secretary",
  TEACHER: "teacher",
  STUDENT: "student",
  COUNCIL: "council",
} as const;

export type Role = (typeof ROLE)[keyof typeof ROLE];

// ---------- Council sub-roles (granular within the COUNCIL role) ----------
export const COUNCIL_ROLE = {
  CHAIRMAN: "council_chairman",       // Chủ tịch HĐ
  SECRETARY: "council_secretary",     // Thư ký HĐ
  INTERNAL_REVIEWER: "council_internal_reviewer", // Phản biện nội bộ
  EXTERNAL_REVIEWER: "council_external_reviewer", // Phản biện ngoài
  MEMBER: "council_member",           // Ủy viên
} as const;

export type CouncilRole = (typeof COUNCIL_ROLE)[keyof typeof COUNCIL_ROLE];

export const COUNCIL_ROLE_LABELS: Record<CouncilRole, string> = {
  [COUNCIL_ROLE.CHAIRMAN]: "Chủ tịch Hội đồng",
  [COUNCIL_ROLE.SECRETARY]: "Thư ký Hội đồng",
  [COUNCIL_ROLE.INTERNAL_REVIEWER]: "Phản biện nội bộ",
  [COUNCIL_ROLE.EXTERNAL_REVIEWER]: "Phản biện ngoài",
  [COUNCIL_ROLE.MEMBER]: "Ủy viên",
};

export const ROLE_LABELS: Record<Role, string> = {
  [ROLE.ADMIN]: "Quản trị viên",
  [ROLE.SECRETARY]: "Thư ký",
  [ROLE.TEACHER]: "Giảng viên",
  [ROLE.STUDENT]: "Sinh viên",
  [ROLE.COUNCIL]: "Hội đồng",
};

export const ROLE_COLORS: Record<
  Role,
  { bg: string; color: string; border: string }
> = {
  [ROLE.ADMIN]: { bg: "#fee2e2", color: "#dc2626", border: "#fecaca" },
  [ROLE.SECRETARY]: { bg: "#dbeafe", color: "#2563eb", border: "#bfdbfe" },
  [ROLE.TEACHER]: { bg: "#dcfce7", color: "#16a34a", border: "#bbf7d0" },
  [ROLE.STUDENT]: { bg: "#f3e8ff", color: "#9333ea", border: "#e9d5ff" },
  [ROLE.COUNCIL]: { bg: "#fef3c7", color: "#d97706", border: "#fde68a" },
};

export const COUNCIL_ROLE_COLORS: Record<CouncilRole, { bg: string; color: string; border: string }> = {
  [COUNCIL_ROLE.CHAIRMAN]: { bg: "#fef3c7", color: "#d97706", border: "#fde68a" },
  [COUNCIL_ROLE.SECRETARY]: { bg: "#dbeafe", color: "#2563eb", border: "#bfdbfe" },
  [COUNCIL_ROLE.INTERNAL_REVIEWER]: { bg: "#dcfce7", color: "#16a34a", border: "#bbf7d0" },
  [COUNCIL_ROLE.EXTERNAL_REVIEWER]: { bg: "#e0e7ff", color: "#4f46e5", border: "#c7d2fe" },
  [COUNCIL_ROLE.MEMBER]: { bg: "#f3e8ff", color: "#9333ea", border: "#e9d5ff" },
};

export const ROLE_HIERARCHY: Record<Role, number> = {
  [ROLE.ADMIN]: 100,
  [ROLE.SECRETARY]: 75,
  [ROLE.TEACHER]: 50,
  [ROLE.STUDENT]: 25,
  [ROLE.COUNCIL]: 60,
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
  GRADE: "grade",
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
  GRADING_RESULT: "grading_result",
  COUNCIL: "council",
  SUBMISSION: "submission",
  QUOTA: "quota",
  DEADLINE: "deadline",

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
  councilRole?: CouncilRole; // only meaningful when role === COUNCIL
}

// ---------- Ability check options ----------
export interface AbilityCheck {
  action: Action;
  resource: Resource;
  field?: string;
}
