"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Table as MuiTable,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  CircularProgress,
  Chip,
} from "@mui/material";
import { PageHeader } from "@/shared/components";
import { Building2 } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "@/shared/theme";
import { apiClient } from "@/shared/services/api-client";

interface DepartmentStats {
  department_id: number;
  department_name: string;
  teachers: number;
  projects: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}

export default function DepartmentPage() {
  const { resolvedMode } = useTheme();
  const isDark = resolvedMode === "dark";
  const [departments, setDepartments] = useState<DepartmentStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get<{ data: DepartmentStats[] }>("/dashboard/department");
        setDepartments(response.data || []);
      } catch (e: unknown) {
        const msg =
          e instanceof Error ? e.message : "Không tải được dữ liệu khoa";
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 3, display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, width: "100%" }}>
      <PageHeader
        title="Dashboard Khoa"
        subtitle="Thống kê giảng viên và đề tài theo khoa"
        illustration={<Building2 size={56} strokeWidth={1.5} />}
        showBgImage
      />

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: isDark ? "#334155" : "#e2e8f0",
          borderRadius: 2,
        }}
      >
        <MuiTable size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: isDark ? "#1e293b" : "#f8fafc" }}>
              <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Khoa</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="center">
                Giảng viên
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="center">
                Tổng đề tài
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="center">
                Chờ duyệt
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="center">
                Đã duyệt
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="center">
                Từ chối
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {departments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">Chưa có dữ liệu</Typography>
                </TableCell>
              </TableRow>
            ) : (
              departments.map((dept) => (
                <TableRow key={dept.department_id} hover>
                  <TableCell>{dept.department_id}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {dept.department_name}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={dept.teachers}
                      size="small"
                      sx={{
                        bgcolor: "#8b5cf6",
                        color: "#fff",
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={dept.projects.total}
                      size="small"
                      sx={{
                        bgcolor: "#6b7280",
                        color: "#fff",
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={dept.projects.pending}
                      size="small"
                      sx={{
                        bgcolor: "#f59e0b",
                        color: "#fff",
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={dept.projects.approved}
                      size="small"
                      sx={{
                        bgcolor: "#10b981",
                        color: "#fff",
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={dept.projects.rejected}
                      size="small"
                      sx={{
                        bgcolor: "#ef4444",
                        color: "#fff",
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </MuiTable>
      </TableContainer>
    </Box>
  );
}
