"use client";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Collapse,
} from "@mui/material";
import {
  PushPin as PinIcon,
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon,
} from "@mui/icons-material";
import { useState } from "react";
import type { Announcement } from "@/feature/announcement/constants";

interface AnnouncementListProps {
  announcements: Announcement[];
}

export function AnnouncementList({ announcements }: AnnouncementListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (announcements.length === 0) {
    return (
      <Box sx={{ py: 4, textAlign: "center" }}>
        <Typography color="text.secondary">Không có thông báo nào</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {announcements.map((announcement) => (
        <Card
          key={announcement.id}
          sx={{
            borderLeft: announcement.pinned
              ? "4px solid #1976d2"
              : announcement.important
                ? "4px solid #d32f2f"
                : "4px solid #e0e0e0",
          }}
        >
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
              <Box sx={{ flexGrow: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 0.5,
                  }}
                >
                  {announcement.pinned && (
                    <PinIcon sx={{ fontSize: 16, color: "primary.main" }} />
                  )}
                  <Typography
                    variant="h6"
                    sx={{ fontSize: "1rem", fontWeight: 600 }}
                  >
                    {announcement.title}
                  </Typography>
                </Box>

                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <Chip
                    label={
                      announcement.pinned
                        ? "Đã ghim"
                        : announcement.important
                          ? "Quan trọng"
                          : "Thường"
                    }
                    size="small"
                    color={
                      announcement.pinned
                        ? "primary"
                        : announcement.important
                          ? "error"
                          : "default"
                    }
                    variant={
                      announcement.pinned || announcement.important
                        ? "filled"
                        : "outlined"
                    }
                  />
                  <Typography variant="caption" color="text.secondary">
                    {announcement.author} •{" "}
                    {new Date(announcement.date).toLocaleDateString("vi-VN")}
                  </Typography>
                </Box>

                <Collapse in={expandedId === announcement.id}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    {announcement.content}
                  </Typography>
                </Collapse>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                  onClick={() =>
                    setExpandedId(
                      expandedId === announcement.id ? null : announcement.id,
                    )
                  }
                >
                  {expandedId === announcement.id ? (
                    <>
                      <CollapseIcon sx={{ fontSize: 16 }} /> Thu gọn
                    </>
                  ) : (
                    <>
                      <ExpandIcon sx={{ fontSize: 16 }} /> Xem thêm
                    </>
                  )}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
