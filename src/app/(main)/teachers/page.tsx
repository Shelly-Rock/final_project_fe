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
  mockLecturers,
  getDepartmentsByFaculty,
} from "@/feature/admin/mockData";
import { PageHeader } from "@/shared/components";
import { GraduationCap } from "lucide-react";
import { toast } from "sonner";

// Current state (in-memory)
const lecturers = [...mockLecturers];

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

  // Refresh teachers list
  const refreshTeachers = useCallback(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      let filtered = [...lecturers];

      // Apply Faculty filter
      if (filterFaculty !== "all") {
        filtered = filtered.filter((t) => t.facultyId === filterFaculty);
      }

      // Apply Department filter
      if (filterDepartment !== "all") {
        filtered = filtered.filter((t) => t.departmentId === filterDepartment);
      }

      setTeachers(filtered);
      setLoading(false);
    }, 300);
  }, [filterFaculty, filterDepartment]);

  // Initial load
  useEffect(() => {
    refreshTeachers();
  }, [refreshTeachers]);

  // Reset department filter when faculty changes
  const handleFacultyChange = (facultyId: string) => {
    setFilterFaculty(facultyId);
    setFilterDepartment("all"); // Reset department when faculty changes
  };

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
    const newStatus = currentStatus === "active" ? "Tạm khóa" : "Kích hoạt";
    const confirmed = window.confirm(
      `Bạn có chắc muốn ${newStatus} giảng viên này?`,
    );
    if (!confirmed) return;

    // TODO: Tích hợp API sau
    const index = lecturers.findIndex((t) => t.id === teacherId);
    if (index !== -1) {
      lecturers[index] = {
        ...lecturers[index],
        status: currentStatus === "active" ? "inactive" : "active",
        updatedAt: new Date().toISOString(),
      };
    }

    refreshTeachers();
    toast.success(`Đã ${newStatus.toLowerCase()} giảng viên`);
  };

  const handleFormSubmit = async (
    data: CreateLecturerInput | UpdateLecturerInput,
  ) => {
    setFormLoading(true);
    try {
      // TODO: Tích hợp API sau
      if (selectedTeacher) {
        // Update existing
        const index = lecturers.findIndex((t) => t.id === selectedTeacher.id);
        if (index !== -1) {
          lecturers[index] = {
            ...lecturers[index],
            ...data,
            updatedAt: new Date().toISOString(),
          };
        }
        toast.success("Cập nhật thành công");
      } else {
        // Create new
        const newTeacher: Lecturer = {
          id: Math.max(...lecturers.map((t) => t.id), 0) + 1,
          code: (data as CreateLecturerInput).code,
          name: (data as CreateLecturerInput).name,
          email: (data as CreateLecturerInput).email,
          phone: (data as CreateLecturerInput).phone,
          facultyId: (data as CreateLecturerInput).facultyId,
          departmentId: (data as CreateLecturerInput).departmentId,
          academicTitle: (data as CreateLecturerInput).academicTitle,
          position: (data as CreateLecturerInput).position,
          dateOfBirth: (data as CreateLecturerInput).dateOfBirth,
          gender: (data as CreateLecturerInput).gender,
          address: (data as CreateLecturerInput).address,
          status: "active",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        lecturers.push(newTeacher);
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
    // TODO: Tích hợp API sau
    let success = 0;
    for (const row of rows) {
      const newTeacher: Lecturer = {
        id: Math.max(...lecturers.map((t) => t.id), 0) + 1,
        code: row.code,
        name: row.name,
        email: row.email,
        phone: row.phone,
        facultyId: row.facultyId,
        departmentId: row.departmentId,
        academicTitle: row.academicTitle,
        position: row.position,
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      lecturers.push(newTeacher);
      success++;
    }
    refreshTeachers();
    toast.success(`Đã import ${success} giảng viên`);
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

      {/* Filter Section */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 2,
          flexWrap: "wrap",
        }}
      >
        {/* Faculty Filter */}
        <Box sx={{ minWidth: 220 }}>
          <select
            value={filterFaculty}
            onChange={(e) => handleFacultyChange(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #e2e8f0",
              fontSize: "14px",
              backgroundColor: "white",
              cursor: "pointer",
            }}
          >
            <option value="all">Tất cả Khoa</option>
            {mockFaculties.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </Box>

        {/* Department Filter */}
        <Box sx={{ minWidth: 220 }}>
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            disabled={filterFaculty === "all"}
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #e2e8f0",
              fontSize: "14px",
              backgroundColor: filterFaculty === "all" ? "#f1f5f9" : "white",
              cursor: filterFaculty === "all" ? "not-allowed" : "pointer",
              opacity: filterFaculty === "all" ? 0.6 : 1,
            }}
          >
            <option value="all">Tất cả Bộ môn</option>
            {availableDepartments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </Box>
      </Box>

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
