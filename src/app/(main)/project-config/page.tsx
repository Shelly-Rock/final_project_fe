"use client";

import { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Paper,
  Tab,
  Tabs,
  useTheme,
  Theme,
} from "@mui/material";
import { ClipboardCheck, Settings, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/shared/components";
import { usePermissionContext } from "@/core/providers/PermissionProvider";
import { isAnyRole } from "@/core/permissions/helpers/hasPermission";
import { PeriodConfigForm } from "@/feature/project-governance/components/PeriodConfigForm";
import { TopicManageTable } from "@/feature/project-governance/components/TopicManageTable";
import {
  TemplateList,
  TemplateUploadDialog,
} from "@/feature/progress-tracking/components";
import type { Template } from "@/feature/progress-tracking/types";
import { toast } from "sonner";

const getCardBackground = (theme: Theme) => {
  const isDark = theme.palette.mode === "dark";
  return isDark
    ? "linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 58, 138, 0.4) 100%)"
    : theme.palette.background.paper;
};

export default function ProjectConfigPage() {
  const router = useRouter();
  const theme = useTheme();
  const { role } = usePermissionContext();
  const [tab, setTab] = useState(0);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [replaceTemplate, setReplaceTemplate] = useState<Template | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const allowed = isAnyRole(role, ["admin", "secretary"]);

  useEffect(() => {
    if (role && !allowed) router.replace("/unauthorized");
  }, [allowed, role, router]);

  if (!role || !allowed) {
    return (
      <Box sx={{ p: 3, display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, width: "100%" }}>
      <PageHeader
        title="Cấu hình & Duyệt đề tài"
        subtitle="Quản lý quy tắc theo đợt, thời hạn, cảnh báo và kiểm duyệt đề tài"
        illustration={<Settings size={56} strokeWidth={1.5} />}
        showBgImage
      />

      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
          background: getCardBackground(theme),
        }}
      >
        <Tabs
          value={tab}
          onChange={(_, value) => setTab(value)}
          sx={{ px: 2, borderBottom: "1px solid", borderColor: "divider" }}
        >
          <Tab
            icon={<Settings size={16} />}
            iconPosition="start"
            label="Cấu hình Đợt Đồ án"
          />
          <Tab
            icon={<FileText size={16} />}
            iconPosition="start"
            label="Biểu mẫu (Templates)"
          />
          <Tab
            icon={<ClipboardCheck size={16} />}
            iconPosition="start"
            label="Danh sách & Duyệt Đề tài"
          />
        </Tabs>
        <Box sx={{ p: 2.5, overflowX: "auto" }}>
          {tab === 0 && <PeriodConfigForm />}
          {tab === 1 && (
            <TemplateList
              key={`templates-${refreshKey}`}
              onUploadClick={() => setUploadDialogOpen(true)}
              onReplaceClick={(t) => {
                setReplaceTemplate(t);
                setUploadDialogOpen(true);
              }}
            />
          )}
          {tab === 2 && <TopicManageTable />}
        </Box>
      </Paper>

      <TemplateUploadDialog
        open={uploadDialogOpen}
        replaceTemplate={replaceTemplate}
        onClose={() => {
          setUploadDialogOpen(false);
          setReplaceTemplate(null);
        }}
        onSuccess={() => {
          setRefreshKey((k) => k + 1);
        }}
      />
    </Box>
  );
}
