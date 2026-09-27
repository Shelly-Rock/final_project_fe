"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Chip,
  IconButton,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  FileText,
  Pencil,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { adminDashboardService } from "@/feature/dashboard/services/admin-dashboard.service";
import { departmentService as adminDepartmentService } from "@/feature/admin/services";
import type { Department } from "@/feature/admin/services";
import { facultyService } from "@/feature/admin/services";
import { getCardBackground } from "@/shared/constants/gradients";
import { useUserRole } from "@/shared/hooks/useUserRole";
import { DepartmentFormDialog } from "./DepartmentFormDialog";

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
  const userRole = useUserRole();
  const isAdmin = userRole === "admin";
  const queryClient = useQueryClient();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Department | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-faculty-detail", facultyId],
    queryFn: () => adminDashboardService.getFacultyDetail(facultyId),
  });

  // Danh sách khoa để chọn khi tạo bộ môn
  const { data: faculties = [] } = useQuery({
    queryKey: ["admin-faculties"],
    queryFn: () => facultyService.getAll(),
  });

  const facultyOptions = useMemo(
    () => faculties.map((f) => ({ id: f.id, name: f.name })),
    [faculties],
  );

  // Số liệu từng bộ môn lấy trực tiếp từ endpoint quản lý (đọc được
  // ngay sau khi thêm/sửa/xóa mà không phải chờ dashboard).
  const { data: crudDepartments = [] } = useQuery({
    queryKey: ["admin-departments", facultyId],
    queryFn: () => adminDepartmentService.getAll(facultyId),
  });

  const invalidateAll = async () => {
    await Promise.all(
      [
        "admin-faculty-detail",
        "admin-faculty-stats",
        "admin-departments",
        "admin-faculties",
        "admin-department-stats",
        "admin-dashboard",
      ].map((key) => queryClient.invalidateQueries({ queryKey: [key] })),
    );
  };

  const saveMutation = useMutation({
    mutationFn: (payload: { id?: string; name: string; facultyId: string }) =>
      editing
        ? adminDepartmentService.update(editing.id, {
            name: payload.name,
            facultyId: payload.facultyId,
          })
        : adminDepartmentService.create({
            id: payload.id as string,
            name: payload.name,
            facultyId: payload.facultyId,
          }),
    onSuccess: async () => {
      toast.success(
        editing ? "Cập nhật bộ môn thành công" : "Tạo bộ môn thành công",
      );
      setFormOpen(false);
      setEditing(null);
      await invalidateAll();
    },
    onError: (error: Error) =>
      toast.error(error.message || "Thao tác thất bại"),
  });

  const deleteMutation = useMutation({
    mutationFn: (deptId: string) => adminDepartmentService.delete(deptId),
    onSuccess: async () => {
      toast.success("Đã xóa bộ môn");
      await invalidateAll();
    },
    onError: (error: Error) =>
      toast.error(error.message || "Xóa bộ môn thất bại"),
  });

  const handleSubmit = async (payload: {
    id?: string;
    name: string;
    facultyId: string;
  }) => {
    setSubmitting(true);
    try {
      await saveMutation.mutateAsync(payload);
    } catch {
      // toast đã hiển thị trong onError
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (dept: Department) => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa bộ môn "${dept.name}"?\n\nChỉ có thể xóa bộ môn chưa có giảng viên hoặc thư ký.`,
    );
    if (!confirmed) return;
    await deleteMutation.mutateAsync(dept.id).catch(() => undefined);
  };

  // Ưu tiên danh sách từ endpoint quản lý (mới nhất), fallback về data tổng hợp
  const departments = useMemo(() => {
    if (crudDepartments.length > 0) {
      return crudDepartments.map((d) => {
        const stat = data?.departments.find((x) => x.id === d.id);
        return {
          id: d.id,
          name: d.name,
          teachers: stat?.teachers ?? 0,
          approved: stat?.projects.approved ?? 0,
          pending: stat?.projects.pending ?? 0,
          total: stat?.projects.total ?? 0,
        };
      });
    }
    return (data?.departments ?? []).map((d) => ({
      id: d.id,
      name: d.name,
      teachers: d.teachers,
      approved: d.projects.approved,
      pending: d.projects.pending,
      total: d.projects.total,
    }));
  }, [crudDepartments, data]);

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

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Typography
            sx={{
              fontSize: 11.5,
              fontWeight: 800,
              letterSpacing: 0.6,
              textTransform: "uppercase",
              color: "text.secondary",
            }}
          >
            Bộ môn ({departments.length})
          </Typography>
          {isAdmin && (
            <Box
              component="button"
              onClick={() => {
                setEditing(null);
                setFormOpen(true);
              }}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                border: "1px solid #2a78d6",
                color: "#2a78d6",
                background: "transparent",
                borderRadius: "8px",
                padding: "4px 8px",
                fontSize: 11.5,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              <Plus size={13} /> Thêm
            </Box>
          )}
        </Box>

        <Box sx={{ display: "grid", gap: 0.75 }}>
          {departments.map((dept) => {
            const { approved, total, pending, teachers } = dept;
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
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontFamily: "monospace",
                        color: "#94a3b8",
                      }}
                    >
                      {dept.id}
                    </span>
                    {isAdmin && (
                      <>
                        <Tooltip title="Sửa">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditing({
                                id: dept.id,
                                name: dept.name,
                                facultyId: facultyId,
                              });
                              setFormOpen(true);
                            }}
                          >
                            <Pencil size={13} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete({
                                id: dept.id,
                                name: dept.name,
                                facultyId: facultyId,
                              });
                            }}
                          >
                            <Trash2 size={13} />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </Box>
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
                  <span>GV: {teachers}</span>
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

          {departments.length === 0 && (
            <Typography sx={{ fontSize: 12.5, color: "text.secondary" }}>
              Khoa chưa có bộ môn nào. {isAdmin && "Bấm “Thêm” để tạo bộ môn."}
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
                {departments.map((dept) => (
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
                        {dept.approved}
                      </span>
                      <span style={{ opacity: 0.6 }}>/{dept.total}</span>
                    </td>
                    <td
                      style={{
                        padding: "10px 12px",
                        color: STATUS_COLOR.PENDING,
                        fontWeight: 600,
                      }}
                    >
                      {dept.pending}
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

      <DepartmentFormDialog
        open={formOpen}
        department={editing}
        faculties={facultyOptions}
        loading={submitting}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
      />
    </Box>
  );
}

export default FacultyDetailPanel;
