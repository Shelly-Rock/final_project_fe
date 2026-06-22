"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  FileDownload as ExportIcon,
  FileUpload as ImportIcon,
} from "@mui/icons-material";
import {
  StudentTable,
  StudentDetailModal,
  StudentFormModal,
  exportStudentsToExcel,
  importStudentsFromFile,
} from "@/feature/student-management/components";
import { studentService } from "@/feature/student-management/services";
import type {
  Student,
  StudentFilters,
  StudentStatus,
  StudentFormData,
} from "@/feature/student-management/types";

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
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
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

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await studentService.getAll();
      setStudents(data);
    } catch {
      showSnackbar("Không thể tải danh sách sinh viên", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const load = () => {
      fetchStudents();
    };
    load();
  }, [fetchStudents]);

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

  const handleImport = () => {
    importStudentsFromFile(
      async (data) => {
        try {
          await studentService.createMany(data);
          await fetchStudents();
          showSnackbar(`Đã import ${data.length} sinh viên thành công`);
        } catch {
          showSnackbar("Import thất bại", "error");
        }
      },
      (error) => {
        showSnackbar(error, "error");
      },
    );
  };

  const handleExport = () => {
    exportStudentsToExcel(filteredStudents);
    showSnackbar("Đã xuất file Excel");
  };

  const handleDelete = async (student: Student) => {
    try {
      await studentService.delete(student.id);
      await fetchStudents();
      showSnackbar("Đã xóa sinh viên");
    } catch {
      showSnackbar("Xóa thất bại", "error");
    }
  };

  const handleView = (student: Student) => {
    setViewingStudent(student);
    setDetailModalOpen(true);
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setFormModalOpen(true);
  };

  const handleOpenAddForm = () => {
    setEditingStudent(null);
    setFormModalOpen(true);
  };

  const handleCloseForm = () => {
    setFormModalOpen(false);
    setEditingStudent(null);
  };

  const handleCloseDetail = () => {
    setDetailModalOpen(false);
    setViewingStudent(null);
  };

  const handleEditFromDetail = (student: Student) => {
    setViewingStudent(null);
    setDetailModalOpen(false);
    setEditingStudent(student);
    setFormModalOpen(true);
  };

  const handleSubmitForm = async (data: StudentFormData) => {
    try {
      if (editingStudent?.id) {
        await studentService.update(editingStudent.id, data);
        showSnackbar("Cập nhật sinh viên thành công");
      } else {
        await studentService.create(data);
        showSnackbar("Thêm sinh viên mới thành công");
      }
      await fetchStudents();
      handleCloseForm();
    } catch {
      showSnackbar("Đã xảy ra lỗi", "error");
    }
  };

  const khoaOptions = studentService.getKhoaOptions();
  const khoaHocOptions = studentService.getKhoaHocOptions();

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Quản lý sinh viên
        </Typography>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <TextField
            size="small"
            placeholder="Tìm kiếm theo tên, MSSV, email..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            sx={{ minWidth: 280 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Khoa</InputLabel>
            <Select
              value={filters.khoa}
              label="Khoa"
              onChange={(e) => setFilters({ ...filters, khoa: e.target.value })}
            >
              <MenuItem value="">Tất cả</MenuItem>
              {khoaOptions.map((khoa) => (
                <MenuItem key={khoa} value={khoa}>
                  {khoa}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Khóa</InputLabel>
            <Select
              value={filters.khoaHoc}
              label="Khóa"
              onChange={(e) =>
                setFilters({ ...filters, khoaHoc: e.target.value })
              }
            >
              <MenuItem value="">Tất cả</MenuItem>
              {khoaHocOptions.map((khoa) => (
                <MenuItem key={khoa} value={khoa}>
                  {khoa}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <Box sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Trạng thái:
        </Typography>
        <ToggleButtonGroup
          size="small"
          value={filters.status}
          exclusive
          onChange={(_, v) => {
            if (v !== null)
              setFilters({ ...filters, status: v as StudentStatus });
          }}
        >
          <ToggleButton value="all">Tất cả</ToggleButton>
          <ToggleButton value="has_topic">Đã chọn đề tài</ToggleButton>
          <ToggleButton value="no_topic">Chưa chọn đề tài</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box sx={{ mb: 2, display: "flex", gap: 1, justifyContent: "flex-end" }}>
        <Button
          variant="outlined"
          startIcon={<ImportIcon />}
          onClick={handleImport}
        >
          Import Excel
        </Button>
        <Button
          variant="outlined"
          startIcon={<ExportIcon />}
          onClick={handleExport}
          disabled={filteredStudents.length === 0}
        >
          Xuất Excel
        </Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAddForm}
        >
          Thêm sinh viên
        </Button>
      </Box>

      <StudentTable
        students={filteredStudents}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />

      <StudentFormModal
        open={formModalOpen}
        student={editingStudent}
        onClose={handleCloseForm}
        onSubmit={handleSubmitForm}
      />

      <StudentDetailModal
        open={detailModalOpen}
        student={viewingStudent}
        onClose={handleCloseDetail}
        onEdit={handleEditFromDetail}
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
