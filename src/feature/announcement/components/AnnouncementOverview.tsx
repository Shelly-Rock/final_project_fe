"use client";

import { Box, Typography, Card, CardContent, Chip } from "@mui/material";

interface AnnouncementOverviewProps {
  total: number;
  pinned: number;
  important: number;
}

export function AnnouncementOverview({
  total,
  pinned,
  important,
}: AnnouncementOverviewProps) {
  return (
    <Card sx={{ position: "sticky", top: 16 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Tổng quan
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2">Tổng thông báo</Typography>
            <Chip label={total} size="small" />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2">Đã ghim</Typography>
            <Chip label={pinned} size="small" color="primary" />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2">Quan trọng</Typography>
            <Chip label={important} size="small" color="error" />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
