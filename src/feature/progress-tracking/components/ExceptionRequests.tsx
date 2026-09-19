"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Link,
  CircularProgress,
} from "@mui/material";
import {
  Description as DescriptionIcon,
  Upload as UploadIcon,
} from "@mui/icons-material";
import { progressTrackingService } from "../services";
import type { Template } from "../types";
import { ReportSubmissionDialog } from "./ReportSubmission";

interface ExceptionRequestsProps {
  studentId: number;
  periodId?: number;
  onRefresh?: () => void;
}

export function ExceptionRequests({
  studentId,
  periodId,
  onRefresh,
}: ExceptionRequestsProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);

  // We can pass a specific template info to the dialog if needed,
  // but ReportSubmissionDialog currently just takes deadlineId.
  // We'll pass deadlineId={undefined} to let it know it's an exception.

  const loadTemplates = useCallback(async () => {
    setLoading(true);
    try {
      // isException=true is the new query parameter we added
      const result = await progressTrackingService.getTemplates({
        isException: true,
        limit: 50,
      });
      setTemplates(result.data);
    } catch (error) {
      console.error("Failed to load exception templates", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Đây là các biểu mẫu ngoại lệ (VD: Xin đổi GVHD, Xin gia hạn báo cáo...).
        Bạn có thể tải về, điền thông tin và nộp đơn bất cứ lúc nào. Giảng viên
        hướng dẫn và Thư ký sẽ xét duyệt đơn của bạn.
      </Typography>

      {templates.length === 0 ? (
        <Paper
          sx={{ p: 4, textAlign: "center", bgcolor: "background.default" }}
        >
          <Typography color="text.secondary">
            Chưa có biểu mẫu ngoại lệ nào được hệ thống cấu hình.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {templates.map((template) => (
            <Grid item xs={12} sm={6} md={4} key={template.id}>
              <Card variant="outlined">
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 1,
                      gap: 1,
                    }}
                  >
                    <DescriptionIcon color="primary" />
                    <Typography variant="h6" noWrap title={template.name}>
                      {template.name}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2, height: 40, overflow: "hidden" }}
                  >
                    {template.description || "Không có mô tả"}
                  </Typography>
                </CardContent>
                <CardActions
                  sx={{ px: 2, pb: 2, justifyContent: "space-between" }}
                >
                  <Link
                    href={
                      template.fileUrl.includes("cloudinary.com")
                        ? template.fileUrl.replace(
                            "/upload/",
                            `/upload/fl_attachment:${encodeURIComponent(template.fileName.substring(0, template.fileName.lastIndexOf(".")) || template.fileName)}/`,
                          )
                        : template.fileUrl
                    }
                    target="_blank"
                    rel="noopener"
                    underline="hover"
                    download={template.fileName}
                  >
                    Tải biểu mẫu
                  </Link>
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<UploadIcon />}
                    onClick={() => setSubmitDialogOpen(true)}
                  >
                    Nộp đơn
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <ReportSubmissionDialog
        open={submitDialogOpen}
        onClose={() => setSubmitDialogOpen(false)}
        studentId={studentId}
        deadlineId={undefined}
        onSuccess={() => {
          if (onRefresh) onRefresh();
        }}
      />
    </Box>
  );
}
