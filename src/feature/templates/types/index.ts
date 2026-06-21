// Template category types
export type CategoryType = "admin" | "secretary" | "student" | "teacher";

// Template stage types
export type StageType = "preparation" | "assignment" | "execution" | "evaluation";

// File type
export type FileType = "docx" | "doc" | "xlsx" | "xls" | "pdf";

// Template item interface
export interface TemplateItem {
  id: number;
  code: string;
  name: string;
  nameEn: string;
  description: string;
  icon: string;
  color: string;
  category: CategoryType;
  stage: StageType;
  fileType: FileType;
  fileVI?: string;
  fileEN?: string;
  forRoles: CategoryType[];
  isActive: boolean;
}

// Category configuration
export const categoryConfig: Record<CategoryType, { label: string; color: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" }> = {
  admin: { label: "Quản trị", color: "primary" },
  secretary: { label: "Thư ký", color: "secondary" },
  student: { label: "Sinh viên", color: "success" },
  teacher: { label: "Giảng viên", color: "warning" },
};

// Stage configuration
export const stageConfig: Record<StageType, { label: string; color: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" }> = {
  preparation: { label: "Chuẩn bị", color: "info" },
  assignment: { label: "Giao đề tài", color: "primary" },
  execution: { label: "Thực hiện", color: "warning" },
  evaluation: { label: "Đánh giá", color: "success" },
};
