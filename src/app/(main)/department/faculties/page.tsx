"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Box, Button } from "@mui/material";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import {
  FacultyDetailPanel,
  FacultyFormDialog,
  FacultyTable,
} from "@/feature/admin/components";
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
  "admin-faculty-stats",
  "admin-faculty-detail",
  "admin-department-stats",
  "admin-dashboard",
  "secretary-department-list",
] as const;

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

function FacultyManagementContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const userRole = useUserRole();
  const isAdmin = userRole === "admin";

  // Dashboard điều hướng tới đây kèm facultyId để mở sẵn form sửa khoa đó
  const focusFacultyId = searchParams.get("facultyId");

  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filterValue, setFilterValue] = useState("all");

  const { data: faculties = [], isLoading: loading } = useQuery({
    queryKey: FACULTIES_QUERY_KEY,
    queryFn: () => facultyService.getAll(),
  });

  // Đang mở chi tiết một khoa (dashboard bấm vào card khoa) -> hiện sidebar.
  // Dùng trực tiếp focusFacultyId từ URL, không phụ thuộc vào danh sách
  // faculties đã tải xong, để bấm card luôn ra đúng giao diện chi tiết.
  const [detailFacultyId, setDetailFacultyId] = useState<string | null>(null);

  useEffect(() => {
    setDetailFacultyId(focusFacultyId);
  }, [focusFacultyId]);

  const closeDetail = useCallback(() => {
    setDetailFacultyId(null);
    if (focusFacultyId) {
      router.replace("/department/faculties");
    }
  }, [focusFacultyId, router]);

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
        const updatedFaculty = await facultyService.update(
          selectedFaculty.id,
          data as UpdateFacultyInput,
        );

        queryClient.setQueryData<Faculty[]>(FACULTIES_QUERY_KEY, (current) =>
          current?.map((faculty) =>
            faculty.id === updatedFaculty.id ? updatedFaculty : faculty,
          ),
        );
        toast.success("Cập nhật khoa thành công");
      } else {
        const createdFaculty = await facultyService.create(
          data as CreateFacultyInput,
        );

        queryClient.setQueryData<Faculty[]>(FACULTIES_QUERY_KEY, (current) =>
          current ? [createdFaculty, ...current] : [createdFaculty],
        );
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
        {detailFacultyId ? (
          <FacultyDetailPanel
            facultyId={detailFacultyId}
            onBack={closeDetail}
          />
        ) : (
          <>
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
          </>
        )}

        <FacultyFormDialog
          open={formDialogOpen}
          faculty={selectedFaculty}
          loading={submitting}
          onClose={() => {
            setFormDialogOpen(false);
            setSelectedFaculty(null);
            if (focusFacultyId) {
              router.replace("/department/faculties");
            }
          }}
          onSubmit={handleFormSubmit}
        />
      </Box>
    </RoleGate>
  );
}

export default function FacultyManagementPage() {
  return (
    <Suspense fallback={null}>
      <FacultyManagementContent />
    </Suspense>
  );
}
