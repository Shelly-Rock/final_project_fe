"use client";

import { Box, Typography, Paper, ToggleButtonGroup, ToggleButton } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

export interface MonthlyStat {
  month: string; // "2026-03", "T3/2026", v.v.
  pass: number;
  fail: number;
  total: number;
}

interface StatBarChartProps {
  data: MonthlyStat[];
  height?: number;
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const pass = payload.find((p: any) => p.dataKey === "pass");
  const fail = payload.find((p: any) => p.dataKey === "fail");
  return (
    <Paper sx={{ p: 1.5, border: "1px solid", borderColor: "divider" }}>
      <Typography variant="caption" sx={{ fontWeight: 700, display: "block", mb: 0.5 }}>
        {label}
      </Typography>
      {pass && (
        <Typography variant="caption" sx={{ color: "success.main", display: "block" }}>
          Đạt: {pass.value}
        </Typography>
      )}
      {fail && (
        <Typography variant="caption" sx={{ color: "error.main", display: "block" }}>
          Rớt: {fail.value}
        </Typography>
      )}
      <Typography variant="caption" sx={{ color: "text.secondary", display: "block", borderTop: "1px solid", mt: 0.5, pt: 0.5 }}>
        Tổng: {(pass?.value ?? 0) + (fail?.value ?? 0)}
      </Typography>
    </Paper>
  );
}

export function StatBarChart({ data, height = 300 }: StatBarChartProps) {
  if (!data.length) {
    return (
      <Box sx={{ height, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography variant="body2" color="text.secondary">
          Không có dữ liệu thống kê
        </Typography>
      </Box>
    );
  }

  const maxVal = Math.max(...data.map((d) => d.pass + d.fail));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
        barCategoryGap="25%"
        barGap={2}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11 }}
          tickLine={false}
          axisLine={{ stroke: "#e0e0e0" }}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          domain={[0, Math.ceil(maxVal * 1.15)]}
          width={32}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
        <Legend
          wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
          formatter={(value) => (
            <span style={{ fontSize: 12 }}>
              {value === "pass" ? "Đạt" : "Rớt"}
            </span>
          )}
        />
        <Bar dataKey="pass" name="pass" fill="#2e7d32" radius={[4, 4, 0, 0]} maxBarSize={48}>
          {data.map((_, idx) => (
            <Cell key={`pass-${idx}`} fill="#2e7d32" />
          ))}
        </Bar>
        <Bar dataKey="fail" name="fail" fill="#c62828" radius={[4, 4, 0, 0]} maxBarSize={48}>
          {data.map((_, idx) => (
            <Cell key={`fail-${idx}`} fill="#c62828" />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
