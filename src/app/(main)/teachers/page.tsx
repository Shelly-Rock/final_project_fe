"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  Box,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Badge,
} from "@mui/material";
import {
  TeacherTable,
  TeacherFormDialog,
  TeacherDetailDialog,
  ImportExcelDialog,
  exportTeachersToExcel,
} from "@/feature/teacher/components";
import {
  type Lecturer,
  type CreateLecturerInput,
  type UpdateLecturerInput,
} from "@/feature/admin/types";
import { facultyService } from "@/feature/admin/services";
import { teacherService } from "@/feature/teacher/services/teacher.service";
import { HeaderTools } from "@/layout/Header";
import { Search, Filter } from "lucide-react";
import { toast } from "sonner";

interface Faculty {
  id: string;
  name: string;
}

export default function TeacherManagementPage() {
  const searchParams = useSearchParams();
  const scopedFacultyId = searchParams.get("facultyId");

  // Lecturers state
  const [teachers, setTeachers] = useState<Lecturer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState<Lecturer | null>(null);
  const [selectedViewTeacher, setSelectedViewTeacher] =
    useState<Lecturer | null>(null);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  // Filter state by faculty
  const [filterFaculty, setFilterFaculty] = useState(scopedFacultyId || "all");
  const [search, setSearch] = useState("");
  const [khoaAnchorEl, setKhoaAnchorEl] = useState<HTMLElement | null>(null);

  // Faculty/Department from API
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loadingFaculties, setLoadingFaculties] = useState(true);

  useEffect(() => {
    setFilterFaculty(scopedFacultyId || "all");
  }, [scopedFacultyId]);

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

  const handleFacultyChange = (facultyId: string) => {
    setFilterFaculty(facultyId);
  };

  // Refresh teachers list
  const refreshTeachers = useCallback(() => {
    setLoading(true);
    teacherService
      .getAll({
        facultyId: filterFaculty === "all" ? undefined : filterFaculty,
      })
      .then(({ teachers }) => setTeachers(teachers))
      .catch(() => toast.error("Không thể tải danh sách giảng viên"))
      .finally(() => setLoading(false));
  }, [filterFaculty]);

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

  const getErrorMessage = (error: unknown, fallback: string) => {
    if (typeof error === "object" && error !== null) {
      const typedError = error as {
        response?: {
          data?: {
            message?: string | string[];
            errors?: { field: string; message: string }[];
          };
        };
        message?: string;
      };
      const validationErrors = typedError.response?.data?.errors;
      if (validationErrors?.length) {
        return validationErrors
          .map(({ field, message }) => `${field}: ${message}`)
          .join("; ");
      }
      const backendMessage = typedError.response?.data?.message;
      return Array.isArray(backendMessage)
        ? backendMessage.join("\n")
        : backendMessage || typedError.message || fallback;
    }

    return fallback;
  };

  const handleViewTeacher = async (teacher: Lecturer) => {
    try {
      const detail = await teacherService.getByCode(teacher.code);
      setSelectedViewTeacher(detail);
      setDetailDialogOpen(true);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Không thể tải thông tin giảng viên"));
    }
  };

  const handleDeleteTeacher = async (teacher: Lecturer) => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa giảng viên ${teacher.name}?`,
    );
    if (!confirmed) return;

    try {
      await teacherService.delete(teacher.code);
      toast.success("Xóa giảng viên thành công");
      refreshTeachers();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Xóa giảng viên thất bại"));
    }
  };

  const handleDeleteManyTeachers = async (selectedTeachers: Lecturer[]) => {
    if (!selectedTeachers.length) return;

    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa ${selectedTeachers.length} giảng viên đã chọn?`,
    );
    if (!confirmed) return;

    try {
      await teacherService.deleteMany(
        selectedTeachers.map((teacher) => teacher.code),
      );
      toast.success(`Đã xóa ${selectedTeachers.length} giảng viên`);
      refreshTeachers();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Xóa giảng viên thất bại"));
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
      return true;
    } catch (error: unknown) {
      toast.error(
        getErrorMessage(
          error,
          selectedTeacher ? "Cập nhật thất bại" : "Tạo mới thất bại",
        ),
      );
      return false;
    } finally {
      setFormLoading(false);
    }
  };

  const handleImport = async (file: File) => {
    try {
      const result = await teacherService.importFile(file);
      refreshTeachers();
      toast.success(result.message || `Đã import ${result.count} giảng viên`);
    } catch (error: unknown) {
      const message = getErrorMessage(
        error,
        "Import thất bại. Vui lòng kiểm tra lại file Excel.",
      );
      toast.error(message);
      throw new Error(message);
    }
  };

  const handleExport = () => {
    exportTeachersToExcel(teachers, faculties);
    toast.success("Đã xuất file Excel");
  };

  const filteredTeachers = useMemo(() => {
    if (!search.trim()) return teachers;
    const q = search.toLowerCase();
    return teachers.filter(
      (teacher) =>
        teacher.name.toLowerCase().includes(q) ||
        teacher.code.toLowerCase().includes(q) ||
        (teacher.email || "").toLowerCase().includes(q),
    );
  }, [teachers, search]);

  const selectedFacultyName =
    faculties.find((faculty) => faculty.id === filterFaculty)?.name || "";

  if (loadingFaculties) {
    return (
      <Box sx={{ p: 3, display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

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
              placeholder="Tìm kiếm giảng viên..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
          <Tooltip title={selectedFacultyName || "Lọc theo khoa"}>
            <IconButton
              onClick={(e) => setKhoaAnchorEl(e.currentTarget)}
              sx={{
                color:
                  filterFaculty !== "all" ? "primary.main" : "text.secondary",
                border: "1px solid",
                borderColor:
                  filterFaculty !== "all" ? "primary.main" : "divider",
                borderRadius: 2,
                width: 36,
                height: 36,
              }}
            >
              <Badge
                color="primary"
                variant="dot"
                invisible={filterFaculty === "all"}
              >
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
              selected={filterFaculty === "all"}
              disabled={!!scopedFacultyId}
              onClick={() => {
                handleFacultyChange("all");
                setKhoaAnchorEl(null);
              }}
            >
              Tất cả khoa
            </MenuItem>
            {faculties.map((faculty) => (
              <MenuItem
                key={faculty.id}
                selected={filterFaculty === faculty.id}
                disabled={!!scopedFacultyId && faculty.id !== scopedFacultyId}
                onClick={() => {
                  handleFacultyChange(faculty.id);
                  setKhoaAnchorEl(null);
                }}
              >
                {faculty.name}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </HeaderTools>
      <TeacherTable
        teachers={filteredTeachers}
        loading={loading}
        faculties={faculties}
        onView={handleViewTeacher}
        onEdit={handleEditTeacher}
        onDelete={handleDeleteTeacher}
        onDeleteMany={handleDeleteManyTeachers}
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
      />

      <TeacherDetailDialog
        open={detailDialogOpen}
        onClose={() => {
          setDetailDialogOpen(false);
          setSelectedViewTeacher(null);
        }}
        teacher={selectedViewTeacher}
        faculties={faculties}
      />

      <ImportExcelDialog
        open={importDialogOpen}
        onClose={() => setImportDialogOpen(false)}
        onImport={handleImport}
        faculties={faculties}
      />
    </Box>
  );
}
