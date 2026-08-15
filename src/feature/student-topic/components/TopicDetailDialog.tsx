"use client";

import { useState } from "react";
import { Box, Typography, Divider, Alert, Tabs, Tab } from "@mui/material";
import {
  User,
  Mail,
  Building2,
  Calendar,
  Clock,
  Printer,
  Users,
  BookOpen,
  Target,
  Monitor,
} from "lucide-react";
import { Dialog, Button, Badge } from "@/shared/components";
import type { AvailableTopic, RegistrationRequest } from "../types";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`topic-detail-tabpanel-${index}`}
      aria-labelledby={`topic-detail-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}

const statusConfig = {
  Pending: {
    label: "Chờ duyệt",
    color: "warning" as const,
    icon: <Clock size={16} />,
  },
  Approved: {
    label: "Đã duyệt",
    color: "success" as const,
    icon: <BookOpen size={16} />,
  },
  Rejected: {
    label: "Từ chối",
    color: "error" as const,
    icon: <Clock size={16} />,
  },
};

// Trạng thái đăng ký cho sinh viên xem
const registrationStatusConfig = {
  OPEN: {
    label: "Mở đăng ký",
    color: "success" as const,
    bgColor: "#dcfce7",
    textColor: "#166534",
  },
  FULL: {
    label: "Đã đầy",
    color: "warning" as const,
    bgColor: "#fef3c7",
    textColor: "#92400e",
  },
  LOCKED: {
    label: "Đã chốt danh sách",
    color: "default" as const,
    bgColor: "#f3f4f6",
    textColor: "#6b7280",
  },
};

interface TopicDetailDialogProps {
  open: boolean;
  onClose: () => void;
  topic: AvailableTopic | null;
  registration?: RegistrationRequest | null;
  onRegister: (topicId: string) => Promise<void>;
  onPrintConfirmation?: (registration: RegistrationRequest) => void;
  isExpired?: boolean;
}

export function TopicDetailDialog({
  open,
  onClose,
  topic,
  registration,
  onRegister,
  onPrintConfirmation,
  isExpired = false,
}: TopicDetailDialogProps) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  if (!topic) return null;

  const handleRegister = async () => {
    setLoading(true);
    try {
      await onRegister(topic.id);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    if (registration && onPrintConfirmation) {
      onPrintConfirmation(registration);
    }
  };

  const renderStatusSection = () => {
    if (!registration) return null;

    const status = statusConfig[registration.status];

    return (
      <Alert
        severity={
          registration.status === "Approved"
            ? "success"
            : registration.status === "Rejected"
              ? "error"
              : "warning"
        }
        sx={{
          mb: 2,
          borderRadius: 2,
          bgcolor: "background.default",
          color: "text.primary",
          "& .MuiAlert-icon": {
            color:
              registration.status === "Approved"
                ? "success.main"
                : registration.status === "Rejected"
                  ? "error.main"
                  : "warning.main",
          },
        }}
        icon={status.icon}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            Trạng thái đăng ký:
          </Typography>
          <Badge label={status.label} color={status.color} variant="soft" />
        </Box>
        {registration.status === "Rejected" && registration.rejectionReason && (
          <Typography variant="caption" sx={{ display: "block", mt: 1 }}>
            Lý do: {registration.rejectionReason}
          </Typography>
        )}
        {registration.status === "Approved" && (
          <Typography variant="caption" sx={{ display: "block", mt: 1 }}>
            Bạn đã được duyệt đăng ký đề tài này. Có thể in phiếu xác nhận.
          </Typography>
        )}
      </Alert>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={topic.name}
      description={
        topic.englishName
          ? `English: ${topic.englishName}`
          : "Thông tin chi tiết đề tài khóa luận"
      }
      size="lg"
      actions={
        <>
          <Button variant="outlined" onClick={onClose}>
            Đóng
          </Button>
          {registration?.status === "Approved" && onPrintConfirmation && (
            <Button
              color="success"
              leftIcon={<Printer size={16} />}
              onClick={handlePrint}
            >
              In phiếu xác nhận
            </Button>
          )}
          {!isExpired && !registration && (
            <Button
              color="primary"
              onClick={handleRegister}
              loading={loading}
              disabled={
                topic.registeredCount >= topic.maxStudents ||
                topic.registrationStatus === "LOCKED"
              }
              sx={{
                opacity: topic.registrationStatus === "LOCKED" ? 0.6 : 1,
                cursor:
                  topic.registrationStatus === "LOCKED"
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              {topic.registrationStatus === "LOCKED"
                ? "Không thể đăng ký"
                : topic.registeredCount >= topic.maxStudents
                  ? "Đề tài đã đầy"
                  : "Gửi yêu cầu đăng ký"}
            </Button>
          )}
        </>
      }
    >
      <Box sx={{ px: 1 }}>
        {renderStatusSection()}

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={(_event, newValue) => setActiveTab(newValue)}
          sx={{
            minHeight: 36,
            mb: 1,
            "& .MuiTab-root": {
              minHeight: 36,
              textTransform: "none",
              fontWeight: 500,
            },
          }}
        >
          <Tab label="Thông tin đề tài" />
          <Tab
            label={
              <Box
                component="span"
                sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
              >
                <Users size={14} />
                Danh sách sinh viên ({topic.registeredStudents?.length || 0}/
                {topic.maxStudents})
              </Box>
            }
          />
        </Tabs>

        {/* Tab 1: Thông tin đề tài */}
        <TabPanel value={activeTab} index={0}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            {/* Giảng viên */}
            <Box>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <User size={14} style={{ color: "#2563eb" }} />
                <Typography variant="caption" color="text.secondary">
                  Giảng viên hướng dẫn
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {topic.teacherName}
              </Typography>
            </Box>

            {/* Email */}
            <Box>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <Mail size={14} style={{ color: "#2563eb" }} />
                <Typography variant="caption" color="text.secondary">
                  Email giảng viên
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {topic.teacherEmail}
              </Typography>
            </Box>

            {/* Khoa */}
            <Box>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <Building2 size={14} style={{ color: "#2563eb" }} />
                <Typography variant="caption" color="text.secondary">
                  Khoa
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {topic.department}
              </Typography>
            </Box>

            {/* Sĩ số */}
            <Box>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <Calendar size={14} style={{ color: "#2563eb" }} />
                <Typography variant="caption" color="text.secondary">
                  Sĩ số
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {topic.registeredCount}/{topic.maxStudents} sinh viên
                </Typography>
                {/* Badge trạng thái đăng ký */}
                <Box
                  component="span"
                  sx={{
                    px: 1,
                    py: 0.25,
                    borderRadius: 1,
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    bgcolor:
                      registrationStatusConfig[topic.registrationStatus]
                        .bgColor,
                    color:
                      registrationStatusConfig[topic.registrationStatus]
                        .textColor,
                  }}
                >
                  {registrationStatusConfig[topic.registrationStatus].label}
                </Box>
              </Box>
            </Box>

            <Divider />

            {/* Mô tả đề tài */}
            <Box>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <BookOpen size={14} style={{ color: "#2563eb" }} />
                <Typography variant="caption" color="text.secondary">
                  Mô tả đề tài
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{ lineHeight: 1.6, whiteSpace: "pre-wrap" }}
              >
                {topic.description || "Chưa có mô tả"}
              </Typography>
            </Box>

            {/* Mục tiêu đề tài */}
            {topic.objectives && (
              <Box>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <Target size={14} style={{ color: "#2563eb" }} />
                  <Typography variant="caption" color="text.secondary">
                    Mục tiêu đề tài
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{ lineHeight: 1.6, whiteSpace: "pre-wrap" }}
                >
                  {topic.objectives}
                </Typography>
              </Box>
            )}

            {/* Công nghệ sử dụng */}
            {topic.technologies && (
              <Box>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <Monitor size={14} style={{ color: "#2563eb" }} />
                  <Typography variant="caption" color="text.secondary">
                    Công nghệ sử dụng
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{ lineHeight: 1.6, whiteSpace: "pre-wrap" }}
                >
                  {topic.technologies}
                </Typography>
              </Box>
            )}
          </Box>
        </TabPanel>

        {/* Tab 2: Danh sách sinh viên */}
        <TabPanel value={activeTab} index={1}>
          {topic.registeredStudents && topic.registeredStudents.length > 0 ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {topic.registeredStudents.map((student, index) => (
                <Box
                  key={student.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 1.5,
                    borderRadius: 1,
                    bgcolor: "action.hover",
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                    }}
                  >
                    {student.order || index + 1}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {student.studentName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      MSSV: {student.studentCode}
                    </Typography>
                  </Box>
                  {student.registeredAt && (
                    <Typography variant="caption" color="text.secondary">
                      {new Date(student.registeredAt).toLocaleDateString(
                        "vi-VN",
                      )}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                py: 4,
                color: "text.secondary",
              }}
            >
              <Users size={48} strokeWidth={1} />
              <Typography variant="body2" sx={{ mt: 1 }}>
                Chưa có sinh viên đăng ký
              </Typography>
            </Box>
          )}
        </TabPanel>
      </Box>
    </Dialog>
  );
}
