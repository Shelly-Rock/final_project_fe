"use client";

import { useState, useEffect, useCallback } from "react";
import { Box } from "@mui/material";
import {
  PeriodTable,
  PeriodFormDialog,
} from "@/feature/registration-period/components";
import {
  periodService,
  type RegistrationPeriod,
  type CreatePeriodInput,
  type UpdatePeriodInput,
} from "@/feature/registration-period";
import { PageHeader } from "@/shared/components";
import { ClipboardList } from "lucide-react";
import { toast } from "sonner";

export default function RegistrationPeriodManagementPage() {
  // Periods state
  const [allPeriods, setAllPeriods] = useState<RegistrationPeriod[]>([]);
  const [periodLoading, setPeriodLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] =
    useState<RegistrationPeriod | null>(null);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Search and filter state
  const [searchValue, setSearchValue] = useState("");
  const [filterValue, setFilterValue] = useState("all");

  // Refresh periods list
  const refreshPeriods = useCallback(() => {
    setPeriodLoading(true);
    periodService
      .getAll()
      .then((data) => {
        setAllPeriods(data);
      })
      .catch(() => toast.error("Không thể tải danh sách đợt đăng ký"))
      .finally(() => setPeriodLoading(false));
  }, []);

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

  const handleDeletePeriod = async (period: RegistrationPeriod) => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa đợt "${period.name}"?\n\nHành động này cũng sẽ xóa tất cả chỉ tiêu giảng viên và đề tài liên quan.`,
    );
    if (!confirmed) return;

    try {
      await periodService.delete(period.id);
      refreshPeriods();
      toast.success("Đã xóa đợt đăng ký");
    } catch {
      toast.error("Xóa thất bại");
    }
  };

  const handleFormSubmit = async (data: CreatePeriodInput) => {
    setFormLoading(true);
    try {
      if (selectedPeriod) {
        await periodService.update(
          selectedPeriod.id,
          data as UpdatePeriodInput,
        );
        toast.success("Cập nhật thành công");
      } else {
        await periodService.create(data);
        toast.success("Tạo mới thành công");
      }
      refreshPeriods();
      setFormDialogOpen(false);
    } catch {
      toast.error(selectedPeriod ? "Cập nhật thất bại" : "Tạo mới thất bại");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, width: "100%" }}>
      <PageHeader
        title="Quản lý đợt đăng ký"
        subtitle="Thiết lập và quản lý các đợt đăng ký đề tài khóa luận"
        illustration={<ClipboardList size={56} strokeWidth={1.5} />}
        showBgImage={true}
      />

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
      <PeriodFormDialog
        open={formDialogOpen}
        onClose={() => setFormDialogOpen(false)}
        onSubmit={handleFormSubmit}
        period={selectedPeriod}
        loading={formLoading}
      />
    </Box>
  );
}
