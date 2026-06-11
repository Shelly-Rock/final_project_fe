"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import { PageHeader, FilterBar } from "@/shared/components";
import { mockAuditLogs, actionColors } from "@/feature/audit/constants";

export default function AuditPage() {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");

  const filteredLogs = mockAuditLogs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.resource.toLowerCase().includes(search.toLowerCase());
    const matchesAction = actionFilter === "all" || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  return (
    <Box sx={{ p: 3 }}>
      <PageHeader
        title="Nhật ký hệ thống"
        subtitle="Theo dõi các hoạt động trong hệ thống"
      />

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {mockAuditLogs.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tổng hoạt động
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {mockAuditLogs.filter((l) => l.status === "failed").length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Hoạt động thất bại
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {mockAuditLogs.filter((l) => l.action === "login").length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Đăng nhập
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {new Set(mockAuditLogs.map((l) => l.user)).size}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Người dùng hoạt động
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <FilterBar
        totalCount={mockAuditLogs.length}
        filteredCount={filteredLogs.length}
      >
        <TextField
          size="small"
          placeholder="Tìm kiếm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 250 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Hoạt động</InputLabel>
          <Select
            value={actionFilter}
            label="Hoạt động"
            onChange={(e) => setActionFilter(e.target.value)}
          >
            <MenuItem value="all">Tất cả</MenuItem>
            <MenuItem value="login">Đăng nhập</MenuItem>
            <MenuItem value="create">Tạo mới</MenuItem>
            <MenuItem value="update">Cập nhật</MenuItem>
            <MenuItem value="delete">Xóa</MenuItem>
            <MenuItem value="export">Xuất</MenuItem>
            <MenuItem value="import">Nhập</MenuItem>
          </Select>
        </FormControl>
      </FilterBar>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "grey.100" }}>
                <TableCell sx={{ fontWeight: 600 }}>Thời gian</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Người dùng</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Hoạt động</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Tài nguyên</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>IP</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.timestamp}</TableCell>
                  <TableCell>{log.user}</TableCell>
                  <TableCell>
                    <Chip
                      label={log.action}
                      color={actionColors[log.action]}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{log.resource}</TableCell>
                  <TableCell>{log.ip}</TableCell>
                  <TableCell>
                    <Chip
                      label={
                        log.status === "success" ? "Thành công" : "Thất bại"
                      }
                      color={log.status === "success" ? "success" : "error"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Xem chi tiết">
                      <IconButton size="small">
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}
