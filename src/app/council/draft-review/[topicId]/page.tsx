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
  Grid,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Divider,
  Paper,
} from "@mui/material";
import {
  ArrowBack as BackIcon,
  Lock as LockIcon,
  CheckCircle as ConfirmIcon,
  Groups as GroupsIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { ScoreComparisonTable, type ScoreCriteria } from "@/shared/components/ScoreComparisonTable";
import { AuditLogPanel, type AuditEntry } from "@/shared/components/AuditLogPanel";

interface MemberScoreData {
  role: string;
  roleLabel: string;
  scores: Record<string, number>;
  total: number;
  confirmed: boolean;
}

// MOCK user role: "chutich" (Chủ tịch)
const MOCK_ROLE = "chutich";
const IS_CHAIRMAN = MOCK_ROLE === "chutich";

const CRITERIA: ScoreCriteria[] = [
  { id: "cc1", label: "Nội dung & Khoa học", maxScore: 25 },
  { id: "cc2", label: "Phương pháp & Kết quả", maxScore: 25 },
  { id: "cc3", label: "Trình bày & Văn phong", maxScore: 20 },
  { id: "cc4", label: "Thuyết trình & Phản biện", maxScore: 15 },
  { id: "cc5", label: "Đóng góp & Ứng dụng", maxScore: 15 },
];

const INITIAL_MEMBERS: MemberScoreData[] = [
  {
    role: "chutich",
    roleLabel: "Chủ tịch",
    scores: { cc1: 20, cc2: 19, cc3: 17, cc4: 13, cc5: 12 },
    total: 81,
    confirmed: true,
  },
  {
    role: "pth",
    roleLabel: "Phó CT",
    scores: { cc1: 21, cc2: 18, cc3: 16, cc4: 12, cc5: 13 },
    total: 80,
    confirmed: true,
  },
  {
    role: "uv1",
    roleLabel: "UV1",
    scores: { cc1: 22, cc2: 19, cc3: 15, cc4: 11, cc5: 12 },
    total: 79,
    confirmed: true,
  },
  {
    role: "uv2",
    roleLabel: "UV2",
    scores: { cc1: 19, cc2: 18, cc3: 14, cc4: 12, cc5: 11 },
    total: 74,
    confirmed: true,
  },
];

const INITIAL_AUDIT: AuditEntry[] = [
  {
    id: "a1",
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    actor: "TS. Nguyễn Văn A",
    role: "chutich",
    action: "create",
    note: "Bắt đầu họp HĐ, ghi nhận điểm chấm của 4 thành viên.",
  },
  {
    id: "a2",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    actor: "PGS. Lê Văn C",
    role: "pth",
    action: "update",
    field: "UV2 - cc1",
    oldValue: 18,
    newValue: 19,
    note: "Điều chỉnh điểm UV2 cho tiêu chí Nội dung.",
  },
  {
    id: "a3",
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    actor: "TS. Nguyễn Văn A",
    role: "chutich",
    action: "override",
    field: "UV2 - cc5",
    oldValue: 11,
    newValue: 12,
    note: "CT điều chỉnh điểm UV2 cc5 từ 11 → 12.",
  },
];

const mockThesis = {
  id: "t1",
  title: "Ứng dụng AI trong y tế",
  studentName: "Nguyễn Văn Minh",
  mssv: "CN200101",
};

function computeFinalScores(members: MemberScoreData[]): Record<string, number> {
  const result: Record<string, number> = {};
  for (const c of CRITERIA) {
    const vals = members.map((m) => m.scores[c.id]).filter((v): v is number => v !== undefined);
    if (vals.length > 0) {
      result[c.id] = Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10;
    }
  }
  return result;
}

function computeFinalTotal(finalScores: Record<string, number>): number {
  return Math.round(Object.values(finalScores).reduce((a, b) => a + b, 0) * 10) / 10;
}

export default function CouncilDraftReviewPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.topicId as string;

  const [members, setMembers] = useState<MemberScoreData[]>(INITIAL_MEMBERS);
  const [audit, setAudit] = useState<AuditEntry[]>(INITIAL_AUDIT);
  const [isLocked, setIsLocked] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" | "warning" }>({ open: false, message: "", severity: "success" });

  const finalScores = computeFinalScores(members);
  const finalTotal = computeFinalTotal(finalScores);
  const maxTotal = CRITERIA.reduce((s, c) => s + c.maxScore, 0);
  const percentage = Math.round((finalTotal / maxTotal) * 100);
  const passCount = members.filter((m) => m.total >= maxTotal * 0.5).length;

  const handleScoreOverride = useCallback((criteriaId: string, newScore: number) => {
    const oldScore = members[0].scores[criteriaId as keyof typeof members[0]["scores"]] ?? 0;

    setMembers((prev) =>
      prev.map((m) => ({
        ...m,
        scores: { ...m.scores, [criteriaId]: newScore } as Record<string, number>,
        total: Object.values({ ...m.scores, [criteriaId]: newScore }).reduce((a, b) => a + b, 0),
      }))
    );

    const newEntry: AuditEntry = {
      id: `a${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: "TS. Nguyễn Văn A",
      role: "chutich",
      action: "override",
      field: `Tất cả - ${CRITERIA.find((c) => c.id === criteriaId)?.label}`,
      oldValue: oldScore,
      newValue: newScore,
      note: `CT ghi đè điểm thành ${newScore}.`,
    };
    setAudit((prev) => [...prev, newEntry]);
    setSnackbar({ open: true, message: "Đã cập nhật điểm!", severity: "success" });
  }, [members]);

  const handleFinalize = useCallback(() => {
    setConfirmDialog(true);
  }, []);

  const handleConfirmFinalize = useCallback(() => {
    setIsLocked(true);
    setConfirmDialog(false);

    const finalizeEntry: AuditEntry = {
      id: `a${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: "TS. Nguyễn Văn A",
      role: "chutich",
      action: "confirm",
      note: `Chốt điểm nháp: ${finalTotal}/${maxTotal} (${percentage}%). ${passCount}/4 phiếu đạt.`,
    };
    setAudit((prev) => [...prev, finalizeEntry]);
    setSnackbar({
      open: true,
      message: `Đã chốt điểm nháp! Kết quả: ${finalTotal}/${maxTotal} — ${percentage >= 50 ? "ĐẠT" : "RỚT"}`,
      severity: percentage >= 50 ? "success" : "error",
    });
  }, [finalTotal, maxTotal, percentage, passCount]);

  const gradeColor = (pct: number) =>
    pct >= 80 ? "success" : pct >= 60 ? "warning" : "error";

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <IconButton onClick={() => router.push("/council/topics")}>
          <BackIcon />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Họp Hội đồng — Chốt điểm nháp
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {mockThesis.title} — {mockThesis.studentName} ({mockThesis.mssv})
          </Typography>
        </Box>
        <Chip
          icon={<GroupsIcon />}
          label={MOCK_ROLE === "chutich" ? "Chủ tịch" : MOCK_ROLE === "pth" ? "Phó CT" : MOCK_ROLE}
          color="primary"
          variant="outlined"
        />
        {isLocked && (
          <Chip icon={<LockIcon />} label="Đã chốt" color="default" />
        )}
      </Box>

      {/* Locked notice */}
      {isLocked && (
        <Alert severity="success" sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            Điểm nháp đã được chốt bởi Chủ tịch.
          </Typography>
          <Typography variant="caption">
            Kết quả: <strong>{finalTotal}/{maxTotal}</strong> ({percentage}%) —{" "}
            <strong>{percentage >= 50 ? "ĐẠT" : "RỚT"}</strong>.
            Kết quả chính thức sẽ được công bố sau khi tất cả HĐ xác nhận.
          </Typography>
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Main: Score comparison */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <ScoreComparisonTable
                criteria={CRITERIA}
                members={members}
                finalScores={finalScores}
                finalTotal={finalTotal}
                editable={IS_CHAIRMAN && !isLocked}
                isLocked={isLocked}
                onScoreOverride={handleScoreOverride}
                onFinalize={handleFinalize}
              />
            </CardContent>
          </Card>

          {/* Summary cards */}
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Paper variant="outlined" sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="h4" sx={{ fontWeight: 900, color: `${gradeColor(percentage)}.main` }}>
                  {finalTotal}
                </Typography>
                <Typography variant="caption" color="text.secondary">Điểm chốt</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper variant="outlined" sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="h4" sx={{ fontWeight: 900, color: "primary.main" }}>
                  {maxTotal}
                </Typography>
                <Typography variant="caption" color="text.secondary">Tổng tối đa</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper variant="outlined" sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="h4" sx={{ fontWeight: 900, color: `${gradeColor(percentage)}.main` }}>
                  {percentage}%
                </Typography>
                <Typography variant="caption" color="text.secondary">Tỷ lệ</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper variant="outlined" sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="h4" sx={{ fontWeight: 900, color: passCount >= 3 ? "success.main" : "error.main" }}>
                  {passCount}/4
                </Typography>
                <Typography variant="caption" color="text.secondary">Phiếu đạt</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        {/* Sidebar: Audit log */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Nhật ký thay đổi
                </Typography>
                <Chip
                  label={`${audit.length} thay đổi`}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ fontSize: "0.65rem" }}
                />
              </Box>

              <AuditLogPanel entries={audit} />

              <Divider sx={{ my: 2 }} />

              {/* Member status */}
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
                Trạng thái thành viên
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {members.map((m) => (
                  <Box
                    key={m.role}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      p: 1,
                      borderRadius: 1,
                      border: "1px solid",
                      borderColor: m.confirmed ? "success.main" : "warning.main",
                      bgcolor: m.confirmed ? "success.50" : "warning.50",
                    }}
                  >
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {m.roleLabel}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontFamily: "monospace" }}>
                        Tổng: {m.total}
                      </Typography>
                    </Box>
                    <Chip
                      label={m.confirmed ? "Đã xác nhận" : "Chờ"}
                      size="small"
                      color={m.confirmed ? "success" : "warning"}
                      sx={{ fontSize: "0.65rem" }}
                    />
                  </Box>
                ))}
              </Box>

              {/* Finalize button */}
              {!isLocked && IS_CHAIRMAN && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    startIcon={<ConfirmIcon />}
                    onClick={handleFinalize}
                    sx={{ fontWeight: 700 }}
                  >
                    Xác nhận chốt điểm nháp
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Confirm dialog */}
      <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Xác nhận chốt điểm nháp</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="caption">
              Sau khi chốt, điểm sẽ <strong>không thể thay đổi</strong>. Kết quả sẽ được gửi tới Thư ký khoa.
            </Typography>
          </Alert>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Kết quả dự kiến:</strong>
          </Typography>
          <Box sx={{ pl: 2 }}>
            <Typography variant="body2">Điểm: <strong>{finalTotal}/{maxTotal}</strong></Typography>
            <Typography variant="body2">Tỷ lệ: <strong>{percentage}%</strong></Typography>
            <Typography variant="body2">Phiếu đạt: <strong>{passCount}/4</strong></Typography>
            <Typography variant="body2">
              Kết luận: <strong style={{ color: percentage >= 50 ? "green" : "red" }}>
                {percentage >= 50 ? "ĐẠT" : "RỚT"}
              </strong>
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)}>Hủy</Button>
          <Button variant="contained" color="success" onClick={handleConfirmFinalize} startIcon={<ConfirmIcon />}>
            Xác nhận chốt điểm
          </Button>
        </DialogActions>
      </Dialog>

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
