"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Box, useTheme, Typography, Paper } from "@mui/material";
import { periodService } from "@/feature/registration-period/services";
import type {
  RegistrationPeriod,
  PeriodStats,
} from "@/feature/registration-period";
import {
  BookOpen,
  Users,
  Calendar,
  ArrowLeft,
  ClipboardList,
  Unlock,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { Button, Spinner, Badge, ConfirmDialog } from "@/shared/components";

const InfoCard = ({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) => (
  <Paper
    elevation={0}
    sx={{
      p: 2,
      border: "1px solid",
      borderColor: highlight ? "primary.main" : "divider",
      borderRadius: 2,
      bgcolor: highlight ? "primary.50" : "background.paper",
    }}
  >
    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
      {label}
    </Typography>
    <Typography
      variant="body1"
      fontWeight={500}
      color={highlight ? "primary.main" : "text.primary"}
    >
      {value}
    </Typography>
  </Paper>
);

const StatCard = ({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}) => (
  <Paper
    elevation={0}
    sx={{
      p: 2,
      border: "1px solid",
      borderColor: "divider",
      borderRadius: 2,
      display: "flex",
      alignItems: "center",
      gap: 2,
    }}
  >
    <Box
      sx={{
        width: 48,
        height: 48,
        borderRadius: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: `${color}15`,
        color,
      }}
    >
      {icon}
    </Box>
    <Box>
      <Typography variant="h5" fontWeight={600} sx={{ lineHeight: 1.2 }}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
    </Box>
  </Paper>
);

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "Chưa cập nhật";
  try {
    return new Date(dateStr).toLocaleDateString("vi-VN");
  } catch {
    return dateStr;
  }
};

export default function PeriodDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [period, setPeriod] = useState<RegistrationPeriod | null>(null);
  const [stats, setStats] = useState<PeriodStats | null>(null);
  const [confirmState, setConfirmState] = useState<{
    open: boolean;
    type: "open" | "close" | null;
  }>({ open: false, type: null });
  const [periodLoading, setPeriodLoading] = useState(true);
  const [periodError, setPeriodError] = useState("");

  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const headingColor = isDark ? "#f8fafc" : "#0f172a";
  const secondaryTextColor = isDark ? "#94a3b8" : "#64748b";

  useEffect(() => {
    if (!id || isNaN(id)) return;
    const fetchInitialData = async () => {
      try {
        setPeriodLoading(true);
        const [periodData, statsData] = await Promise.all([
          periodService.getById(id),
          periodService.getStats(id),
        ]);
        setPeriod(periodData || null);
        setStats(statsData);
      } catch {
        setPeriodError("Không thể tải thông tin đợt đăng ký");
      } finally {
        setPeriodLoading(false);
      }
    };
    fetchInitialData();
  }, [id]);

  const handleOpenPeriod = () => setConfirmState({ open: true, type: "open" });
  const handleClosePeriod = () =>
    setConfirmState({ open: true, type: "close" });

  const executeAction = async () => {
    const type = confirmState.type;
    setPeriodLoading(true);
    try {
      if (type === "open") {
        await periodService.openPeriod(id);
        toast.success("Mở đợt đăng ký thành công");
      } else {
        await periodService.closePeriod(id);
        toast.success("Đóng đợt đăng ký thành công");
      }
      const [periodData, statsData] = await Promise.all([
        periodService.getById(id),
        periodService.getStats(id),
      ]);
      setPeriod(periodData || null);
      setStats(statsData);
      setConfirmState({ open: false, type: null });
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      toast.error(
        message ||
          (type === "open"
            ? "Lỗi khi mở đợt đăng ký"
            : "Lỗi khi đóng đợt đăng ký"),
      );
    } finally {
      setPeriodLoading(false);
    }
  };

  if (periodLoading) {
    return (
      <Box sx={{ p: 3, display: "flex", justifyContent: "center", mt: 10 }}>
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
          <Button onClick={() => router.push("/registration-periods")}>
            Quay lại danh sách
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, width: "100%" }}>
      {/* Header */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              {period.name}
              {period.status === "open" && (
                <Badge label="Đang mở" color="success" variant="soft" />
              )}
              {period.status === "closed" && (
                <Badge label="Đã đóng" color="default" variant="soft" />
              )}
              {period.status === "upcoming" && (
                <Badge label="Sắp mở" color="warning" variant="soft" />
              )}
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
              Học kỳ {period.semester} - {period.schoolYear}
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            leftIcon={<ClipboardList size={18} />}
            onClick={() => {
              if (period.status === "upcoming") {
                toast.warning(
                  "Đợt đăng ký chưa được kích hoạt, vui lòng kích hoạt đợt đăng ký để có thể cấu hình",
                );
                return;
              }
              router.push(`/project-config?periodId=${period.id}`);
            }}
          >
            Đi đến trang cấu hình đợt đăng ký
          </Button>

          {period.status === "upcoming" && (
            <Button
              variant="contained"
              color="success"
              onClick={handleOpenPeriod}
              leftIcon={<Unlock size={16} />}
            >
              Kích hoạt đợt đăng ký
            </Button>
          )}
          {period.status === "open" && (
            <Button
              variant="contained"
              color="error"
              onClick={handleClosePeriod}
              leftIcon={<Lock size={16} />}
            >
              Đóng đợt
            </Button>
          )}
        </Box>
      </Box>

      {/* Info Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 2,
          mb: 4,
        }}
      >
        <InfoCard label="Ngày bắt đầu" value={formatDate(period.startDate)} />
        <InfoCard
          label="Trạng thái đợt đăng ký"
          value={
            period.status === "upcoming" ? "Chưa kích hoạt" : "Đã kích hoạt"
          }
          highlight
        />
      </Box>

      {/* Stats Cards */}
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Thống kê hiện tại
      </Typography>
      {stats && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 3,
          }}
        >
          <StatCard
            title="Tổng đề tài"
            value={stats.totalTopics}
            icon={<BookOpen size={24} />}
            color="#3b82f6"
          />
          <StatCard
            title="Tổng chỉ tiêu GV"
            value={stats.totalQuotas}
            icon={<Users size={24} />}
            color="#8b5cf6"
          />
          <StatCard
            title="Đề tài đã duyệt"
            value={stats.approvedTopics}
            icon={<Calendar size={24} />}
            color="#10b981"
          />
        </Box>
      )}

      {/* Confirm Action Dialog */}
      <ConfirmDialog
        open={confirmState.open}
        onClose={() => setConfirmState({ open: false, type: null })}
        onConfirm={executeAction}
        title={
          confirmState.type === "open"
            ? "Kích hoạt đợt đăng ký"
            : "Đóng đợt đăng ký"
        }
        description={
          confirmState.type === "open"
            ? "Bạn có chắc chắn muốn KÍCH HOẠT đợt đăng ký này? Sau khi kích hoạt, cấu hình thời gian bên trang Governance sẽ bắt đầu có hiệu lực."
            : "Bạn có chắc chắn muốn ĐÓNG đợt đăng ký này? Các hoạt động sẽ bị khóa lại."
        }
        confirmText="Đồng ý"
        variant={confirmState.type === "open" ? "success" : "danger"}
        loading={periodLoading}
      />
    </Box>
  );
}
