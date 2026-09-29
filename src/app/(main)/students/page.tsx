"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import {
  Box,
  Snackbar,
  Alert,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Badge,
} from "@mui/material";
import {
  StudentTable,
  StudentImportDialog,
  StudentFormDialog,
  StudentDetailDialog,
  exportStudentsToExcel,
} from "@/feature/student/components";
import { studentService } from "@/feature/student/services";
import { facultyService } from "@/feature/admin/services";
import type { Faculty } from "@/feature/admin/types";
import type {
  Student,
  StudentFilters,
  CreateStudentInput,
} from "@/feature/student/types";
import { HeaderTools } from "@/layout/Header";
import { Search, Filter } from "lucide-react";

const INITIAL_FILTERS: StudentFilters = {
  search: "",
  khoa: "",
  khoaHoc: "",
  status: "all",
};

export default function StudentManagementPage() {
  const searchParams = useSearchParams();
  const facultyId = searchParams.get("facultyId") || undefined;
  const [students, setStudents] = useState<Student[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [facultiesLoading, setFacultiesLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<StudentFilters>(INITIAL_FILTERS);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [khoaAnchorEl, setKhoaAnchorEl] = useState<HTMLElement | null>(null);
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

  const refreshStudents = () => {
    setLoading(true);
    studentService
      .getAll({ facultyId })
      .then((data) => setStudents(data))
      .catch(() => showSnackbar("Không thể tải danh sách sinh viên", "error"))
      .finally(() => setLoading(false));
  };

  // Initial load - only run once on mount
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    studentService
      .getAll({ facultyId })
      .then((data) => {
        if (isMounted) setStudents(data);
      })
      .catch(() => {
        if (isMounted)
          showSnackbar("Không thể tải danh sách sinh viên", "error");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [facultyId]);

  useEffect(() => {
    let isMounted = true;
    facultyService
      .getAll()
      .then((data) => {
        if (isMounted) setFaculties(data);
      })
      .catch(() => {
        if (isMounted) showSnackbar("Không thể tải danh sách khoa", "error");
      })
      .finally(() => {
        if (isMounted) setFacultiesLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const availableFaculties = useMemo(
    () => faculties.filter((faculty) => !facultyId || faculty.id === facultyId),
    [faculties, facultyId],
  );
  const scopedFacultyName = facultyId ? availableFaculties[0]?.name : undefined;

  const filteredStudents = students.filter((student) => {
    if (facultyId && student.khoa !== scopedFacultyName) return false;
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

  const khoaOptions = useMemo(
    () =>
      Array.from(
        new Set([
          ...availableFaculties.map((faculty) => faculty.name),
          ...(!facultyId
            ? students.map((student) => student.khoa).filter(Boolean)
            : []),
        ]),
      ).sort(),
    [availableFaculties, students, facultyId],
  );

  const handleImport = async (file: File) => {
    try {
      const result = await studentService.importFile(file);
      refreshStudents();
      showSnackbar(
        `Đã import ${result.success} sinh viên thành công${result.failed > 0 ? `, ${result.failed} thất bại` : ""}`,
      );
    } catch (error: unknown) {
      const responseMessage = axios.isAxiosError(error)
        ? error.response?.data?.message
        : undefined;
      const message = Array.isArray(responseMessage)
        ? responseMessage.join(", ")
        : responseMessage || "Import thất bại";
      showSnackbar(message, "error");
      throw new Error(message);
    }
  };

  const handleDelete = async (student: Student) => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa sinh viên "${student.hoTen}" (${student.mssv})?`,
    );
    if (!confirmed) return;

    try {
      const success = await studentService.delete(student.id);
      if (!success) {
        showSnackbar("Không thể xóa sinh viên này", "error");
        return;
      }
      refreshStudents();
      showSnackbar("Đã xóa sinh viên");
    } catch {
      showSnackbar("Xóa thất bại", "error");
    }
  };

  const handleDeleteMany = async (selectedStudents: Student[]) => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa ${selectedStudents.length} sinh viên đã chọn?`,
    );
    if (!confirmed) return;

    const success = await studentService.deleteMany(
      selectedStudents.map((student) => student.id),
    );
    if (!success) {
      showSnackbar("Xóa thất bại", "error");
      return;
    }
    refreshStudents();
    showSnackbar(`Đã xóa ${selectedStudents.length} sinh viên`);
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

  const handleSubmitStudent = async (data: CreateStudentInput) => {
    try {
      if (selectedStudent) {
        const updated = await studentService.update(selectedStudent.id, data);
        if (!updated) throw new Error("Cập nhật sinh viên thất bại");
        showSnackbar("Đã cập nhật sinh viên");
      } else {
        const selectedFaculty = availableFaculties.find(
          (faculty) => faculty.name === data.khoa,
        );
        if (!selectedFaculty) throw new Error("Vui lòng chọn khoa hợp lệ");
        await studentService.create(data);
        showSnackbar("Đã thêm sinh viên");
      }
      setFormDialogOpen(false);
      refreshStudents();
    } catch (error) {
      const responseData = axios.isAxiosError<{
        message?: string | string[];
        errors?: { field: string; message: string }[];
      }>(error)
        ? error.response?.data
        : undefined;
      const validationMessage = responseData?.errors
        ?.map(({ field, message }) => `${field}: ${message}`)
        .join("; ");
      const responseMessage = responseData?.message;
      showSnackbar(
        validationMessage ||
          (Array.isArray(responseMessage)
            ? responseMessage.join(", ")
            : responseMessage) ||
          (error instanceof Error ? error.message : "Lưu sinh viên thất bại"),
        "error",
      );
      throw error;
    }
  };

  const handleExport = async () => {
    try {
      exportStudentsToExcel(students);
      showSnackbar("Đã xuất danh sách sinh viên");
    } catch (error: unknown) {
      const responseMessage = axios.isAxiosError(error)
        ? error.response?.data?.message
        : undefined;
      const message = Array.isArray(responseMessage)
        ? responseMessage.join(", ")
        : responseMessage || "Xuất danh sách thất bại";
      showSnackbar(message, "error");
    }
  };

  return (
    <Box sx={{ p: 3, width: "100%" }}>
      <HeaderTools>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            width: "100%",
            maxWidth: 420,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flex: 1,
              minWidth: 0,
              px: 1.5,
              height: 36,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              bgcolor: "action.hover",
            }}
          >
            <Search size={16} color="#2563eb" />
            <Box
              component="input"
              type="text"
              placeholder="Tìm kiếm sinh viên..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              spellCheck={false}
              sx={{
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: "0.875rem",
                color: "text.primary",
                fontWeight: 500,
                width: "100%",
                "&::placeholder": {
                  color: "text.secondary",
                  opacity: 0.8,
                },
              }}
            />
          </Box>
          <Tooltip title={filters.khoa || "Lọc theo khoa"}>
            <IconButton
              onClick={(e) => setKhoaAnchorEl(e.currentTarget)}
              sx={{
                color: filters.khoa ? "primary.main" : "text.secondary",
                border: "1px solid",
                borderColor: filters.khoa ? "primary.main" : "divider",
                borderRadius: 2,
                width: 36,
                height: 36,
              }}
            >
              <Badge color="primary" variant="dot" invisible={!filters.khoa}>
                <Filter size={16} />
              </Badge>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={khoaAnchorEl}
            open={Boolean(khoaAnchorEl)}
            onClose={() => setKhoaAnchorEl(null)}
            PaperProps={{ sx: { minWidth: 220, borderRadius: 2, mt: 0.5 } }}
          >
            <MenuItem
              selected={!filters.khoa}
              onClick={() => {
                setFilters({ ...filters, khoa: "" });
                setKhoaAnchorEl(null);
              }}
            >
              Tất cả khoa
            </MenuItem>
            {khoaOptions.map((khoa) => (
              <MenuItem
                key={khoa}
                selected={filters.khoa === khoa}
                onClick={() => {
                  setFilters({ ...filters, khoa });
                  setKhoaAnchorEl(null);
                }}
              >
                {khoa}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </HeaderTools>
      <StudentTable
        students={filteredStudents}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDeleteMany={handleDeleteMany}
        onView={handleView}
        onAdd={handleAdd}
        onExport={handleExport}
        onImport={() => setImportDialogOpen(true)}
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
        onSubmit={handleSubmitStudent}
        faculties={availableFaculties}
        facultiesLoading={facultiesLoading}
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
