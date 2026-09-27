"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Box, Chip, Skeleton, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ClipboardList,
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
        <Skeleton variant="rounded" width={300} height={520} />
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          <Skeleton variant="rounded" height={140} />
          <Skeleton variant="rounded" height={360} />
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

  const kpis = [
    {
      label: "Bộ môn",
      value: data.summary.department_count,
      icon: <ClipboardList size={18} />,
      color: "#2a78d6",
    },
    {
      label: "Giảng viên",
      value: data.summary.teacher_count,
      icon: <Users size={18} />,
      color: "#8b5cf6",
    },
    {
      label: "Đề tài",
      value: data.summary.projects.total,
      icon: <BookOpen size={18} />,
      color: "#1baf7a",
    },
    {
      label: "Báo cáo",
      value: data.summary.report_count,
      icon: <FileText size={18} />,
      color: "#eb6834",
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", lg: "row" },
        gap: 2.5,
        alignItems: "flex-start",
      }}
    >
      {/* ============ SIDEBAR: danh sách bộ môn của khoa ============ */}
      <Box
        component="aside"
        sx={{
          width: { xs: "100%", lg: 300 },
          flexShrink: 0,
          ...cardSx,
          p: 2,
          position: { lg: "sticky" },
          top: { lg: 88 },
          maxHeight: { lg: "calc(100vh - 120px)" },
          overflowY: "auto",
        }}
      >
        <Box
          onClick={onBack}
          role="button"
          tabIndex={0}
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
            color: "text.secondary",
            fontWeight: 700,
            fontSize: 13,
            mb: 1.5,
            "&:hover": { color: "primary.main" },
          }}
        >
          <ArrowLeft size={16} /> Quay lại
        </Box>

        <Typography sx={{ fontWeight: 800, fontSize: 16, mb: 0.5 }}>
          {data.faculty.name}
        </Typography>
        <Typography sx={{ fontSize: 12, color: "text.secondary", mb: 2 }}>
          Mã khoa: {data.faculty.id}
        </Typography>

        <Box
          sx={{
            px: 1.5,
            py: 1,
            mb: 1.5,
            borderRadius: "12px",
            bgcolor: isDark ? "rgba(255,255,255,0.06)" : "#f8fafc",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "#e2e8f0"}`,
          }}
        >
          <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
            Tiến độ đề tài
          </Typography>
          <Box
            sx={{ display: "flex", alignItems: "baseline", gap: 1, mt: 0.4 }}
          >
            <Typography sx={{ fontSize: 22, fontWeight: 900, lineHeight: 1 }}>
              {completionRate}%
            </Typography>
            <Typography sx={{ fontSize: 11.5, color: "text.secondary" }}>
              {data.summary.projects.approved}/{data.summary.projects.total} đã
              duyệt
            </Typography>
          </Box>
        </Box>

        <Typography
          sx={{
            fontSize: 11.5,
            fontWeight: 800,
            letterSpacing: 0.6,
            textTransform: "uppercase",
            color: "text.secondary",
            mb: 1,
          }}
        >
          Bộ môn ({data.departments.length})
        </Typography>

        <Box sx={{ display: "grid", gap: 0.75 }}>
          {data.departments.map((dept) => {
            const approved = dept.projects.approved ?? 0;
            const total = dept.projects.total ?? 0;
            const pct = total ? Math.round((approved / total) * 100) : 0;

            return (
              <Box
                key={dept.id}
                role="button"
                tabIndex={0}
                onClick={() =>
                  router.push(`/department/${encodeURIComponent(dept.id)}`)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    router.push(`/department/${encodeURIComponent(dept.id)}`);
                  }
                }}
                sx={{
                  p: 1.25,
                  borderRadius: "12px",
                  cursor: "pointer",
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "#e2e8f0"}`,
                  bgcolor: isDark ? "rgba(255,255,255,0.04)" : "#ffffff",
                  transition: "all .18s ease",
                  "&:hover": {
                    borderColor: "#2a78d6",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                  }}
                >
                  <Typography
                    sx={{ fontSize: 13, fontWeight: 700, lineHeight: 1.3 }}
                  >
                    {dept.name}
                  </Typography>
                  <span
                    style={{
                      fontSize: 11,
                      fontFamily: "monospace",
                      color: "#94a3b8",
                    }}
                  >
                    {dept.id}
                  </span>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mt: 0.75,
                    fontSize: 11.5,
                    color: "text.secondary",
                  }}
                >
                  <span>GV: {dept.teachers}</span>
                  <span>
                    ĐT: {approved}/{total}
                  </span>
                </Box>
                <Box
                  sx={{
                    mt: 0.75,
                    height: 4,
                    borderRadius: 999,
                    bgcolor: isDark ? "rgba(255,255,255,0.12)" : "#e2e8f0",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      width: `${pct}%`,
                      height: "100%",
                      bgcolor: "#1baf7a",
                      borderRadius: 999,
                    }}
                  />
                </Box>
              </Box>
            );
          })}

          {data.departments.length === 0 && (
            <Typography sx={{ fontSize: 12.5, color: "text.secondary" }}>
              Khoa chưa có bộ môn nào.
            </Typography>
          )}
        </Box>
      </Box>

      {/* ============ NỘI DUNG CHÍNH ============ */}
      <Box sx={{ flex: 1, minWidth: 0, display: "grid", gap: 2.5 }}>
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
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: 20 }}>
                {data.faculty.name}
              </Typography>
              <Typography sx={{ fontSize: 13, opacity: 0.75, mt: 0.3 }}>
                {data.faculty.description ||
                  "Chưa có mô tả. Bấm vào một bộ môn ở cột bên để xem chi tiết."}
              </Typography>
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
        </Box>

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

        <Box sx={cardSx}>
          <Typography sx={{ fontWeight: 800, fontSize: 16, mb: 2 }}>
            Bộ môn trong khoa
          </Typography>
          <Box sx={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 13.5,
              }}
            >
              <thead>
                <tr style={{ borderBottom: "2px solid #2563eb" }}>
                  {["Mã BM", "Tên bộ môn", "GV", "Đề tài", "Chờ duyệt", ""].map(
                    (h, i) => (
                      <th
                        key={h || i}
                        style={{
                          padding: "10px 12px",
                          textAlign: "left",
                          fontWeight: 700,
                          color: "#2563eb",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {data.departments.map((dept) => (
                  <tr
                    key={dept.id}
                    style={{ borderBottom: "1px solid #e2e8f0" }}
                  >
                    <td
                      style={{ padding: "10px 12px", fontFamily: "monospace" }}
                    >
                      {dept.id}
                    </td>
                    <td style={{ padding: "10px 12px", fontWeight: 600 }}>
                      {dept.name}
                    </td>
                    <td style={{ padding: "10px 12px" }}>{dept.teachers}</td>
                    <td style={{ padding: "10px 12px" }}>
                      <span
                        style={{
                          color: STATUS_COLOR.APPROVED,
                          fontWeight: 700,
                        }}
                      >
                        {dept.projects.approved ?? 0}
                      </span>
                      <span style={{ opacity: 0.6 }}>
                        /{dept.projects.total ?? 0}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "10px 12px",
                        color: STATUS_COLOR.PENDING,
                        fontWeight: 600,
                      }}
                    >
                      {dept.projects.pending ?? 0}
                    </td>
                    <td style={{ padding: "10px 12px", textAlign: "right" }}>
                      <Box
                        component="button"
                        onClick={() =>
                          router.push(
                            `/department/${encodeURIComponent(dept.id)}`,
                          )
                        }
                        sx={{
                          border: "1px solid #2a78d6",
                          color: "#2a78d6",
                          background: "transparent",
                          borderRadius: "8px",
                          padding: "4px 10px",
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        Xem chi tiết
                      </Box>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default FacultyDetailPanel;
