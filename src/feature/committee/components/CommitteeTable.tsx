"use client";

import { Box, Chip } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { DataTable } from "@/shared/components";
import type { Column, Action } from "@/shared/components";
import type { Committee } from "../services";

interface CommitteeTableProps {
  committees: Committee[];
  loading?: boolean;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  onEdit: (committee: Committee) => void;
  onDelete: (committee: Committee) => void;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (pageSize: number) => void;
}

const renderMemberTag = (
  id: number | null,
  name: string | null,
  role: string,
) => {
  if (!id || !name) {
    return <Chip label="Chưa có" size="small" color="default" />;
  }
  return (
    <Chip
      label={`${role}: ${name}`}
      size="small"
      color="primary"
      sx={{ mb: 0.5 }}
    />
  );
};

export function CommitteeTable({
  committees,
  loading = false,
  pagination,
  onEdit,
  onDelete,
  onPageChange,
  onRowsPerPageChange,
}: CommitteeTableProps) {
  const columns: Column<Committee>[] = [
    {
      id: "name",
      label: "Tên hội đồng",
      format: (_, row) => row.name,
    },
    {
      id: "members",
      label: "Thành viên",
      format: (_, row) => (
        <Box>
          {renderMemberTag(row.chairmanId, row.chairmanName, "Chủ tịch")}
          {renderMemberTag(row.secretaryId, row.secretaryName, "Thư ký")}
          {renderMemberTag(row.internal1Id, row.internal1Name, "PB trong 1")}
          {renderMemberTag(row.internal2Id, row.internal2Name, "PB trong 2")}
          {row.externalReviewers.map((er: { id: number; name: string }) => (
            <Chip
              key={er.id}
              label={`PB ngoài: ${er.name}`}
              size="small"
              color="success"
              sx={{ mb: 0.5 }}
            />
          ))}
        </Box>
      ),
    },
    {
      id: "memberCount",
      label: "Số thành viên",
      format: (_, row) => {
        let count = 0;
        if (row.chairmanId) count++;
        if (row.secretaryId) count++;
        if (row.internal1Id) count++;
        if (row.internal2Id) count++;
        count += row.externalReviewers.length;

        return (
          <Chip
            label={`${count}/4+ thành viên`}
            size="small"
            color={count >= 4 ? "success" : "warning"}
          />
        );
      },
      minWidth: 130,
    },
  ];

  const actions: Action<Committee>[] = [
    {
      id: "edit",
      icon: <EditIcon fontSize="small" />,
      label: "Sửa",
      color: "primary" as const,
      onClick: (row) => onEdit(row),
    },
    {
      id: "delete",
      icon: <DeleteIcon fontSize="small" />,
      label: "Xóa",
      color: "error" as const,
      onClick: (row) => onDelete(row),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={committees}
      rowKey="id"
      actions={actions}
      loading={loading}
      showSearchInput={false}
      showFilterButton={false}
      showExportButton={false}
      showImportButton={false}
      emptyMessage="Không có dữ liệu"
      totalCount={pagination.total}
      page={pagination.current - 1}
      rowsPerPage={pagination.pageSize}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
    />
  );
}
