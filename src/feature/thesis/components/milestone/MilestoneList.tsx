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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  CheckCircle as ApproveIcon,
  Replay as RevisionIcon,
} from "@mui/icons-material";
import { FilterBar } from "@/shared/components";
import {
  mockMilestones,
  getMilestoneStatusColor,
  calculateOverallProgress,
} from "@/feature/thesis/constants";
import { StatusBadge } from "@/feature/thesis/components/registration/RegistrationStatusBadge";
import type { Milestone, MilestoneStatus } from "@/feature/thesis/types";

interface MilestoneListProps {
  milestones?: Milestone[];
  thesisId?: string;
  showActions?: boolean;
  onView?: (milestone: Milestone) => void;
  onEdit?: (milestone: Milestone) => void;
  onApprove?: (milestone: Milestone) => void;
  onRequestRevision?: (milestone: Milestone) => void;
}

export function MilestoneList({
  milestones = mockMilestones,
  thesisId,
  showActions = true,
  onView,
  onEdit,
  onApprove,
  onRequestRevision,
}: MilestoneListProps) {
  const [statusFilter, setStatusFilter] = useState<MilestoneStatus | "all">("all");
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);

  // Filter milestones by thesisId if provided
  const filteredMilestones = thesisId
    ? milestones.filter((m) => m.thesisId === thesisId)
    : milestones;

  // Apply status filter
  const displayedMilestones =
    statusFilter === "all"
      ? filteredMilestones
      : filteredMilestones.filter((m) => m.status === statusFilter);

  // Calculate overall progress
  const overallProgress = calculateOverallProgress(filteredMilestones);

  // Stats
  const stats = {
    total: filteredMilestones.length,
    completed: filteredMilestones.filter((m) => 
      m.status === "completed" || m.status === "approved"
    ).length,
    inProgress: filteredMilestones.filter((m) => 
      m.status === "in_progress" || m.status === "submitted"
    ).length,
    overdue: filteredMilestones.filter((m) => m.status === "overdue").length,
  };

  const handleViewDetails = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
  };

  return (
    <Box>
      {/* Progress Overview */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Tiến độ tổng thể
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h3" color="primary">
              {overallProgress}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Hoàn thành
            </Typography>
          </Box>
          <Stack direction="row" spacing={4}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h5" color="success.main">
                {stats.completed}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Hoàn thành
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h5" color="info.main">
                {stats.inProgress}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Đang thực hiện
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h5" color="error.main">
                {stats.overdue}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Trễ hạn
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Paper>

      <FilterBar
        totalCount={filteredMilestones.length}
        filteredCount={displayedMilestones.length}
      >
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Trạng thái</InputLabel>
          <Select
            value={statusFilter}
            label="Trạng thái"
            onChange={(e) => setStatusFilter(e.target.value as MilestoneStatus | "all")}
          >
            <MenuItem value="all">Tất cả</MenuItem>
            <MenuItem value="not_started">Chưa bắt đầu</MenuItem>
            <MenuItem value="in_progress">Đang thực hiện</MenuItem>
            <MenuItem value="overdue">Trễ hạn</MenuItem>
            <MenuItem value="submitted">Đã nộp</MenuItem>
            <MenuItem value="approved">Đã duyệt</MenuItem>
            <MenuItem value="revision">Yêu cầu chỉnh sửa</MenuItem>
            <MenuItem value="completed">Hoàn thành</MenuItem>
          </Select>
        </FormControl>
      </FilterBar>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "grey.100" }}>
              <TableCell sx={{ fontWeight: 600 }}>STT</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Tên milestone</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Mô tả</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Hạn chót</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Trọng số</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Ngày nộp</TableCell>
              {showActions && (
                <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>
                  Thao tác
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedMilestones.map((milestone, index) => (
              <TableRow key={milestone.id} hover>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight={500}>
                    {milestone.name}
                  </Typography>
                </TableCell>
                <TableCell sx={{ maxWidth: 200 }}>
                  <Tooltip title={milestone.description}>
                    <Typography variant="body2" noWrap>
                      {milestone.description}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    color={milestone.status === "overdue" ? "error" : "inherit"}
                  >
                    {milestone.deadline}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip label={`${milestone.weight}%`} size="small" variant="outlined" />
                </TableCell>
                <TableCell>
                  <StatusBadge status={milestone.status} />
                </TableCell>
                <TableCell>
                  {milestone.submittedAt || "—"}
                </TableCell>
                {showActions && (
                  <TableCell align="center">
                    <Tooltip title="Xem chi tiết">
                      <IconButton
                        size="small"
                        onClick={() => handleViewDetails(milestone)}
                      >
                        <ViewIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    {(milestone.status === "submitted" || milestone.status === "revision") && (
                      <>
                        <Tooltip title="Duyệt">
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => onApprove?.(milestone)}
                          >
                            <ApproveIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Yêu cầu chỉnh sửa">
                          <IconButton
                            size="small"
                            color="warning"
                            onClick={() => onRequestRevision?.(milestone)}
                          >
                            <RevisionIcon fontSize="small" />
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

      {/* Milestone Detail Dialog */}
      <Dialog
        open={Boolean(selectedMilestone)}
        onClose={() => setSelectedMilestone(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedMilestone && (
          <>
            <DialogTitle>{selectedMilestone.name}</DialogTitle>
            <DialogContent>
              <Stack spacing={2} sx={{ mt: 1 }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Mô tả
                  </Typography>
                  <Typography variant="body2">
                    {selectedMilestone.description}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 4 }}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Hạn chót
                    </Typography>
                    <Typography variant="body2">
                      {selectedMilestone.deadline}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Trọng số
                    </Typography>
                    <Typography variant="body2">
                      {selectedMilestone.weight}%
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Trạng thái
                    </Typography>
                    <StatusBadge status={selectedMilestone.status} />
                  </Box>
                </Box>
                {selectedMilestone.attachments && selectedMilestone.attachments.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      File đính kèm
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                      {selectedMilestone.attachments.map((file, idx) => (
                        <Chip key={idx} label={file} size="small" />
                      ))}
                    </Stack>
                  </Box>
                )}
                {selectedMilestone.revisionNote && (
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "warning.light",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="subtitle2" color="warning.dark">
                      Yêu cầu chỉnh sửa
                    </Typography>
                    <Typography variant="body2">
                      {selectedMilestone.revisionNote}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedMilestone(null)}>Đóng</Button>
              {selectedMilestone.status === "submitted" && (
                <>
                  <Button
                    color="warning"
                    onClick={() => {
                      onRequestRevision?.(selectedMilestone);
                      setSelectedMilestone(null);
                    }}
                  >
                    Yêu cầu chỉnh sửa
                  </Button>
                  <Button
                    color="success"
                    variant="contained"
                    onClick={() => {
                      onApprove?.(selectedMilestone);
                      setSelectedMilestone(null);
                    }}
                  >
                    Duyệt
                  </Button>
                </>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
