"use client";

import { useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import { usePermissionContext } from "@/core/providers/PermissionProvider";
import { ROLE_LABELS, ROLE_COLORS, ROLE } from "@/core/permissions/types";
import { ROLE_PAGE_TITLES } from "@/feature/homepage/roleData";
import { useDebounce } from "@/shared/hooks";

const ACADEMIC_YEARS = [2026, 2025, 2024, 2023, 2022];

interface PageHeaderProps {
  customTitle?: string;
}

export function PageHeader({ customTitle }: PageHeaderProps) {
  const { role } = usePermissionContext();
  const [year, setYear] = useState<number>(2026);
  const [facultyInput, setFacultyInput] = useState<string>("");
  const debouncedFaculty = useDebounce(facultyInput, 300);

  const roleLabel = useMemo(
    () => (role ? ROLE_LABELS[role] : "Người dùng"),
    [role]
  );

  const roleColor = useMemo(
    () =>
      role
        ? ROLE_COLORS[role]
        : { bg: "#f3f4f6", color: "#6b7280", border: "#e5e7eb" },
    [role]
  );

  const pageInfo = useMemo(
    () => (role ? ROLE_PAGE_TITLES[role] : ROLE_PAGE_TITLES[ROLE.ADMIN]),
    [role]
  );

  const title = useMemo(
    () => customTitle ?? pageInfo.title,
    [customTitle, pageInfo]
  );

  const faculty = debouncedFaculty || "Tất cả khoa";

  return (
    <Box className="dashboard-header">
      <Box>
        <Typography className="dashboard-title">{title}</Typography>
        <Box className="dashboard-welcome">
          <Typography className="dashboard-subtitle">
            Chào mừng bạn quay trở lại,{" "}
          </Typography>
          <Box
            className="dashboard-role-badge"
            sx={{
              background: roleColor.bg,
              color: roleColor.color,
              border: `1px solid ${roleColor.border}`,
            }}
          >
            {roleLabel}
          </Box>
        </Box>
      </Box>
      <Box className="dashboard-header-actions">
        {/* Filter by Academic Year */}
        <FormControl size="small" className="filter-select">
          <Select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            displayEmpty
            sx={{
              minWidth: 120,
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#e5e7eb",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#2a5bc0",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#2a5bc0",
                borderWidth: 2,
              },
            }}
          >
            {ACADEMIC_YEARS.map((y) => (
              <MenuItem key={y} value={y}>
                Khóa {y}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Search by Faculty */}
        <FormControl size="small" className="filter-search">
          <OutlinedInput
            placeholder="Tìm kiếm theo khoa..."
            value={facultyInput}
            onChange={(e) => setFacultyInput(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <i
                  className="bi bi-search"
                  style={{ fontSize: "1rem", color: "#9ca3af" }}
                />
              </InputAdornment>
            }
            sx={{
              minWidth: 200,
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#e5e7eb",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#2a5bc0",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#2a5bc0",
                borderWidth: 2,
              },
            }}
          />
        </FormControl>
      </Box>
    </Box>
  );
}
