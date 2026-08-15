"use client";

import { useState, useEffect, useCallback } from "react";
import { Box, Snackbar, Alert } from "@mui/material";
import {
  StudentTable,
  StudentImportDialog,
  StudentFormDialog,
  StudentDetailDialog,
} from "@/feature/student/components";
import { PageHeader } from "@/shared/components";
import { studentService } from "@/feature/student/services";
import type {
  Student,
  StudentFilters,
  StudentImportRow,
  StudentStatus,
} from "@/feature/student/types";
import { List, CheckSquare, Square, Users } from "lucide-react";

const INITIAL_FILTERS: StudentFilters = {
  search: "",
  khoa: "",
  khoaHoc: "",
  status: "all",
};

export default function StudentManagementPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<StudentFilters>(INITIAL_FILTERS);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (
    message: string,
    severity: "success" | "error" = "success",
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  const refreshStudents = useCallback(() => {
    setLoading(true);
    studentService
      .getAll()
      .then((data) => setStudents(data))
      .catch(() => showSnackbar("Không thể tải danh sách sinh viên", "error"))
      .finally(() => setLoading(false));
  }, []);

  // Initial load with refreshStudents dependency
  useEffect(() => {
    const timer = setTimeout(refreshStudents, 0);
    return () => clearTimeout(timer);
  }, [refreshStudents]);

  const filteredStudents = students.filter((student) => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchSearch =
        student.hoTen.toLowerCase().includes(searchLower) ||
        student.mssv.toLowerCase().includes(searchLower) ||
        student.gmail.toLowerCase().includes(searchLower);
      if (!matchSearch) return false;
    }
    if (filters.khoa && student.khoa !== filters.khoa) return false;
    if (filters.khoaHoc && student.khoaHoc !== filters.khoaHoc) return false;
    if (filters.status === "has_topic" && !student.deTai) return false;
    if (filters.status === "no_topic" && student.deTai) return false;
    return true;
  });

  const handleImport = async (data: StudentImportRow[]) => {
    try {
      const result = await studentService.createMany(data);
      refreshStudents();
      showSnackbar(
        `Đã import ${result.success} sinh viên thành công${result.failed > 0 ? `, ${result.failed} thất bại` : ""}`,
      );
    } catch {
      showSnackbar("Import thất bại", "error");
    }
  };

  const handleDelete = async (student: Student) => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa sinh viên "${student.hoTen}" (${student.mssv})?`,
    );
    if (!confirmed) return;

    try {
      await studentService.delete(student.id);
      refreshStudents();
      showSnackbar("Đã xóa sinh viên");
    } catch {
      showSnackbar("Xóa thất bại", "error");
    }
  };

  const handleView = (student: Student) => {
    setSelectedStudent(student);
    setDetailDialogOpen(true);
  };

  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setFormDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedStudent(null);
    setFormDialogOpen(true);
  };

  return (
    <Box sx={{ p: 3, width: "100%" }}>
      <PageHeader
        title="Quản lý sinh viên"
        illustration={<Users size={56} strokeWidth={1.5} />}
        showBgImage={true}
      />

      <StudentTable
        students={filteredStudents}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        filterOptions={[
          { value: "all", label: "Tất cả", icon: <List size={16} /> },
          {
            value: "has_topic",
            label: "Đã chọn đề tài",
            icon: <CheckSquare size={16} />,
          },
          {
            value: "no_topic",
            label: "Chưa chọn đề tài",
            icon: <Square size={16} />,
          },
        ]}
        filterValue={filters.status}
        onFilterChange={(value) =>
          setFilters({ ...filters, status: value as StudentStatus })
        }
        onAdd={handleAdd}
        onRefresh={refreshStudents}
      />
      <StudentImportDialog
        open={importDialogOpen}
        onClose={() => setImportDialogOpen(false)}
        onImport={handleImport}
      />

      <StudentFormDialog
        open={formDialogOpen}
        onClose={() => setFormDialogOpen(false)}
        student={selectedStudent}
      />
      <StudentDetailDialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        student={selectedStudent}
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
