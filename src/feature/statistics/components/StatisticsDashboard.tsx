"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { Download } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContentDiv,
  CardHeader,
  DataTable,
} from "@/shared/components";
import type { Column } from "@/shared/components";
import { periodService } from "@/feature/registration-period/services/period.service";
import {
  exportStatisticsExcel,
  getAcademicReport,
  getTeacherProductivity,
  type AcademicReport,
  type TeacherProductivityRow,
} from "../services";

function StatCard({
  label,
  value,
  color,
  suffix,
}: {
  label: string;
  value: number | string;
  color: string;
  suffix?: string;
}) {
  return (
    <Card>
      <CardContentDiv padding={2}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {label}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700, color }}>
          {value}
          {suffix ? (
            <Typography
              component="span"
              variant="body1"
              sx={{ ml: 0.5, fontWeight: 600, color }}
            >
              {suffix}
            </Typography>
          ) : null}
        </Typography>
      </CardContentDiv>
    </Card>
  );
}

export function StatisticsDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [periodId, setPeriodId] = useState<number | "">("");
  const [periods, setPeriods] = useState<{ id: number; name: string }[]>([]);
  const [academic, setAcademic] = useState<AcademicReport | null>(null);
  const [teachers, setTeachers] = useState<TeacherProductivityRow[]>([]);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const pid = periodId === "" ? undefined : periodId;
      const [report, rows] = await Promise.all([
        getAcademicReport(pid),
        getTeacherProductivity(pid),
      ]);
      setAcademic(report);
      setTeachers(rows);
    } catch {
      toast.error("Không thể tải số liệu thống kê");
    } finally {
      setLoading(false);
    }
  }, [periodId]);

  useEffect(() => {
    periodService
      .getAll()
      .then((list) => setPeriods(list.map((p) => ({ id: p.id, name: p.name }))))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleExport = async () => {
    try {
      setExporting(true);
      await exportStatisticsExcel(periodId === "" ? undefined : periodId);
      toast.success("Đã xuất file Excel");
    } catch (err) {
      toast.error((err as Error).message || "Không thể xuất Excel");
    } finally {
      setExporting(false);
    }
  };

  const columns: Column<TeacherProductivityRow>[] = [
    { id: "teacherCode", label: "Mã GV", minWidth: 100 },
    { id: "name", label: "Họ tên", minWidth: 180 },
    { id: "topics", label: "Số đề tài", minWidth: 100 },
    { id: "studentsGuided", label: "SV hướng dẫn", minWidth: 120 },
    { id: "committeeSeats", label: "Ghế hội đồng", minWidth: 110 },
    { id: "committeeAsChairman", label: "Chủ tịch", minWidth: 90 },
    { id: "committeeAsSecretary", label: "Thư ký", minWidth: 90 },
    { id: "committeeAsInternal", label: "PB trong", minWidth: 90 },
    { id: "committeeAsExternal", label: "PB ngoài", minWidth: 90 },
  ];

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 3,
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TextField
          select
          label="Kỳ báo cáo"
          value={periodId}
          onChange={(e) =>
            setPeriodId(e.target.value === "" ? "" : Number(e.target.value))
          }
          sx={{ minWidth: 280 }}
        >
          <MenuItem value="">Tất cả kỳ</MenuItem>
          {periods.map((p) => (
            <MenuItem key={p.id} value={p.id}>
              {p.name}
            </MenuItem>
          ))}
        </TextField>
        <Button
          variant="contained"
          startIcon={<Download size={16} />}
          onClick={handleExport}
          disabled={exporting}
        >
          {exporting ? "Đang xuất..." : "Xuất Excel"}
        </Button>
      </Box>

      {loading || !academic ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box sx={{ mb: 3 }}>
            <Card>
              <CardHeader
                title="Báo cáo học vụ"
                subtitle="Tỷ lệ sinh viên đậu/rớt theo kết quả bảo vệ đã chốt"
              />
              <CardContentDiv padding={2}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                      label="Tổng đề tài có kết quả"
                      value={academic.total}
                      color="#6b7280"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                      label="Đã công bố điểm"
                      value={academic.published}
                      color="#3b82f6"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                      label="Đậu"
                      value={academic.passed}
                      color="#10b981"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                      label="Rớt"
                      value={academic.failed}
                      color="#ef4444"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                      label="Tỷ lệ đậu"
                      value={academic.passRate}
                      suffix="%"
                      color="#10b981"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                      label="Tỷ lệ rớt"
                      value={academic.failRate}
                      suffix="%"
                      color="#ef4444"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                      label="Rớt hội đồng"
                      value={academic.rejectedDefense}
                      color="#f59e0b"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                      label="Điểm TB"
                      value={academic.avgFinalScore}
                      color="#8b5cf6"
                    />
                  </Grid>
                </Grid>
              </CardContentDiv>
            </Card>
          </Box>

          <Card>
            <CardHeader
              title="Năng suất giảng viên"
              subtitle="Số đề tài đã ra, ghế hội đồng theo vai trò, tổng sinh viên hướng dẫn trong kỳ"
            />
            <CardContentDiv padding={2}>
              <DataTable
                columns={columns}
                rows={teachers}
                rowKey="teacherId"
                loading={loading}
                showSearchInput={true}
                showFilterButton={false}
                showExportButton={false}
                showImportButton={false}
                emptyMessage="Chưa có dữ liệu giảng viên"
              />
            </CardContentDiv>
          </Card>
        </>
      )}
    </Box>
  );
}
