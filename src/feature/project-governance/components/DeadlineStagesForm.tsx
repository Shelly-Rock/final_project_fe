"use client";

import {
  Box,
  Button,
  IconButton,
  Paper,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { Plus, Trash2 } from "lucide-react";
import { Switch } from "@/shared/components";
import {
  DEADLINE_TYPES,
  DEADLINE_TYPE_HINTS,
  DEADLINE_TYPE_LABELS,
} from "../constants";
import type { DeadlineType, PeriodDeadlineInput } from "../types";
import {
  addPeriodicMilestone,
  removePeriodicMilestone,
  toIso,
  toLocalInputValue,
} from "../utils/governance";

interface DeadlineStagesFormProps {
  value: PeriodDeadlineInput[];
  onChange: (value: PeriodDeadlineInput[]) => void;
  disabled?: boolean;
}

const STAGE_ACCENT: Record<DeadlineType, string> = {
  TOPIC_CREATION: "#2563eb",
  STUDENT_REGISTRATION: "#0f766e",
  TEACHER_APPROVAL: "#4f46e5",
  FORM_02: "#c2410c",
  PERIODIC_REPORT: "#7c3aed",
  FINAL_SUBMISSION: "#be123c",
};

function sortDeadlines(items: PeriodDeadlineInput[]): PeriodDeadlineInput[] {
  return [...items].sort((left, right) => {
    const typeOrder =
      DEADLINE_TYPES.indexOf(left.type) - DEADLINE_TYPES.indexOf(right.type);
    return typeOrder || left.seq - right.seq;
  });
}

export function DeadlineStagesForm({
  value,
  onChange,
  disabled = false,
}: DeadlineStagesFormProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const updateDeadline = (
    type: DeadlineType,
    seq: number,
    patch: Partial<PeriodDeadlineInput>,
  ) => {
    onChange(
      sortDeadlines(
        value.map((deadline) =>
          deadline.type === type && deadline.seq === seq
            ? { ...deadline, ...patch }
            : deadline,
        ),
      ),
    );
  };

  const sorted = sortDeadlines(value);

  return (
    <Box sx={{ display: "grid", gap: 1.75 }}>
      {sorted.map((deadline, index) => {
        const isPeriodic = deadline.type === "PERIODIC_REPORT";
        const localValue = toLocalInputValue(deadline.deadlineAt);
        const accent = STAGE_ACCENT[deadline.type];
        const muted = !deadline.enabled;

        return (
          <Paper
            key={`${deadline.type}:${deadline.seq}`}
            elevation={0}
            sx={{
              p: { xs: 2, md: 2.25 },
              border: "1px solid",
              borderColor: muted
                ? isDark
                  ? "rgba(148,163,184,0.28)"
                  : "#cbd5e1"
                : isDark
                  ? "rgba(148,163,184,0.22)"
                  : "#cbd5e1",
              borderLeft: `5px solid ${accent}`,
              bgcolor: muted
                ? isDark
                  ? "rgba(15,23,42,0.35)"
                  : "#f8fafc"
                : isDark
                  ? "rgba(15,23,42,0.55)"
                  : "#ffffff",
              opacity: muted ? 0.78 : 1,
              boxShadow: isDark ? "none" : "0 1px 2px rgba(15, 23, 42, 0.06)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 1.75,
                alignItems: "flex-start",
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  flexShrink: 0,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: isDark ? `${accent}33` : `${accent}18`,
                  color: accent,
                  fontWeight: 800,
                  fontSize: "0.95rem",
                  mt: 0.25,
                }}
              >
                {index + 1}
              </Box>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 1,
                    flexWrap: "wrap",
                    mb: 1.5,
                  }}
                >
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography
                      sx={{
                        fontWeight: 800,
                        fontSize: "0.98rem",
                        color: "text.primary",
                        lineHeight: 1.35,
                      }}
                    >
                      {DEADLINE_TYPE_LABELS[deadline.type]}
                      {isPeriodic ? ` #${deadline.seq}` : ""}
                    </Typography>
                    <Typography
                      sx={{
                        mt: 0.4,
                        fontSize: "0.8125rem",
                        lineHeight: 1.55,
                        color: isDark ? "text.secondary" : "#475569",
                      }}
                    >
                      {DEADLINE_TYPE_HINTS[deadline.type]}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      flexShrink: 0,
                    }}
                  >
                    <Switch
                      label="Kích hoạt"
                      checked={deadline.enabled}
                      onChange={(_, checked) =>
                        updateDeadline(deadline.type, deadline.seq, {
                          enabled: checked,
                        })
                      }
                      disabled={disabled}
                      size="small"
                    />
                    {isPeriodic &&
                      value.filter((item) => item.type === "PERIODIC_REPORT")
                        .length > 1 && (
                        <Tooltip title="Xóa mốc báo cáo">
                          <span>
                            <IconButton
                              color="error"
                              size="small"
                              disabled={disabled}
                              onClick={() =>
                                onChange(
                                  sortDeadlines(
                                    removePeriodicMilestone(
                                      value,
                                      deadline.seq,
                                    ),
                                  ),
                                )
                              }
                            >
                              <Trash2 size={17} />
                            </IconButton>
                          </span>
                        </Tooltip>
                      )}
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "minmax(0, 1.2fr) minmax(0, 1fr)",
                    },
                    gap: 1.5,
                  }}
                >
                  <TextField
                    label="Tên hiển thị"
                    size="small"
                    value={deadline.label}
                    onChange={(event) =>
                      updateDeadline(deadline.type, deadline.seq, {
                        label: event.target.value,
                      })
                    }
                    disabled={disabled}
                    required
                    fullWidth
                  />

                  <TextField
                    label="Thời điểm hết hạn"
                    type="datetime-local"
                    size="small"
                    value={localValue}
                    onChange={(event) => {
                      const iso = toIso(event.target.value);
                      updateDeadline(deadline.type, deadline.seq, {
                        deadlineAt: iso ?? event.target.value,
                      });
                    }}
                    disabled={disabled}
                    required
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                </Box>
              </Box>
            </Box>
          </Paper>
        );
      })}

      <Box>
        <Button
          type="button"
          variant="outlined"
          startIcon={<Plus size={17} />}
          disabled={disabled}
          onClick={() => onChange(sortDeadlines(addPeriodicMilestone(value)))}
        >
          Thêm mốc báo cáo định kỳ
        </Button>
      </Box>
    </Box>
  );
}
