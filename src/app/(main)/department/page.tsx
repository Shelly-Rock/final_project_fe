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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { PageHeader } from "@/shared/components";
import { RoleGate } from "@/shared/components/PermissionGuard/PermissionGuard";
import { Building2, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";
import {
  departmentService,
  DepartmentSummary,
} from "@/feature/dashboard/services/department.service";
import { useUserRole } from "@/shared/hooks/useUserRole";

export default function DepartmentPage() {
  const router = useRouter();
  const userRole = useUserRole();
  const [departments, setDepartments] = useState<DepartmentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [newDeptName, setNewDeptName] = useState("");

  useEffect(() => {
    // Redirect secretary directly to their department
    if (userRole === "secretary") {
      router.push("/department/BM_KTPM");
      return;
    }

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
  }, [userRole, router]);

  const handleCardClick = (departmentId: string) => {
    router.push(`/department/${encodeURIComponent(departmentId)}`);
  };

  const handleAddDepartment = async () => {
    if (!newDeptName.trim()) {
      toast.error("Vui lòng nhập tên khoa");
      return;
    }
    // TODO: Implement API call to create department
    toast.success(`Thêm khoa "${newDeptName}" thành công`);
    setNewDeptName("");
    setOpenDialog(false);
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
        <Box sx={{ mb: 3 }}>
          <PageHeader
            title="Dashboard Khoa"
            subtitle="Quản lý và theo dõi thống kê các khoa"
            illustration={<Building2 size={56} strokeWidth={1.5} />}
            showBgImage
            actions={
              userRole === "admin" && (
                <Button
                  variant="contained"
                  startIcon={<Plus size={20} />}
                  onClick={() => setOpenDialog(true)}
                >
                  Thêm khoa mới
                </Button>
              )
            }
          />
        </Box>
        {departments.length === 0 ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography color="text.secondary">Chưa có dữ liệu khoa</Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {departments.map((dept) => {
              const chartData = [
                { name: "Chờ duyệt", value: dept.projects.pending },
                { name: "Đã duyệt", value: dept.projects.approved },
                { name: "Từ chối", value: dept.projects.rejected },
              ];
              const COLORS = ["#f59e0b", "#10b981", "#ef4444"];

              return (
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
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 700, mb: 2 }}
                        >
                          {dept.department_name}
                        </Typography>

                        {/* Pie Chart */}
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            mb: 2,
                          }}
                        >
                          <ResponsiveContainer width={180} height={180}>
                            <PieChart>
                              <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={35}
                                outerRadius={60}
                                paddingAngle={2}
                                dataKey="value"
                                label={({ value }) => value}
                                labelLine={false}
                              >
                                {chartData.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                  />
                                ))}
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                        </Box>

                        {/* Summary Stats */}
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                          }}
                        >
                          <StatRow
                            label="Giảng viên"
                            value={dept.teachers}
                            color="#2563EB"
                          />
                          <StatRow
                            label="Tổng đề tài"
                            value={dept.projects.total}
                            color="#2563EB"
                          />
                        </Box>
                      </Box>
                    </CardActionArea>
                  </MuiCard>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>

      {/* Add Department Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Thêm khoa mới</DialogTitle>
        <DialogContent sx={{ minWidth: 400 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Tên khoa"
            fullWidth
            variant="outlined"
            value={newDeptName}
            onChange={(e) => setNewDeptName(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button onClick={handleAddDepartment} variant="contained">
            Thêm
          </Button>
        </DialogActions>
      </Dialog>
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
