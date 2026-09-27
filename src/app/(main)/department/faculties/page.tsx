"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button } from "@mui/material";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { FacultyFormDialog, FacultyTable } from "@/feature/admin/components";
import { facultyService } from "@/feature/admin/services";
import type {
  CreateFacultyInput,
  Faculty,
  UpdateFacultyInput,
} from "@/feature/admin/types";
import { RoleGate } from "@/shared/components/PermissionGuard/PermissionGuard";
import { useUserRole } from "@/shared/hooks/useUserRole";

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export default function FacultyManagementPage() {
  const router = useRouter();
  const userRole = useUserRole();
  const isAdmin = userRole === "admin";

  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filterValue, setFilterValue] = useState("all");

  const refreshFaculties = useCallback(() => {
    setLoading(true);
    facultyService
      .getAll()
      .then(setFaculties)
      .catch((error) =>
        toast.error(getErrorMessage(error, "Không thể tải danh sách khoa")),
      )
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refreshFaculties();
  }, [refreshFaculties]);

  const displayedFaculties = useMemo(() => {
    const search = searchValue.trim().toLowerCase();

    return faculties.filter((faculty) => {
      if (filterValue === "active" && !faculty.isActive) return false;
      if (filterValue === "inactive" && faculty.isActive) return false;

      if (!search) return true;

      return (
        faculty.id.toLowerCase().includes(search) ||
        faculty.name.toLowerCase().includes(search) ||
        (faculty.description ?? "").toLowerCase().includes(search)
      );
    });
  }, [faculties, filterValue, searchValue]);

  const handleCreate = () => {
    setSelectedFaculty(null);
    setFormDialogOpen(true);
  };

  const handleEdit = (faculty: Faculty) => {
    setSelectedFaculty(faculty);
    setFormDialogOpen(true);
  };

  const handleDelete = async (faculty: Faculty) => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa khoa "${faculty.name}"?\n\nChỉ có thể xóa khoa chưa có bộ môn hoặc giảng viên.`,
    );
    if (!confirmed) return;

    try {
      await facultyService.delete(faculty.id);
      toast.success("Đã xóa khoa");
      refreshFaculties();
    } catch (error) {
      toast.error(getErrorMessage(error, "Xóa khoa thất bại"));
    }
  };

  const handleFormSubmit = async (
    data: CreateFacultyInput | UpdateFacultyInput,
  ) => {
    setFormLoading(true);
    try {
      if (selectedFaculty) {
        await facultyService.update(
          selectedFaculty.id,
          data as UpdateFacultyInput,
        );
        toast.success("Cập nhật khoa thành công");
      } else {
        await facultyService.create(data as CreateFacultyInput);
        toast.success("Tạo khoa thành công");
      }
      setFormDialogOpen(false);
      refreshFaculties();
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          selectedFaculty ? "Cập nhật khoa thất bại" : "Tạo khoa thất bại",
        ),
      );
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <RoleGate
      roles={["admin", "secretary"]}
      fallback={
        <div className="w-full p-3 text-center">
          <h6 className="text-red-600">
            Bạn không có quyền truy cập trang này
          </h6>
        </div>
      }
    >
      <Box sx={{ p: 3, width: "100%" }}>
        <Button
          variant="outlined"
          startIcon={<ArrowLeft size={18} />}
          onClick={() => router.push("/department")}
          sx={{ mb: 2, textTransform: "none", fontWeight: 600 }}
        >
          Quay lại
        </Button>

        <FacultyTable
          faculties={displayedFaculties}
          loading={loading}
          canCreate={isAdmin}
          canDelete={isAdmin}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          filterValue={filterValue}
          onFilterChange={setFilterValue}
          onCreate={handleCreate}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <FacultyFormDialog
          open={formDialogOpen}
          faculty={selectedFaculty}
          loading={formLoading}
          onClose={() => setFormDialogOpen(false)}
          onSubmit={handleFormSubmit}
        />
      </Box>
    </RoleGate>
  );
}
