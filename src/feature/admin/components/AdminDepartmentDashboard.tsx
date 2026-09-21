"use client";

import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminDashboardService } from "@/feature/dashboard/services/admin-dashboard.service";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  CircularProgress,
  useTheme,
  Tabs,
  Tab,
  Pagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";

interface DepartmentCardData {
  id: string;
  name: string;
  abbr: string;
  totalProjects: number;
  totalStudents: number;
  teacherCount: number;
  councilCount: number;
  completionRate: number;
  stageDescription: string;
  stageCount: number;
  status: "on-time" | "delayed" | "warning";
  color: "error" | "primary" | "success" | "warning" | "info";
}

export const AdminDepartmentDashboard: React.FC = () => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { isLoading: statsLoading } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: () => adminDashboardService.getAdminStats(),
  });

  const { isLoading: deptLoading } = useQuery({
    queryKey: ["admin-department-stats"],
    queryFn: () => adminDashboardService.getDepartmentStats(),
  });

  const mockDepartments: DepartmentCardData[] = useMemo(() => {
    return [
      {
        id: "1",
        name: "CNTT & Truyền thông",
        abbr: "IT",
        totalProjects: 450,
        totalStudents: 580,
        teacherCount: 65,
        councilCount: 16,
        completionRate: 82,
        stageDescription: "Phản biện & Bảo vệ",
        stageCount: 320,
        status: "on-time",
        color: "primary",
      },
      {
        id: "2",
        name: "Điện - Điện Tử",
        abbr: "EE",
        totalProjects: 320,
        totalStudents: 390,
        teacherCount: 48,
        councilCount: 12,
        completionRate: 75,
        stageDescription: "Chế tạo mạch & Lab",
        stageCount: 240,
        status: "delayed",
        color: "warning",
      },
      {
        id: "3",
        name: "Kinh Tế & QTKD",
        abbr: "BA",
        totalProjects: 380,
        totalStudents: 460,
        teacherCount: 52,
        councilCount: 14,
        completionRate: 90,
        stageDescription: "Bản thảo & Turnitin",
        stageCount: 342,
        status: "on-time",
        color: "success",
      },
      {
        id: "4",
        name: "Cơ Khí Chế Tạo",
        abbr: "ME",
        totalProjects: 270,
        totalStudents: 320,
        teacherCount: 40,
        councilCount: 10,
        completionRate: 68,
        stageDescription: "Gia công mô hình xưởng",
        stageCount: 190,
        status: "warning",
        color: "info",
      },
      {
        id: "5",
        name: "Khoa Học Ứng Dụng",
        abbr: "AS",
        totalProjects: 150,
        totalStudents: 180,
        teacherCount: 35,
        councilCount: 8,
        completionRate: 80,
        stageDescription: "Thí nghiệm",
        stageCount: 120,
        status: "on-time",
        color: "primary",
      },
      {
        id: "6",
        name: "Hóa Học & Môi Trường",
        abbr: "CH",
        totalProjects: 150,
        totalStudents: 160,
        teacherCount: 30,
        councilCount: 8,
        completionRate: 71,
        stageDescription: "Phân tích & Báo cáo",
        stageCount: 106,
        status: "on-time",
        color: "success",
      },
    ];
  }, []);

  const filteredDepartments = useMemo(() => {
    return mockDepartments.filter(
      (dept) =>
        (filter === "all" || dept.status === filter) &&
        (dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dept.abbr.toLowerCase().includes(searchQuery.toLowerCase())),
    );
  }, [searchQuery, filter, mockDepartments]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDepartments = filteredDepartments.slice(
    startIndex,
    startIndex + itemsPerPage,
  );
  const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage);

  const totalProjects = mockDepartments.reduce(
    (sum, d) => sum + d.totalProjects,
    0,
  );
  const totalStudents = mockDepartments.reduce(
    (sum, d) => sum + d.totalStudents,
    0,
  );
  const totalTeachers = mockDepartments.reduce(
    (sum, d) => sum + d.teacherCount,
    0,
  );
  const avgCompletion = Math.round(
    mockDepartments.reduce((sum, d) => sum + d.completionRate, 0) /
      mockDepartments.length,
  );

  const filterTabs = [
    { id: "all", label: "Tất cả", count: mockDepartments.length },
    {
      id: "on-time",
      label: "Đúng hạn",
      count: mockDepartments.filter((d) => d.status === "on-time").length,
    },
    {
      id: "delayed",
      label: "Trễ hạn",
      count: mockDepartments.filter((d) => d.status === "delayed").length,
    },
    {
      id: "warning",
      label: "Cảnh báo",
      count: mockDepartments.filter((d) => d.status === "warning").length,
    },
  ];

  if (statsLoading || deptLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 4,
          pb: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Quản lý Khoa
            </Typography>
            <Chip
              label="Department Center"
              size="small"
              sx={{
                bgcolor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                fontSize: "0.75rem",
              }}
            />
          </Box>
          <Typography variant="body2" color="textSecondary">
            Quản lý đề tài, sinh viên, giảng viên hướng dẫn và hội đồng bảo vệ
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ whiteSpace: "nowrap" }}
        >
          Thêm khoa
        </Button>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Tổng Đề Tài
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {totalProjects}
              </Typography>
              <Typography variant="caption" color="success.main">
                +8.2% tháng này
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Sinh Viên
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {totalStudents}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {Math.round(totalStudents / mockDepartments.length)} SV/khoa
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                GVHD
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {totalTeachers}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {(totalProjects / totalTeachers).toFixed(1)} ĐT/GV
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Tiến độ TB
              </Typography>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, color: theme.palette.success.main }}
              >
                {avgCompletion}%
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Hoàn thành trung bình
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filter Tabs & Search */}
      <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Tabs
          value={filter}
          onChange={(e, newValue) => {
            setFilter(newValue);
            setCurrentPage(1);
          }}
          variant="scrollable"
          scrollButtons="auto"
        >
          {filterTabs.map((tab) => (
            <Tab
              key={tab.id}
              label={`${tab.label} ${tab.count}`}
              value={tab.id}
            />
          ))}
        </Tabs>
        <TextField
          placeholder="Tìm theo tên, viết tắt..."
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ mr: 1, color: "textSecondary" }} />
            ),
          }}
          sx={{ ml: "auto", minWidth: 250 }}
        />
      </Box>

      {/* Table */}
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        {paginatedDepartments.length === 0 ? (
          <Box sx={{ p: 3, textAlign: "center", color: "textSecondary" }}>
            <Typography>Không tìm thấy khoa nào</Typography>
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: theme.palette.background.default }}>
                <TableCell>Tên Khoa</TableCell>
                <TableCell align="right">Đề Tài</TableCell>
                <TableCell align="right">Sinh Viên</TableCell>
                <TableCell align="right">GVHD</TableCell>
                <TableCell align="center">Tiến độ</TableCell>
                <TableCell align="center">Trạng thái</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedDepartments.map((dept) => (
                <TableRow
                  key={dept.id}
                  sx={{
                    "&:hover": { bgcolor: theme.palette.action.hover },
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Chip
                        label={dept.abbr}
                        size="small"
                        color={dept.color}
                        variant="outlined"
                      />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {dept.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {dept.stageDescription}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {dept.totalProjects}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {dept.totalStudents}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {dept.teacherCount}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ minWidth: 120 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 0.5,
                        }}
                      >
                        <Typography variant="caption">
                          {dept.stageCount}/{dept.totalProjects}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 600,
                            color:
                              dept.completionRate >= 80
                                ? theme.palette.success.main
                                : dept.completionRate >= 60
                                  ? theme.palette.warning.main
                                  : theme.palette.error.main,
                          }}
                        >
                          {dept.completionRate}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={dept.completionRate}
                        color={
                          dept.completionRate >= 80
                            ? "success"
                            : dept.completionRate >= 60
                              ? "warning"
                              : "error"
                        }
                      />
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={
                        dept.status === "on-time"
                          ? "Đúng hạn"
                          : dept.status === "delayed"
                            ? "Trễ hạn"
                            : "Cảnh báo"
                      }
                      size="small"
                      color={
                        dept.status === "on-time"
                          ? "success"
                          : dept.status === "delayed"
                            ? "error"
                            : "warning"
                      }
                      variant="outlined"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(e, page) => setCurrentPage(page)}
          />
        </Box>
      )}
    </Box>
  );
};

export default AdminDepartmentDashboard;
