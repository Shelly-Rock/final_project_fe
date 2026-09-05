"use client";

import { Box } from "@mui/material";
import { Card, CardContentDiv } from "@/shared/components";
import { Input } from "@/shared/components";
import { Select } from "@/shared/components";
import { Search } from "lucide-react";
import type { ScoringType, ScoringStatus } from "../services";

interface ScoringFilterCardProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  scoringType: ScoringType | "ALL";
  onScoringTypeChange: (value: ScoringType | "ALL") => void;
  status: ScoringStatus | "ALL";
  onStatusChange: (value: ScoringStatus | "ALL") => void;
}

export function ScoringFilterCard({
  searchQuery,
  onSearchChange,
  scoringType,
  onScoringTypeChange,
  status,
  onStatusChange,
}: ScoringFilterCardProps) {
  return (
    <Card>
      <CardContentDiv padding={2}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Input
              placeholder="Tìm kiếm đề tài, sinh viên..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              leftIcon={<Search size={18} />}
              fullWidth
            />
          </Box>

          <Select
            value={scoringType}
            onChange={(v) => onScoringTypeChange(v as ScoringType | "ALL")}
            placeholder="Loại chấm"
            options={[
              { value: "ALL", label: "Tất cả loại" },
              { value: "GVHD", label: "GVHD" },
              { value: "COMMITTEE", label: "Hội đồng" },
            ]}
            sx={{ minWidth: 150 }}
          />

          <Select
            value={status}
            onChange={(v) => onStatusChange(v as ScoringStatus | "ALL")}
            placeholder="Trạng thái"
            options={[
              { value: "ALL", label: "Tất cả" },
              { value: "PENDING", label: "Chưa chấm" },
              { value: "IN_PROGRESS", label: "Đang chấm" },
              { value: "SUBMITTED", label: "Đã nộp" },
              { value: "FAILED", label: "Rớt" },
            ]}
            sx={{ minWidth: 150 }}
          />
        </Box>
      </CardContentDiv>
    </Card>
  );
}
