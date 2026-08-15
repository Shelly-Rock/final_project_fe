"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Box, useTheme } from "@mui/material";
import {
  QuotaAdjustDialog,
  TeacherQuotaTable,
  TopicModerationTable,
  ExceptionRequestTable,
} from "@/feature/registration-period/components";
import { periodService } from "@/feature/registration-period/services";
import type {
  RegistrationPeriod,
  TeacherQuota,
  Topic,
  ExceptionRequest,
} from "@/feature/registration-period/types";
import {
  Calendar,
  Users,
  BookOpen,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { Button, Spinner, Tabs, Breadcrumb, Badge } from "@/shared/components";
import {
  createBreadcrumbs,
  BREADCRUMB_NODES,
} from "@/shared/constants/breadcrumbs";
import { toast } from "sonner";

export default function PeriodDetailPage() {
  const theme = useTheme();
  const params = useParams();
  const router = useRouter();
  const periodId = Number(params.id);

  // Period state
  const [period, setPeriod] = useState<RegistrationPeriod | null>(null);
  const [periodLoading, setPeriodLoading] = useState(true);
  const [periodError, setPeriodError] = useState<string | null>(null);

  // Quotas state
  const [quotas, setQuotas] = useState<TeacherQuota[]>([]);
  const [quotaLoading, setQuotaLoading] = useState(false);
  const [quotaAdjustDialogOpen, setQuotaAdjustDialogOpen] = useState(false);
  const [selectedQuota, setSelectedQuota] = useState<TeacherQuota | null>(null);

  // Topics state
  const [topics, setTopics] = useState<Topic[]>([]);
  const [topicLoading, setTopicLoading] = useState(false);

  // Exception requests state
  const [exceptionRequests, setExceptionRequests] = useState<
    ExceptionRequest[]
  >([]);
  const [exceptionLoading, setExceptionLoading] = useState(false);

  // Active tab (0 = quotas, 1 = topics, 2 = exceptions)
  const [activeTab, setActiveTab] = useState(0);

  // Breadcrumbs - dynamic based on period data
  const breadcrumbs = useMemo(() => {
    return [
      ...createBreadcrumbs("REGISTRATION_PERIODS"),
      {
        ...BREADCRUMB_NODES.REGISTRATION_PERIOD_DETAIL,
        label: period?.name || "Đang tải...",
      },
    ];
  }, [period?.name]);

  // Load period details
  const loadPeriod = useCallback(async () => {
    setPeriodLoading(true);
    setPeriodError(null);
    try {
      const data = await periodService.getById(periodId);
      if (data) {
        setPeriod(data);
      } else {
        setPeriodError("Không tìm thấy đợt đăng ký");
      }
    } catch {
      setPeriodError("Không thể tải thông tin đợt đăng ký");
    } finally {
      setPeriodLoading(false);
    }
  }, [periodId]);

  // Load quotas
  const loadQuotas = useCallback(async () => {
    setQuotaLoading(true);
    try {
      const data = await periodService.getTeacherQuotas(periodId);
      setQuotas(data);
    } catch {
      toast.error("Không thể tải chỉ tiêu giảng viên");
    } finally {
      setQuotaLoading(false);
    }
  }, [periodId]);

  // Load topics
  const loadTopics = useCallback(async () => {
    setTopicLoading(true);
    try {
      const data = await periodService.getTopics(periodId);
      setTopics(data);
    } catch {
      toast.error("Không thể tải danh sách đề tài");
    } finally {
      setTopicLoading(false);
    }
  }, [periodId]);

  // Load exception requests
  const loadExceptionRequests = useCallback(async () => {
    setExceptionLoading(true);
    try {
      const data = await periodService.getExceptionRequests(periodId);
      setExceptionRequests(data);
    } catch {
      toast.error("Không thể tải yêu cầu ngoại lệ");
    } finally {
      setExceptionLoading(false);
    }
  }, [periodId]);

  // Initial load
  useEffect(() => {
    loadPeriod();
  }, [loadPeriod]);

  // Load data when period is loaded
  useEffect(() => {
    if (period) {
      loadQuotas();
      loadTopics();
      loadExceptionRequests();
    }
  }, [period, loadQuotas, loadTopics, loadExceptionRequests]);

  // ============================================================
  // QUOTA HANDLERS
  // ============================================================

  const handleAdjustQuota = (quota: TeacherQuota) => {
    setSelectedQuota(quota);
    setQuotaAdjustDialogOpen(true);
  };

  const handleQuotaSubmit = async (newQuota: number) => {
    if (!selectedQuota) return;

    try {
      await periodService.updateTeacherQuota(
        periodId,
        selectedQuota.teacherId,
        {
          assignedQuota: newQuota,
        },
      );
      loadQuotas();
      toast.success("Đã cập nhật chỉ tiêu");
      setQuotaAdjustDialogOpen(false);
    } catch {
      toast.error("Cập nhật thất bại");
    }
  };

  const handleRemindAll = async () => {
    try {
      const result = await periodService.notifyTeachers(periodId);
      toast.success(`Đã gửi nhắc nhở đến ${result.notified} giảng viên`);
    } catch {
      toast.error("Gửi nhắc nhở thất bại");
    }
  };

  // ============================================================
  // TOPIC HANDLERS
  // ============================================================

  const handleApproveTopic = async (topicId: number) => {
    try {
      await periodService.approveTopic(topicId);
      loadTopics();
      toast.success("Đã duyệt đề tài");
    } catch {
      toast.error("Duyệt thất bại");
    }
  };

  const handleRejectTopic = async (
    topicId: number,
    reason: string,
    note?: string,
  ) => {
    try {
      await periodService.rejectTopic(topicId, {
        rejectionReason: reason,
        moderatorNote: note,
      });
      loadTopics();
      toast.success("Đã từ chối đề tài");
    } catch {
      toast.error("Thao tác thất bại");
    }
  };

  const handleEditTopic = () => {
    toast.info("Tính năng đang phát triển");
  };

  // ============================================================
  // EXCEPTION HANDLERS
  // ============================================================

  const handleApproveException = async (requestId: number) => {
    try {
      await periodService.approveException(periodId, requestId);
      loadExceptionRequests();
      toast.success(
        "Đã duyệt ngoại lệ, cập nhật trạng thái đề tài và sinh viên thành công",
      );
    } catch {
      toast.error("Duyệt ngoại lệ thất bại");
    }
  };

  const handleRejectException = async (requestId: number, reason: string) => {
    try {
      await periodService.rejectException(periodId, requestId, reason);
      toast.success("Từ chối ngoại lệ thành công");
      loadExceptionRequests();
    } catch {
      toast.error("Từ chối ngoại lệ thất bại");
    }
  };

  const exceptionCount = exceptionRequests.filter(
    (r) => r.status === "pending",
  ).length;

  // ============================================================
  // STATS CALCULATION
  // ============================================================

  const getStats = () => {
    return periodService.getPeriodStats(periodId);
  };

  const stats = getStats();

  const isDark = theme.palette.mode === "dark";
  const secondaryTextColor = isDark ? "#94a3b8" : "#64748b";
  const headingColor = isDark ? "#f1f5f9" : "#1e293b";

  // ============================================================
  // RENDER
  // ============================================================

  if (periodLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <Spinner size={40} />
      </Box>
    );
  }

  if (periodError || !period) {
    return (
      <Box sx={{ p: 3, width: "100%" }}>
        <Box
          sx={{
            p: 4,
            textAlign: "center",
            backgroundColor: "#fef2f2",
            borderRadius: 2,
            border: "1px solid #fecaca",
          }}
        >
          <Box sx={{ fontSize: "3rem", mb: 2 }}>❌</Box>
          <Box
            sx={{
              fontSize: "1.125rem",
              fontWeight: 600,
              color: "#991b1b",
              mb: 1,
            }}
          >
            Không tìm thấy đợt đăng ký
          </Box>
          <Box sx={{ color: "#dc2626", mb: 3 }}>
            {periodError || "Đợt đăng ký này có thể đã bị xóa."}
          </Box>
          <Button onClick={() => router.push("/registration-periods")}>
            ← Quay lại danh sách
          </Button>
        </Box>
      </Box>
    );
  }

  // Tab items for shared Tabs component
  const tabItems = [
    {
      label: "Chỉ tiêu giảng viên",
      content: (
        <TeacherQuotaTable
          quotas={quotas}
          loading={quotaLoading}
          onAdjustQuota={handleAdjustQuota}
          onRemindAll={handleRemindAll}
        />
      ),
    },
    {
      label: "Duyệt đề tài",
      content: (
        <TopicModerationTable
          topics={topics}
          loading={topicLoading}
          onApprove={handleApproveTopic}
          onReject={handleRejectTopic}
          onEdit={handleEditTopic}
        />
      ),
    },
    {
      label: (
        <Box
          component="span"
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          Yêu cầu ngoại lệ
          {exceptionCount > 0 && (
            <Badge
              label={String(exceptionCount)}
              color="error"
              variant="soft"
            />
          )}
        </Box>
      ),
      content: (
        <ExceptionRequestTable
          requests={exceptionRequests}
          loading={exceptionLoading}
          onApprove={handleApproveException}
          onReject={handleRejectException}
        />
      ),
    },
  ];

  return (
    <Box sx={{ p: 3, width: "100%" }}>
      {/* Breadcrumb */}
      <Box sx={{ mb: 2 }}>
        <Breadcrumb items={breadcrumbs} />
      </Box>

      {/* Back Button & Period Info */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Button
          variant="outlined"
          onClick={() => router.push("/registration-periods")}
          leftIcon={<ArrowLeft size={16} />}
        >
          Quay lại
        </Button>

        <Box>
          <Box
            component="h1"
            sx={{
              m: 0,
              fontSize: "1.5rem",
              fontWeight: 600,
              color: headingColor,
            }}
          >
            {period.name}
          </Box>
          <Box
            component="p"
            sx={{
              m: 0,
              mt: 0.5,
              color: secondaryTextColor,
              fontSize: "0.875rem",
            }}
          >
            {period.semester === "1"
              ? "Học kỳ 1"
              : period.semester === "2"
                ? "Học kỳ 2"
                : "Học kỳ 3"}{" "}
            • {period.schoolYear}
          </Box>
        </Box>
      </Box>

      {/* Period Info Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 2,
          mb: 3,
        }}
      >
        <InfoCard label="Ngày bắt đầu" value={formatDate(period.startDate)} />
        <InfoCard
          label="Hạn GV nộp"
          value={formatDate(period.teacherDeadline)}
          highlight
        />
        <InfoCard
          label="Hạn SV đăng ký"
          value={formatDate(period.studentDeadline)}
          highlight
        />
        <InfoCard
          label="Chỉ tiêu mặc định"
          value={`${period.defaultQuota} đề tài/GV`}
        />
      </Box>

      {/* Stats Cards */}
      {stats && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 2,
            mb: 3,
          }}
        >
          <StatCard
            icon={<BookOpen size={24} />}
            label="Tổng đề tài"
            value={stats.totalTopics}
            color="#2563eb"
          />
          <StatCard
            icon={<Calendar size={24} />}
            label="Chờ duyệt"
            value={stats.pendingTopics}
            color="#f59e0b"
          />
          <StatCard
            icon={<CheckCircle size={24} />}
            label="Đã duyệt"
            value={stats.approvedTopics}
            color="#22c55e"
          />
          <StatCard
            icon={<Users size={24} />}
            label="GV chưa đủ chỉ tiêu"
            value={stats.insufficientTeachers}
            color="#ef4444"
          />
        </Box>
      )}

      {/* Tabs - Using shared Tabs component */}
      <Tabs
        items={tabItems}
        controlledValue={activeTab}
        onChange={setActiveTab}
      />

      {/* Dialogs */}
      <QuotaAdjustDialog
        open={quotaAdjustDialogOpen}
        onClose={() => setQuotaAdjustDialogOpen(false)}
        onSubmit={handleQuotaSubmit}
        teacherQuota={selectedQuota}
      />
    </Box>
  );
}

// ============================================================
// HELPER COMPONENTS
// ============================================================

function InfoCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const bgColor = highlight
    ? isDark
      ? "#78350f"
      : "#fef3c7"
    : isDark
      ? "#334155"
      : "#f8fafc";
  const borderColor = highlight
    ? isDark
      ? "#b45309"
      : "#fcd34d"
    : isDark
      ? "#475569"
      : "#e2e8f0";
  const textColor = highlight
    ? isDark
      ? "#fde68a"
      : "#92400e"
    : isDark
      ? "#f1f5f9"
      : "#1e293b";
  const labelColor = isDark ? "#94a3b8" : "#64748b";

  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: bgColor,
        borderRadius: 2,
        border: "1px solid",
        borderColor: borderColor,
      }}
    >
      <Box sx={{ fontSize: "0.75rem", color: labelColor, mb: 0.5 }}>
        {label}
      </Box>
      <Box sx={{ fontWeight: 600, color: textColor }}>{value}</Box>
    </Box>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const cardBg = isDark ? "#1e293b" : "#ffffff";
  const labelColor = isDark ? "#94a3b8" : "#64748b";

  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: cardBg,
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        display: "flex",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Box sx={{ color, opacity: 0.8 }}>{icon}</Box>
      <Box>
        <Box sx={{ fontSize: "1.5rem", fontWeight: 700, color }}>{value}</Box>
        <Box sx={{ fontSize: "0.75rem", color: labelColor }}>{label}</Box>
      </Box>
    </Box>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
