"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { toast } from "sonner";
import { Switch } from "@/shared/components";
import { DeadlineStagesForm } from "./DeadlineStagesForm";
import { TeacherOverrideTable } from "./TeacherOverrideTable";
import { SendAlertDialog } from "./SendAlertDialog";
import { AlertLogTable } from "./AlertLogTable";
import { periodService } from "@/feature/registration-period/services/period.service";
import { adminConfigService } from "../services/adminConfig.service";
import { useTheme } from "@/shared/theme";
import {
  ALERT_OFFSET_LABELS,
  ALLOWED_ALERT_OFFSETS,
  MAX_STUDENTS_PER_TOPIC_CEILING,
  MAX_TOPIC_LIMIT_CEILING,
} from "../constants";
import {
  errorMessage,
  formatDateTime,
  humanizeRemaining,
  mergeDeadlinesIntoDrafts,
  stageDeadlineOf,
  validateGovernanceInput,
} from "../utils/governance";
import type {
  GovernanceConfigResponse,
  PeriodDeadlineInput,
  PeriodOption,
} from "../types";
import { Select } from "@/shared/components/Select";

export function PeriodConfigForm() {
  const { resolvedMode } = useTheme();
  const isDark = resolvedMode === "dark";
  const [periods, setPeriods] = useState<PeriodOption[]>([]);
  const [selectedPeriodId, setSelectedPeriodId] = useState<number | null>(null);
  const [loadingPeriods, setLoadingPeriods] = useState(true);
  const [loadingConfig, setLoadingConfig] = useState(false);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState<GovernanceConfigResponse | null>(null);

  const [defaultTopicLimit, setDefaultTopicLimit] = useState("3");
  const [maxTopicLimit, setMaxTopicLimit] = useState("10");
  const [maxStudentsPerTopic, setMaxStudentsPerTopic] = useState("3");
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [alertOffsets, setAlertOffsets] = useState<number[]>([3, 1]);
  const [deadlines, setDeadlines] = useState<PeriodDeadlineInput[]>([]);
  const [sendAlertOpen, setSendAlertOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadPeriods = useCallback(async () => {
    setLoadingPeriods(true);
    try {
      const items = await periodService.getAll();
      const options: PeriodOption[] = items.map((period) => ({
        id: period.id,
        name: period.name,
        semester: String(period.semester),
        schoolYear: period.schoolYear,
        status: period.status,
      }));
      setPeriods(options);
      setSelectedPeriodId((current) => {
        if (current !== null || !options.length) return current;
        const prioritized =
          options.find((item) => item.status === "open") ??
          options.find((item) => item.status === "upcoming") ??
          options[0];
        return prioritized?.id ?? null;
      });
    } catch (error) {
      toast.error(errorMessage(error, "Không thể tải danh sách đợt đồ án."));
    } finally {
      setLoadingPeriods(false);
    }
  }, []);

  const loadConfig = useCallback(async (periodId: number) => {
    setLoadingConfig(true);
    try {
      const response = await adminConfigService.getConfig(periodId);
      setConfig(response);
      setDefaultTopicLimit(String(response.config.defaultTopicLimit));
      setMaxTopicLimit(String(response.config.maxTopicLimit));
      setMaxStudentsPerTopic(String(response.config.maxStudentsPerTopic));
      setAlertsEnabled(response.config.alertsEnabled);
      setAlertOffsets(response.config.alertOffsetsDays ?? [3, 1]);
      setDeadlines(mergeDeadlinesIntoDrafts(response.deadlines));
    } catch (error) {
      toast.error(
        errorMessage(error, "Không thể tải cấu hình governance của đợt."),
      );
    } finally {
      setLoadingConfig(false);
    }
  }, []);

  useEffect(() => {
    loadPeriods();
  }, [loadPeriods]);

  useEffect(() => {
    if (!selectedPeriodId) return;
    loadConfig(selectedPeriodId);
  }, [selectedPeriodId, loadConfig, refreshKey]);

  const validationErrors = useMemo(() => {
    if (!config) return [];
    return validateGovernanceInput({
      defaultTopicLimit: Number(defaultTopicLimit),
      maxTopicLimit: Number(maxTopicLimit),
      maxStudentsPerTopic: Number(maxStudentsPerTopic),
      alertsEnabled,
      alertOffsetsDays: alertOffsets,
      deadlines,
    });
  }, [
    alertOffsets,
    alertsEnabled,
    config,
    deadlines,
    defaultTopicLimit,
    maxStudentsPerTopic,
    maxTopicLimit,
  ]);

  const handleSave = async () => {
    if (!selectedPeriodId || !config) return;
    if (validationErrors.length) {
      toast.error(validationErrors[0]);
      return;
    }
    setSaving(true);
    try {
      const next = await adminConfigService.saveConfig({
        periodId: selectedPeriodId,
        defaultTopicLimit: Number(defaultTopicLimit),
        maxTopicLimit: Number(maxTopicLimit),
        maxStudentsPerTopic: Number(maxStudentsPerTopic),
        alertsEnabled,
        alertOffsetsDays: [...alertOffsets].sort((a, b) => b - a),
        deadlines: deadlines.map((deadline) => ({
          type: deadline.type,
          seq: deadline.seq,
          label: deadline.label.trim() || deadline.type,
          deadlineAt: new Date(deadline.deadlineAt).toISOString(),
          enabled: deadline.enabled,
        })),
      });
      setConfig(next);
      setDeadlines(mergeDeadlinesIntoDrafts(next.deadlines));
      toast.success("Đã lưu cấu hình đợt đồ án.");
      setRefreshKey((value) => value + 1);
    } catch (error) {
      toast.error(errorMessage(error, "Không thể lưu cấu hình đợt đồ án."));
    } finally {
      setSaving(false);
    }
  };

  const governance = config?.governance;
  const activeStageInfo = useMemo(() => {
    if (!governance) return null;
    return {
      topic: stageDeadlineOf(governance.stages, "TOPIC_CREATION"),
      registration: stageDeadlineOf(governance.stages, "STUDENT_REGISTRATION"),
      approval: stageDeadlineOf(governance.stages, "TEACHER_APPROVAL"),
      finalSubmission: stageDeadlineOf(governance.stages, "FINAL_SUBMISSION"),
    };
  }, [governance]);

  if (loadingPeriods) {
    return (
      <Box sx={{ py: 6, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!periods.length) {
    return (
      <Alert severity="info">
        Chưa có đợt đồ án nào. Hãy tạo đợt tại màn Đợt đăng ký trước.
      </Alert>
    );
  }

  return (
    <Box sx={{ display: "grid", gap: 2 }}>
      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <Select
          label="Đợt đồ án"
          size="small"
          value={selectedPeriodId ? String(selectedPeriodId) : ""}
          options={periods.map((period) => ({
            value: String(period.id),
            label: `${period.name} · ${period.schoolYear} (Kỳ ${period.semester}) · ${period.status}`,
          }))}
          onChange={(value) => setSelectedPeriodId(Number(value) || null)}
          sx={{ width: { xs: "100%", sm: 420 }, maxWidth: "100%" }}
        />
        <Box sx={{ flex: 1 }} />
        <Button
          variant="outlined"
          onClick={() => setRefreshKey((value) => value + 1)}
          disabled={loadingConfig}
        >
          Làm mới
        </Button>
        <Button
          variant="outlined"
          onClick={() => setSendAlertOpen(true)}
          disabled={
            !selectedPeriodId || !deadlines.length || loadingConfig || saving
          }
        >
          Gửi email nhắc hạn
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving || loadingConfig || validationErrors.length > 0}
        >
          {saving ? (
            <CircularProgress size={18} color="inherit" />
          ) : (
            "Lưu cấu hình"
          )}
        </Button>
      </Box>

      {loadingConfig ? (
        <Box sx={{ py: 6, display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      ) : !config ? (
        <Alert severity="warning">Chưa tải được cấu hình của đợt này.</Alert>
      ) : (
        <>
          <Paper
            variant="outlined"
            sx={{ p: 2, borderColor: isDark ? "#334155" : "#e2e8f0" }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
              Chỉ tiêu đề tài
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "repeat(3, minmax(0, 1fr))",
                },
                gap: 1.5,
              }}
            >
              <TextField
                label="Chỉ tiêu mặc định"
                type="number"
                size="small"
                value={defaultTopicLimit}
                onChange={(event) => setDefaultTopicLimit(event.target.value)}
                inputProps={{
                  min: 1,
                  max: Number(maxTopicLimit) || MAX_TOPIC_LIMIT_CEILING,
                  step: 1,
                }}
                helperText="GV mặc định nhận 3 đề tài."
                fullWidth
              />
              <TextField
                label="Trần chỉ tiêu của đợt"
                type="number"
                size="small"
                value={maxTopicLimit}
                onChange={(event) => setMaxTopicLimit(event.target.value)}
                inputProps={{ min: 3, max: MAX_TOPIC_LIMIT_CEILING, step: 1 }}
                helperText={`Trần tuyệt đối ${MAX_TOPIC_LIMIT_CEILING}`}
                fullWidth
              />
              <TextField
                label="Sĩ số tối đa / đề tài"
                type="number"
                size="small"
                value={maxStudentsPerTopic}
                onChange={(event) => setMaxStudentsPerTopic(event.target.value)}
                inputProps={{
                  min: 1,
                  max: MAX_STUDENTS_PER_TOPIC_CEILING,
                  step: 1,
                }}
                helperText={`1–${MAX_STUDENTS_PER_TOPIC_CEILING} sinh viên`}
                fullWidth
              />
            </Box>

            {governance && (
              <Alert severity="info" sx={{ mt: 2 }}>
                <Box sx={{ display: "grid", gap: 0.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    Trạng thái đợt — giờ máy chủ{" "}
                    {formatDateTime(governance.serverTime)}
                  </Typography>
                  <Typography variant="caption">
                    Tạo đề tài:{" "}
                    {governance.locks.topicWritable ? "đang mở" : "đã khóa"}
                    {" · "}
                    Đăng ký:{" "}
                    {governance.locks.registrationOpen ? "đang mở" : "đã đóng"}
                    {" · "}
                    Duyệt:{" "}
                    {governance.locks.approvalOpen ? "đang mở" : "đã đóng"}
                    {" · "}
                    Nộp cuối kỳ:{" "}
                    {governance.locks.finalSubmissionOpen
                      ? "đang mở"
                      : "đã đóng"}
                  </Typography>
                  {activeStageInfo?.topic && (
                    <Typography variant="caption">
                      Tạo đề tài:{" "}
                      {formatDateTime(activeStageInfo.topic.deadlineAt)} ·{" "}
                      {humanizeRemaining(activeStageInfo.topic.remainingMs)}
                    </Typography>
                  )}
                  {activeStageInfo?.registration && (
                    <Typography variant="caption">
                      SV đăng ký:{" "}
                      {formatDateTime(activeStageInfo.registration.deadlineAt)}{" "}
                      ·{" "}
                      {humanizeRemaining(
                        activeStageInfo.registration.remainingMs,
                      )}
                    </Typography>
                  )}
                  {activeStageInfo?.approval && (
                    <Typography variant="caption">
                      GV duyệt:{" "}
                      {formatDateTime(activeStageInfo.approval.deadlineAt)} ·{" "}
                      {humanizeRemaining(activeStageInfo.approval.remainingMs)}
                    </Typography>
                  )}
                  {activeStageInfo?.finalSubmission && (
                    <Typography variant="caption">
                      Nộp cuối kỳ:{" "}
                      {formatDateTime(
                        activeStageInfo.finalSubmission.deadlineAt,
                      )}{" "}
                      ·{" "}
                      {humanizeRemaining(
                        activeStageInfo.finalSubmission.remainingMs,
                      )}
                    </Typography>
                  )}
                </Box>
              </Alert>
            )}
          </Paper>

          <Paper
            variant="outlined"
            sx={{ p: 2, borderColor: isDark ? "#334155" : "#e2e8f0" }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              Thời hạn 5 giai đoạn
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mb: 1.5 }}
            >
              Thứ tự bắt buộc: tạo đề tài → sinh viên đăng ký → giảng viên duyệt
              → nộp cuối kỳ. Các mốc báo cáo định kỳ phải nằm sau hạn duyệt và
              trước hạn nộp cuối kỳ.
            </Typography>
            <DeadlineStagesForm
              value={deadlines}
              onChange={setDeadlines}
              disabled={saving}
            />
          </Paper>

          <Paper
            variant="outlined"
            sx={{ p: 2, borderColor: isDark ? "#334155" : "#e2e8f0" }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1,
                flexWrap: "wrap",
              }}
            >
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  Nhắc hạn qua email
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Bật hoặc tắt email nhắc hạn tự động cho từng đợt đồ án.
                </Typography>
              </Box>
              <Switch
                label={alertsEnabled ? "Đang bật" : "Đang tắt"}
                checked={alertsEnabled}
                onChange={(_, checked) => setAlertsEnabled(checked)}
                disabled={saving}
                size="small"
              />
            </Box>
            <Divider sx={{ my: 1.5 }} />
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              {ALLOWED_ALERT_OFFSETS.map((offset) => (
                <Box
                  key={offset}
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Switch
                    checked={alertOffsets.includes(offset)}
                    onChange={(_, checked) =>
                      setAlertOffsets((values) =>
                        checked
                          ? [...values, offset].sort((a, b) => b - a)
                          : values.filter((value) => value !== offset),
                      )
                    }
                    disabled={saving || !alertsEnabled}
                    size="small"
                  />
                  <Typography variant="body2">
                    {ALERT_OFFSET_LABELS[offset]}
                  </Typography>
                </Box>
              ))}
            </Box>

            {config.alertStats && (
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1.5 }}>
                <Chip
                  label={`Đang gửi: ${config.alertStats.processing}`}
                  size="small"
                  color="info"
                />
                <Chip
                  label={`Đã gửi: ${config.alertStats.sent}`}
                  size="small"
                  color="success"
                />
                <Chip
                  label={`Thất bại: ${config.alertStats.failed}`}
                  size="small"
                  color="error"
                />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ alignSelf: "center" }}
                >
                  Lần chạy gần nhất:{" "}
                  {config.alertStats.lastRunAt
                    ? formatDateTime(config.alertStats.lastRunAt)
                    : "—"}
                </Typography>
              </Box>
            )}
          </Paper>

          {validationErrors.length > 0 && (
            <Alert severity="warning">
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Chưa đủ điều kiện lưu:
              </Typography>
              <Card
                variant="outlined"
                sx={{ mt: 1, borderColor: "warning.light" }}
              >
                <CardContent sx={{ py: 1.5 }}>
                  <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                    {validationErrors.map((message) => (
                      <Typography key={message} component="li" variant="body2">
                        {message}
                      </Typography>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Alert>
          )}

          <Paper
            variant="outlined"
            sx={{ p: 2, borderColor: isDark ? "#334155" : "#e2e8f0" }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
              Ghi đè chỉ tiêu theo giảng viên
            </Typography>
            <TeacherOverrideTable
              periodId={config.config.periodId}
              maxTopicLimit={Number(maxTopicLimit) || MAX_TOPIC_LIMIT_CEILING}
              maxStudentsPerTopic={
                Number(maxStudentsPerTopic) || MAX_STUDENTS_PER_TOPIC_CEILING
              }
              onReloadStats={() => setRefreshKey((value) => value + 1)}
            />
          </Paper>

          <Paper
            variant="outlined"
            sx={{ p: 2, borderColor: isDark ? "#334155" : "#e2e8f0" }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
              Lịch sử gửi email nhắc hạn
            </Typography>
            <AlertLogTable
              periodId={config.config.periodId}
              refreshKey={refreshKey}
            />
          </Paper>

          <SendAlertDialog
            open={sendAlertOpen}
            periodId={config.config.periodId}
            deadlines={deadlines}
            onClose={() => setSendAlertOpen(false)}
            onSent={() => setRefreshKey((value) => value + 1)}
          />
        </>
      )}
    </Box>
  );
}
