// ============================================================
// Student Table Component
// ============================================================
"use client";

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Tooltip,
  Paper,
  Skeleton,
  Typography,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import type { Student } from "../types";

interface StudentTableProps {
  students: Student[];
  loading?: boolean;
  onEdit?: (student: Student) => void;
  onDelete?: (student: Student) => void;
  onView?: (student: Student) => void;
}

export function StudentTable({
  students,
  loading = false,
  onEdit,
  onDelete,
  onView,
}: StudentTableProps) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedStudents = students.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const getStatusColor = (status: Student["trangThai"]) => {
    switch (status) {
      case "active":
        return "success";
      case "inactive":
        return "default";
      case "graduated":
        return "info";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: Student["trangThai"]) => {
    switch (status) {
      case "active":
        return "Đang học";
      case "inactive":
        return "Nghỉ học";
      case "graduated":
        return "Đã tốt nghiệp";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <Paper>
        <Box sx={{ p: 2 }}>
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} height={60} sx={{ my: 1 }} />
          ))}
        </Box>
      </Paper>
    );
  }

  if (students.length === 0) {
    return (
      <Paper>
        <Box sx={{ p: 4, textAlign: "center" }}>
          <Typography color="text.secondary">Không có sinh viên nào</Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "grey.100" }}>
              <TableCell sx={{ fontWeight: 600 }}>MSSV</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Họ tên</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Khoa</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Khóa</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Lớp</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Đề tài</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">
                Thao tác
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedStudents.map((student) => (
              <TableRow key={student.id} hover>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {student.mssv}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {student.hoTen}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {student.gmail}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{student.khoa}</TableCell>
                <TableCell>{student.khoaHoc}</TableCell>
                <TableCell>{student.lop}</TableCell>
                <TableCell>
                  {student.deTai ? (
                    <Chip
                      label={
                        student.deTai.length > 30
                          ? student.deTai.substring(0, 30) + "..."
                          : student.deTai
                      }
                      size="small"
                      variant="outlined"
                      color="primary"
                    />
                  ) : (
                    <Typography variant="caption" color="text.secondary">
                      Chưa có đề tài
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Chip
                    label={getStatusLabel(student.trangThai)}
                    color={getStatusColor(student.trangThai)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Xem chi tiết">
                    <IconButton size="small" onClick={() => onView?.(student)}>
                      <ViewIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Sửa">
                    <IconButton size="small" onClick={() => onEdit?.(student)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Xóa">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => onDelete?.(student)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={students.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Số dòng mỗi trang:"
      />
    </Paper>
  );
}

import React from "react";
