"use client";

import { Eye } from "lucide-react";
import { DataTable } from "@/shared/components";
import type { Column, Action } from "@/shared/components";
import type { AvailableTopic } from "../types";

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
      minWidth: 180,
      format: (val) => (
        <span style={{ color: "#2563eb" }}>{val as string}</span>
      ),
    },
    {
      id: "department",
      label: "Khoa",
      minWidth: 150,
    },
    {
      id: "enrollment",
      label: "Sĩ số",
      minWidth: 80,
      align: "center",
      format: (_, row) => {
        const isFull = row.registeredCount >= row.maxStudents;
        return (
          <span
            style={{
              fontWeight: isFull ? 600 : 400,
              color: isFull ? "#ef4444" : "inherit",
            }}
          >
            {row.registeredCount}/{row.maxStudents}
          </span>
        );
      },
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
      emptyMessage="Không có đề tài nào được mở đăng ký"
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
