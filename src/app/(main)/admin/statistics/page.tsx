"use client";

import { useState, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Chip,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  TrendingUp as TrendIcon,
  School as SchoolIcon,
  Groups as GroupsIcon,
  CheckCircle as PassIcon,
  Cancel as FailIcon,
} from "@mui/icons-material";
import { StatBarChart, type MonthlyStat } from "@/shared/components/StatBarChart";
import { TeacherStatsTable, type TeacherStat } from "@/shared/components/TeacherStatsTable";
import { ExportExcelButton } from "@/shared/components/ExportExcelButton";

const MONTHLY_STATS: MonthlyStat[] = [
  { month: "T9/2025", pass: 45, fail: 3, total: 48 },
  { month: "T10/2025", pass: 52, fail: 5, total: 57 },
  { month: "T11/2025", pass: 61, fail: 4, total: 65 },
  { month: "T12/2025", pass: 78, fail: 6, total: 84 },
  { month: "T1/2026", pass: 33, fail: 2, total: 35 },
  { month: "T2/2026", pass: 28, fail: 1, total: 29 },
  { month: "T3/2026", pass: 55, fail: 7, total: 62 },
  { month: "T4/2026", pass: 48, fail: 4, total: 52 },
  { month: "T5/2026", pass: 67, fail: 5, total: 72 },
  { month: "T6/2026", pass: 89, fail: 8, total: 97 },
];

const TEACHER_STATS: TeacherStat[] = [
  {
    id: "gv01",
    name: "TS. Nguyễn Văn A",
    email: "nvana@khoa.edu.vn",
    department: "Khoa học Máy tính",
    thesisCount: 8,
    councilRoles: { chutich: 3, thuky: 1, uyvien: 5, phanbienNgoai: 4 },
    avgThesisScore: 85.2,
    avgCouncilScore: 81.5,
    totalRoles: 13,
  },
  {
    id: "gv02",
    name: "PGS. Lê Văn B",
    email: "lvanb@khoa.edu.vn",
    department: "Khoa học Máy tính",
    thesisCount: 12,
    councilRoles: { chutich: 5, thuky: 3, uyvien: 2, phanbienNgoai: 2 },
    avgThesisScore: 79.8,
    avgCouncilScore: 82.0,
    totalRoles: 12,
  },
  {
    id: "gv03",
    name: "TS. Trần Thị C",
    email: "ttc@khoa.edu.vn",
    department: "Hệ thống Thông tin",
    thesisCount: 6,
    councilRoles: { chutich: 2, thuky: 4, uyvien: 6, phanbienNgoai: 3 },
    avgThesisScore: 88.1,
    avgCouncilScore: 85.7,
    totalRoles: 15,
  },
  {
    id: "gv04",
    name: "ThS. Hoàng Văn D",
    email: "hvd@khoa.edu.vn",
    department: "Khoa học Máy tính",
    thesisCount: 5,
    councilRoles: { chutich: 1, thuky: 2, uyvien: 8, phanbienNgoai: 1 },
    avgThesisScore: 76.4,
    avgCouncilScore: 78.2,
    totalRoles: 12,
  },
  {
    id: "gv05",
    name: "PGS. Phạm Thị E",
    email: "pte@khoa.edu.vn",
    department: "Mạng & An toàn",
    thesisCount: 10,
    councilRoles: { chutich: 4, thuky: 1, uyvien: 3, phanbienNgoai: 5 },
    avgThesisScore: 83.5,
    avgCouncilScore: 80.3,
    totalRoles: 13,
  },
  {
    id: "gv06",
    name: "TS. Vũ Văn F",
    email: "vvf@khoa.edu.vn",
    department: "Khoa học Máy tính",
    thesisCount: 3,
    councilRoles: { chutich: 1, thuky: 2, uyvien: 4, phanbienNgoai: 0 },
    avgThesisScore: 72.0,
    avgCouncilScore: 75.0,
    totalRoles: 7,
  },
  {
    id: "gv07",
    name: "ThS. Đặng Thị G",
    email: "dtg@khoa.edu.vn",
    department: "CNTT",
    thesisCount: 7,
    councilRoles: { chutich: 2, thuky: 3, uyvien: 1, phanbienNgoai: 2 },
    avgThesisScore: 81.0,
    avgCouncilScore: 79.5,
    totalRoles: 8,
  },
  {
    id: "gv08",
    name: "TS. Bùi Văn H",
    email: "bvh@khoa.edu.vn",
    department: "Khoa học Máy tính",
    thesisCount: 9,
    councilRoles: { chutich: 3, thuky: 2, uyvien: 2, phanbienNgoai: 3 },
    avgThesisScore: 84.7,
    avgCouncilScore: 83.2,
    totalRoles: 10,
  },
];

const OVERALL_STATS = {
  totalTheses: MONTHLY_STATS.reduce((s, m) => s + m.total, 0),
  totalPass: MONTHLY_STATS.reduce((s, m) => s + m.pass, 0),
  totalFail: MONTHLY_STATS.reduce((s, m) => s + m.fail, 0),
  passRate: 0,
  totalTeachers: TEACHER_STATS.length,
  totalTopics: TEACHER_STATS.reduce((s, t) => s + t.thesisCount, 0),
  totalCouncilRoles: TEACHER_STATS.reduce((s, t) => s + t.totalRoles, 0),
};
OVERALL_STATS.passRate = Math.round((OVERALL_STATS.totalPass / OVERALL_STATS.totalTheses) * 100);

export default function AdminStatisticsPage() {
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  const excelSheets = useCallback((): Parameters<typeof ExportExcelButton>[0]["sheets"] => {
    return [
      {
        sheetName: "Tổng quan",
        data: [
          {
            "Metric": "Tổng luận văn",
            "Value": OVERALL_STATS.totalTheses,
          },
          {
            "Metric": "Đạt",
            "Value": OVERALL_STATS.totalPass,
          },
          {
            "Metric": "Rớt",
            "Value": OVERALL_STATS.totalFail,
          },
          {
            "Metric": "Tỷ lệ đạt (%)",
            "Value": OVERALL_STATS.passRate,
          },
          {
            "Metric": "Tổng giảng viên",
            "Value": OVERALL_STATS.totalTeachers,
          },
          {
            "Metric": "Tổng đề tài hướng dẫn",
            "Value": OVERALL_STATS.totalTopics,
          },
          {
            "Metric": "Tổng vai trò HĐ",
            "Value": OVERALL_STATS.totalCouncilRoles,
          },
        ],
      },
      {
        sheetName: "Theo tháng",
        data: MONTHLY_STATS.map((m, idx) => ({
          STT: idx + 1,
          "Tháng": m.month,
          "Đạt": m.pass,
          "Rớt": m.fail,
          "Tổng": m.total,
          "Tỷ lệ (%)": Math.round((m.pass / m.total) * 100),
        })),
      },
      {
        sheetName: "Thống kê GV",
        data: TEACHER_STATS.map((t, idx) => ({
          STT: idx + 1,
          "Họ tên": t.name,
          Email: t.email,
          Khoa: t.department,
          "Đề tài GVHD": t.thesisCount,
          "CT HĐ": t.councilRoles.chutich,
          "TK HĐ": t.councilRoles.thuky,
          "UV HĐ": t.councilRoles.uyvien,
          "PB ngoài": t.councilRoles.phanbienNgoai,
          "Tổng vai trò": t.totalRoles,
          "Điểm LV TB": t.avgThesisScore?.toFixed(1),
          "Điểm HĐ TB": t.avgCouncilScore?.toFixed(1),
        })),
      },
      {
        sheetName: "Phân bố loại",
        data: [
          { "Xếp loại": "A", "Số lượng": 12, "Tỷ lệ (%)": 8.4 },
          { "Xếp loại": "B", "Số lượng": 28, "Tỷ lệ (%)": 19.6 },
          { "Xếp loại": "C", "Số lượng": 55, "Tỷ lệ (%)": 38.5 },
          { "Xếp loại": "D", "Số lượng": 30, "Tỷ lệ (%)": 21.0 },
          { "Xếp loại": "F", "Số lượng": 18, "Tỷ lệ (%)": 12.6 },
        ],
      },
    ];
  }, []);

  const gradeDist = [
    { grade: "A", count: 12, color: "success" },
    { grade: "B", count: 28, color: "info" },
    { grade: "C", count: 55, color: "primary" },
    { grade: "D", count: 30, color: "warning" },
    { grade: "F", count: 18, color: "error" },
  ];
  const maxGrade = Math.max(...gradeDist.map((g) => g.count));

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
            Thống kê & Báo cáo
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tổng quan hoạt động bảo vệ luận văn — Học kỳ 2025–2026
          </Typography>
        </Box>
        <ExportExcelButton
          sheets={excelSheets()}
          filename="BaoCaoTongHop_HK2026"
          variant="contained"
          color="success"
          label="Xuất Excel"
        />
      </Box>

      {/* KPI cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          {
            label: "Tổng luận văn",
            value: OVERALL_STATS.totalTheses,
            icon: <SchoolIcon />,
            color: "primary",
            sub: "Tất cả các đợt",
          },
          {
            label: "Tỷ lệ đạt",
            value: `${OVERALL_STATS.passRate}%`,
            icon: <PassIcon />,
            color: "success",
            sub: `${OVERALL_STATS.totalPass} đạt / ${OVERALL_STATS.totalFail} rớt`,
          },
          {
            label: "Giảng viên",
            value: OVERALL_STATS.totalTeachers,
            icon: <GroupsIcon />,
            color: "info",
            sub: `${OVERALL_STATS.totalCouncilRoles} vai trò HĐ`,
          },
          {
            label: "Đề tài hướng dẫn",
            value: OVERALL_STATS.totalTopics,
            icon: <TrendIcon />,
            color: "warning",
            sub: "GVHD các khoa",
          },
        ].map((kpi) => (
          <Grid item xs={6} sm={3} key={kpi.label}>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: 2,
                borderColor: `${kpi.color}.200`,
                bgcolor: `${kpi.color}.50`,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">{kpi.label}</Typography>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 900, color: `${kpi.color}.main`, lineHeight: 1.1 }}
                  >
                    {kpi.value}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">{kpi.sub}</Typography>
                </Box>
                <Box sx={{ color: `${kpi.color}.main`, opacity: 0.7 }}>
                  {kpi.icon}
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Bar chart: pass/fail by month */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Tỷ lệ đạt/rớt theo tháng
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Biểu đồ cột — {MONTHLY_STATS.length} tháng gần nhất
                  </Typography>
                </Box>
                <Chip
                  label={`Pass rate: ${OVERALL_STATS.passRate}%`}
                  color="success"
                  size="small"
                  sx={{ fontWeight: 700 }}
                />
              </Box>
              <StatBarChart data={MONTHLY_STATS} height={320} />
            </CardContent>
          </Card>
        </Grid>

        {/* Grade distribution */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                Phân bố xếp loại
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {gradeDist.map((g) => {
                  const pct = Math.round((g.count / OVERALL_STATS.totalTheses) * 100);
                  return (
                    <Box key={g.grade}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                        <Chip
                          label={`Loại ${g.grade}`}
                          size="small"
                          color={g.color as "success" | "info" | "primary" | "warning" | "error"}
                          sx={{ fontWeight: 900 }}
                        />
                        <Typography variant="caption" sx={{ fontWeight: 700, fontFamily: "monospace" }}>
                          {g.count} ({pct}%)
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          height: 20,
                          bgcolor: "grey.100",
                          borderRadius: 1,
                          overflow: "hidden",
                        }}
                      >
                        <Box
                          sx={{
                            height: "100%",
                            width: `${(g.count / maxGrade) * 100}%`,
                            bgcolor: `${g.color}.main`,
                            borderRadius: 1,
                            transition: "width 0.5s ease",
                          }}
                        />
                      </Box>
                    </Box>
                  );
                })}
              </Box>
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="caption">
                  <strong>143/164</strong> sinh viên đạt (loại C trở lên).
                  21 sinh viên xếp loại D/F.
                </Typography>
              </Alert>
            </CardContent>
          </Card>
        </Grid>

        {/* Teacher stats table */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Thống kê giảng viên
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Số đề tài hướng dẫn, vai trò Hội đồng, điểm trung bình
                  </Typography>
                </Box>
                <Chip
                  label={`${TEACHER_STATS.length} giảng viên`}
                  color="primary"
                  size="small"
                  variant="outlined"
                />
              </Box>
              <TeacherStatsTable teachers={TEACHER_STATS} showScores />
            </CardContent>
          </Card>
        </Grid>

        {/* Monthly breakdown table */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                Bảng chi tiết theo tháng
              </Typography>
              <Box sx={{ overflowX: "auto" }}>
                <Paper variant="outlined" sx={{ minWidth: 600 }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "#f5f5f5" }}>
                        {["Tháng", "Đạt", "Rớt", "Tổng", "Tỷ lệ đạt", "Xu hướng"].map((h) => (
                          <th
                            key={h}
                            style={{
                              padding: "8px 12px",
                              textAlign: "left",
                              fontWeight: 700,
                              fontSize: "0.75rem",
                              borderBottom: "2px solid #e0e0e0",
                            }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {MONTHLY_STATS.map((m, idx) => {
                        const rate = Math.round((m.pass / m.total) * 100);
                        const prev = idx > 0 ? MONTHLY_STATS[idx - 1] : null;
                        const prevRate = prev ? Math.round((prev.pass / prev.total) * 100) : null;
                        const trend = prevRate !== null ? rate - prevRate : 0;
                        return (
                          <tr key={m.month} style={{ borderBottom: "1px solid #f0f0f0" }}>
                            <td style={{ padding: "8px 12px", fontWeight: 700, fontSize: "0.8rem" }}>{m.month}</td>
                            <td style={{ padding: "8px 12px", color: "#2e7d32", fontWeight: 700, fontFamily: "monospace" }}>{m.pass}</td>
                            <td style={{ padding: "8px 12px", color: "#c62828", fontWeight: 700, fontFamily: "monospace" }}>{m.fail}</td>
                            <td style={{ padding: "8px 12px", fontFamily: "monospace" }}>{m.total}</td>
                            <td style={{ padding: "8px 12px" }}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Box
                                  sx={{
                                    width: 50,
                                    height: 6,
                                    bgcolor: "grey.200",
                                    borderRadius: 3,
                                    overflow: "hidden",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      height: "100%",
                                      width: `${rate}%`,
                                      bgcolor: rate >= 80 ? "success.main" : rate >= 60 ? "warning.main" : "error.main",
                                      borderRadius: 3,
                                    }}
                                  />
                                </Box>
                                <Typography variant="caption" sx={{ fontFamily: "monospace", fontWeight: 700 }}>
                                  {rate}%
                                </Typography>
                              </Box>
                            </td>
                            <td style={{ padding: "8px 12px" }}>
                              {trend !== 0 && (
                                <Chip
                                  label={trend > 0 ? `↑ +${trend}%` : `↓ ${trend}%`}
                                  size="small"
                                  color={trend > 0 ? "success" : "error"}
                                  sx={{ fontFamily: "monospace", fontWeight: 900, fontSize: "0.6rem" }}
                                />
                              )}
                              {trend === 0 && (
                                <Typography variant="caption" color="text.disabled">—</Typography>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </Paper>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity="success" onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
