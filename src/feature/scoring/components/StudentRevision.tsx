"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { toast } from "sonner";
import { Card, CardContentDiv, CardHeader } from "@/shared/components";
import {
  CommitteeRoleLabels,
  getMyRevision,
  submitRevision,
  type CommitteeRole,
  type StudentRevisionDetail,
} from "../services";

function studentName(detail: StudentRevisionDetail) {
  if (!detail.student) return "-";
  return [
    detail.student.lastName,
    detail.student.middleName,
    detail.student.firstName,
  ]
    .filter(Boolean)
    .join(" ");
}

export function StudentRevisionPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [detail, setDetail] = useState<StudentRevisionDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [note, setNote] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setDetail(await getMyRevision());
    } catch (err) {
      setError((err as Error).message || "Bảng điểm chưa được công bố");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = async () => {
    if (!detail || !file) {
      toast.error("Vui lòng chọn file hồ sơ chỉnh sửa");
      return;
    }
    const expected = `[${detail.projectCode}]`;
    if (!file.name.startsWith(expected)) {
      toast.error(`Tên file phải bắt đầu bằng ${expected}`);
      return;
    }
    try {
      setSubmitting(true);
      await submitRevision({
        fileUrl: `/uploads/${file.name}`,
        fileName: file.name,
        originalName: file.name,
        fileSize: file.size || 0,
        note,
      });
      toast.success("Đã nộp hồ sơ chỉnh sửa");
      setFile(null);
      await load();
    } catch (err) {
      toast.error((err as Error).message || "Không thể nộp hồ sơ");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !detail) {
    return (
      <Alert severity="info">
        {error || "Bảng điểm chưa được công bố nên chưa mở chỉnh sửa hồ sơ."}
      </Alert>
    );
  }

  const deadline = new Date(detail.revisionDeadline);

  return (
    <Box>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContentDiv padding={2}>
              <Typography variant="caption" color="text.secondary">
                Đề tài
              </Typography>
              <Typography sx={{ fontWeight: 700 }}>
                {detail.projectCode}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {detail.projectName}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {studentName(detail)}
              </Typography>
            </CardContentDiv>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContentDiv padding={2}>
              <Typography variant="caption" color="text.secondary">
                Hạn chỉnh sửa
              </Typography>
              <Typography sx={{ fontWeight: 700 }}>
                {deadline.toLocaleString("vi-VN")}
              </Typography>
              <Box sx={{ mt: 1 }}>
                {detail.canSubmitRevision ? (
                  <Chip size="small" color="success" label="Còn hạn nộp" />
                ) : (
                  <Chip size="small" color="error" label="Đã hết hạn" />
                )}
              </Box>
            </CardContentDiv>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mb: 3 }}>
        <Card>
          <CardHeader
            title="Nhận xét hội đồng (Giai đoạn 6)"
            subtitle="Chỉnh sửa đồ án theo 3 cột: ưu điểm, nhược điểm, nhận xét"
          />
          <CardContentDiv padding={2}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {detail.comments.map((row, index) => (
                <Box
                  key={`${row.teacherName}-${index}`}
                  sx={{
                    p: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                  }}
                >
                  <Typography sx={{ fontWeight: 600, mb: 1 }}>
                    {row.teacherName}
                    {row.role
                      ? ` · ${CommitteeRoleLabels[row.role as CommitteeRole]}`
                      : ""}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Typography variant="caption" color="text.secondary">
                        Ưu điểm
                      </Typography>
                      <Typography variant="body2">
                        {row.strengths || "-"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="caption" color="text.secondary">
                        Nhược điểm
                      </Typography>
                      <Typography variant="body2">
                        {row.weaknesses || "-"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="caption" color="text.secondary">
                        Nhận xét
                      </Typography>
                      <Typography variant="body2">
                        {row.notes || "-"}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              ))}
            </Box>
          </CardContentDiv>
        </Card>
      </Box>

      <Card>
        <CardHeader
          title="Nộp hồ sơ chỉnh sửa"
          subtitle={`Đặt tên file theo mẫu [${detail.projectCode}].PDF`}
        />
        <CardContentDiv padding={2}>
          {detail.revision && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Đã nộp: {detail.revision.fileName} ·{" "}
              {new Date(detail.revision.submittedAt).toLocaleString("vi-VN")}
            </Alert>
          )}
          {detail.canSubmitRevision ? (
            <>
              <Button variant="outlined" component="label" sx={{ mb: 2 }}>
                Chọn file
                <input
                  hidden
                  type="file"
                  accept=".pdf,.docx,.pptx"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
              </Button>
              {file && (
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {file.name}
                </Typography>
              )}
              <TextField
                label="Ghi chú chỉnh sửa"
                fullWidth
                multiline
                minRows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={submitting || !file}
                >
                  {submitting ? "Đang nộp..." : "Nộp hồ sơ"}
                </Button>
              </Box>
            </>
          ) : (
            <Alert severity="warning">Đã hết hạn chỉnh sửa hồ sơ.</Alert>
          )}
        </CardContentDiv>
      </Card>
    </Box>
  );
}
