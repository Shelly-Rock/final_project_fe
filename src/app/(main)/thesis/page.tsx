"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { PageHeader, FilterBar } from "@/shared/components";
import { DataTable } from "@/shared/components/DataTable";
import type { Column, Action } from "@/shared/components";
import {
  mockTheses,
  mockTopics,
  statusConfig,
  type ThesisStatus,
} from "@/feature/thesis/constants";
import { ThesisTopicList } from "@/feature/thesis/components/ThesisTopicList";
import { usePermissionContext } from "@/core/providers/PermissionProvider";
import { ROLE } from "@/core/permissions/types";

export default function ThesisPage() {
  const { role } = usePermissionContext();
  const [tab, setTab] = useState(0);
  const [thesisStatus, setThesisStatus] = useState<ThesisStatus>("all");

  const canManageTheses = role === ROLE.ADMIN || role === ROLE.SECRETARY;

  const filteredTheses =
    thesisStatus === "all"
      ? mockTheses
      : mockTheses.filter((t) => t.status === thesisStatus);

  const columns: Column<(typeof mockTheses)[0]>[] = [
    { id: "id", label: "ID", minWidth: 60 },
    { id: "title", label: "Tên đề tài", minWidth: 250, sortable: true },
    { id: "student", label: "Sinh viên", minWidth: 150 },
    { id: "mssv", label: "MSSV", minWidth: 100 },
    {
      id: "status",
      label: "Trạng thái",
      minWidth: 120,
      format: (value) => {
        const config = statusConfig[value as string];
        return <Chip label={config.label} color={config.color} size="small" />;
      },
    },
    { id: "submittedAt", label: "Ngày nộp", minWidth: 120 },
  ];

  const actions: Action<(typeof mockTheses)[0]>[] = [
    { id: "view", icon: <ViewIcon />, label: "Xem", onClick: () => {} },
    ...(canManageTheses
      ? [
          { id: "edit", icon: <EditIcon />, label: "Sửa", onClick: () => {} },
          {
            id: "delete",
            icon: <DeleteIcon />,
            label: "Xóa",
            onClick: () => {},
            color: "error" as const,
          },
        ]
      : []),
  ];

  return (
    <Box sx={{ p: 3 }}>
      <PageHeader
        title="Đồ án & Đề tài"
        subtitle="Quản lý đồ án và đề tài tốt nghiệp"
      />

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label={`Đề tài (${mockTopics.length})`} />
        <Tab label={`Đồ án (${mockTheses.length})`} />
      </Tabs>

      {tab === 0 && (
        <>
          <FilterBar totalCount={mockTopics.length}>
            <Typography variant="body2" color="text.secondary">
              Hiển thị <strong>{mockTopics.length}</strong> đề tài
            </Typography>
          </FilterBar>
          <ThesisTopicList topics={mockTopics} />
        </>
      )}

      {tab === 1 && (
        <>
          <PageHeader
            title=""
            subtitle=""
            actions={
              <ToggleButtonGroup
                size="small"
                value={thesisStatus}
                exclusive
                onChange={(_, v) => v && setThesisStatus(v)}
              >
                <ToggleButton value="all">Tất cả</ToggleButton>
                <ToggleButton value="pending">Chờ duyệt</ToggleButton>
                <ToggleButton value="in_progress">Đang thực hiện</ToggleButton>
                <ToggleButton value="completed">Hoàn thành</ToggleButton>
              </ToggleButtonGroup>
            }
          />

          <FilterBar
            totalCount={mockTheses.length}
            filteredCount={filteredTheses.length}
          >
            <Typography variant="body2" color="text.secondary">
              Hiển thị <strong>{filteredTheses.length}</strong> đồ án
            </Typography>
          </FilterBar>

          <DataTable
            columns={columns}
            rows={filteredTheses}
            rowKey="id"
            actions={actions}
          />
        </>
      )}
    </Box>
  );
}
