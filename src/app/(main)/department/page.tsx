"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Grid,
  Card as MuiCard,
  CardActionArea,
  CircularProgress,
  Typography,
} from "@mui/material";
import { PageHeader } from "@/shared/components";
import { RoleGate } from "@/shared/components/PermissionGuard/PermissionGuard";
import { Building2 } from "lucide-react";
import { toast } from "sonner";
import {
  departmentService,
  DepartmentSummary,
} from "@/feature/dashboard/services/department.service";

export default function DepartmentPage() {
  const router = useRouter();
  const [departments, setDepartments] = useState<DepartmentSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await departmentService.getDepartments();
        setDepartments(data);
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

  const handleCardClick = (departmentId: string) => {
    router.push(`/department/${encodeURIComponent(departmentId)}`);
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <RoleGate
      roles={["admin", "secretary"]}
      fallback={
        <Box sx={{ p: 3, width: "100%", textAlign: "center" }}>
          <Typography variant="h6" color="error">
            Bạn không có quyền truy cập trang này
          </Typography>
        </Box>
      }
    >
      <Box sx={{ p: 3, width: "100%" }}>
        <PageHeader
          title="Dashboard Khoa"
          subtitle="Quản lý và theo dõi thống kê các khoa"
          illustration={<Building2 size={56} strokeWidth={1.5} />}
          showBgImage
        />

        {departments.length === 0 ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography color="text.secondary">Chưa có dữ liệu khoa</Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {departments.map((dept) => (
              <Grid item xs={12} sm={6} md={4} key={dept.department_id}>
                <MuiCard
                  elevation={0}
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                    height: "100%",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <CardActionArea
                    onClick={() => handleCardClick(dept.department_id)}
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Box sx={{ p: 3, width: "100%", flexGrow: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                        {dept.department_name}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                        <StatRow
                          label="Giảng viên"
                          value={dept.teachers}
                          color="#8b5cf6"
                        />
                        <StatRow
                          label="Tổng đề tài"
                          value={dept.projects.total}
                          color="#6b7280"
                        />
                        <StatRow
                          label="Chờ duyệt"
                          value={dept.projects.pending}
                          color="#f59e0b"
                        />
                        <StatRow
                          label="Đã duyệt"
                          value={dept.projects.approved}
                          color="#10b981"
                        />
                        <StatRow
                          label="Từ chối"
                          value={dept.projects.rejected}
                          color="#ef4444"
                        />
                      </Box>
                    </Box>
                  </CardActionArea>
                </MuiCard>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </RoleGate>
  );
}

function StatRow({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        py: 0.5,
        px: 1,
        borderRadius: 1,
        bgcolor: "action.hover",
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 700, color }}>
        {value}
      </Typography>
    </Box>
  );
}
