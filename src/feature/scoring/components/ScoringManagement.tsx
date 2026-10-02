"use client";

import { useState } from "react";
import { Box, Chip, Paper, Tab, Tabs, Typography } from "@mui/material";
import { FileCheck2, FileText } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { DataTable } from "@/shared/components";
import type { Column } from "@/shared/components";
import { ScoreIssuancePanel } from "./ScoreIssuancePanel";

type ScoreSheetConfiguration = {
  id: string;
  template: string;
  type: string;
  roles: string[];
  purpose: string;
};

const SCORE_SHEET_CONFIGURATIONS: ScoreSheetConfiguration[] = [
  {
    id: "gvhd",
    template: "NIIE-KLTN010.docx",
    type: "Phiếu chấm GVHD",
    roles: ["Giảng viên hướng dẫn"],
    purpose: "Đánh giá quá trình và kết quả thực hiện đề tài của sinh viên.",
  },
  {
    id: "external-reviewer",
    template: "NIIE-KLTN011.docx",
    type: "Phiếu chấm phản biện ngoài",
    roles: ["Phản biện ngoài"],
    purpose: "Đánh giá độc lập của giảng viên phản biện ngoài hội đồng.",
  },
  {
    id: "committee-member",
    template: "NIIE-KLTN012.docx",
    type: "Phiếu chấm hội đồng",
    roles: ["Chủ tịch", "Thư ký hội đồng", "Phản biện trong"],
    purpose: "Phiếu dùng chung cho đúng ba thành viên nội bộ của hội đồng.",
  },
  {
    id: "summary",
    template: "NIIE-KLTN013.docx",
    type: "Phiếu tổng hợp điểm",
    roles: ["Thư ký khoa", "Admin"],
    purpose: "Tổng hợp điểm từ các phiếu đã được giảng viên nộp.",
  },
];

const configurationColumns: Column<ScoreSheetConfiguration>[] = [
  {
    id: "type",
    label: "Loại phiếu chấm",
    minWidth: 220,
    format: (_, row) => (
      <Box>
        <Typography variant="body2" fontWeight={700}>
          {row.type}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {row.purpose}
        </Typography>
      </Box>
    ),
  },
  {
    id: "roles",
    label: "Vai trò sử dụng",
    minWidth: 280,
    format: (_, row) => (
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
        {row.roles.map((role) => (
          <Chip key={role} label={role} size="small" variant="outlined" />
        ))}
      </Box>
    ),
  },
  {
    id: "template",
    label: "Mẫu xuất file",
    minWidth: 180,
    format: (_, row) => (
      <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
        {row.template}
      </Typography>
    ),
  },
  {
    id: "status",
    label: "Trạng thái",
    minWidth: 120,
    format: () => <Chip label="Đang sử dụng" size="small" color="success" />,
  },
];

export function ScoringManagementPage() {
  const searchParams = useSearchParams();
  const facultyId = searchParams.get("facultyId") || undefined;
  const [activeTab, setActiveTab] = useState<"issuance" | "configurations">(
    "issuance",
  );

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          mb: 2,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Tabs
          value={activeTab === "issuance" ? 0 : 1}
          onChange={(_, value: number) =>
            setActiveTab(value === 0 ? "issuance" : "configurations")
          }
          sx={{ px: 1, minHeight: 48 }}
        >
          <Tab
            icon={<FileText size={16} />}
            iconPosition="start"
            label="Cấp phiếu chấm"
            sx={{ textTransform: "none", fontWeight: 600, minHeight: 48 }}
          />
          <Tab
            icon={<FileCheck2 size={16} />}
            iconPosition="start"
            label="Danh sách phiếu chấm"
            sx={{ textTransform: "none", fontWeight: 600, minHeight: 48 }}
          />
        </Tabs>
      </Paper>

      {activeTab === "issuance" ? (
        <ScoreIssuancePanel facultyId={facultyId} />
      ) : (
        <DataTable
          columns={configurationColumns}
          rows={SCORE_SHEET_CONFIGURATIONS}
          rowKey="id"
          loading={false}
          showSearchInput={false}
          showFilterButton={false}
          showExportButton={false}
          showImportButton={false}
          emptyMessage="Chưa có cấu hình phiếu chấm"
        />
      )}
    </>
  );
}
