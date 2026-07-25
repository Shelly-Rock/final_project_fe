"use client";

import { useState } from "react";
import { Box, Typography, Divider, Alert } from "@mui/material";
import {
  User,
  Mail,
  Building2,
  Target,
  Wrench,
  Award,
  Calendar,
  Clock,
  Printer,
} from "lucide-react";
import { Dialog, Button, Badge } from "@/shared/components";
import type { AvailableTopic, RegistrationRequest } from "../types";

// InfoItem component - defined outside to avoid recreation during render
function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, mb: 2 }}>
      <Box sx={{ color: "#2563eb", mt: 0.25 }}>{icon}</Box>
      <Box sx={{ flex: 1 }}>
        <Typography
          variant="caption"
          sx={{ color: "text.secondary", display: "block", mb: 0.25 }}
        >
          {label}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {value}
        </Typography>
      </Box>
    </Box>
  );
}

interface TopicDetailDialogProps {
  open: boolean;
  onClose: () => void;
  topic: AvailableTopic | null;
  registration?: RegistrationRequest | null;
  onRegister: (topicId: string) => Promise<void>;
  onPrintConfirmation?: (registration: RegistrationRequest) => void;
  isExpired?: boolean;
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
    icon: <Award size={16} />,
  },
  Rejected: {
    label: "Từ chối",
    color: "error" as const,
    icon: <Clock size={16} />,
  },
};

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
          mb: 3,
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
      description="Thông tin chi tiết đề tài khóa luận"
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
            <Button color="primary" onClick={handleRegister} loading={loading}>
              Gửi yêu cầu đăng ký
            </Button>
          )}
        </>
      }
    >
      <Box sx={{ px: 1 }}>
        {renderStatusSection()}

        <InfoItem
          icon={<User size={16} />}
          label="Giảng viên hướng dẫn"
          value={topic.teacherName}
        />

        <InfoItem
          icon={<Mail size={16} />}
          label="Email giảng viên"
          value={topic.teacherEmail}
        />

        <InfoItem
          icon={<Building2 size={16} />}
          label="Khoa"
          value={topic.department}
        />

        <InfoItem
          icon={<Calendar size={16} />}
          label="Sĩ số"
          value={`${topic.registeredCount}/${topic.maxStudents} sinh viên`}
        />

        <Divider sx={{ my: 2 }} />

        <Typography
          variant="subtitle2"
          sx={{
            color: "text.secondary",
            mb: 1.5,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Target size={14} /> Mục tiêu
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6 }}>
          {topic.objectives}
        </Typography>

        <Typography
          variant="subtitle2"
          sx={{
            color: "text.secondary",
            mb: 1.5,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Wrench size={14} /> Yêu cầu kỹ thuật
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6 }}>
          {topic.technicalRequirements}
        </Typography>

        <Typography
          variant="subtitle2"
          sx={{
            color: "text.secondary",
            mb: 1.5,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Award size={14} /> Kết quả mong đợi
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6 }}>
          {topic.expectedOutcome}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="body2" color="text.secondary">
          {topic.description}
        </Typography>
      </Box>
    </Dialog>
  );
}
