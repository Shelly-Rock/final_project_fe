"use client";

import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import type { TemplateItem, CategoryType, StageType } from "../types";
import { categoryConfig, stageConfig } from "../types";

interface TemplateFilterProps {
  searchText: string;
  onSearchChange: (value: string) => void;
  selectedCategory: CategoryType | "all";
  onCategoryChange: (value: CategoryType | "all") => void;
  selectedStage: StageType | "all";
  onStageChange: (value: StageType | "all") => void;
  onRefresh?: () => void;
  totalCount: number;
  filteredCount: number;
}

export function TemplateFilter({
  searchText,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedStage,
  onStageChange,
  onRefresh,
  totalCount,
  filteredCount,
}: TemplateFilterProps) {
  const allCategories: (CategoryType | "all")[] = [
    "all",
    "admin",
    "secretary",
    "teacher",
    "student",
  ];
  const allStages: (StageType | "all")[] = [
    "all",
    "preparation",
    "assignment",
    "execution",
    "evaluation",
  ];

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", md: "center" }}
        >
          <TextField
            size="small"
            placeholder="Tìm kiếm theo tên, mã..."
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 250 }}
          />

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Theo vai trò</InputLabel>
            <Select
              value={selectedCategory}
              label="Theo vai trò"
              onChange={(e) => onCategoryChange(e.target.value as CategoryType | "all")}
            >
              {allCategories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat === "all" ? "Tất cả" : categoryConfig[cat as CategoryType].label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Theo giai đoạn</InputLabel>
            <Select
              value={selectedStage}
              label="Theo giai đoạn"
              onChange={(e) => onStageChange(e.target.value as StageType | "all")}
            >
              {allStages.map((stage) => (
                <MenuItem key={stage} value={stage}>
                  {stage === "all" ? "Tất cả" : stageConfig[stage as StageType].label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ flex: 1 }} />

          {onRefresh && (
            <Tooltip title="Làm mới">
              <IconButton onClick={onRefresh}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          )}
        </Stack>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Tổng cộng: <strong>{filteredCount}</strong> biểu mẫu
            {filteredCount !== totalCount && (
              <span> (đã lọc từ {totalCount})</span>
            )}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
