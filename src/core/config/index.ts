/**
 * App configuration — centralized constants for the thesis defense system.
 * These values are loaded from useAppConfigStore (Zustand + localStorage).
 * For production, replace with API calls to a backend config endpoint.
 */

export const APP_CONFIG = {
  NAME: "Hệ thống Quản lý Luận văn",
  VERSION: "1.0.0",
  ACADEMIC_YEAR: "2025-2026",
  SEMESTER: "Học kỳ 2",

  // URL patterns
  URLS: {
    STUDENT_TOPICS: "/student/topics",
    STUDENT_MY_APPLICATIONS: "/student/my-applications",
    STUDENT_CONFIRMATION: "/student/confirmation",
    STUDENT_PROGRESS: "/student/progress",
    STUDENT_REVISION: "/student/revision",
    STUDENT_FINAL_SCORE: "/student/final-score",

    TEACHER_TOPICS: "/teacher/topics",
    TEACHER_GRADING: "/teacher/grading",

    SECRETARY_TOPICS: "/secretary/topics",
    SECRETARY_COUNCILS: "/secretary/councils",
    SECRETARY_SCHEDULE: "/secretary/schedule",
    SECRETARY_FINAL_SCORES: "/secretary/final-scores",
    SECRETARY_RANKING: "/secretary/ranking",

    COUNCIL_TOPICS: "/council/topics",
    COUNCIL_DRAFT_REVIEW: "/council/draft-review",

    ADMIN_STATISTICS: "/admin/statistics",
    ADMIN_IMPORT: "/admin/import",
    ADMIN_TEMPLATES: "/admin/templates",
  },

  // Deadlines (days from now, in dev mode)
  DEFAULTS: {
    REGISTRATION_DAYS: 30,
    APPROVAL_DAYS: 35,
    FIRST_SUBMISSION_DAYS: 60,
    COUNCIL_GRADING_DAYS: 90,
    REVISION_DAYS: 14,
  },

  // Quota defaults
  QUOTA: {
    MAX_TOPICS_PER_TEACHER: 5,
    MAX_STUDENTS_PER_TOPIC: 3,
    COUNCIL_MAX_MEMBERS: 5,
    COUNCIL_CHAIRMAN: 1,
    COUNCIL_SECRETARY: 1,
    COUNCIL_MEMBERS: 3,
    COUNCIL_EXTERNAL_REVIEWER: 0,
  },

  // Score thresholds
  SCORE: {
    PASS_THRESHOLD: 50,
    GRADE_A_MIN: 90,
    GRADE_B_MIN: 80,
    GRADE_C_MIN: 70,
    GRADE_D_MIN: 50,
    // below D = F
  },

  // UI
  UI: {
    SIDEBAR_COLLAPSED_DEFAULT: false,
    SIDEBAR_BREAKPOINT: "md", // md = 900px
    TABLE_PAGE_SIZE: 20,
    CHART_COLORS: {
      primary: "#1976d2",
      success: "#2e7d32",
      error: "#c62828",
      warning: "#f57c00",
      info: "#0288d1",
    },
  },

  // Mock data
  MOCK_DELAY_MS: 800,
  MOCK_ENABLED: true,
} as const;

export type AppConfig = typeof APP_CONFIG;
