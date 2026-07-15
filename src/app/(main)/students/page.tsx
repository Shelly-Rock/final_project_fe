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
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import {
  StudentTable,
  StudentImportDialog,
  StudentFormDialog,
  StudentDetailDialog,
  exportStudentsToExcel,
} from "@/feature/student-management/components";
import { studentService } from "@/feature/student-management/services";
import type {
  Student,
  StudentFilters,
  StudentImportRow,
  StudentStatus,
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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshStudents();
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

  const handleExport = () => {
    exportStudentsToExcel(filteredStudents);
    showSnackbar("Đã xuất file Excel");
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
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Quản lý sinh viên
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Quản lý thông tin sinh viên và đề tài khóa luận
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<ImportIcon />}
            onClick={() => setImportDialogOpen(true)}
          >
            Import
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
            onClick={handleAdd}
          >
            Thêm sinh viên
          </Button>
        </Box>
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

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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

          <Box sx={{ flex: 1 }} />

          <Button
            size="small"
            startIcon={<RefreshIcon />}
            onClick={refreshStudents}
          >
            Làm mới
          </Button>
        </Box>

        <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Tổng: <strong>{filteredStudents.length}</strong> sinh viên
          </Typography>
          {filteredStudents.length !== students.length && (
            <Typography variant="body2" color="text.secondary">
              (đã lọc từ {students.length})
            </Typography>
          )}
        </Box>
      </Paper>

      <StudentTable
        students={filteredStudents}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
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
