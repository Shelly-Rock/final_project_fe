"use client";

import Box from "@mui/material/Box";
import {
  PageHeader,
  OverviewStats,
  FacultyCharts,
  ThesisTrendChart,
} from "@/feature/homepage";

export default function DashboardPage() {
  return (
    <Box className="dashboard-page">
      <PageHeader />
      <OverviewStats />

      {/* Faculty Charts Row */}
      <Box className="dashboard-section">
        <FacultyCharts />
      </Box>

      {/* Row 2: Thesis Trend Chart */}
      <Box className="dashboard-section">
        <ThesisTrendChart />
      </Box>
    </Box>
  );
}
