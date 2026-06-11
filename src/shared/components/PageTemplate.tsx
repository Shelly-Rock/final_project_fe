// ============================================================
// SHARED - Page Template Component
// ============================================================
"use client";

import { Box, Typography, Paper, Button } from "@mui/material";
import { Refresh as RefreshIcon } from "@mui/icons-material";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 3,
      }}
    >
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
      {actions && <Box sx={{ display: "flex", gap: 1 }}>{actions}</Box>}
    </Box>
  );
}

interface FilterBarProps {
  children: React.ReactNode;
  onSearch?: (value: string) => void;
  searchPlaceholder?: string;
  onRefresh?: () => void;
  totalCount?: number;
  filteredCount?: number;
}

export function FilterBar({
  children,
  onRefresh,
  totalCount,
  filteredCount,
}: FilterBarProps) {
  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Box
        sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}
      >
        {children}
        <Box sx={{ flex: 1 }} />
        {onRefresh && (
          <Button size="small" startIcon={<RefreshIcon />} onClick={onRefresh}>
            Làm mới
          </Button>
        )}
      </Box>
      {(totalCount !== undefined || filteredCount !== undefined) && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Tổng: <strong>{filteredCount ?? totalCount}</strong>
            {filteredCount !== undefined &&
              totalCount !== undefined &&
              filteredCount !== totalCount && (
                <span> (đã lọc từ {totalCount})</span>
              )}
          </Typography>
        </Box>
      )}
    </Paper>
  );
}
