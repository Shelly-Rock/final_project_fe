"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Box } from "@mui/material";
import {
  TeacherTable,
  TeacherFormDialog,
  ImportExcelDialog,
  exportTeachersToExcel,
} from "@/feature/teacher/components";
import {
  type Lecturer,
  type CreateLecturerInput,
  type UpdateLecturerInput,
} from "@/feature/admin/types";
import {
  mockFaculties,
  mockDepartments,
  getDepartmentsByFaculty,
} from "@/feature/admin/mockData";
import { teacherService } from "@/feature/teacher/services/teacher.service";
import { PageHeader } from "@/shared/components";
import { GraduationCap } from "lucide-react";
import { toast } from "sonner";

export default function TeacherManagementPage() {
  // Lecturers state
  const [teachers, setTeachers] = useState<Lecturer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState<Lecturer | null>(null);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  // Filter state - cascading Faculty -> Department
  const [filterFaculty, setFilterFaculty] = useState("all");
  const [filterDepartment, setFilterDepartment] = useState("all");

  // Derived departments based on selected faculty
  const availableDepartments = useMemo(() => {
    if (filterFaculty === "all") {
      return mockDepartments;
    }
    return getDepartmentsByFaculty(filterFaculty);
  }, [filterFaculty]);

  // Reset department filter when faculty changes
  const handleFacultyChange = (facultyId: string) => {
    setFilterFaculty(facultyId);
    setFilterDepartment("all"); // Reset department when faculty changes
  };

  // Refresh teachers list
  const refreshTeachers = useCallback(() => {
    setLoading(true);
    teacherService
      .getAll({
        facultyId: filterFaculty === "all" ? undefined : filterFaculty,
        departmentId: filterDepartment === "all" ? undefined : filterDepartment,
      })
      .then(({ teachers }) => setTeachers(teachers))
      .catch(() => toast.error("Không thể tải danh sách giảng viên"))
      .finally(() => setLoading(false));
  }, [filterFaculty, filterDepartment]);

  // Initial load & re-filter when filter changes
  useEffect(() => {
    refreshTeachers();
  }, [refreshTeachers]);

  // ============================================================
  // TEACHER HANDLERS
  // ============================================================

  const handleCreateTeacher = () => {
    setSelectedTeacher(null);
    setFormDialogOpen(true);
  };

  const handleEditTeacher = (teacher: Lecturer) => {
    setSelectedTeacher(teacher);
    setFormDialogOpen(true);
  };

  const handleToggleStatus = async (
    teacherId: number,
    currentStatus: "active" | "inactive",
  ) => {
    const teacher = teachers.find((t) => t.id === teacherId);
    if (!teacher) return;

    const newStatus = currentStatus === "active" ? "inactive" : "active";
    const actionText = currentStatus === "active" ? "Tạm khóa" : "Kích hoạt";
    const confirmed = window.confirm(
      `Bạn có chắc muốn ${actionText.toLowerCase()} giảng viên này?`,
    );
    if (!confirmed) return;

    try {
      await teacherService.toggleStatus(teacher.code, newStatus);
      toast.success(`Đã ${actionText.toLowerCase()} giảng viên`);
      refreshTeachers();
    } catch {
      toast.error("Không thể thay đổi trạng thái");
    }
  };

  const handleFormSubmit = async (
    data: CreateLecturerInput | UpdateLecturerInput,
  ) => {
    setFormLoading(true);
    try {
      if (selectedTeacher) {
        await teacherService.update(selectedTeacher.code, data);
        toast.success("Cập nhật thành công");
      } else {
        await teacherService.create(data as CreateLecturerInput);
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
      name: string;
      email: string;
      phone?: string;
      facultyId: string;
      departmentId: string;
      academicTitle?: string;
      position?: string;
    }[],
  ) => {
    let success = 0;
    let failed = 0;
    for (const row of rows) {
      try {
        await teacherService.create(row as CreateLecturerInput);
        success++;
      } catch {
        failed++;
      }
    }
    refreshTeachers();
    if (failed > 0) {
      toast.warning(`Import thành công ${success}, thất bại ${failed}`);
    } else {
      toast.success(`Đã import ${success} giảng viên`);
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
        filterFaculty={filterFaculty}
        filterDepartment={filterDepartment}
        onFilterFacultyChange={handleFacultyChange}
        onFilterDepartmentChange={setFilterDepartment}
        faculties={mockFaculties}
        departments={availableDepartments}
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
