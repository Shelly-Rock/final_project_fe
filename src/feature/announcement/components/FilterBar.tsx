"use client";

import {
  Box,
  TextField,
  InputAdornment,
  Typography,
  Chip,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";

interface FilterBarProps {
  total: number;
  pinned: number;
  important: number;
  searchValue: string;
  onSearchChange: (value: string) => void;
  filteredCount: number;
}

export function FilterBar({
  total,
  pinned,
  important,
  searchValue,
  onSearchChange,
  filteredCount,
}: FilterBarProps) {
  return (
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
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Chip label={`Tổng: ${total}`} size="small" />
        <Chip label={`Đã ghim: ${pinned}`} size="small" color="primary" />
        <Chip label={`Quan trọng: ${important}`} size="small" color="error" />
        {filteredCount !== total && (
          <Typography variant="caption" color="text.secondary">
            (Đã lọc: {filteredCount})
          </Typography>
        )}
      </Box>

      <TextField
        size="small"
        placeholder="Tìm kiếm thông báo..."
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
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
  );
}
