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
  Avatar,
  AvatarGroup,
  Stack,
  LinearProgress,
} from "@mui/material";
import {
  Visibility as ViewIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  MoreVert as MoreIcon,
} from "@mui/icons-material";
import { FilterBar } from "@/shared/components";
import {
  mockRegistrations,
  getRegistrationStatusColor,
} from "@/feature/thesis/constants";
import { RegistrationStatusBadge } from "./RegistrationStatusBadge";
import type { ThesisRegistration, RegistrationStatus } from "@/feature/thesis/types";

interface RegistrationListProps {
  registrations?: ThesisRegistration[];
  showActions?: boolean;
  onView?: (registration: ThesisRegistration) => void;
  onApprove?: (registration: ThesisRegistration) => void;
  onReject?: (registration: ThesisRegistration) => void;
  filterBySupervisor?: string;
  filterByStatus?: RegistrationStatus | "all";
}

export function RegistrationList({
  registrations = mockRegistrations,
  showActions = true,
  onView,
  onApprove,
  onReject,
  filterBySupervisor,
  filterByStatus = "all",
}: RegistrationListProps) {
  const [statusFilter, setStatusFilter] = useState<RegistrationStatus | "all">(filterByStatus);
  const [supervisorFilter, setSupervisorFilter] = useState<string>(filterBySupervisor || "all");

  // Get unique supervisors
  const supervisors = [...new Set(registrations.map((r) => r.supervisorId))];

  // Filter registrations
  const filteredRegistrations = registrations.filter((reg) => {
    if (statusFilter !== "all" && reg.status !== statusFilter) return false;
    if (supervisorFilter !== "all" && reg.supervisorId !== supervisorFilter) return false;
    return true;
  });

  // Stats
  const stats = {
    total: registrations.length,
    pending: registrations.filter((r) => r.status === "pending_supervisor").length,
    confirmed: registrations.filter((r) => r.status === "confirmed" || r.status === "in_progress").length,
    completed: registrations.filter((r) => r.status === "completed").length,
  };

  return (
    <Box>
      {/* Stats Cards */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Paper sx={{ p: 2, flex: 1, textAlign: "center" }}>
          <Typography variant="h4" color="primary">
            {stats.total}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tổng đăng ký
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: 1, textAlign: "center" }}>
          <Typography variant="h4" color="warning.main">
            {stats.pending}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Chờ xác nhận
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: 1, textAlign: "center" }}>
          <Typography variant="h4" color="info.main">
            {stats.confirmed}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Đang thực hiện
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: 1, textAlign: "center" }}>
          <Typography variant="h4" color="success.main">
            {stats.completed}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Hoàn thành
          </Typography>
        </Paper>
      </Box>

      <FilterBar
        totalCount={registrations.length}
        filteredCount={filteredRegistrations.length}
      >
        <Stack direction="row" spacing={2}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={statusFilter}
              label="Trạng thái"
              onChange={(e) => setStatusFilter(e.target.value as RegistrationStatus | "all")}
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="pending_supervisor">Chờ xác nhận</MenuItem>
              <MenuItem value="confirmed">Đã xác nhận</MenuItem>
              <MenuItem value="in_progress">Đang thực hiện</MenuItem>
              <MenuItem value="paused">Tạm ngưng</MenuItem>
              <MenuItem value="completed">Hoàn thành</MenuItem>
              <MenuItem value="rejected">Từ chối</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>GV hướng dẫn</InputLabel>
            <Select
              value={supervisorFilter}
              label="GV hướng dẫn"
              onChange={(e) => setSupervisorFilter(e.target.value)}
            >
              <MenuItem value="all">Tất cả</MenuItem>
              {supervisors.map((supId) => {
                const reg = registrations.find((r) => r.supervisorId === supId);
                return (
                  <MenuItem key={supId} value={supId}>
                    {reg?.supervisorName}
                  </MenuItem>
                );
              })}
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
              <TableCell sx={{ fontWeight: 600 }}>Đề tài</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>GVHD</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Ngày đăng ký</TableCell>
              {showActions && <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>Thao tác</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRegistrations.map((reg, index) => (
              <TableRow key={reg.id} hover>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight={500}>
                      {reg.studentName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {reg.studentMssv}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ maxWidth: 250 }}>
                  <Tooltip title={reg.topicName}>
                    <Typography variant="body2" noWrap>
                      {reg.topicName}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>{reg.supervisorName}</TableCell>
                <TableCell>
                  <RegistrationStatusBadge status={reg.status} />
                </TableCell>
                <TableCell>{reg.registeredAt}</TableCell>
                {showActions && (
                  <TableCell align="center">
                    <Tooltip title="Xem chi tiết">
                      <IconButton
                        size="small"
                        onClick={() => onView?.(reg)}
                      >
                        <ViewIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    {reg.status === "pending_supervisor" && showActions && (
                      <>
                        <Tooltip title="Xác nhận">
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => onApprove?.(reg)}
                          >
                            <ApproveIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Từ chối">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => onReject?.(reg)}
                          >
                            <RejectIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
