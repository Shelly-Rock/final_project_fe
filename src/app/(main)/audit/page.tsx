"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  MenuItem,
  Table as MuiTable,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  CircularProgress,
  Chip,
} from "@mui/material";
import { PageHeader } from "@/shared/components";
import { ClipboardList } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "@/shared/theme";
import {
  auditService,
  type AuditLog,
  type AuditQueryParams,
} from "@/feature/audit/services/audit.service";

const ENTITY_TYPE_LABEL: Record<string, string> = {
  ROLE: "Vai trò",
  USER: "Tài khoản",
  PROJECT: "Đề tài",
  REPORT: "Báo cáo",
};

const ACTION_LABEL: Record<string, string> = {
  CREATE: "Tạo mới",
  UPDATE: "Cập nhật",
  DELETE: "Xóa",
  ASSIGN: "Gán",
  APPROVE: "Duyệt",
  REJECT: "Từ chối",
};

const ACTION_COLOR: Record<string, string> = {
  CREATE: "#10b981",
  UPDATE: "#3b82f6",
  DELETE: "#ef4444",
  ASSIGN: "#8b5cf6",
  APPROVE: "#059669",
  REJECT: "#dc2626",
};

export default function AuditPage() {
  const { resolvedMode } = useTheme();
  const isDark = resolvedMode === "dark";

  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const limit = 20;

  const [filters, setFilters] = useState<AuditQueryParams>({});

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await auditService.getLogs({
        page,
        limit,
        ...filters,
      });
      setLogs(res.data);
      setTotal(res.total);
    } catch (e: unknown) {
      const msg =
        e instanceof Error ? e.message : "Không tải được nhật ký audit";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleFilterChange = (key: keyof AuditQueryParams, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }));
    setPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <Box sx={{ p: 3, width: "100%" }}>
      <PageHeader
        title="Nhật ký Audit"
        subtitle="Theo dõi mọi thao tác quan trọng trong hệ thống"
        illustration={<ClipboardList size={56} strokeWidth={1.5} />}
        showBgImage
      />

      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          p: 2.5,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        {/* Filters */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 2.5,
            flexWrap: "wrap",
          }}
        >
          <TextField
            select
            size="small"
            label="Loại thực thể"
            value={filters.entity_type || ""}
            onChange={(e) => handleFilterChange("entity_type", e.target.value)}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="ROLE">Vai trò</MenuItem>
            <MenuItem value="USER">Tài khoản</MenuItem>
            <MenuItem value="PROJECT">Đề tài</MenuItem>
            <MenuItem value="REPORT">Báo cáo</MenuItem>
          </TextField>

          <TextField
            select
            size="small"
            label="Hành động"
            value={filters.action || ""}
            onChange={(e) => handleFilterChange("action", e.target.value)}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="CREATE">Tạo mới</MenuItem>
            <MenuItem value="UPDATE">Cập nhật</MenuItem>
            <MenuItem value="DELETE">Xóa</MenuItem>
            <MenuItem value="ASSIGN">Gán</MenuItem>
            <MenuItem value="APPROVE">Duyệt</MenuItem>
            <MenuItem value="REJECT">Từ chối</MenuItem>
          </TextField>

          <TextField
            size="small"
            label="ID thực thể"
            type="number"
            value={filters.entity_id || ""}
            onChange={(e) => handleFilterChange("entity_id", e.target.value)}
            sx={{ minWidth: 140 }}
          />

          <TextField
            size="small"
            label="ID người thao tác"
            type="number"
            value={filters.actor_user_id || ""}
            onChange={(e) => handleFilterChange("actor_user_id", e.target.value)}
            sx={{ minWidth: 160 }}
          />

          <Box sx={{ flex: 1 }} />

          <Button variant="outlined" onClick={fetchLogs} disabled={loading}>
            {loading ? <CircularProgress size={16} /> : "Làm mới"}
          </Button>
        </Box>

        {/* Table */}
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: isDark ? "#334155" : "#e2e8f0",
            borderRadius: 2,
          }}
        >
          <MuiTable size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: isDark ? "#1e293b" : "#f8fafc" }}>
                <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Thời gian</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Người thao tác</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Hành động</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Thực thể</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Lý do</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      Chưa có nhật ký nào
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.id} hover>
                    <TableCell>{log.id}</TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {new Date(log.created_at).toLocaleString("vi-VN")}
                    </TableCell>
                    <TableCell>
                      {log.actor ? (
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {log.actor.username}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {log.actor.email}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontStyle: "italic" }}
                        >
                          ID {log.actor_user_id}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={ACTION_LABEL[log.action] || log.action}
                        size="small"
                        sx={{
                          bgcolor: ACTION_COLOR[log.action] || "#6b7280",
                          color: "#fff",
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {ENTITY_TYPE_LABEL[log.entity_type] || log.entity_type}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {log.entity_id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="caption"
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          maxWidth: 280,
                        }}
                      >
                        {log.reason || "—"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </MuiTable>
        </TableContainer>

        {/* Pagination */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 1.5,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Tổng {total} bản ghi — Trang {page}/{totalPages}
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              size="small"
              variant="outlined"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Trước
            </Button>
            <Button
              size="small"
              variant="outlined"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Sau
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
