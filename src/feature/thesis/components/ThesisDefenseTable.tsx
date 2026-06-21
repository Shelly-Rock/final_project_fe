"use client";

import { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  AccessTime as TimeIcon,
  Person as PersonIcon,
  MilitaryTech as TechIcon,
} from "@mui/icons-material";
import { FilterBar } from "@/shared/components";
import type { ThesisDefense } from "../constants";

interface ThesisDefenseTableProps {
  defenses: ThesisDefense[];
}

export function ThesisDefenseTable({
  defenses,
}: ThesisDefenseTableProps) {
  const [filter, setFilter] = useState("all");

  const totalCount = useMemo(() => defenses.length, [defenses]);

  const filteredDefenses = useMemo(
    () => (filter === "all" ? defenses : defenses.filter((d) => d.status === filter)),
    [filter, defenses]
  );

  const completedCount = useMemo(
    () => defenses.filter((d) => d.status === "completed").length,
    [defenses]
  );

  const pendingCount = useMemo(
    () => defenses.length - completedCount,
    [defenses, completedCount]
  );

  const progress = useMemo(
    () => (defenses.length > 0 ? (completedCount / defenses.length) * 100 : 0),
    [defenses.length, completedCount]
  );

  return (
    <>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <TimeIcon color="primary" />
                <Typography variant="h6">Lịch bảo vệ</Typography>
              </Box>
              <Typography variant="h4" sx={{ my: 1 }}>
                {defenses.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Đề tài được xếp lịch
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <TechIcon color="success" />
                <Typography variant="h6">Đã bảo vệ</Typography>
              </Box>
              <Typography variant="h4" sx={{ my: 1 }}>
                {completedCount}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PersonIcon color="warning" />
                <Typography variant="h6">Chờ bảo vệ</Typography>
              </Box>
              <Typography variant="h4" sx={{ my: 1 }}>
                {pendingCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sắp tới
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <FilterBar
        totalCount={totalCount}
        filteredCount={filteredDefenses.length}
      >
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Trạng thái</InputLabel>
          <Select
            value={filter}
            label="Trạng thái"
            onChange={(e) => setFilter(e.target.value)}
          >
            <MenuItem value="all">Tất cả</MenuItem>
            <MenuItem value="pending">Chưa bảo vệ</MenuItem>
            <MenuItem value="scheduled">Đã xếp lịch</MenuItem>
            <MenuItem value="completed">Hoàn thành</MenuItem>
          </Select>
        </FormControl>
      </FilterBar>

      <Paper>
        <TableContainer>
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
                <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>
                  Điểm
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDefenses.map((defense, index) => (
                <TableRow key={defense.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{defense.student}</TableCell>
                  <TableCell sx={{ maxWidth: 200 }}>{defense.thesis}</TableCell>
                  <TableCell>{defense.room}</TableCell>
                  <TableCell>{defense.date}</TableCell>
                  <TableCell>{defense.time}</TableCell>
                  <TableCell>
                    <Chip
                      label={
                        defense.status === "completed"
                          ? "Hoàn thành"
                          : defense.status === "scheduled"
                            ? "Đã xếp lịch"
                            : "Chờ"
                      }
                      color={
                        defense.status === "completed"
                          ? "success"
                          : defense.status === "scheduled"
                            ? "info"
                            : "warning"
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {defense.score !== null ? (
                      <Chip
                        label={defense.score}
                        color="primary"
                        size="small"
                      />
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        —
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
}
