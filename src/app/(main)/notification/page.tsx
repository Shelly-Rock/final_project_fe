"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  CircularProgress,
  useTheme,
  Tabs,
  Tab,
  Pagination,
} from "@mui/material";
import { notificationApi } from "@/shared/services/api/notification.api";
import { INotification } from "@/shared/types/notification.types";
import SendNotificationForm from "@/feature/notification/components/SendNotificationForm";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import SearchIcon from "@mui/icons-material/Search";

export default function NotificationPage() {
  const theme = useTheme();
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [formData, setFormData] = useState({ title: "", message: "" });

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      try {
        const data = await notificationApi.getNotifications({
          page: 1,
          limit: 50,
        });
        setNotifications(data.notifications);
        setError(null);
      } catch {
        // API not implemented - use mock data for development
        const mockNotifications: INotification[] = [
          {
            id: 1,
            title:
              "Nhắc hạn cuối nộp hồ sơ quyết toán kinh phí đề tài NCKH cấp Bộ đợt 2",
            message:
              "Phòng Quản lý Khoa học • Gửi tới 8 Khoa & 2 Viện trực thuộc",
            type: "STATUS_CHANGED",
            isRead: false,
            recipientId: 1,
            senderId: 2,
            createdAt: new Date(Date.now() - 10 * 60000).toISOString(),
          },
          {
            id: 2,
            title:
              "Kết luận cuộc họp giao ban công tác nghiệm thu đề tài NCKH Quý IV/2024",
            message: "Ban Giám Hiệu • Trưởng Khoa & Viện trưởng",
            type: "REPORT_APPROVED",
            isRead: true,
            recipientId: 1,
            senderId: 3,
            createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
          },
          {
            id: 3,
            title:
              "Đôn đốc nộp báo cáo tiến độ học thuật định kỳ tháng 12/2024",
            message:
              "Khoa Cơ khí & Ngoại ngữ chưa gửi • Hạn chót: 17:00 chiều nay",
            type: "REPORT_REJECTED",
            isRead: false,
            recipientId: 1,
            senderId: 4,
            createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
          },
          {
            id: 4,
            title:
              "Lịch bảo vệ đề cương nghiên cứu sinh và học viên cao học năm học 2024-2025",
            message: "Viện Sau Đại Học • Hội đồng chuyên môn & Giảng viên",
            type: "REPORT_SUBMITTED",
            isRead: true,
            recipientId: 1,
            senderId: 5,
            createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
          },
          {
            id: 5,
            title:
              "Kế hoạch phân bổ kinh phí đề tài tiềm năng khởi nghiệp đổi mới sáng tạo 2025",
            message: "GS.TS Lê Quang Huy • Đã lưu vào bộ nhớ tạm hôm qua",
            type: "BAN_APPLIED",
            isRead: false,
            recipientId: 1,
            senderId: 6,
            createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
          },
        ];
        setNotifications(mockNotifications);
        setError(null);
      }
    } catch (err) {
      setError("Failed to load notifications");
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await notificationApi.deleteNotification(id);
      setNotifications(notifications.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Failed to delete notification");
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await notificationApi.markAsRead([id]);
      fetchNotifications();
    } catch (err) {
      console.error("Failed to mark as read");
    }
  };

  const getTypeInfo = (type: string) => {
    const typeMap: Record<
      string,
      {
        label: string;
        color: "error" | "primary" | "success" | "warning" | "info";
        dotColor: string;
      }
    > = {
      STATUS_CHANGED: {
        label: "Hỏa tốc",
        color: "error",
        dotColor: "#f87171",
      },
      REPORT_SUBMITTED: {
        label: "Toàn trường",
        color: "primary",
        dotColor: "#38bdf8",
      },
      REPORT_APPROVED: {
        label: "Chỉ thị",
        color: "info",
        dotColor: "#a78bfa",
      },
      REPORT_REJECTED: {
        label: "Nhắc hạn",
        color: "warning",
        dotColor: "#fbbf24",
      },
      BAN_APPLIED: {
        label: "Bản nháp",
        color: "success",
        dotColor: "#34d399",
      },
      BAN_WARNING: {
        label: "Warning",
        color: "warning",
        dotColor: "#fbbf24",
      },
    };
    return (
      typeMap[type] || {
        label: "Thông báo",
        color: "primary",
        dotColor: "#38bdf8",
      }
    );
  };

  const getCategoryCount = (category: string) => {
    return notifications.filter((n) => {
      const typeInfo = getTypeInfo(n.type);
      if (category === "all") return true;
      return typeInfo.label.toLowerCase() === category.toLowerCase();
    }).length;
  };

  const filterTabs = [
    { id: "all", label: "Tất cả", count: notifications.length },
    { id: "hỏa tốc", label: "Hỏa tốc", count: getCategoryCount("Hỏa tốc") },
    {
      id: "toàn trường",
      label: "Toàn trường",
      count: getCategoryCount("Toàn trường"),
    },
    {
      id: "chỉ thị",
      label: "Chỉ thị",
      count: getCategoryCount("Chỉ thị"),
    },
    { id: "bản nháp", label: "Bản nháp", count: getCategoryCount("Bản nháp") },
  ];

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const totalCount = notifications.length;
  const urgentCount = getCategoryCount("Hỏa tốc") + getCategoryCount("Chỉ thị");
  const readRate =
    totalCount > 0
      ? Math.round(((totalCount - unreadCount) / totalCount) * 100)
      : 0;
  const pendingCount = unreadCount;

  const filteredNotifications = notifications.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.message.toLowerCase().includes(searchQuery.toLowerCase());
    if (filter === "all") return matchesSearch;
    const typeInfo = getTypeInfo(n.type);
    return (
      matchesSearch && typeInfo.label.toLowerCase() === filter.toLowerCase()
    );
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNotifications = filteredNotifications.slice(
    startIndex,
    startIndex + itemsPerPage,
  );
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Vừa xong";
    if (diffMins < 60) return `${diffMins}m trước`;
    if (diffHours < 24)
      return `Hôm nay ${date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}`;
    if (diffDays === 1) return "Hôm qua";
    return date.toLocaleDateString("vi-VN");
  };

  const handleSendNotification = async () => {
    try {
      if (formData.title && formData.message) {
        setShowModal(false);
        setFormData({ title: "", message: "" });
        fetchNotifications();
      }
    } catch (err) {
      console.error("Failed to send notification");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 4,
          pb: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Quản lý Thông báo
            </Typography>
            <Chip
              label="Executive Center"
              size="small"
              sx={{
                bgcolor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                fontSize: "0.75rem",
              }}
            />
          </Box>
          <Typography variant="body2" color="textSecondary">
            Điều phối chỉ thị học thuật, thông tri khẩn và theo dõi tiến độ tiếp
            nhận toàn trường
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowModal(true)}
          sx={{ whiteSpace: "nowrap" }}
        >
          Soạn thông báo
        </Button>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Tổng thông báo
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {totalCount}
              </Typography>
              <Typography variant="caption" color="success.main">
                +14% tháng này
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Khẩn cấp & Chỉ thị
              </Typography>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, color: theme.palette.error.main }}
              >
                {urgentCount}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                100% tiếp nhận
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Tỷ lệ đọc trung bình
              </Typography>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, color: theme.palette.success.main }}
              >
                {readRate}%
              </Typography>
              <Typography variant="caption" color="textSecondary">
                ~40m phản hồi
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Cần đôn đốc
              </Typography>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, color: theme.palette.warning.main }}
              >
                {pendingCount}
              </Typography>
              <Typography variant="caption" color="error">
                2 đơn vị trễ
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filter Tabs & Search */}
      <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Tabs
          value={filter}
          onChange={(e, newValue) => {
            setFilter(newValue);
            setCurrentPage(1);
          }}
          variant="scrollable"
          scrollButtons="auto"
        >
          {filterTabs.map((tab) => (
            <Tab
              key={tab.id}
              label={`${tab.label} ${tab.count}`}
              value={tab.id}
            />
          ))}
        </Tabs>
        <TextField
          placeholder="Tìm theo tiêu đề, người gửi..."
          size="small"
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ mr: 1, color: "textSecondary" }} />
            ),
          }}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          sx={{ ml: "auto", minWidth: 250 }}
        />
      </Box>

      {/* Table */}
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        {paginatedNotifications.length === 0 ? (
          <Box sx={{ p: 3, textAlign: "center", color: "textSecondary" }}>
            <Typography>No notifications found</Typography>
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: theme.palette.background.default }}>
                <TableCell>Tiêu đề thông báo & Đơn vị phát hành</TableCell>
                <TableCell align="right">Thời gian</TableCell>
                <TableCell align="center">Tiến độ tiếp nhận</TableCell>
                <TableCell align="right">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedNotifications.map((notification) => {
                const typeInfo = getTypeInfo(notification.type);
                const isUnread = !notification.isRead;
                const readPercent = 92; // Mock data

                return (
                  <TableRow
                    key={notification.id}
                    sx={{ "&:hover": { bgcolor: theme.palette.action.hover } }}
                  >
                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 2,
                          alignItems: "flex-start",
                        }}
                      >
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor: typeInfo.dotColor,
                            mt: 1,
                            flexShrink: 0,
                          }}
                        />
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Box
                            sx={{
                              display: "flex",
                              gap: 1,
                              alignItems: "center",
                              mb: 0.5,
                            }}
                          >
                            <Chip
                              label={typeInfo.label}
                              size="small"
                              color={typeInfo.color}
                              variant="outlined"
                            />
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600, flexShrink: 1 }}
                              noWrap
                            >
                              {notification.title}
                            </Typography>
                          </Box>
                          <Typography
                            variant="caption"
                            color="textSecondary"
                            sx={{ display: "block" }}
                          >
                            {notification.message}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="caption">
                        {formatDate(notification.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ minWidth: 120 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 0.5,
                          }}
                        >
                          <Typography variant="caption">
                            {isUnread ? "Unread" : "Read"}
                          </Typography>
                          <Typography
                            variant="caption"
                            color={isUnread ? "error" : "success"}
                          >
                            {readPercent}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={readPercent}
                          color={isUnread ? "error" : "success"}
                        />
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      {!notification.isRead && (
                        <IconButton
                          size="small"
                          onClick={() => handleMarkAsRead(notification.id)}
                          title="Mark as read"
                        >
                          <CheckIcon fontSize="small" />
                        </IconButton>
                      )}
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(notification.id)}
                        color="error"
                        title="Delete"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(e, page) => setCurrentPage(page)}
          />
        </Box>
      )}

      {/* Compose Modal */}
      {showModal && (
        <SendNotificationForm
          onSuccess={() => {
            setShowModal(false);
            fetchNotifications();
          }}
          onClose={() => setShowModal(false)}
        />
      )}
    </Box>
  );
}
