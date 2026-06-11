"use client";

import { useState } from "react";
import { Box, Chip } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { PageHeader } from "@/shared/components";
import { AnnouncementList } from "@/feature/announcement/components";
import { mockAnnouncements } from "@/feature/announcement/constants";
import { usePermissionContext } from "@/core/providers/PermissionProvider";
import { ROLE } from "@/core/permissions/types";

export default function AnnouncementPage() {
  const { role } = usePermissionContext();
  const [search, setSearch] = useState("");
  const [showPinned, setShowPinned] = useState(false);

  let announcements = mockAnnouncements.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.content.toLowerCase().includes(search.toLowerCase()),
  );

  // Role-specific filtering
  if (role === ROLE.STUDENT) {
    announcements = announcements.filter((a) => a.important || a.pinned);
  }

  if (showPinned) {
    announcements = announcements.filter((a) => a.pinned);
  }

  const sortedAnnouncements = [...announcements].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const pinnedCount = mockAnnouncements.filter((a) => a.pinned).length;
  const importantCount = mockAnnouncements.filter((a) => a.important).length;

  return (
    <Box sx={{ p: 3 }}>
      <PageHeader
        title="Thông báo"
        subtitle={
          role === ROLE.STUDENT
            ? "Thông tin quan trọng dành cho sinh viên"
            : "Quản lý thông báo hệ thống"
        }
      />

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
          p: 2,
          bgcolor: "background.paper",
          borderRadius: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Chip label={`Tổng: ${mockAnnouncements.length}`} size="small" />
          <Chip
            label={`Đã ghim: ${pinnedCount}`}
            size="small"
            color="primary"
          />
          <Chip
            label={`Quan trọng: ${importantCount}`}
            size="small"
            color="error"
          />
          <Chip
            label={showPinned ? "Bỏ lọc ghim" : "Chỉ ghim"}
            size="small"
            variant={showPinned ? "filled" : "outlined"}
            onClick={() => setShowPinned(!showPinned)}
            sx={{ cursor: "pointer" }}
          />
        </Box>

        <TextField
          size="small"
          placeholder="Tìm kiếm thông báo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 250 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <AnnouncementList announcements={sortedAnnouncements} />
    </Box>
  );
}
