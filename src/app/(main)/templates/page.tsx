"use client";

import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Chip,
  Stack,
  Button,
  Card,
  CardContent,
  Snackbar,
  Alert,
  Badge,
} from "@mui/material";
import {
  Description as FileIcon,
  Settings as SettingsIcon,
  FolderOpen as FolderIcon,
} from "@mui/icons-material";
import { PageHeader } from "@/shared/components";
import { mockTemplates } from "@/feature/templates/constants";
import {
  TemplateList,
  TemplateStats,
  TemplatePreviewModal,
  TemplateFilter,
} from "@/feature/templates/components";
import type { TemplateItem, CategoryType, StageType } from "@/feature/templates/types";

export default function TemplatesPage() {
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | "all">("all");
  const [selectedStage, setSelectedStage] = useState<StageType | "all">("all");
  const [previewTemplate, setPreviewTemplate] = useState<TemplateItem | null>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "info" }>({
    open: false,
    message: "",
    severity: "info",
  });

  const filteredTemplates = useMemo(() => {
    return mockTemplates.filter((t) => {
      const matchSearch =
        searchText === "" ||
        t.name.toLowerCase().includes(searchText.toLowerCase()) ||
        t.code.toLowerCase().includes(searchText.toLowerCase()) ||
        t.nameEn.toLowerCase().includes(searchText.toLowerCase());

      const matchCategory =
        selectedCategory === "all" || t.forRoles.includes(selectedCategory);

      const matchStage =
        selectedStage === "all" || t.stage === selectedStage;

      return matchSearch && matchCategory && matchStage;
    });
  }, [searchText, selectedCategory, selectedStage]);

  const handleView = (template: TemplateItem) => {
    setPreviewTemplate(template);
    setPreviewModalOpen(true);
  };

  const handleDownload = (template: TemplateItem, lang: "vi" | "en") => {
    const fileUrl = lang === "en" ? template.fileEN : template.fileVI;
    if (fileUrl) {
      window.open(fileUrl, "_blank");
    } else {
      setSnackbar({
        open: true,
        message: `File ${lang === "en" ? "tiếng Anh" : "tiếng Việt"} của ${template.code} sẽ được tải về khi có trên hệ thống`,
        severity: "info",
      });
    }
  };

  const handleStageClick = (stage: StageType) => {
    setSelectedStage(selectedStage === stage ? "all" : stage);
  };

  return (
    <Box sx={{ p: 3 }}>
      <PageHeader
        title="Biểu mẫu"
        subtitle="Danh sách biểu mẫu khóa luận tốt nghiệp - NIIE"
      />

      {/* Info Banner */}
      <Card
        sx={{
          mb: 3,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
        }}
      >
        <CardContent>
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", md: "center" }}
            spacing={2}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <FolderIcon sx={{ fontSize: 32 }} />
              <Box>
                <Typography variant="h6" sx={{ color: "white", fontWeight: 600 }}>
                  Học kỳ 2024.1
                </Typography>
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.85)" }}>
                  19/02/2024 - 27/05/2024
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Badge
                badgeContent={mockTemplates.length}
                color="error"
                sx={{ "& .MuiBadge-badge": { background: "#fff", color: "#667eea" } }}
              />
              <Typography variant="body2" sx={{ color: "white" }}>
                Biểu mẫu
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Filters */}
      <TemplateFilter
        searchText={searchText}
        onSearchChange={setSearchText}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedStage={selectedStage}
        onStageChange={setSelectedStage}
        totalCount={mockTemplates.length}
        filteredCount={filteredTemplates.length}
      />

      {/* Stage Progress Indicator */}
      <TemplateStats
        templates={mockTemplates}
        selectedStage={selectedStage}
        onStageClick={handleStageClick}
      />

      {/* Templates List */}
      <TemplateList
        templates={filteredTemplates}
        groupByStage={true}
        onView={handleView}
        onDownload={handleDownload}
      />

      {/* Legend */}
      <Card sx={{ mt: 3 }} variant="outlined">
        <CardContent>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
            Ghi chú
          </Typography>
          <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Giai đoạn quy trình
              </Typography>
              <Stack spacing={0.5}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip label="Chuẩn bị" color="info" size="small" />
                  <Typography variant="body2" color="text.secondary">Trước khi bắt đầu</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip label="Giao đề tài" color="primary" size="small" />
                  <Typography variant="body2" color="text.secondary">Phân công cho sinh viên</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip label="Thực hiện" color="warning" size="small" />
                  <Typography variant="body2" color="text.secondary">Quá trình làm khóa luận</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip label="Đánh giá" color="success" size="small" />
                  <Typography variant="body2" color="text.secondary">Chấm điểm, phản biện</Typography>
                </Stack>
              </Stack>
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Định dạng file
              </Typography>
              <Stack spacing={0.5}>
                <Typography variant="body2">.docx, .doc - Microsoft Word</Typography>
                <Typography variant="body2">.pdf - PDF Document</Typography>
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Preview Modal */}
      <TemplatePreviewModal
        open={previewModalOpen}
        template={previewTemplate}
        onClose={() => setPreviewModalOpen(false)}
        onDownload={handleDownload}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
