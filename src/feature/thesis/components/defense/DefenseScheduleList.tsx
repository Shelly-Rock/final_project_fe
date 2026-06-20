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
  Card,
  CardContent,
  Grid,
  Avatar,
  AvatarGroup,
  Button,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  CalendarMonth as CalendarIcon,
  Groups as CouncilIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { FilterBar } from "@/shared/components";
import {
  mockDefenses,
  mockDefenseSchedules,
  mockCouncilMembers,
  getDefenseStatusColor,
  getCouncilRoleLabel,
} from "@/feature/thesis/constants";
import { StatusBadge } from "@/feature/thesis/components/registration/RegistrationStatusBadge";
import type { ThesisDefense, DefenseSchedule, CouncilMember, DefenseRecord } from "@/feature/thesis/types";

interface DefenseScheduleListProps {
  defenses?: ThesisDefense[];
  schedules?: DefenseSchedule[];
  onViewDetail?: (defense: ThesisDefense) => void;
  onSchedule?: (defense: ThesisDefense) => void;
  onEditSchedule?: (schedule: DefenseSchedule) => void;
}

export function DefenseScheduleList({
  defenses = mockDefenses,
  schedules = mockDefenseSchedules,
  onViewDetail,
  onSchedule,
  onEditSchedule,
}: DefenseScheduleListProps) {
  const [tab, setTab] = useState(0);
  const [statusFilter, setStatusFilter] = useState<"all" | ThesisDefense["status"]>("all");
  const [selectedSchedule, setSelectedSchedule] = useState<DefenseSchedule | null>(null);

  const filteredDefenses = defenses.filter((d) => {
    if (statusFilter === "all") return true;
    return d.status === statusFilter;
  });

  // Stats
  const stats = {
    total: defenses.length,
    scheduled: defenses.filter((d) => d.status === "scheduled").length,
    completed: defenses.filter((d) => d.status === "completed").length,
    notReady: defenses.filter((d) => d.status === "not_ready").length,
  };

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab label="Danh sách bảo vệ" />
          <Tab label={`Lịch bảo vệ (${schedules.length})`} />
          <Tab label="Hội đồng" />
        </Tabs>
      </Box>

      {tab === 0 && (
        <>
          {/* Stats */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <CouncilIcon color="primary" />
                    <Box>
                      <Typography variant="h4">{stats.total}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Tổng SV
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <CalendarIcon color="info" />
                    <Box>
                      <Typography variant="h4">{stats.scheduled}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Đã xếp lịch
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <CouncilIcon color="success" />
                    <Box>
                      <Typography variant="h4">{stats.completed}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Đã bảo vệ
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <CalendarIcon color="warning" />
                    <Box>
                      <Typography variant="h4">{stats.notReady}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Chờ xếp lịch
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <FilterBar
            totalCount={defenses.length}
            filteredCount={filteredDefenses.length}
          >
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={statusFilter}
                label="Trạng thái"
                onChange={(e) => setStatusFilter(e.target.value as "all" | ThesisDefense["status"])}
              >
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="pending">Chưa xếp lịch</MenuItem>
                <MenuItem value="scheduled">Đã xếp lịch</MenuItem>
                <MenuItem value="completed">Hoàn thành</MenuItem>
              </Select>
            </FormControl>
          </FilterBar>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "grey.100" }}>
                  <TableCell sx={{ fontWeight: 600 }}>STT</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Sinh viên</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Đề tài</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Phòng</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Ngày</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Giờ</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Điểm</TableCell>
                  <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredDefenses.map((defense, index) => (
                  <TableRow key={defense.id} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {defense.student}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 200 }}>
                      <Tooltip title={defense.thesis}>
                        <Typography variant="body2" noWrap>
                          {defense.thesis}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>{defense.room}</TableCell>
                    <TableCell>{defense.date}</TableCell>
                    <TableCell>{defense.time}</TableCell>
                    <TableCell>
                      <StatusBadge status={defense.status} />
                    </TableCell>
                    <TableCell>
                      {defense.score != null ? (
                        <Chip
                          label={defense.score}
                          color={(defense.score ?? 0) >= 8.5 ? "success" : (defense.score ?? 0) >= 7 ? "info" : "warning"}
                          size="small"
                        />
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          —
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Xem chi tiết">
                        <IconButton size="small" onClick={() => onViewDetail?.(defense)}>
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {defense.status === "not_ready" && (
                        <Tooltip title="Xếp lịch">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => onSchedule?.(defense)}
                          >
                            <CalendarIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {tab === 1 && (
        <Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6">Lịch bảo vệ</Typography>
            <Button variant="contained" startIcon={<AddIcon />}>
              Tạo lịch mới
            </Button>
          </Box>

          <Grid container spacing={3}>
            {schedules.map((schedule) => (
              <Grid item xs={12} md={6} lg={4} key={schedule.id}>
                <Card
                  sx={{
                    cursor: "pointer",
                    "&:hover": { boxShadow: 4 },
                    transition: "box-shadow 0.2s",
                  }}
                  onClick={() => setSelectedSchedule(schedule)}
                >
                  <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                      <Chip
                        icon={<CalendarIcon />}
                        label={schedule.date}
                        color="primary"
                        variant="outlined"
                      />
                      <Typography variant="body2" color="text.secondary">
                        {schedule.timeSlot}
                      </Typography>
                    </Box>

                    <Typography variant="h6" gutterBottom>
                      Phòng {schedule.room}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {schedule.councilName}
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                      <AvatarGroup max={4}>
                        {schedule.councilMembers.map((member) => (
                          <Tooltip
                            key={member.id}
                            title={`${member.name} (${getCouncilRoleLabel(member.role)})`}
                          >
                            <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>
                              {member.name.split(" ").pop()?.charAt(0)}
                            </Avatar>
                          </Tooltip>
                        ))}
                      </AvatarGroup>
                    </Box>

                    <Chip
                      label={`${schedule.councilMembers.length} thành viên`}
                      size="small"
                      variant="outlined"
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {tab === 2 && (
        <Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6">Quản lý hội đồng</Typography>
            <Button variant="contained" startIcon={<AddIcon />}>
              Thêm hội đồng
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "grey.100" }}>
                  <TableCell sx={{ fontWeight: 600 }}>STT</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Họ tên</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Vai trò</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Khoa</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockCouncilMembers.map((member, index) => (
                  <TableRow key={member.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{member.name}</TableCell>
                    <TableCell>
                      <Chip
                        label={getCouncilRoleLabel(member.role)}
                        size="small"
                        color={
                          member.role === "chairman"
                            ? "primary"
                            : member.role === "secretary"
                              ? "secondary"
                              : "default"
                        }
                      />
                    </TableCell>
                    <TableCell>{member.department}</TableCell>
                    <TableCell>
                      <IconButton size="small">
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Schedule Detail Dialog */}
      <Dialog
        open={Boolean(selectedSchedule)}
        onClose={() => setSelectedSchedule(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedSchedule && (
          <>
            <DialogTitle>
              Lịch bảo vệ - Phòng {selectedSchedule.room}
            </DialogTitle>
            <DialogContent>
              <Stack spacing={2}>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Chip label={selectedSchedule.date} />
                  <Chip label={selectedSchedule.timeSlot} />
                </Box>
                <Typography variant="h6">{selectedSchedule.councilName}</Typography>

                <Typography variant="subtitle2">Thành viên hội đồng:</Typography>
                <Stack spacing={1}>
                  {selectedSchedule.councilMembers.map((member) => (
                    <Box
                      key={member.id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        p: 1,
                        bgcolor: "grey.50",
                        borderRadius: 1,
                      }}
                    >
                      <Avatar>{member.name.charAt(0)}</Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          {member.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {getCouncilRoleLabel(member.role)} - {member.department}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedSchedule(null)}>Đóng</Button>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => {
                  onEditSchedule?.(selectedSchedule);
                  setSelectedSchedule(null);
                }}
              >
                Chỉnh sửa
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
