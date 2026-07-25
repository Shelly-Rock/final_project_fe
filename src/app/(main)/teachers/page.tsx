"use client";

import { useState, useEffect, useCallback } from "react";
import { Box } from "@mui/material";
import {
  TeacherTable,
  TeacherFormDialog,
  ImportExcelDialog,
  exportTeachersToExcel,
} from "@/feature/teacher/components";
import {
  teacherService,
  type Teacher,
  type CreateTeacherInput,
  type UpdateTeacherInput,
} from "@/feature/teacher";
import { PageHeader } from "@/shared/components";
import { GraduationCap } from "lucide-react";
import { toast } from "sonner";

export default function TeacherManagementPage() {
  // Teachers state
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [allTeachers, setAllTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  // Search and filter state
  const [filterDepartment, setFilterDepartment] = useState("all");

  // Refresh teachers list
  const refreshTeachers = useCallback(() => {
    setLoading(true);
    teacherService
      .getAll()
      .then((data) => {
        setAllTeachers(data);
        setTeachers(data);
      })
      .catch(() => toast.error("Không thể tải danh sách giảng viên"))
      .finally(() => setLoading(false));
  }, []);

  // Initial load
  useEffect(() => {
    const timer = setTimeout(refreshTeachers, 0);
    return () => clearTimeout(timer);
  }, [refreshTeachers]);

  // Get unique departments for filter
  const departments = [...new Set(allTeachers.map((t) => t.department))].sort();

  // ============================================================
  // TEACHER HANDLERS
  // ============================================================

  const handleCreateTeacher = () => {
    setSelectedTeacher(null);
    setFormDialogOpen(true);
  };

  const handleEditTeacher = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setFormDialogOpen(true);
  };

  const handleToggleStatus = async (
    teacherId: number,
    currentStatus: "active" | "inactive",
  ) => {
    const newStatus = currentStatus === "active" ? "Tạm khóa" : "Kích hoạt";
    const confirmed = window.confirm(
      `Bạn có chắc muốn ${newStatus} giảng viên này?`,
    );
    if (!confirmed) return;

    try {
      await teacherService.toggleStatus(teacherId);
      refreshTeachers();
      toast.success(`Đã ${newStatus.toLowerCase()} giảng viên`);
    } catch {
      toast.error("Thao tác thất bại");
    }
  };

  const handleFormSubmit = async (
    data: CreateTeacherInput | UpdateTeacherInput,
  ) => {
    setFormLoading(true);
    try {
      if (selectedTeacher) {
        await teacherService.update(
          selectedTeacher.id,
          data as UpdateTeacherInput,
        );
        toast.success("Cập nhật thành công");
      } else {
        await teacherService.create(data as CreateTeacherInput);
        toast.success("Tạo mới thành công");
      }
      refreshTeachers();
      setFormDialogOpen(false);
    } catch {
      toast.error(selectedTeacher ? "Cập nhật thất bại" : "Tạo mới thất bại");
    } finally {
      setFormLoading(false);
    }
  };

  const handleImport = async (
    rows: {
      code: string;
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
      department: string;
      academicTitle?: string;
      position?: string;
    }[],
  ) => {
    try {
      const result = await teacherService.importFromExcel(rows);
      refreshTeachers();
      toast.success(
        `Đã import ${result.success} giảng viên${result.failed > 0 ? `, ${result.failed} thất bại` : ""}`,
      );
    } catch {
      toast.error("Import thất bại");
    }
  };

  const handleExport = () => {
    exportTeachersToExcel(teachers);
    toast.success("Đã xuất file Excel");
  };

  return (
    <Box sx={{ p: 3, width: "100%" }}>
      <PageHeader
        title="Danh sách giảng viên"
        subtitle="Quản lý thông tin và trạng thái nhân sự giảng dạy"
        illustration={<GraduationCap size={56} strokeWidth={1.5} />}
        showBgImage={true}
      />

      <TeacherTable
        teachers={teachers}
        loading={loading}
        filterDepartment={filterDepartment}
        onFilterDepartmentChange={setFilterDepartment}
        departments={departments}
        onEdit={handleEditTeacher}
        onToggleStatus={handleToggleStatus}
        onAdd={handleCreateTeacher}
        onImport={() => setImportDialogOpen(true)}
        onExport={handleExport}
        onRefresh={refreshTeachers}
      />

      {/* Dialogs */}
      <TeacherFormDialog
        open={formDialogOpen}
        onClose={() => setFormDialogOpen(false)}
        onSubmit={handleFormSubmit}
        teacher={selectedTeacher}
        loading={formLoading}
      />

      <ImportExcelDialog
        open={importDialogOpen}
        onClose={() => setImportDialogOpen(false)}
        onImport={handleImport}
      />
    </Box>
  );
}
