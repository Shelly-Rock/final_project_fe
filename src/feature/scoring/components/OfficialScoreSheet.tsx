"use client";

import { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { toast } from "sonner";
import { Card, CardContentDiv, CardHeader } from "@/shared/components";
import { getPrintSheet, type PostDefenseRow } from "../services";

function studentName(row: PostDefenseRow) {
  if (!row.student) return "-";
  return [row.student.lastName, row.student.middleName, row.student.firstName]
    .filter(Boolean)
    .join(" ");
}

export function OfficialScoreSheetPage() {
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
          justifyContent: "flex-end",
          mb: 2,
          "@media print": { display: "none" },
        }}
      >
        <Button variant="contained" onClick={() => window.print()}>
          In bảng điểm chính thức
        </Button>
      </Box>

      <Card>
        <CardHeader
          title="Bảng điểm chính thức — lưu trữ học vụ"
          subtitle={
            generatedAt
              ? `Xuất lúc ${new Date(generatedAt).toLocaleString("vi-VN")}`
              : undefined
          }
        />
        <CardContentDiv padding={2}>
          <Box
            component="table"
            sx={{
              width: "100%",
              borderCollapse: "collapse",
              "& th, & td": {
                border: "1px solid",
                borderColor: "divider",
                p: 1,
                textAlign: "left",
                fontSize: 14,
              },
              "& th": { fontWeight: 700, backgroundColor: "action.hover" },
            }}
          >
            <thead>
              <tr>
                <th>Hạng</th>
                <th>MSSV</th>
                <th>Họ tên</th>
                <th>Lớp</th>
                <th>Mã đề tài</th>
                <th>Điểm tổng</th>
                <th>Hồ sơ chỉnh sửa</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.projectId}>
                  <td>{row.rank ?? "-"}</td>
                  <td>{row.student?.studentId ?? "-"}</td>
                  <td>{studentName(row)}</td>
                  <td>{row.student?.className ?? "-"}</td>
                  <td>{row.projectCode}</td>
                  <td>
                    {row.finalScore != null ? row.finalScore.toFixed(2) : "-"}
                  </td>
                  <td>{row.latestRevisionFile ?? "Chưa nộp"}</td>
                </tr>
              ))}
            </tbody>
          </Box>
          {rows.length === 0 && (
            <Typography sx={{ mt: 2 }} color="text.secondary">
              Chưa có dữ liệu để in.
            </Typography>
          )}
        </CardContentDiv>
      </Card>
    </Box>
  );
}
