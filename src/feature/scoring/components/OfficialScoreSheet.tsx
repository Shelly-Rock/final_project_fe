"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import { ArrowLeft, Printer, Trophy } from "lucide-react";
import { toast } from "sonner";
import { GRADIENT_STYLES } from "@/shared/constants/gradients";
import { getPrintSheet, type PostDefenseRow } from "../services";

const C = {
  blue: "#2a78d6",
  orange: "#eb6834",
  green: "#1baf7a",
  yellow: "#eda100",
  silver: "#64748b",
};

function studentName(row: PostDefenseRow) {
  if (!row.student) return "-";
  return [row.student.lastName, row.student.middleName, row.student.firstName]
    .filter(Boolean)
    .join(" ");
}

function medalColor(rank: number | null) {
  if (rank === 1) return C.yellow;
  if (rank === 2) return C.silver;
  if (rank === 3) return C.orange;
  return null;
}

export function OfficialScoreSheetPage() {
  const router = useRouter();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const ink = theme.palette.text.primary;
  const muted = theme.palette.text.secondary;
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<PostDefenseRow[]>([]);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getPrintSheet();
        setRows(data.data);
        setGeneratedAt(data.generatedAt);
      } catch {
        toast.error("Không thể tải biểu mẫu lưu trữ");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const ranked = useMemo(
    () => rows.filter((r) => r.rank != null).length,
    [rows],
  );

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1,
          mb: 2.5,
          flexWrap: "wrap",
          "@media print": { display: "none" },
        }}
      >
        <Button
          variant="outlined"
          startIcon={<ArrowLeft size={16} />}
          onClick={() => router.push("/scoring/post-defense")}
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          Quay lại xếp hạng
        </Button>
        <Button
          variant="contained"
          startIcon={<Printer size={16} />}
          onClick={() => window.print()}
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          In bảng điểm chính thức
        </Button>
      </Box>

      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: isDark ? "#1e293b" : "background.paper",
          backgroundImage: isDark ? GRADIENT_STYLES.darkGradient : "none",
          boxShadow: isDark ? "none" : "0 1px 3px rgba(0,0,0,0.06)",
          overflow: "hidden",
          "@media print": {
            border: "none",
            boxShadow: "none",
            backgroundImage: "none",
            bgcolor: "#fff",
            borderRadius: 0,
          },
        }}
      >
        <Box
          sx={{
            px: 3,
            py: 2.5,
            borderBottom: "1px solid",
            borderColor: "divider",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: 1,
                color: C.blue,
                mb: 0.5,
              }}
            >
              LƯU TRỮ HỌC VỤ
            </Typography>
            <Typography sx={{ fontWeight: 800, fontSize: 20, color: ink }}>
              Bảng điểm chính thức
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Hậu kiểm sau bảo vệ · xếp hạng theo điểm tổng kết
            </Typography>
          </Box>
          <Box sx={{ textAlign: { xs: "left", sm: "right" } }}>
            <Chip
              icon={<Trophy size={14} />}
              label={`${rows.length} sinh viên`}
              size="small"
              sx={{ fontWeight: 700, mb: 0.5 }}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              {ranked} đã xếp hạng
              {generatedAt
                ? ` · Xuất ${new Date(generatedAt).toLocaleString("vi-VN")}`
                : ""}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ overflowX: "auto" }}>
          <Box
            component="table"
            sx={{
              width: "100%",
              borderCollapse: "collapse",
              "& th, & td": {
                p: 1.25,
                textAlign: "left",
                fontSize: 13,
                borderBottom: "1px solid",
                borderColor: "divider",
              },
              "& th": {
                fontWeight: 700,
                color: muted,
                fontSize: 11,
                letterSpacing: 0.4,
                textTransform: "uppercase",
                bgcolor: isDark ? "rgba(255,255,255,0.04)" : "#f8fafc",
              },
              "& tbody tr:hover": {
                bgcolor: "action.hover",
                "@media print": { bgcolor: "transparent" },
              },
            }}
          >
            <thead>
              <tr>
                <th style={{ width: 72, textAlign: "center" }}>Hạng</th>
                <th>Sinh viên</th>
                <th>Lớp</th>
                <th>Đề tài</th>
                <th style={{ textAlign: "right" }}>Điểm tổng</th>
                <th>Hồ sơ chỉnh sửa</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const rank = row.rankOverride ?? row.rank;
                const color = medalColor(rank);
                return (
                  <tr key={row.projectId}>
                    <td>
                      <Box
                        sx={{
                          width: 28,
                          height: 28,
                          mx: "auto",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 800,
                          fontSize: 12,
                          bgcolor: color ? `${color}22` : "transparent",
                          color: color ?? ink,
                          border: "1.5px solid",
                          borderColor: color ?? "divider",
                        }}
                      >
                        {rank ?? "—"}
                      </Box>
                    </td>
                    <td>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {studentName(row)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {row.student?.studentId ?? "—"}
                      </Typography>
                    </td>
                    <td>
                      <Typography variant="body2">
                        {row.student?.className ?? "—"}
                      </Typography>
                    </td>
                    <td>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {row.projectCode}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {row.projectName}
                      </Typography>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <Typography
                        sx={{
                          fontWeight: 800,
                          color:
                            row.finalScore != null && row.finalScore >= 9
                              ? C.green
                              : row.finalScore != null && row.finalScore >= 8
                                ? C.blue
                                : ink,
                        }}
                      >
                        {row.finalScore != null
                          ? row.finalScore.toFixed(2)
                          : "—"}
                      </Typography>
                    </td>
                    <td>
                      {row.latestRevisionFile ? (
                        <Chip
                          size="small"
                          label={row.latestRevisionFile}
                          sx={{
                            bgcolor: isDark
                              ? "rgba(27,175,122,0.18)"
                              : "#ecfdf5",
                            color: C.green,
                            fontWeight: 600,
                          }}
                        />
                      ) : (
                        <Chip
                          size="small"
                          label="Chưa nộp"
                          sx={{
                            bgcolor: isDark
                              ? "rgba(237,161,0,0.18)"
                              : "#fffbeb",
                            color: C.yellow,
                            fontWeight: 600,
                          }}
                        />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Box>
        </Box>

        {rows.length === 0 && (
          <Typography sx={{ p: 3 }} color="text.secondary">
            Chưa có dữ liệu để in.
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
