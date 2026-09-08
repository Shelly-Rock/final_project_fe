"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  Typography,
} from "@mui/material";
import { Dialog } from "@/shared/components";
import { toast } from "sonner";
import { AUDIT_ACTION_LABELS } from "../constants";
import { topicManageService } from "../services/topicManage.service";
import type { ManagedTopicRow, TopicAuditResponse } from "../types";
import { errorMessage, formatDateTime } from "../utils/governance";

interface TopicAuditDialogProps {
  open: boolean;
  topic: ManagedTopicRow | null;
  onClose: () => void;
}

function AuditPayload({ value }: { value: unknown }) {
  if (value === null || value === undefined) {
    return (
      <Typography variant="body2" color="text.secondary">
        —
      </Typography>
    );
  }

  return (
    <Box
      component="pre"
      sx={{
        m: 0,
        p: 1.25,
        maxHeight: 220,
        overflow: "auto",
        borderRadius: 1,
        bgcolor: "action.hover",
        fontFamily: "monospace",
        fontSize: "0.75rem",
        lineHeight: 1.55,
        whiteSpace: "pre-wrap",
        overflowWrap: "anywhere",
      }}
    >
      {JSON.stringify(value, null, 2)}
    </Box>
  );
}

export function TopicAuditDialog({
  open,
  topic,
  onClose,
}: TopicAuditDialogProps) {
  const [data, setData] = useState<TopicAuditResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !topic) return;

    let active = true;
    setData(null);
    setLoading(true);
    topicManageService
      .getAudits(topic.id)
      .then((response) => {
        if (active) setData(response);
      })
      .catch((error) => {
        if (active) {
          toast.error(
            errorMessage(error, "Không thể tải lịch sử chỉnh sửa đề tài."),
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [open, topic]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={
        data
          ? `Lịch sử — ${data.topic.code ?? `#${data.topic.id}`}`
          : topic
            ? `Lịch sử — ${topic.code ?? `#${topic.id}`}`
            : "Lịch sử đề tài"
      }
      description={data?.topic.name ?? topic?.name}
    >
      <Box sx={{ display: "grid", gap: 1.5, pt: 1 }}>
        {loading ? (
          <Box sx={{ py: 6, display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : !data || data.items.length === 0 ? (
          <Alert severity="info">
            Chưa có bản ghi lịch sử nào cho đề tài này.
          </Alert>
        ) : (
          data.items.map((entry) => (
            <Paper key={entry.id} variant="outlined" sx={{ p: 1.5 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 1,
                  flexWrap: "wrap",
                }}
              >
                <Chip
                  size="small"
                  color="primary"
                  variant="outlined"
                  label={AUDIT_ACTION_LABELS[entry.action] ?? entry.action}
                />
                <Typography variant="caption" color="text.secondary">
                  {formatDateTime(entry.createdAt)}
                </Typography>
              </Box>

              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Người thực hiện:</strong>{" "}
                {entry.actor
                  ? `${entry.actor.username}${entry.actor.email ? ` · ${entry.actor.email}` : ""}`
                  : "Hệ thống"}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mt: 0.5,
                  whiteSpace: "pre-wrap",
                  overflowWrap: "anywhere",
                }}
              >
                <strong>Lý do:</strong> {entry.reason || "—"}
              </Typography>

              <Divider sx={{ my: 1.25 }} />
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 1.25,
                }}
              >
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>
                    Trước thay đổi
                  </Typography>
                  <AuditPayload value={entry.before} />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>
                    Sau thay đổi
                  </Typography>
                  <AuditPayload value={entry.after} />
                </Box>
              </Box>
            </Paper>
          ))
        )}
      </Box>
    </Dialog>
  );
}
