"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Box, CircularProgress } from "@mui/material";
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
import { facultyService, departmentService } from "@/feature/admin/services";
import { teacherService } from "@/feature/teacher/services/teacher.service";
import { PageHeader } from "@/shared/components";
import { GraduationCap } from "lucide-react";
import { toast } from "sonner";

interface Faculty {
  id: string;
  name: string;
}

interface Department {
  id: string;
  name: string;
  facultyId: string;
}

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

  // Faculty/Department from API
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [allDepartments, setAllDepartments] = useState<Department[]>([]);
  const [loadingFaculties, setLoadingFaculties] = useState(true);

  // Load faculties on mount
  useEffect(() => {
    facultyService
      .getAll()
      .then(setFaculties)
      .catch(() => {
        toast.error("Không thể tải danh sách khoa");
        setFaculties([]);
      })
      .finally(() => setLoadingFaculties(false));
  }, []);

  // Load departments when faculties change
  useEffect(() => {
    if (faculties.length === 0) return;
    departmentService
      .getAll()
      .then(setAllDepartments)
      .catch(() => {
        toast.error("Không thể tải danh sách bộ môn");
        setAllDepartments([]);
      });
  }, [faculties]);

  // Derived departments based on selected faculty
  const availableDepartments = useMemo(() => {
    if (filterFaculty === "all") {
      return allDepartments;
    }
    return allDepartments.filter((d) => d.facultyId === filterFaculty);
  }, [filterFaculty, allDepartments]);

  // Reset department filter when faculty changes
  const handleFacultyChange = (facultyId: string) => {
    setFilterFaculty(facultyId);
    setFilterDepartment("all");
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
    exportTeachersToExcel(teachers, faculties, allDepartments);
    toast.success("Đã xuất file Excel");
  };

  if (loadingFaculties) {
    return (
      <Box sx={{ p: 3, display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

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
        faculties={faculties}
        departments={availableDepartments}
        allFaculties={faculties}
        allDepartments={allDepartments}
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
        faculties={faculties}
        departments={allDepartments}
      />

      <ImportExcelDialog
        open={importDialogOpen}
        onClose={() => setImportDialogOpen(false)}
        onImport={handleImport}
        faculties={faculties}
        departments={allDepartments}
      />
    </Box>
  );
}
