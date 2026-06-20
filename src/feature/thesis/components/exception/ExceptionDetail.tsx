"use client";

import {
  Paper,
  Typography,
  Box,
  Chip,
  Stack,
  Divider,
  Card,
  CardContent,
  Avatar,
  Button,
} from "@mui/material";
import {
  Person as PersonIcon,
  AccessTime as TimeIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  History as HistoryIcon,
  Circle as CircleIcon,
} from "@mui/icons-material";
import {
  getExceptionStatusColor,
  getExceptionTypeLabel,
} from "@/feature/thesis/constants";
import type { ThesisException } from "@/feature/thesis/types";

interface ExceptionDetailProps {
  exception: ThesisException;
  onApprove?: (exception: ThesisException) => void;
  onReject?: (exception: ThesisException) => void;
}

export function ExceptionDetail({
  exception,
  onApprove,
  onReject,
}: ExceptionDetailProps) {
  const getStatusIcon = (status: ThesisException["status"]) => {
    switch (status) {
      case "approved":
        return <ApproveIcon />;
      case "rejected":
        return <RejectIcon />;
      case "resolved":
        return <CheckCircleIcon />;
      default:
        return <HistoryIcon />;
    }
  };

  const getStatusColor = (status: ThesisException["status"]) => {
    switch (status) {
      case "approved":
        return "success";
      case "rejected":
        return "error";
      case "resolved":
        return "info";
      default:
        return "warning";
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
        <Box>
          <Typography variant="h5" gutterBottom>
            Chi tiết yêu cầu
          </Typography>
          <Stack direction="row" spacing={1}>
            <Chip label={`Mã: ${exception.id}`} size="small" variant="outlined" />
            <Chip
              label={getExceptionTypeLabel(exception.type)}
              size="small"
              variant="outlined"
            />
          </Stack>
        </Box>
        <Chip
          icon={getStatusIcon(exception.status)}
          label={
            exception.status === "pending"
              ? "Chờ xử lý"
              : exception.status === "approved"
                ? "Đã duyệt"
                : exception.status === "rejected"
                  ? "Từ chối"
                  : "Đã giải quyết"
          }
          color={getStatusColor(exception.status)}
          sx={{ fontWeight: 500 }}
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Student Info */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Thông tin sinh viên
          </Typography>
          <Stack spacing={1}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar sx={{ bgcolor: "primary.main" }}>
                {exception.studentName.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="body2" fontWeight={500}>
                  {exception.studentName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  ID: {exception.studentId}
                </Typography>
              </Box>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Exception Details */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Chi tiết yêu cầu
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Lý do
            </Typography>
            <Typography variant="body2">{exception.reason}</Typography>
          </Box>

          {exception.supportingDocuments && exception.supportingDocuments.length > 0 && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Tài liệu đính kèm
              </Typography>
              <Stack direction="row" spacing={1}>
                {exception.supportingDocuments.map((doc, idx) => (
                  <Chip key={idx} label={doc} size="small" variant="outlined" />
                ))}
              </Stack>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Processing Info */}
      {exception.processedBy && (
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Thông tin xử lý
            </Typography>
            <Stack spacing={1}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PersonIcon fontSize="small" color="action" />
                <Typography variant="body2">
                  Người xử lý: {exception.processedBy}
                </Typography>
              </Box>
              {exception.processedAt && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <TimeIcon fontSize="small" color="action" />
                  <Typography variant="body2">
                    Ngày xử lý: {exception.processedAt}
                  </Typography>
                </Box>
              )}
              {exception.processedNote && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Ghi chú:
                  </Typography>
                  <Typography variant="body2">{exception.processedNote}</Typography>
                </Box>
              )}
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* History Timeline */}
      {exception.history && exception.history.length > 0 && (
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Lịch sử xử lý
            </Typography>
            <Box sx={{ pl: 2 }}>
              {exception.history.map((item, index) => (
                <Box key={index} sx={{ display: "flex", mb: 2, position: "relative" }}>
                  <CircleIcon 
                    sx={{ 
                      fontSize: 12, 
                      mr: 2, 
                      mt: 0.5,
                      color: index === 0 ? "primary.main" : "grey.400"
                    }} 
                  />
                  {index < exception.history!.length - 1 && (
                    <Box sx={{ 
                      position: "absolute", 
                      left: 5, 
                      top: 16, 
                      bottom: -16, 
                      width: 2, 
                      bgcolor: "grey.300" 
                    }} />
                  )}
                  <Box>
                    <Typography variant="body2" fontWeight={500}>
                      {item.action}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.performedBy} - {item.performedAt}
                    </Typography>
                    {item.note && (
                      <Typography variant="caption" color="text.secondary" display="block">
                        Ghi chú: {item.note}
                      </Typography>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      {exception.status === "pending" && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button
            variant="outlined"
            color="error"
            onClick={() => onReject?.(exception)}
          >
            Từ chối
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => onApprove?.(exception)}
          >
            Phê duyệt
          </Button>
        </Box>
      )}
    </Paper>
  );
}

function CheckCircleIcon() {
  return <CircleIcon sx={{ fontSize: 12, mr: 2, mt: 0.5, color: "success.main" }} />;
}
