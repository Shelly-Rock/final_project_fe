"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { Dialog, Select } from "@/shared/components";
import { adminConfigService } from "../services/adminConfig.service";
import type {
  AlertDispatchResult,
  AlertEvent,
  AlertRecipientRole,
  DeadlineType,
  PeriodDeadlineInput,
} from "../types";
import {
  ALERT_EVENT_LABELS,
  DEADLINE_TYPE_LABELS,
  RECIPIENT_ROLE_LABELS,
  RECIPIENT_ROLES,
} from "../constants";
import { errorMessage, parseIdList } from "../utils/governance";

interface SendAlertDialogProps {
  open: boolean;
  periodId: number;
  deadlines: PeriodDeadlineInput[];
  onClose: () => void;
  onSent?: () => void;
}

const EVENT_OPTIONS: Array<{ value: AlertEvent; label: string }> = (
  Object.keys(ALERT_EVENT_LABELS) as AlertEvent[]
).map((value) => ({ value, label: ALERT_EVENT_LABELS[value] }));

export function SendAlertDialog({
  open,
  periodId,
  deadlines,
  onClose,
  onSent,
}: SendAlertDialogProps) {
  const availableDeadlines = useMemo(
    () =>
      [...deadlines]
        .filter((deadline) => deadline.enabled)
        .sort(
          (left, right) =>
            left.type.localeCompare(right.type) || left.seq - right.seq,
        ),
    [deadlines],
  );
  const [deadlineKey, setDeadlineKey] = useState("");
  const [event, setEvent] = useState<AlertEvent>("DUE_IN_3_DAYS");
  const [recipientRole, setRecipientRole] = useState<AlertRecipientRole | "">(
    "",
  );
  const [recipientIdsRaw, setRecipientIdsRaw] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<AlertDispatchResult | null>(null);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!open) return;
    const first = availableDeadlines[0];
    setDeadlineKey(first ? `${first.type}:${first.seq}` : "");
    setEvent("DUE_IN_3_DAYS");
    setRecipientRole("");
    setRecipientIdsRaw("");
    setResult(null);
    setFormError("");
  }, [open, availableDeadlines]);

  const deadlineOptions = availableDeadlines.map((deadline) => ({
    value: `${deadline.type}:${deadline.seq}`,
    label: `${DEADLINE_TYPE_LABELS[deadline.type]}${
      deadline.type === "PERIODIC_REPORT" ? ` #${deadline.seq}` : ""
    }`,
  }));

  const handleSend = async () => {
    const [deadlineType, seqRaw] = deadlineKey.split(":") as [
      DeadlineType | undefined,
      string | undefined,
    ];
    if (!deadlineType || !seqRaw) {
      setFormError("Vui lòng chọn thời hạn cần gửi email nhắc.");
      return;
    }

    const parsedIds = parseIdList(recipientIdsRaw);
    if (parsedIds.error) {
      setFormError(parsedIds.error);
      return;
    }

    setSubmitting(true);
    setFormError("");
    setResult(null);
    try {
      const response = await adminConfigService.sendAlerts({
        periodId,
        deadlineType,
        deadlineSeq: Number(seqRaw),
        event,
        recipientRole: recipientRole || undefined,
        recipientIds: parsedIds.ids.length ? parsedIds.ids : undefined,
      });
      setResult(response);
      onSent?.();
    } catch (error) {
      setFormError(errorMessage(error, "Không thể gửi email nhắc hạn."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Gửi email nhắc hạn thủ công"
      description="Hệ thống chỉ gửi cho người chưa hoàn thành và không gửi trùng cho cùng một thời hạn và sự kiện."
      closeOnBackdrop={!submitting}
      closeOnEscape={!submitting}
      actions={
        <>
          <Button variant="outlined" onClick={onClose} disabled={submitting}>
            Đóng
          </Button>
          <Button
            variant="contained"
            onClick={handleSend}
            disabled={submitting || !deadlineKey}
          >
            {submitting ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              "Gửi email"
            )}
          </Button>
        </>
      }
    >
      <Box sx={{ display: "grid", gap: 2, pt: 1 }}>
        {availableDeadlines.length === 0 && (
          <Alert severity="warning">
            Không có thời hạn đang bật để gửi email nhắc.
          </Alert>
        )}

        <Select
          label="Thời hạn"
          size="small"
          value={deadlineKey}
          options={deadlineOptions}
          onChange={setDeadlineKey}
          disabled={submitting || availableDeadlines.length === 0}
        />

        <Select
          label="Sự kiện"
          size="small"
          value={event}
          options={EVENT_OPTIONS}
          onChange={(value) => setEvent(value as AlertEvent)}
          disabled={submitting}
        />

        <Select
          label="Nhóm người nhận (tùy chọn)"
          size="small"
          value={recipientRole}
          options={RECIPIENT_ROLES.map((role) => ({
            value: role,
            label: RECIPIENT_ROLE_LABELS[role],
          }))}
          onChange={(value) => setRecipientRole(value as AlertRecipientRole)}
          showClearButton
          onClear={() => setRecipientRole("")}
          disabled={submitting}
        />

        <TextField
          label="Mã nội bộ người nhận (tùy chọn)"
          placeholder="Ví dụ: 12, 18, 25"
          value={recipientIdsRaw}
          onChange={(event) => setRecipientIdsRaw(event.target.value)}
          multiline
          minRows={2}
          size="small"
          disabled={submitting}
          helperText="Để trống để gửi cho tất cả người chưa hoàn thành trong nhóm đã chọn."
        />

        {formError && <Alert severity="error">{formError}</Alert>}

        {result && (
          <Alert severity={result.failed > 0 ? "warning" : "success"}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              Khớp {result.matched} · Đã gửi {result.sent} · Bỏ qua{" "}
              {result.skipped} · Thất bại {result.failed}
            </Typography>
            {result.errors.length > 0 && (
              <>
                <Divider sx={{ my: 1 }} />
                <List dense disablePadding>
                  {result.errors.map((item, index) => (
                    <ListItem
                      key={`${item.recipientId}:${item.email}:${index}`}
                      disableGutters
                    >
                      <ListItemText
                        primary={item.email}
                        secondary={item.message}
                      />
                    </ListItem>
                  ))}
                </List>
              </>
            )}
          </Alert>
        )}
      </Box>
    </Dialog>
  );
}
