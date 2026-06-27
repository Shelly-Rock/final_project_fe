"use client";

import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Button,
  Box,
  Avatar,
  AvatarGroup,
  Tooltip,
  Divider,
} from "@mui/material";
import {
  BookmarkAdd as RegisterIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  ExpandMore as ExpandIcon,
} from "@mui/icons-material";
import { useState } from "react";
import { StatusBadge } from "./StatusBadge";

export type TopicCardStatus = "open" | "locked" | "pending";

export interface TopicCardTopic {
  id: string;
  name: string;
  description?: string;
  department: string;
  lecturer: string;
  lecturerAvatar?: string;
  slots: number;
  registered: number;
  status: TopicCardStatus;
  applicants?: { id: string; name: string; avatar?: string; priority: number }[];
  allowStudentProposal?: boolean;
  maxApplications?: number;
  deadline?: Date | string;
}

interface TopicCardProps {
  topic: TopicCardTopic;
  onRegister?: (topic: TopicCardTopic) => void;
  onViewDetail?: (topic: TopicCardProps["topic"]) => void;
  isStudent?: boolean;
  canLock?: boolean;
  onLock?: (topic: TopicCardTopic) => void;
  selected?: boolean;
  onSelect?: (topic: TopicCardTopic) => void;
}

export function TopicCard({
  topic,
  onRegister,
  onViewDetail,
  isStudent = false,
  canLock = false,
  onLock,
  selected = false,
  onSelect,
}: TopicCardProps) {
  const [expanded, setExpanded] = useState(false);

  const isFull = topic.registered >= topic.slots;
  const isLocked = topic.status === "locked";
  const isPending = topic.status === "pending";
  const canRegister = isStudent && topic.status === "open" && !isFull;

  const priorityColors = ["success", "info", "warning", "default"];

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        opacity: isLocked ? 0.7 : 1,
        border: selected ? "2px solid" : "1px solid",
        borderColor: selected ? "primary.main" : "divider",
        borderRadius: 2,
        transition: "all 0.2s",
        "&:hover": {
          boxShadow: 4,
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        {/* Header: Status + Department */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
          <StatusBadge status={topic.status} />
          <Chip label={topic.department} size="small" variant="outlined" />
        </Box>

        {/* Title */}
        <Typography
          variant="h6"
          sx={{
            mb: 1,
            fontWeight: 700,
            fontSize: "0.95rem",
            lineHeight: 1.4,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {topic.name}
        </Typography>

        {/* Lecturer */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
          <Avatar sx={{ width: 24, height: 24, fontSize: "0.7rem", bgcolor: "primary.main" }}>
            {topic.lecturer.charAt(0)}
          </Avatar>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8rem" }}>
            {topic.lecturer}
          </Typography>
        </Box>

        {/* Slots progress */}
        <Box sx={{ mb: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              <PeopleIcon sx={{ fontSize: 12, mr: 0.3, verticalAlign: "middle" }} />
              Đã đăng ký
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                color: isFull ? "error.main" : "success.main",
              }}
            >
              {topic.registered}/{topic.slots}
            </Typography>
          </Box>
          <Box
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: "grey.200",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                height: "100%",
                width: `${(topic.registered / topic.slots) * 100}%`,
                bgcolor: isFull ? "error.main" : "success.main",
                borderRadius: 3,
                transition: "width 0.3s",
              }}
            />
          </Box>
        </Box>

        {/* Allow student proposal badge */}
        {topic.allowStudentProposal && (
          <Chip
            icon={<SchoolIcon sx={{ fontSize: "14px !important" }} />}
            label="SV tự đề xuất"
            size="small"
            color="info"
            variant="outlined"
            sx={{ mb: 1, fontSize: "0.7rem" }}
          />
        )}

        {/* Applicants */}
        {topic.applicants && topic.applicants.length > 0 && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: "block" }}>
              Ứng viên ({topic.applicants.length}):
            </Typography>
            <AvatarGroup max={5} sx={{ "& .MuiAvatar-root": { width: 24, height: 24, fontSize: "0.65rem" } }}>
              {topic.applicants.map((app) => (
                <Tooltip
                  key={app.id}
                  title={`${app.name} — NV${app.priority}`}
                >
                  <Avatar
                    sx={{
                      bgcolor:
                        priorityColors[app.priority - 1] === "success"
                          ? "success.main"
                          : priorityColors[app.priority - 1] === "info"
                          ? "info.main"
                          : priorityColors[app.priority - 1] === "warning"
                          ? "warning.main"
                          : "grey.main",
                      fontSize: "0.65rem",
                    }}
                  >
                    {app.name.charAt(0)}
                  </Avatar>
                </Tooltip>
              ))}
            </AvatarGroup>
          </Box>
        )}

        {/* Expanded description */}
        {expanded && topic.description && (
          <Box
            sx={{
              mt: 1.5,
              p: 1.5,
              bgcolor: "grey.50",
              borderRadius: 1,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              Mô tả:
            </Typography>
            <Typography variant="caption" sx={{ display: "block", mt: 0.5 }}>
              {topic.description}
            </Typography>
          </Box>
        )}
      </CardContent>

      <Divider />

      <CardActions sx={{ px: 2, py: 1, justifyContent: "space-between" }}>
        <Button
          size="small"
          variant="text"
          onClick={() => setExpanded(!expanded)}
          endIcon={<ExpandIcon sx={{ rotate: expanded ? "180deg" : "0deg", transition: "0.2s" }} />}
          sx={{ fontSize: "0.75rem" }}
        >
          {expanded ? "Thu gọn" : "Chi tiết"}
        </Button>

        <Box sx={{ display: "flex", gap: 1 }}>
          {onViewDetail && (
            <Button
              size="small"
              variant="outlined"
              onClick={() => onViewDetail(topic)}
              sx={{ fontSize: "0.75rem" }}
            >
              Xem
            </Button>
          )}

          {isStudent && onSelect && (
            <Button
              size="small"
              variant={selected ? "contained" : "outlined"}
              color={selected ? "primary" : "inherit"}
              onClick={() => onSelect(topic)}
              sx={{ fontSize: "0.75rem" }}
            >
              {selected ? "Bỏ chọn" : "Chọn"}
            </Button>
          )}

          {canRegister && onRegister && (
            <Button
              size="small"
              variant="contained"
              color="primary"
              startIcon={<RegisterIcon />}
              onClick={() => onRegister(topic)}
              sx={{ fontSize: "0.75rem" }}
            >
              Đăng ký
            </Button>
          )}

          {canLock && onLock && (
            <Button
              size="small"
              variant="outlined"
              color={isLocked ? "success" : "error"}
              onClick={() => onLock(topic)}
              sx={{ fontSize: "0.75rem" }}
            >
              {isLocked ? "Mở khóa" : "Khóa"}
            </Button>
          )}
        </Box>
      </CardActions>
    </Card>
  );
}
