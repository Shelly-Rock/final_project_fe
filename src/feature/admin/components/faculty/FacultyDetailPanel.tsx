"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Box, Chip, Skeleton, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  BookOpen,
  CheckCircle2,
  FileText,
  Users,
} from "lucide-react";
import { adminDashboardService } from "@/feature/dashboard/services/admin-dashboard.service";
import { getCardBackground } from "@/shared/constants/gradients";

interface Props {
  facultyId: string;
  onBack: () => void;
}

const STATUS_COLOR = {
  PENDING: "#eda100",
  APPROVED: "#1baf7a",
  REJECTED: "#e34948",
} as const;

export function FacultyDetailPanel({ facultyId, onBack }: Props) {
  const router = useRouter();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-faculty-detail", facultyId],
    queryFn: () => adminDashboardService.getFacultyDetail(facultyId),
  });

  const completionRate = useMemo(() => {
    if (!data) return 0;
    const { total, approved } = data.summary.projects;
    return total ? Math.round((approved / total) * 100) : 0;
  }, [data]);

  const cardSx = {
    p: 2.5,
    borderRadius: "18px",
    border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "#e2e8f0"}`,
    bgcolor: "background.paper",
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          gap: 2.5,
          flexDirection: { xs: "column", lg: "row" },
        }}
      >
        <Skeleton variant="rounded" width={300} height={420} />
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          <Skeleton variant="rounded" height={140} />
          <Skeleton variant="rounded" height={300} />
        </Box>
      </Box>
    );
  }

  if (isError || !data) {
    return (
      <Box sx={cardSx}>
        <Typography color="error" sx={{ fontWeight: 700, mb: 2 }}>
          Không tải được dữ liệu khoa
        </Typography>
        <Box
          component="button"
          onClick={onBack}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            border: "none",
            background: "none",
            color: "primary.main",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          <ArrowLeft size={18} /> Quay lại
        </Box>
      </Box>
    );
  }

  const { projects } = data.summary;

  const kpis = [
    {
      label: "Đề tài",
      value: projects.total,
      icon: <BookOpen size={18} />,
      color: "#2a78d6",
    },
    {
      label: "Đã duyệt",
      value: projects.approved,
      icon: <CheckCircle2 size={18} />,
      color: "#1baf7a",
    },
    {
      label: "Chờ duyệt",
      value: projects.pending,
      icon: <AlertTriangle size={18} />,
      color: "#eda100",
    },
    {
      label: "Từ chối",
      value: projects.rejected,
      icon: <FileText size={18} />,
      color: "#e34948",
    },
  ];

  const breakdown = [
    { label: "Đã duyệt", value: projects.approved, color: STATUS_COLOR.APPROVED },
    { label: "Chờ duyệt", value: projects.pending, color: STATUS_COLOR.PENDING },
    { label: "Từ chối", value: projects.rejected, color: STATUS_COLOR.REJECTED },
  ];

  return (
    <Box sx={{ display: "grid", gap: 2.5 }}>
      {/* ===== Header khoa ===== */}
      <Box
        sx={{
          ...cardSx,
          background: getCardBackground(theme),
          color: isDark ? "#fff" : "text.primary",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box
            role="button"
            tabIndex={0}
            onClick={onBack}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onBack();
              }
            }}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 700,
              opacity: 0.8,
              mb: 1.5,
              "&:hover": { opacity: 1, color: "#2a78d6" },
            }}
          >
            <ArrowLeft size={16} /> Quay lại
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            {data.faculty.is_active ? (
              <Chip
                icon={<CheckCircle2 size={14} />}
                label="Hoạt động"
                size="small"
                sx={{
                  fontWeight: 800,
                  bgcolor: isDark ? "rgba(255,255,255,0.08)" : "#ecfdf5",
                  color: "#1baf7a",
                  "& .MuiChip-icon": { color: "inherit" },
                }}
              />
            ) : (
              <Chip
                icon={<AlertTriangle size={14} />}
                label="Tạm ngưng"
                size="small"
                sx={{
                  fontWeight: 800,
                  bgcolor: isDark ? "rgba(255,255,255,0.08)" : "#fffbeb",
                  color: "#eda100",
                  "& .MuiChip-icon": { color: "inherit" },
                }}
              />
            )}
          </Box>
        </Box>

        <Typography sx={{ fontWeight: 800, fontSize: 22 }}>
          {data.faculty.name}
        </Typography>
        <Typography sx={{ fontSize: 13, opacity: 0.75, mt: 0.3 }}>
          Mã khoa: {data.faculty.id}
        </Typography>
        {data.faculty.description && (
          <Typography sx={{ fontSize: 13, opacity: 0.7, mt: 0.8 }}>
            {data.faculty.description}
          </Typography>
        )}
      </Box>

      {/* ===== KPI ===== */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0,1fr))",
            xl: "repeat(4, minmax(0,1fr))",
          },
          gap: 2,
        }}
      >
        {kpis.map((k) => (
          <Box key={k.label} sx={{ ...cardSx, p: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Typography sx={{ fontSize: 12.5, color: "text.secondary" }}>
                {k.label}
              </Typography>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 1.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: k.color,
                  bgcolor: `${k.color}15`,
                }}
              >
                {k.icon}
              </Box>
            </Box>
            <Typography sx={{ fontSize: 28, fontWeight: 800, lineHeight: 1 }}>
              {k.value}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
          gap: 2,
        }}
      >
        {/* ===== Tiến độ đề tài ===== */}
        <Box sx={cardSx}>
          <Typography sx={{ fontWeight: 800, fontSize: 16, mb: 2 }}>
            Tiến độ đề tài
          </Typography>

          <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, mb: 1 }}>
            <Typography sx={{ fontSize: 34, fontWeight: 900, lineHeight: 1 }}>
              {completionRate}%
            </Typography>
            <Typography sx={{ fontSize: 12.5, color: "text.secondary" }}>
              {projects.approved}/{projects.total} đã duyệt
            </Typography>
          </Box>

          <Box
            sx={{
              height: 10,
              borderRadius: 999,
              bgcolor: isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0",
              overflow: "hidden",
              mb: 2,
            }}
          >
            <Box
              sx={{
                width: `${completionRate}%`,
                height: "100%",
                bgcolor: STATUS_COLOR.APPROVED,
                borderRadius: 999,
              }}
            />
          </Box>

          <Box sx={{ display: "grid", gap: 1 }}>
            {breakdown.map((b) => {
              const pct = projects.total
                ? Math.round((b.value / projects.total) * 100)
                : 0;
              return (
                <Box key={b.label}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 12.5,
                      mb: 0.4,
                    }}
                  >
                    <span style={{ color: b.color, fontWeight: 700 }}>
                      {b.label}
                    </span>
                    <span style={{ color: "text.secondary" }}>
                      {b.value} · {pct}%
                    </span>
                  </Box>
                  <Box
                    sx={{
                      height: 6,
                      borderRadius: 999,
                      bgcolor: isDark
                        ? "rgba(255,255,255,0.1)"
                        : "#e2e8f0",
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        width: `${pct}%`,
                        height: "100%",
                        bgcolor: b.color,
                        borderRadius: 999,
                      }}
                    />
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* ===== Nhân sự & báo cáo ===== */}
        <Box sx={cardSx}>
          <Typography sx={{ fontWeight: 800, fontSize: 16, mb: 2 }}>
            Nhân sự &amp; báo cáo
          </Typography>

          <Box sx={{ display: "grid", gap: 1.5 }}>
            {[
              {
                label: "Giảng viên",
                value: data.summary.teacher_count,
                icon: <Users size={17} />,
                color: "#8b5cf6",
              },
              {
                label: "Đề tài đã đăng ký",
                value: data.summary.topic_count,
                icon: <BookOpen size={17} />,
                color: "#2a78d6",
              },
              {
                label: "Báo cáo tiến trình",
                value: data.summary.report_count,
                icon: <FileText size={17} />,
                color: "#eb6834",
              },
            ].map((row) => (
              <Box
                key={row.label}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 1.5,
                  borderRadius: "12px",
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "#e2e8f0"}`,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: 1.5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: row.color,
                      bgcolor: `${row.color}15`,
                    }}
                  >
                    {row.icon}
                  </Box>
                  <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                    {row.label}
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: 20, fontWeight: 800 }}>
                  {row.value}
                </Typography>
              </Box>
            ))}
          </Box>

          <Box
            onClick={() =>
              router.push(
                `/department/faculties?facultyId=${encodeURIComponent(facultyId)}`,
              )
            }
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                router.push(
                  `/department/faculties?facultyId=${encodeURIComponent(facultyId)}`,
                );
              }
            }}
            sx={{
              mt: 2,
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 700,
              color: "#2a78d6",
            }}
          >
            <BarChart3 size={15} /> Quản lý khoa
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default FacultyDetailPanel;
