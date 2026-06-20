"use client";

import { useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Stack,
  Avatar,
  Button,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Visibility as ViewIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
} from "@mui/icons-material";
import { FilterBar } from "@/shared/components";
import {
  mockExceptions,
  getExceptionStatusColor,
  getExceptionTypeLabel,
} from "@/feature/thesis/constants";
import type { ThesisException, ExceptionType, ExceptionStatus } from "@/feature/thesis/types";

interface ExceptionListProps {
  exceptions?: ThesisException[];
  onView?: (exception: ThesisException) => void;
  onApprove?: (exception: ThesisException) => void;
  onReject?: (exception: ThesisException) => void;
}

export function ExceptionList({
  exceptions = mockExceptions,
  onView,
  onApprove,
  onReject,
}: ExceptionListProps) {
  const [tab, setTab] = useState(0);
  const [statusFilter, setStatusFilter] = useState<ExceptionStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<ExceptionType | "all">("all");

  const filteredExceptions = exceptions.filter((exc) => {
    if (statusFilter !== "all" && exc.status !== statusFilter) return false;
    if (typeFilter !== "all" && exc.type !== typeFilter) return false;
    return true;
  });

  // Stats
  const stats = {
    total: exceptions.length,
    pending: exceptions.filter((e) => e.status === "pending").length,
    approved: exceptions.filter((e) => e.status === "approved").length,
    rejected: exceptions.filter((e) => e.status === "rejected").length,
    resolved: exceptions.filter((e) => e.status === "resolved").length,
  };

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab label={`Tất cả (${exceptions.length})`} />
          <Tab label={`Chờ xử lý (${stats.pending})`} />
          <Tab label="Đã xử lý" />
        </Tabs>
      </Box>

      {/* Stats Cards */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Paper sx={{ p: 2, flex: 1, textAlign: "center" }}>
          <Typography variant="h4" color="primary">
            {stats.total}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tổng yêu cầu
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: 1, textAlign: "center" }}>
          <Typography variant="h4" color="warning.main">
            {stats.pending}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Chờ xử lý
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: 1, textAlign: "center" }}>
          <Typography variant="h4" color="success.main">
            {stats.approved}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Đã duyệt
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: 1, textAlign: "center" }}>
          <Typography variant="h4" color="error.main">
            {stats.rejected}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Từ chối
          </Typography>
        </Paper>
      </Stack>

      <FilterBar
        totalCount={exceptions.length}
        filteredCount={filteredExceptions.length}
      >
        <Stack direction="row" spacing={2}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={statusFilter}
              label="Trạng thái"
              onChange={(e) =>
                setStatusFilter(e.target.value as ExceptionStatus | "all")
              }
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="pending">Chờ xử lý</MenuItem>
              <MenuItem value="approved">Đã duyệt</MenuItem>
              <MenuItem value="rejected">Từ chối</MenuItem>
              <MenuItem value="resolved">Đã giải quyết</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Loại yêu cầu</InputLabel>
            <Select
              value={typeFilter}
              label="Loại yêu cầu"
              onChange={(e) =>
                setTypeFilter(e.target.value as ExceptionType | "all")
              }
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="late_submission">Nộp muộn</MenuItem>
              <MenuItem value="topic_change">Đổi đề tài</MenuItem>
              <MenuItem value="supervisor_change">Đổi GVHD</MenuItem>
              <MenuItem value="extension_request">Xin gia hạn</MenuItem>
              <MenuItem value="pause_request">Xin bảo lưu</MenuItem>
              <MenuItem value="score_appeal">Khiếu nại điểm</MenuItem>
              <MenuItem value="revision_request">Yêu cầu chỉnh sửa</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </FilterBar>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "grey.100" }}>
              <TableCell sx={{ fontWeight: 600 }}>STT</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Sinh viên</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Loại yêu cầu</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Lý do</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Ngày tạo</TableCell>
              <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredExceptions.map((exc, index) => (
              <TableRow key={exc.id} hover>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>
                      {exc.studentName.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        {exc.studentName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {exc.studentId}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={getExceptionTypeLabel(exc.type)}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell sx={{ maxWidth: 200 }}>
                  <Tooltip title={exc.reason}>
                    <Typography variant="body2" noWrap>
                      {exc.reason}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Chip
                    label={
                      exc.status === "pending"
                        ? "Chờ xử lý"
                        : exc.status === "approved"
                          ? "Đã duyệt"
                          : exc.status === "rejected"
                            ? "Từ chối"
                            : "Đã giải quyết"
                    }
                    color={getExceptionStatusColor(exc.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{exc.createdAt}</TableCell>
                <TableCell align="center">
                  <Tooltip title="Xem chi tiết">
                    <IconButton size="small" onClick={() => onView?.(exc)}>
                      <ViewIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  {exc.status === "pending" && (
                    <>
                      <Tooltip title="Phê duyệt">
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => onApprove?.(exc)}
                        >
                          <ApproveIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Từ chối">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => onReject?.(exc)}
                        >
                          <RejectIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
