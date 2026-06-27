"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Search as SearchIcon,
  BookmarkAdd as RegisterIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material";
import { TopicCard } from "@/shared/components/TopicCard";
import { DeadlineCountdownBanner } from "@/shared/components/DeadlineCountdownBanner";
import type { TopicCardTopic } from "@/shared/components/TopicCard";

const REGISTRATION_DEADLINE = new Date("2026-07-15T23:59:59");
const MAX_APPLICATIONS = 3;

const mockTopics: TopicCardTopic[] = [
  { id: "1", name: "Ứng dụng AI trong y tế", description: "Nghiên cứu AI trong chẩn đoán hình ảnh y khoa.", department: "CNTT", lecturer: "TS. Nguyễn Văn A", slots: 3, registered: 2, status: "open" },
  { id: "2", name: "Hệ thống IoT cho nông nghiệp thông minh", description: "Giám sát và điều khiển tưới tiêu tự động.", department: "KTMT", lecturer: "ThS. Trần Thị B", slots: 2, registered: 1, status: "open" },
  { id: "3", name: "Blockchain trong quản lý chuỗi cung ứng", description: "Ứng dụng blockchain trong truy xuất nguồn gốc.", department: "KHMT", lecturer: "PGS. Lê Văn C", slots: 4, registered: 4, status: "locked" },
  { id: "4", name: "Xử lý ngôn ngữ tự nhiên cho tiếng Việt", description: "Chatbot thông minh hỗ trợ sinh viên.", department: "KHMT", lecturer: "TS. Phạm Thị D", slots: 2, registered: 0, status: "open" },
  { id: "5", name: "Bảo mật mạng không dây 5G", description: "Nghiên cứu các lỗ hổng bảo mật 5G.", department: "ATTT", lecturer: "GS. Hoàng Văn E", slots: 3, registered: 2, status: "open" },
  { id: "6", name: "Ứng dụng AR/VR trong giáo dục", description: "Xây dựng ứng dụng AR/VR cho học tập.", department: "CNTT", lecturer: "TS. Đặng Thị F", slots: 2, registered: 1, status: "open" },
  { id: "7", name: "Tối ưu hóa thuật toán tìm đường", description: "A*, Dijkstra trong điều kiện thực tế.", department: "CNTT", lecturer: "TS. Nguyễn Văn A", slots: 2, registered: 0, status: "open", allowStudentProposal: true },
  { id: "8", name: "An ninh mạng cho IoT", description: "Bảo mật thiết bị IoT trong nhà thông minh.", department: "ATTT", lecturer: "ThS. Vũ Văn G", slots: 3, registered: 1, status: "open" },
];

const DEPARTMENTS = ["Tất cả", "CNTT", "KHMT", "KTMT", "ATTT", "HTTT", "MMT&TT"];

export default function StudentTopicsPage() {
  const router = useRouter();
  const [topics] = useState<TopicCardTopic[]>(mockTopics);
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("Tất cả");
  const [selectedTopics, setSelectedTopics] = useState<TopicCardTopic[]>([]);
  const [registerDialog, setRegisterDialog] = useState<{ open: boolean; topic: TopicCardTopic | null }>({
    open: false,
    topic: null,
  });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" | "warning" }>({ open: false, message: "", severity: "success" });

  const filtered = topics.filter((t) => {
    const matchSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.lecturer.toLowerCase().includes(search.toLowerCase());
    const matchDept = filterDept === "Tất cả" || t.department === filterDept;
    return matchSearch && matchDept;
  });

  const handleSelect = useCallback(
    (topic: TopicCardTopic) => {
      setSelectedTopics((prev) => {
        const exists = prev.some((t) => t.id === topic.id);
        if (exists) return prev.filter((t) => t.id !== topic.id);
        if (prev.length >= MAX_APPLICATIONS) {
          setSnackbar({ open: true, message: `Chỉ được chọn tối đa ${MAX_APPLICATIONS} đề tài!`, severity: "warning" });
          return prev;
        }
        return [...prev, topic];
      });
    },
    []
  );

  const handleRegister = useCallback(() => {
    if (selectedTopics.length === 0) {
      setSnackbar({ open: true, message: "Vui lòng chọn ít nhất 1 đề tài!", severity: "warning" });
      return;
    }
    setSnackbar({ open: true, message: `Đã đăng ký ${selectedTopics.length} đề tài thành công!`, severity: "success" });
    setSelectedTopics([]);
    router.push("/student/my-applications");
  }, [selectedTopics, router]);

  const now = new Date();
  const isExpired = now >= REGISTRATION_DEADLINE;

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
          Đăng ký đề tài
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Chọn và đăng ký tối đa <strong>{MAX_APPLICATIONS} đề tài</strong> theo thứ tự ưu tiên.
        </Typography>
      </Box>

      {/* Deadline */}
      <Box sx={{ mb: 3, maxWidth: 500 }}>
        <DeadlineCountdownBanner deadline={REGISTRATION_DEADLINE} />
      </Box>

      {/* Selected topics banner */}
      {selectedTopics.length > 0 && (
        <Alert
          severity="info"
          sx={{ mb: 3 }}
          action={
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                size="small"
                color="inherit"
                onClick={() => router.push("/student/my-applications")}
              >
                Sắp xếp ưu tiên
              </Button>
              <Button size="small" variant="contained" onClick={handleRegister}>
                Xác nhận đăng ký ({selectedTopics.length})
              </Button>
            </Box>
          }
        >
          <Typography variant="body2">
            Đã chọn <strong>{selectedTopics.length}/{MAX_APPLICATIONS}</strong> đề tài:
          </Typography>
          <Box sx={{ display: "flex", gap: 1, mt: 0.5, flexWrap: "wrap" }}>
            {selectedTopics.map((t, idx) => (
              <Chip
                key={t.id}
                label={`NV${idx + 1}: ${t.name.substring(0, 30)}...`}
                size="small"
                color="primary"
                onDelete={() => handleSelect(t)}
              />
            ))}
          </Box>
        </Alert>
      )}

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ pb: "16px !important" }}>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
            <TextField
              size="small"
              placeholder="Tìm kiếm theo tên đề tài, GVHD..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 300 }}
            />

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Khoa</InputLabel>
              <Select
                label="Khoa"
                value={filterDept}
                onChange={(e) => setFilterDept(e.target.value)}
              >
                {DEPARTMENTS.map((d) => (
                  <MenuItem key={d} value={d}>{d}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Chip
              icon={<FilterIcon />}
              label={`${filtered.length} đề tài`}
              size="small"
              variant="outlined"
              sx={{ ml: "auto" }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Grid */}
      <Grid container spacing={3}>
        {filtered.map((topic) => (
          <Grid item xs={12} md={6} lg={4} key={topic.id}>
            <TopicCard
              topic={topic}
              isStudent
              selected={selectedTopics.some((t) => t.id === topic.id)}
              onSelect={handleSelect}
              onRegister={(t) => setRegisterDialog({ open: true, topic: t })}
              onViewDetail={(t) => setRegisterDialog({ open: true, topic: t })}
            />
          </Grid>
        ))}

        {filtered.length === 0 && (
          <Grid item xs={12}>
            <Box sx={{ textAlign: "center", py: 6, color: "text.secondary" }}>
              <Typography variant="body1">Không tìm thấy đề tài phù hợp.</Typography>
            </Box>
          </Grid>
        )}
      </Grid>

      {/* Register dialog */}
      <Dialog
        open={registerDialog.open}
        onClose={() => setRegisterDialog({ open: false, topic: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Đăng ký đề tài</DialogTitle>
        <DialogContent>
          {registerDialog.topic && (
            <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Bạn muốn đăng ký đề tài:
              </Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {registerDialog.topic.name}
                </Typography>
                <Typography variant="caption">
                  GVHD: {registerDialog.topic.lecturer} • {registerDialog.topic.department}
                </Typography>
              </Alert>
              <Typography variant="caption" color="text.secondary">
                Đề tài sẽ được thêm vào danh sách ưu tiên. Bạn có thể sắp xếp lại thứ tự tại trang "Nguyện vọng của tôi".
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRegisterDialog({ open: false, topic: null })}>Hủy</Button>
          <Button
            variant="contained"
            startIcon={<RegisterIcon />}
            onClick={() => {
              if (registerDialog.topic) handleSelect(registerDialog.topic);
              setRegisterDialog({ open: false, topic: null });
            }}
            disabled={isExpired}
          >
            {isExpired ? "Đã hết hạn" : "Đăng ký"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
