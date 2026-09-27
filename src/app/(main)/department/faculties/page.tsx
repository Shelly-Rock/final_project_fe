"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

const FACULTIES_QUERY_KEY = ["admin-faculties"] as const;
// Xóa khoa có thể làm đổi số liệu "n bộ môn" trên dashboard
const DEPARTMENT_RELATED_KEYS = [
  "admin-faculties",
  "admin-department-stats",
  "admin-dashboard",
  "secretary-department-list",
] as const;

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export default function FacultyManagementPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const userRole = useUserRole();
  const isAdmin = userRole === "admin";

  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filterValue, setFilterValue] = useState("all");

  const { data: faculties = [], isLoading: loading } = useQuery({
    queryKey: FACULTIES_QUERY_KEY,
    queryFn: () => facultyService.getAll(),
  });

  const invalidateRelated = useCallback(async () => {
    await Promise.all(
      DEPARTMENT_RELATED_KEYS.map((key) =>
        queryClient.invalidateQueries({ queryKey: [key] }),
      ),
    );
  }, [queryClient]);

  const deleteMutation = useMutation({
    mutationFn: (faculty: Faculty) => facultyService.delete(faculty.id),
    onSuccess: async () => {
      toast.success("Đã xóa khoa");
      await invalidateRelated();
    },
    onError: (error) =>
      toast.error(getErrorMessage(error, "Xóa khoa thất bại")),
  });

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

    await deleteMutation.mutateAsync(faculty).catch(() => undefined);
  };

  const handleFormSubmit = async (
    data: CreateFacultyInput | UpdateFacultyInput,
  ) => {
    setSubmitting(true);
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
      await invalidateRelated();
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          selectedFaculty ? "Cập nhật khoa thất bại" : "Tạo khoa thất bại",
        ),
      );
    } finally {
      setSubmitting(false);
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
          loading={submitting}
          onClose={() => setFormDialogOpen(false)}
          onSubmit={handleFormSubmit}
        />
      </Box>
    </RoleGate>
  );
}
