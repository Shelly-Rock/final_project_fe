"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Grid,
  Card as MuiCard,
  CircularProgress,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { PageHeader } from "@/shared/components";
import { ArrowLeft, Plus, Download } from "lucide-react";
import { toast } from "sonner";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import {
  departmentService,
  DepartmentSecretaryDetail,
} from "../services/department.service";

const STATUS_COLORS = {
  completed: "#10b981",
  pending: "#f59e0b",
  rejected: "#ef4444",
};

interface StatCardProps {
  label: string;
  value: number;
  bgColor: string;
  textColor: string;
  unit?: string;
}

const StatCard = ({
  label,
  value,
  bgColor,
  textColor,
  unit,
}: StatCardProps) => (
  <MuiCard
    elevation={0}
    sx={{
      border: "1px solid",
      borderColor: "divider",
      borderRadius: 2,
      p: 3,
      background:
        "linear-gradient(135deg, rgba(15, 23, 42, 0.5) 0%, rgba(30, 58, 138, 0.2) 100%)",
      backdropFilter: "blur(10px)",
      transition: "all 0.3s ease",
      "&:hover": {
        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        transform: "translateY(-2px)",
      },
    }}
  >
    <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
      {label}
    </Typography>
    <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          color: textColor,
          fontSize: { xs: "28px", sm: "32px" },
        }}
      >
        {value}
      </Typography>
      {unit && (
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {unit}
        </Typography>
      )}
    </Box>
    <Box
      sx={{
        mt: 2,
        height: "3px",
        borderRadius: "2px",
        background: `linear-gradient(90deg, ${bgColor} 0%, ${bgColor}33 100%)`,
      }}
    />
  </MuiCard>
);

export const DepartmentDetailSecretary = () => {
  const router = useRouter();
  const params = useParams();
  const departmentId = params.id as string;

  const [department, setDepartment] =
    useState<DepartmentSecretaryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [openAddTopic, setOpenAddTopic] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data =
          await departmentService.getDepartmentSecretaryDetail(departmentId);
        setDepartment(data);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Không tải được dữ liệu";
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [departmentId]);

  if (loading) {
    return (
      <Box sx={{ p: 3, display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!department) {
    return (
      <Box sx={{ p: 3 }}>
        <Button
          startIcon={<ArrowLeft size={20} />}
          onClick={() => router.back()}
        >
          Quay lại
        </Button>
        <Typography color="error">Không tìm thấy dữ liệu</Typography>
      </Box>
    );
  }

  const chartData = [
    { name: "Đã hoàn thành", value: department.completedTopics },
    { name: "Chờ nghiệm thu", value: department.pendingApprovalTopics },
    { name: "Chậm tiến độ", value: department.delayedTopics },
  ];

  const approvalRate =
    department.totalTopics > 0
      ? Math.round((department.completedTopics / department.totalTopics) * 100)
      : 0;

  return (
    <Box sx={{ width: "100%" }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowLeft size={20} />}
          onClick={() => router.back()}
          sx={{ mb: 2 }}
        >
          Quay lại
        </Button>
        <Box
          sx={{
            p: 3,
            borderRadius: 2,
            background:
              "linear-gradient(135deg, rgba(15, 23, 42, 0.75) 0%, rgba(30, 58, 138, 0.45) 50%, rgba(15, 23, 42, 0.85) 100%)",
            border: "1px solid",
            borderColor: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(16px)",
          }}
        >
          <Grid container spacing={3} alignItems="flex-start">
            <Grid item xs={12} sm="auto">
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: 2,
                  background:
                    "linear-gradient(to br, rgba(59, 130, 246, 0.3) 0%, rgba(99, 102, 241, 0.3) 100%)",
                  border: "2px solid",
                  borderColor: "rgba(255,255,255,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "32px",
                    color: "#3b82f6",
                  }}
                >
                  🏢
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm>
              <Box sx={{ mb: 1 }}>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 1 }}>
                  <Box
                    sx={{
                      px: 2.5,
                      py: 0.75,
                      borderRadius: "9999px",
                      bgcolor: "rgba(16, 185, 129, 0.1)",
                      border: "1px solid rgba(16, 185, 129, 0.3)",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        bgcolor: "#10b981",
                      }}
                    />
                    <Typography
                      sx={{
                        fontSize: "12px",
                        color: "#10b981",
                        fontWeight: 600,
                      }}
                    >
                      Đang hoạt động
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      px: 2.5,
                      py: 0.75,
                      borderRadius: "9999px",
                      bgcolor: "rgba(148, 163, 184, 0.1)",
                      border: "1px solid rgba(148, 163, 184, 0.3)",
                    }}
                  >
                    <Typography sx={{ fontSize: "12px", color: "#94a3b8" }}>
                      Mã BM: {department.departmentCode}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {department.departmentName}
              </Typography>
              <Typography sx={{ color: "text.secondary", maxWidth: 400 }}>
                Cổng quản lý, theo dõi thống kê và báo cáo tiến độ đề tài NCKH,
                đồ án chuyên ngành cấp khoa.
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              sm="auto"
              sx={{
                display: "flex",
                gap: 1,
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <Button
                variant="outlined"
                startIcon={<Download size={18} />}
                sx={{ borderColor: "divider", color: "text.secondary" }}
              >
                Xuất báo cáo
              </Button>
              <Button
                variant="contained"
                startIcon={<Plus size={18} />}
                onClick={() => setOpenAddTopic(true)}
              >
                Thêm đề tài
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Stat Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="Giảng viên"
            value={department.totalTeachers}
            bgColor="#a78bfa"
            textColor="#a78bfa"
            unit="thành viên"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="Tổng đề tài"
            value={department.totalTopics}
            bgColor="#06b6d4"
            textColor="#06b6d4"
            unit="đạt chuẩn"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="Tổng báo cáo"
            value={department.totalReports}
            bgColor="#3b82f6"
            textColor="#3b82f6"
            unit="hàng tháng"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="Chờ duyệt"
            value={department.pendingApprovals}
            bgColor="#f59e0b"
            textColor="#f59e0b"
            unit="ổn định"
          />
        </Grid>
      </Grid>

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* Left: Topic Distribution */}
        <Grid item xs={12} md={5}>
          <MuiCard
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              p: 3,
              height: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                  Phân bổ tỷ lệ đề tài
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Tỷ lệ hoàn thành theo kế hoạch học kỳ
                </Typography>
              </Box>
              <Box
                sx={{
                  px: 2,
                  py: 0.75,
                  borderRadius: "9999px",
                  bgcolor: "rgba(16, 185, 129, 0.1)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                }}
              >
                <Typography
                  sx={{ fontSize: "12px", color: "#10b981", fontWeight: 600 }}
                >
                  {approvalRate}% Hoàn tất
                </Typography>
              </Box>
            </Box>

            {/* Donut Chart */}
            <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
              <ResponsiveContainer width={220} height={220}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                    label={false}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={Object.values(STATUS_COLORS)[index]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </Box>

            {/* Legend */}
            <Box sx={{ space: 2 }}>
              {chartData.map((item, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 1.5,
                    borderRadius: 1,
                    bgcolor: "rgba(255,255,255,0.02)",
                    border: "1px solid",
                    borderColor: "divider",
                    mb: 1,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        bgcolor: Object.values(STATUS_COLORS)[idx],
                      }}
                    />
                    <Typography variant="body2">{item.name}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {item.value} đề tài
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: Object.values(STATUS_COLORS)[idx] }}
                    >
                      ({Math.round((item.value / department.totalTopics) * 100)}
                      %)
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Bottom Stats */}
            <Grid
              container
              spacing={1.5}
              sx={{
                mt: 2,
                pt: 2,
                borderTop: "1px solid",
                borderColor: "divider",
              }}
            >
              <Grid item xs={6}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 1,
                    bgcolor: "rgba(255,255,255,0.02)",
                    textAlign: "center",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary", display: "block", mb: 0.5 }}
                  >
                    Giảng viên hướng dẫn
                  </Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: "16px" }}>
                    {department.totalTeachers} giảng viên
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 1,
                    bgcolor: "rgba(255,255,255,0.02)",
                    textAlign: "center",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary", display: "block", mb: 0.5 }}
                  >
                    Hiệu suất bộ môn
                  </Typography>
                  <Typography
                    sx={{ fontWeight: 700, color: "#06b6d4", fontSize: "16px" }}
                  >
                    Tối ưu (Hạng A+)
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </MuiCard>
        </Grid>

        {/* Right: Monthly Reports & Topics */}
        <Grid
          item
          xs={12}
          md={7}
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          {/* Monthly Reports */}
          <MuiCard
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              p: 3,
              minHeight: 200,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                  Tiến độ báo cáo theo tháng
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Chu kỳ cập nhật báo cáo định kỳ năm 2024
                </Typography>
              </Box>
              <TextField
                select
                size="small"
                defaultValue="2024-2025"
                sx={{ width: 180 }}
                SelectProps={{
                  native: true,
                }}
              >
                <option value="2024-2025">Năm học 2024 - 2025</option>
                <option value="2023-2024">Năm học 2023 - 2024</option>
              </TextField>
            </Box>

            {/* Empty State */}
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 1,
                border: "2px dashed",
                borderColor: "divider",
                py: 4,
              }}
            >
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  bgcolor: "rgba(59, 130, 246, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                  color: "#3b82f6",
                  fontSize: "24px",
                }}
              >
                📋
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                Chưa có dữ liệu báo cáo tháng này
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  textAlign: "center",
                  maxWidth: 300,
                }}
              >
                Kỳ báo cáo định kỳ tiếp theo sẽ mở vào ngày 25 hàng tháng cho
                toàn thể giảng viên thuộc bộ môn.
              </Typography>
            </Box>
          </MuiCard>

          {/* Topics List */}
          <MuiCard
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              p: 3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                  Danh sách đề tài trực thuộc
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {department.totalTopics} đề tài nghiên cứu đã được phê duyệt
                </Typography>
              </Box>
              <Button size="small" sx={{ color: "#3b82f6" }}>
                Xem tất cả →
              </Button>
            </Box>

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow
                    sx={{
                      bgcolor: "rgba(255,255,255,0.02)",
                      borderBottom: "2px solid",
                      borderColor: "divider",
                    }}
                  >
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        fontSize: "12px",
                        textTransform: "uppercase",
                      }}
                    >
                      Tên đề tài & Mã số
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        fontSize: "12px",
                        textTransform: "uppercase",
                      }}
                    >
                      Cán bộ hướng dẫn
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: 700,
                        fontSize: "12px",
                        textTransform: "uppercase",
                      }}
                    >
                      Tiến độ
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        fontWeight: 700,
                        fontSize: "12px",
                        textTransform: "uppercase",
                      }}
                    >
                      Thao tác
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {department.topics && department.topics.length > 0 ? (
                    department.topics.map((topic, idx) => (
                      <TableRow
                        key={idx}
                        sx={{
                          borderBottom: "1px solid",
                          borderColor: "divider",
                          "&:hover": { bgcolor: "rgba(255,255,255,0.02)" },
                        }}
                      >
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {topic.name}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: "text.secondary" }}
                          >
                            Mã: {topic.code}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {topic.instructorName}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: "text.secondary" }}
                          >
                            {topic.instructorRole}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Box
                            sx={{
                              display: "inline-flex",
                              alignItems: "center",
                              px: 1.5,
                              py: 0.5,
                              borderRadius: "9999px",
                              bgcolor: "rgba(16, 185, 129, 0.1)",
                              border: "1px solid rgba(16, 185, 129, 0.3)",
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{ color: "#10b981", fontWeight: 600 }}
                            >
                              {topic.completionPercentage}% Hoàn thành
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            size="small"
                            sx={{
                              p: 0.5,
                              minWidth: "auto",
                              color: "text.secondary",
                            }}
                          >
                            →
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        align="center"
                        sx={{ py: 3, color: "text.secondary" }}
                      >
                        Chưa có đề tài nào
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </MuiCard>
        </Grid>
      </Grid>

      {/* Add Topic Dialog */}
      <Dialog
        open={openAddTopic}
        onClose={() => setOpenAddTopic(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Thêm đề tài mới</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Tên đề tài"
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Mã đề tài"
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Giảng viên hướng dẫn"
            variant="outlined"
            size="small"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddTopic(false)}>Hủy</Button>
          <Button variant="contained" onClick={() => setOpenAddTopic(false)}>
            Thêm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
