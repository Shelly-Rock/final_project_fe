"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Box } from "@mui/material";
import {
  PeriodTable,
  CreatePeriodDialog,
  EditPeriodDialog,
} from "@/feature/registration-period/components";
import {
  periodService,
  type RegistrationPeriod,
  type CreatePeriodInput,
  type UpdatePeriodInput,
} from "@/feature/registration-period";
import { PageHeader, ConfirmDialog } from "@/shared/components";
import { ClipboardList } from "lucide-react";
import { toast } from "sonner";

export default function RegistrationPeriodManagementPage() {
  const searchParams = useSearchParams();
  const facultyId = searchParams.get("facultyId") || undefined;
  const router = useRouter();
  // Periods state
  const [allPeriods, setAllPeriods] = useState<RegistrationPeriod[]>([]);
  const [periodLoading, setPeriodLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] =
    useState<RegistrationPeriod | null>(null);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [periodToDelete, setPeriodToDelete] =
    useState<RegistrationPeriod | null>(null);

  // Search and filter state
  const [searchValue, setSearchValue] = useState("");
  const [filterValue, setFilterValue] = useState("all");

  // Refresh periods list
  const refreshPeriods = useCallback(() => {
    setPeriodLoading(true);
    periodService
      .getAll({
        search: "",
        semester: "all",
        schoolYear: "all",
        status: "all",
        facultyId,
      })
      .then((data) => {
        setAllPeriods(data);
      })
      .catch(() => toast.error("Không thể tải danh sách đợt đăng ký"))
      .finally(() => setPeriodLoading(false));
  }, [facultyId]);

  // Filter and search periods - derived state
  const displayedPeriods = allPeriods.filter((period) => {
    // Filter by status
    if (filterValue !== "all" && period.status !== filterValue) {
      return false;
    }
    // Search by name or school year
    if (searchValue) {
      const searchLower = searchValue.toLowerCase();
      const matchName = period.name.toLowerCase().includes(searchLower);
      const matchYear = period.schoolYear.toLowerCase().includes(searchLower);
      const matchSemester = period.semester.includes(searchValue);
      if (!matchName && !matchYear && !matchSemester) {
        return false;
      }
    }
    return true;
  });

  // Initial load
  useEffect(() => {
    const timer = setTimeout(refreshPeriods, 0);
    return () => clearTimeout(timer);
  }, [refreshPeriods]);

  // Handlers

  const handleCreatePeriod = () => {
    setSelectedPeriod(null);
    setFormDialogOpen(true);
  };

  const handleEditPeriod = (period: RegistrationPeriod) => {
    setSelectedPeriod(period);
    setFormDialogOpen(true);
  };

  const handleDeletePeriod = (period: RegistrationPeriod) => {
    setPeriodToDelete(period);
    setDeleteConfirmOpen(true);
  };

  const executeDelete = async () => {
    if (!periodToDelete) return;
    try {
      await periodService.delete(periodToDelete.id);
      refreshPeriods();
      toast.success("Đã xóa đợt đăng ký");
    } catch {
      toast.error("Xóa thất bại");
    } finally {
      setDeleteConfirmOpen(false);
      setPeriodToDelete(null);
    }
  };

  const handleCreateSubmit = async (data: CreatePeriodInput) => {
    setFormLoading(true);
    try {
      const createdPeriod = await periodService.create(data);
      toast.success("Tạo mới thành công");
      setFormDialogOpen(false);
      // Điều hướng ngay sang trang chi tiết để kích hoạt
      router.push(`/registration-periods/${createdPeriod.id}`);
    } catch {
      toast.error("Tạo mới thất bại");
      setFormLoading(false); // Only stop loading if failed, else keep loading during redirect
    }
  };

  const handleEditSubmit = async (data: UpdatePeriodInput) => {
    if (!selectedPeriod) return;
    setFormLoading(true);
    try {
      await periodService.update(selectedPeriod.id, data);
      toast.success("Cập nhật thành công");
      refreshPeriods();
      setFormDialogOpen(false);
    } catch {
      toast.error("Cập nhật thất bại");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, width: "100%" }}>
      <PeriodTable
        periods={displayedPeriods}
        loading={periodLoading}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        filterValue={filterValue}
        onFilterChange={setFilterValue}
        onEdit={handleEditPeriod}
        onDelete={handleDeletePeriod}
        onCreate={handleCreatePeriod}
      />

      {/* Dialogs */}
      {selectedPeriod ? (
        <EditPeriodDialog
          open={formDialogOpen}
          onClose={() => setFormDialogOpen(false)}
          onSubmit={handleEditSubmit}
          period={selectedPeriod}
          loading={formLoading}
        />
      ) : (
        <CreatePeriodDialog
          open={formDialogOpen}
          onClose={() => setFormDialogOpen(false)}
          onSubmit={handleCreateSubmit}
          loading={formLoading}
        />
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={executeDelete}
        title="Xóa đợt đăng ký"
        description={
          periodToDelete
            ? `Bạn có chắc muốn xóa đợt "${periodToDelete.name}"?\n\nHành động này cũng sẽ xóa tất cả chỉ tiêu giảng viên và đề tài liên quan.`
            : ""
        }
        confirmText="Xóa"
        variant="danger"
      />
    </Box>
  );
}
