"use client";

import { useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  Snackbar,
  Grid,
  IconButton,
  Chip,
} from "@mui/material";
import {
  ArrowBack as BackIcon,
  CheckCircle as DoneIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { CountdownTimer } from "@/shared/components/CountdownTimer";
import { BlindScoreForm, type ScoreCriteria, type ScoreValue } from "@/shared/components/BlindScoreForm";

const COUNCIL_DEADLINE = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 days

const COUNCIL_CRITERIA: ScoreCriteria[] = [
  { id: "cc1", label: "Nội dung & Khoa học", description: "Tính khoa học, độ sâu, phạm vi nghiên cứu", maxScore: 25 },
  { id: "cc2", label: "Phương pháp & Kết quả", description: "Phương pháp đúng, kết quả đạt được", maxScore: 25 },
  { id: "cc3", label: "Trình bày & Văn phong", description: "Bố cục, văn phong, hình thức", maxScore: 20 },
  { id: "cc4", label: "Thuyết trình & Phản biện", description: "Khả năng thuyết trình, trả lời phản biện", maxScore: 15 },
  { id: "cc5", label: "Đóng góp & Ứng dụng", description: "Tính mới, đóng góp thực tiễn", maxScore: 15 },
];

const mockThesis = {
  id: "t1",
  title: "Ứng dụng AI trong y tế",
  studentName: "Nguyễn Văn Minh",
  mssv: "CN200101",
};

// MOCK: Giả định vai trò người dùng hiện tại là "uv1"
const MOCK_COUNCIL_ROLE = "uv1";

export default function CouncilGradingPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.topicId as string;

  const [submittedAt, setSubmittedAt] = useState<string | undefined>();
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" });

  // MOCK: 2/4 thành viên đã gửi
  const [submittedCount, setSubmittedCount] = useState(2);
  const totalMembers = 4;

  const handleSubmit = useCallback((scores: ScoreValue[]) => {
    setSubmittedAt(new Date().toISOString());
    setSubmittedCount((n) => n + 1);
    setSnackbar({
      open: true,
      message: "Gửi phiếu chấm thành công! Điểm sẽ được công khai khi đủ 4 phiếu.",
      severity: "success",
    });
  }, []);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <IconButton onClick={() => router.push("/council/topics")}>
          <BackIcon />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Chấm điểm vòng bảo vệ
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Chấm điểm luận văn trong Hội đồng. Thời hạn: 3 ngày kể từ ngày bảo vệ.
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Chip
            label={`${submittedCount}/${totalMembers} đã gửi`}
            size="small"
            color={submittedCount === totalMembers ? "success" : "warning"}
            variant="outlined"
          />
          {submittedAt && (
            <Chip
              icon={<DoneIcon />}
              label="Đã gửi"
              size="small"
              color="success"
            />
          )}
        </Box>
      </Box>

      {/* Deadline countdown */}
      {!submittedAt && (
        <Box sx={{ mb: 3, maxWidth: 400 }}>
          <CountdownTimer
            deadline={COUNCIL_DEADLINE}
            label="Thời gian còn lại để chấm điểm:"
          />
        </Box>
      )}

      {/* Progress notice */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="caption">
          <strong>Tiến độ chấm điểm Hội đồng:</strong> {submittedCount}/{totalMembers} thành viên đã gửi phiếu.
          Khi đủ 4 phiếu, tất cả điểm sẽ được công khai.
        </Typography>
      </Alert>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {/* Thesis info */}
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {mockThesis.title}
            </Typography>
            <Typography variant="caption">
              SV: {mockThesis.studentName} ({mockThesis.mssv})
            </Typography>
          </Alert>

          {/* Blind Score Form */}
          <BlindScoreForm
            thesisTitle={mockThesis.title}
            studentName={`${mockThesis.studentName} (${mockThesis.mssv})`}
            councilRole={MOCK_COUNCIL_ROLE}
            criteria={COUNCIL_CRITERIA}
            onSubmit={handleSubmit}
            submittedAt={submittedAt}
            readonly={!!submittedAt}
          />
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Status */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                Trạng thái Hội đồng
              </Typography>
              {(["chutich", "pth", "uv1", "uv2"] as const).map((role) => {
                const roleNames = {
                  chutich: "Chủ tịch",
                  pth: "Phó Chủ tịch",
                  uv1: "Ủy viên 1",
                  uv2: "Ủy viên 2",
                };
                const isMe = role === MOCK_COUNCIL_ROLE;
                const isSubmitted = isMe ? !!submittedAt : ["chutich", "pth"].includes(role);
                return (
                  <Box
                    key={role}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                      p: 1,
                      borderRadius: 1,
                      bgcolor: isMe ? "primary.50" : "transparent",
                      border: isMe ? "1px solid" : "none",
                      borderColor: "primary.main",
                    }}
                  >
                    <Typography variant="caption" sx={{ fontWeight: isMe ? 700 : 400 }}>
                      {roleNames[role]}
                      {isMe && " (bạn)"}
                    </Typography>
                    {isSubmitted ? (
                      <Chip label="Đã gửi" size="small" color="success" sx={{ fontSize: "0.65rem" }} />
                    ) : (
                      <Chip label="Chưa gửi" size="small" color="warning" variant="outlined" sx={{ fontSize: "0.65rem" }} />
                    )}
                  </Box>
                );
              })}
            </CardContent>
          </Card>

          {/* Blind notice */}
          <Alert severity="warning">
            <Typography variant="caption">
              <strong>Chế độ ẩn điểm:</strong> Bạn không thể xem điểm của các thành viên khác cho đến khi tất cả 4 người gửi xong. Điều này đảm bảo tính công bằng trong chấm điểm.
            </Typography>
          </Alert>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
