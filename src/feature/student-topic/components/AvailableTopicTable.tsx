"use client";

import { Eye } from "lucide-react";
import { Box } from "@mui/material";
import { DataTable } from "@/shared/components";
import type { Column, Action } from "@/shared/components";
import type { AvailableTopic } from "../types";

// Trạng thái đăng ký cho bảng
const registrationStatusConfig = {
  OPEN: {
    label: "Mở",
    bgColor: "#dcfce7",
    textColor: "#166534",
  },
  FULL: {
    label: "Đã đầy",
    bgColor: "#fef3c7",
    textColor: "#92400e",
  },
  LOCKED: {
    label: "Đã chốt",
    bgColor: "#f3f4f6",
    textColor: "#6b7280",
  },
};

interface AvailableTopicTableProps {
  topics: AvailableTopic[];
  loading?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onViewDetail: (topic: AvailableTopic) => void;
  onRefresh: () => void;
  disabled?: boolean;
}

export function AvailableTopicTable({
  topics,
  loading = false,
  searchValue = "",
  onSearchChange,
  onViewDetail,
  onRefresh,
  disabled = false,
}: AvailableTopicTableProps) {
  const columns: Column<AvailableTopic>[] = [
    {
      id: "name",
      label: "Tên đề tài",
      minWidth: 300,
      format: (_, row) => <span style={{ fontWeight: 500 }}>{row.name}</span>,
    },
    {
      id: "teacherName",
      label: "Giảng viên hướng dẫn",
      minWidth: 250,
      format: (_, row) => (
        <span style={{ color: "#2563eb" }}>
          {row.teacherName}
          {row.department && ` - [${row.department}]`}
        </span>
      ),
    },
    {
      id: "enrollment",
      label: "Sĩ số",
      minWidth: 100,
      align: "center",
      format: (_, row) => {
        const isFull = row.registeredCount >= row.maxStudents;
        const isLocked = row.registrationStatus === "LOCKED";
        return (
          <Box
            component="span"
            sx={{
              px: 1,
              py: 0.5,
              borderRadius: 1,
              fontWeight: isFull ? 600 : 500,
              bgcolor: isFull || isLocked ? "#fee2e2" : "#dcfce7",
              color: isFull || isLocked ? "#dc2626" : "#166534",
              fontSize: "0.8rem",
            }}
          >
            {row.registeredCount}/{row.maxStudents}
          </Box>
        );
      },
    },
    {
      id: "registrationStatus",
      label: "Trạng thái",
      minWidth: 120,
      align: "center",
      format: (_, row) => (
        <Box
          component="span"
          sx={{
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
            fontSize: "0.75rem",
            fontWeight: 600,
            bgcolor: registrationStatusConfig[row.registrationStatus].bgColor,
            color: registrationStatusConfig[row.registrationStatus].textColor,
          }}
        >
          {registrationStatusConfig[row.registrationStatus].label}
        </Box>
      ),
    },
  ];

  const actions: Action<AvailableTopic>[] = [
    {
      id: "view",
      icon: <Eye size={18} />,
      label: "Xem chi tiết",
      onClick: (row) => onViewDetail(row),
      color: "primary",
      disabled,
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={topics}
      rowKey="id"
      actions={actions}
      loading={loading}
      emptyMessage="Không có đề tài nào được mở đăng ký cho chuyên ngành của bạn"
      showSearchInput
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      showExportButton={false}
      showImportButton={false}
      showFilterButton={false}
      headerActions={[
        {
          id: "refresh",
          icon: <span style={{ fontSize: 16 }}>↻</span>,
          label: "Làm mới",
          onClick: onRefresh,
          variant: "outlined",
        },
      ]}
    />
  );
}
