"use client";

import {
  Box,
  Button,
  IconButton,
  Paper,
  TextField,
  Tooltip,
  Typography,
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

  return (
    <Box sx={{ display: "grid", gap: 1.5 }}>
      {sortDeadlines(value).map((deadline) => {
        const isPeriodic = deadline.type === "PERIODIC_REPORT";
        const localValue = toLocalInputValue(deadline.deadlineAt);

        return (
          <Paper
            key={`${deadline.type}:${deadline.seq}`}
            variant="outlined"
            sx={{ p: 2, borderColor: "divider" }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "minmax(220px, 0.9fr) minmax(240px, 1.3fr) minmax(210px, 0.9fr) auto",
                },
                gap: 1.5,
                alignItems: "center",
              }}
            >
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  {DEADLINE_TYPE_LABELS[deadline.type]}
                  {isPeriodic ? ` #${deadline.seq}` : ""}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {DEADLINE_TYPE_HINTS[deadline.type]}
                </Typography>
              </Box>

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

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: { xs: "space-between", md: "flex-end" },
                  gap: 0.5,
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
                                removePeriodicMilestone(value, deadline.seq),
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
