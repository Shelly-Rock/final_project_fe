"use client";

import { useState, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Checkbox,
} from "@mui/material";
import {
  Search as SearchIcon,
  Download as ExportIcon,
  FilterList as FilterIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import * as XLSX from "xlsx";
import { StatusBadge } from "@/shared/components/StatusBadge";
import type { TopicCardStatus } from "@/shared/components/TopicCard";
import { useRouter } from "next/navigation";

interface SecretaryTopic {
  id: string;
  code: string;
  name: string;
  lecturer: string;
  department: string;
  slots: number;
  registered: number;
  status: TopicCardStatus;
  allowStudentProposal: boolean;
  createdAt: string;
}

const mockSecretaryTopics: SecretaryTopic[] = [
  { id: "1", code: "DT-001", name: "Ứng dụng AI trong y tế", lecturer: "TS. Nguyễn Văn A", department: "CNTT", slots: 3, registered: 2, status: "open", allowStudentProposal: true, createdAt: "2026-06-01" },
  { id: "2", code: "DT-002", name: "Hệ thống IoT cho nông nghiệp", lecturer: "ThS. Trần Thị B", department: "KTMT", slots: 2, registered: 2, status: "locked", allowStudentProposal: false, createdAt: "2026-06-02" },
  { id: "3", code: "DT-003", name: "Blockchain trong quản lý chuỗi cung ứng", lecturer: "PGS. Lê Văn C", department: "KHMT", slots: 4, registered: 4, status: "pending", allowStudentProposal: true, createdAt: "2026-06-03" },
  { id: "4", code: "DT-004", name: "Xử lý ngôn ngữ tự nhiên cho tiếng Việt", lecturer: "TS. Phạm Thị D", department: "KHMT", slots: 2, registered: 1, status: "open", allowStudentProposal: false, createdAt: "2026-06-04" },
  { id: "5", code: "DT-005", name: "Bảo mật mạng không dây 5G", lecturer: "GS. Hoàng Văn E", department: "ATTT", slots: 3, registered: 3, status: "locked", allowStudentProposal: true, createdAt: "2026-06-05" },
  { id: "6", code: "DT-006", name: "Ứng dụng AR/VR trong giáo dục", lecturer: "TS. Đặng Thị F", department: "CNTT", slots: 2, registered: 2, status: "pending", allowStudentProposal: false, createdAt: "2026-06-06" },
  { id: "7", code: "DT-007", name: "Tối ưu hóa thuật toán tìm đường", lecturer: "TS. Nguyễn Văn A", department: "CNTT", slots: 2, registered: 0, status: "open", allowStudentProposal: true, createdAt: "2026-06-07" },
  { id: "8", code: "DT-008", name: "An ninh mạng cho IoT", lecturer: "ThS. Vũ Văn G", department: "ATTT", slots: 3, registered: 1, status: "open", allowStudentProposal: false, createdAt: "2026-06-08" },
];

const DEPARTMENTS = ["Tất cả", "CNTT", "KHMT", "ATTT", "KTMT", "HTTT"];
const STATUS_OPTIONS: TopicCardStatus[] = ["open", "locked", "pending"];

export default function SecretaryTopicsPage() {
  const router = useRouter();
  const [topics] = useState<SecretaryTopic[]>(mockSecretaryTopics);
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("Tất cả");
  const [filterStatus, setFilterStatus] = useState<TopicCardStatus | "all">("all");
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = topics.filter((t) => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.lecturer.toLowerCase().includes(search.toLowerCase()) ||
      t.code.toLowerCase().includes(search.toLowerCase());
    const matchDept = filterDept === "Tất cả" || t.department === filterDept;
    const matchStatus = filterStatus === "all" || t.status === filterStatus;
    return matchSearch && matchDept && matchStatus;
  });

  const handleSelectAll = useCallback(() => {
    setSelected(selected.length === filtered.length ? [] : filtered.map((t) => t.id));
  }, [filtered, selected.length]);

  const handleSelectOne = useCallback((id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }, []);

  const handleExport = useCallback(() => {
    const data = filtered.map((t, idx) => ({
      STT: idx + 1,
      "Mã đề tài": t.code,
      "Tên đề tài": t.name,
      "GVHD": t.lecturer,
      "Khoa": t.department,
      "SL đăng ký": `${t.registered}/${t.slots}`,
      "Trạng thái": t.status === "open" ? "Mở" : t.status === "locked" ? "Đã khóa" : "Chờ duyệt",
      "SV tự đề xuất": t.allowStudentProposal ? "Có" : "Không",
      "Ngày tạo": t.createdAt,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DS_DeTai");
    XLSX.writeFile(wb, "DanhSachDeTai_TongHop.xlsx");
  }, [filtered]);

  const statusLabel: Record<TopicCardStatus, string> = {
    open: "Mở",
    locked: "Đã khóa",
    pending: "Chờ duyệt",
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
          Danh sách đề tài tổng hợp
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Quản lý và duyệt tất cả đề tài luận văn. Lọc, tìm kiếm và xuất báo cáo Excel.
        </Typography>
      </Box>

      {/* Summary cards */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2, mb: 3 }}>
        {[
          { label: "Tổng đề tài", value: topics.length, color: "primary" },
          { label: "Đang mở", value: topics.filter((t) => t.status === "open").length, color: "success" },
          { label: "Đã khóa", value: topics.filter((t) => t.status === "locked").length, color: "error" },
          { label: "Chờ duyệt", value: topics.filter((t) => t.status === "pending").length, color: "warning" },
        ].map((stat) => (
          <Paper key={stat.label} variant="outlined" sx={{ p: 2, textAlign: "center", borderColor: `${stat.color}.main` }}>
            <Typography variant="h4" sx={{ fontWeight: 900, color: `${stat.color}.main` }}>
              {stat.value}
            </Typography>
            <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
          </Paper>
        ))}
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ pb: "16px !important" }}>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
            <TextField
              size="small"
              placeholder="Tìm mã đề tài, tên, GVHD..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 280 }}
            />

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Lọc khoa</InputLabel>
              <Select
                label="Lọc khoa"
                value={filterDept}
                onChange={(e) => setFilterDept(e.target.value)}
              >
                {DEPARTMENTS.map((d) => (
                  <MenuItem key={d} value={d}>{d}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                label="Trạng thái"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as TopicCardStatus | "all")}
              >
                <MenuItem value="all">Tất cả</MenuItem>
                {STATUS_OPTIONS.map((s) => (
                  <MenuItem key={s} value={s}>{statusLabel[s]}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography variant="body2" color="text.secondary" sx={{ ml: "auto" }}>
              {filtered.length} / {topics.length} đề tài
            </Typography>

            <Button
              variant="contained"
              startIcon={<ExportIcon />}
              onClick={handleExport}
              size="small"
            >
              Xuất Excel ({selected.length})
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "primary.50" }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    size="small"
                    indeterminate={selected.length > 0 && selected.length < filtered.length}
                    checked={selected.length === filtered.length && filtered.length > 0}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Mã DT</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Tên đề tài</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>GVHD</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Khoa</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>SV/Max</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Trạng thái</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>SV tự đề xuất</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((topic) => (
                <TableRow
                  key={topic.id}
                  sx={{
                    bgcolor: selected.includes(topic.id) ? "selected" : undefined,
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      size="small"
                      checked={selected.includes(topic.id)}
                      onChange={() => handleSelectOne(topic.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: "monospace" }}>
                      {topic.code}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ maxWidth: 300 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {topic.name}
                    </Typography>
                  </TableCell>
                  <TableCell>{topic.lecturer}</TableCell>
                  <TableCell>{topic.department}</TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        color: topic.registered >= topic.slots ? "error.main" : "success.main",
                      }}
                    >
                      {topic.registered}/{topic.slots}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={topic.status} />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={topic.allowStudentProposal ? "Có" : "Không"}
                      size="small"
                      color={topic.allowStudentProposal ? "success" : "default"}
                      variant={topic.allowStudentProposal ? "filled" : "outlined"}
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Xem chi tiết">
                      <IconButton
                        size="small"
                        onClick={() => router.push(`/secretary/topics/${topic.id}/review`)}
                      >
                        <ViewIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    {topic.status === "pending" && (
                      <Tooltip title="Duyệt / Điều chỉnh">
                        <IconButton
                          size="small"
                          color="warning"
                          onClick={() => router.push(`/secretary/topics/${topic.id}/review`)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
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
