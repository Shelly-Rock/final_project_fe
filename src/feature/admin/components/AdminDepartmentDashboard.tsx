"use client";

import React, { useState, useMemo } from "react";
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
import MoreVertIcon from "@mui/icons-material/MoreVert";

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
        dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dept.abbr.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

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

  const delayedCount = mockDepartments.filter(
    (d) => d.status === "delayed",
  ).length;
  const warningCount = mockDepartments.filter(
    (d) => d.status === "warning",
  ).length;

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
      count: delayedCount,
    },
    {
      id: "warning",
      label: "Cảnh báo",
      count: warningCount,
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
    <Box sx={{ p: 2 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 2,
          pb: 1.5,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Quản lý Khoa
            </Typography>
            <Chip
              label="Department Center"
              size="small"
              sx={{
                bgcolor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                fontSize: "0.65rem",
              }}
            />
          </Box>
          <Typography variant="caption" color="textSecondary">
            Quản lý đề tài, sinh viên, giảng viên hướng dẫn và hội đồng bảo vệ
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          size="small"
          sx={{ whiteSpace: "nowrap", textTransform: "none" }}
        >
          Thêm khoa
        </Button>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={1} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ p: 1.5 }}>
              <Typography color="textSecondary" variant="caption">
                Tổng Đề Tài
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.5 }}>
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
            <CardContent sx={{ p: 1.5 }}>
              <Typography color="textSecondary" variant="caption">
                Sinh Viên
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.5 }}>
                {totalStudents}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                430 nhóm
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ p: 1.5 }}>
              <Typography color="textSecondary" variant="caption">
                GVHD
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.5 }}>
                {totalTeachers}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                5.8 đề tài/GV
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ p: 1.5 }}>
              <Typography color="textSecondary" variant="caption">
                Tiến độ TBình
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, mt: 0.5, color: "success.main" }}
              >
                {avgCompletion}%
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {delayedCount} khoa trễ
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filter Tabs & Search */}
      <Box sx={{ mb: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
        <Tabs
          value={filter}
          onChange={(e, newValue) => {
            setFilter(newValue);
            setCurrentPage(1);
          }}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ flex: 1, minWidth: 300 }}
        >
          {filterTabs.map((tab) => (
            <Tab
              key={tab.id}
              label={`${tab.label} ${tab.count}`}
              value={tab.id}
              sx={{ textTransform: "none", fontSize: "0.875rem" }}
            />
          ))}
        </Tabs>
        <TextField
          placeholder="Tìm khoa..."
          size="small"
          InputProps={{
            startAdornment: (
              <SearchIcon
                sx={{ mr: 0.5, color: "textSecondary", fontSize: 18 }}
              />
            ),
          }}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          sx={{ minWidth: 200 }}
        />
      </Box>

      {/* Table */}
      <TableContainer component={Paper} sx={{ mb: 2 }}>
        {paginatedDepartments.length === 0 ? (
          <Box sx={{ p: 2, textAlign: "center", color: "textSecondary" }}>
            <Typography variant="caption">Không tìm thấy khoa nào</Typography>
          </Box>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: theme.palette.background.default }}>
                <TableCell sx={{ fontWeight: 600, fontSize: "0.85rem" }}>
                  Khoa
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 600, fontSize: "0.85rem" }}
                >
                  Đề Tài
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 600, fontSize: "0.85rem" }}
                >
                  Sinh Viên
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 600, fontSize: "0.85rem" }}
                >
                  Tiến độ
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 600, fontSize: "0.85rem" }}
                >
                  Trạng thái
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: 600, fontSize: "0.85rem" }}
                >
                  Thao tác
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedDepartments.map((dept) => (
                <TableRow
                  key={dept.id}
                  sx={{ "&:hover": { bgcolor: theme.palette.action.hover } }}
                >
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Chip
                        label={dept.abbr}
                        size="small"
                        variant="outlined"
                        color={dept.color}
                        sx={{ fontSize: "0.7rem" }}
                      />
                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          {dept.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="textSecondary"
                          display="block"
                        >
                          {dept.stageDescription}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      {dept.totalProjects}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      {dept.totalStudents}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ minWidth: 100 }}>
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
                          color={dept.color}
                          sx={{ fontWeight: 600 }}
                        >
                          {dept.completionRate}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={dept.completionRate}
                        color={dept.color}
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
                      sx={{ fontSize: "0.7rem" }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small">
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
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
            size="small"
          />
        </Box>
      )}
    </Box>
  );
};

export default AdminDepartmentDashboard;
