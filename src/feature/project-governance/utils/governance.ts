import dayjs from "dayjs";
import type {
  DeadlineType,
  GovernanceStage,
  PeriodDeadline,
  PeriodDeadlineInput,
} from "../types";
import {
  ALLOWED_ALERT_OFFSETS,
  DEADLINE_TYPES,
  DEADLINE_TYPE_LABELS,
  DEFAULT_DEADLINE_OFFSET_DAYS,
  MAIN_DEADLINE_ORDERING,
  MAX_STUDENTS_PER_TOPIC_CEILING,
  MAX_TOPIC_LIMIT_CEILING,
} from "../constants";

/** Chuẩn hoá thông báo lỗi từ apiClient (chỉ trả về `message`). */
export function errorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message.trim()) return error.message;
  if (typeof error === "string" && error.trim()) return error;
  return fallback;
}

/** ISO → giá trị cho `<input type="datetime-local">` theo giờ máy người dùng. */
export function toLocalInputValue(iso: string | null | undefined): string {
  if (!iso) return "";
  const parsed = dayjs(iso);
  return parsed.isValid() ? parsed.format("YYYY-MM-DDTHH:mm") : "";
}

/** Giá trị `datetime-local` → ISO để gửi lên BE. */
export function toIso(local: string): string | null {
  if (!local) return null;
  const parsed = dayjs(local);
  return parsed.isValid() ? parsed.toISOString() : null;
}

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  const parsed = dayjs(iso);
  return parsed.isValid() ? parsed.format("DD/MM/YYYY HH:mm") : "—";
}

/** Mô tả khoảng thời gian còn lại / đã trôi qua của một stage. */
export function humanizeRemaining(remainingMs: number | null): string {
  if (remainingMs === null) return "Chưa cấu hình";
  const abs = Math.abs(remainingMs);
  const days = Math.floor(abs / 86_400_000);
  const hours = Math.floor((abs % 86_400_000) / 3_600_000);
  const minutes = Math.floor((abs % 3_600_000) / 60_000);

  const parts: string[] = [];
  if (days > 0) parts.push(`${days} ngày`);
  if (hours > 0) parts.push(`${hours} giờ`);
  if (parts.length === 0) parts.push(`${minutes} phút`);
  const text = parts.join(" ");

  return remainingMs > 0 ? `Còn ${text}` : `Đã qua ${text}`;
}

export function stageDeadlineOf(
  stages: GovernanceStage[],
  type: DeadlineType,
  seq = 1,
): GovernanceStage | undefined {
  return stages.find((stage) => stage.type === type && stage.seq === seq);
}

/**
 * Build đủ 5 loại deadline từ dữ liệu BE, đánh lại `seq` liên tục từ 1.
 * Loại nào chưa có sẽ nhận mốc mặc định để form luôn hợp lệ về mặt cấu trúc.
 */
export function mergeDeadlinesIntoDrafts(
  deadlines: PeriodDeadline[],
): PeriodDeadlineInput[] {
  const drafts: PeriodDeadlineInput[] = [];

  for (const type of DEADLINE_TYPES) {
    const existing = deadlines
      .filter((deadline) => deadline.type === type)
      .sort((a, b) => a.seq - b.seq);

    if (existing.length === 0) {
      drafts.push(createDefaultDraft(type, 1));
      continue;
    }

    existing.forEach((deadline, index) => {
      drafts.push({
        type,
        seq: index + 1,
        label: deadline.label?.trim() || DEADLINE_TYPE_LABELS[type],
        deadlineAt: deadline.deadlineAt,
        enabled: deadline.enabled,
      });
    });
  }

  return drafts;
}

/** Tạo mốc mặc định cho một loại deadline chưa được cấu hình. */
export function createDefaultDraft(
  type: DeadlineType,
  seq: number,
): PeriodDeadlineInput {
  const offsetDays = DEFAULT_DEADLINE_OFFSET_DAYS[type];
  // Mốc cuối kỳ chốt 23:59; mốc tạo đề tài chốt 17:00 theo quy ước nghiệp vụ.
  const at =
    type === "TOPIC_CREATION"
      ? dayjs().add(offsetDays, "day").hour(17).minute(0).second(0)
      : dayjs().add(offsetDays, "day").hour(23).minute(59).second(0);

  const label =
    type === "PERIODIC_REPORT"
      ? `${DEADLINE_TYPE_LABELS[type]} — đợt ${seq}`
      : DEADLINE_TYPE_LABELS[type];

  return {
    type,
    seq,
    label,
    deadlineAt: at.toISOString(),
    enabled: true,
  };
}

/** Thêm một mốc báo cáo định kỳ và đánh lại `seq` liên tục. */
export function addPeriodicMilestone(
  drafts: PeriodDeadlineInput[],
): PeriodDeadlineInput[] {
  const reports = drafts
    .filter((draft) => draft.type === "PERIODIC_REPORT")
    .sort((a, b) => a.seq - b.seq);

  const last = reports[reports.length - 1];
  const nextSeq = reports.length + 1;
  const base = last
    ? dayjs(last.deadlineAt).add(14, "day").hour(23).minute(59).second(0)
    : dayjs().add(49, "day").hour(23).minute(59).second(0);

  const others = drafts.filter((draft) => draft.type !== "PERIODIC_REPORT");
  const renumbered = reports.map((draft, index) => ({
    ...draft,
    seq: index + 1,
  }));

  return [
    ...others,
    ...renumbered,
    {
      type: "PERIODIC_REPORT" as const,
      seq: nextSeq,
      label: `${DEADLINE_TYPE_LABELS.PERIODIC_REPORT} — đợt ${nextSeq}`,
      deadlineAt: base.toISOString(),
      enabled: true,
    },
  ];
}

/** Xoá một mốc báo cáo định kỳ và đánh lại `seq` liên tục từ 1. */
export function removePeriodicMilestone(
  drafts: PeriodDeadlineInput[],
  seq: number,
): PeriodDeadlineInput[] {
  const others = drafts.filter((draft) => draft.type !== "PERIODIC_REPORT");
  const reports = drafts
    .filter((draft) => draft.type === "PERIODIC_REPORT" && draft.seq !== seq)
    .sort((a, b) => a.seq - b.seq)
    .map((draft, index) => ({ ...draft, seq: index + 1 }));

  if (reports.length === 0) {
    reports.push(createDefaultDraft("PERIODIC_REPORT", 1));
  }

  return [...others, ...reports];
}

export interface GovernanceFormValues {
  defaultTopicLimit: number;
  maxTopicLimit: number;
  maxStudentsPerTopic: number;
  alertsEnabled: boolean;
  alertOffsetsDays: number[];
  deadlines: PeriodDeadlineInput[];
}

/**
 * Validate phía client theo đúng luật của BE, để người dùng thấy lỗi trước
 * khi gọi API. Lỗi BE trả về vẫn luôn được hiển thị.
 */
export function validateGovernanceInput(
  values: GovernanceFormValues,
): string[] {
  const errors: string[] = [];

  if (
    !Number.isInteger(values.defaultTopicLimit) ||
    values.defaultTopicLimit < 1
  ) {
    errors.push("Chỉ tiêu mặc định phải là số nguyên từ 1 trở lên.");
  }
  if (
    !Number.isInteger(values.maxTopicLimit) ||
    values.maxTopicLimit < 3 ||
    values.maxTopicLimit > MAX_TOPIC_LIMIT_CEILING
  ) {
    errors.push(
      `Trần chỉ tiêu phải nằm trong khoảng 3–${MAX_TOPIC_LIMIT_CEILING}.`,
    );
  }
  if (values.defaultTopicLimit > values.maxTopicLimit) {
    errors.push("Chỉ tiêu mặc định không được vượt quá trần chỉ tiêu của đợt.");
  }
  if (
    !Number.isInteger(values.maxStudentsPerTopic) ||
    values.maxStudentsPerTopic < 1 ||
    values.maxStudentsPerTopic > MAX_STUDENTS_PER_TOPIC_CEILING
  ) {
    errors.push(
      `Sĩ số tối đa mỗi đề tài phải nằm trong khoảng 1–${MAX_STUDENTS_PER_TOPIC_CEILING}.`,
    );
  }

  const offsets = values.alertOffsetsDays;
  if (offsets.length === 0) {
    errors.push("Phải chọn ít nhất một mốc nhắc (3 ngày / 1 ngày / đúng hạn).");
  }
  if (
    offsets.some(
      (offset) =>
        !(ALLOWED_ALERT_OFFSETS as readonly number[]).includes(offset),
    )
  ) {
    errors.push("Mốc nhắc chỉ được nhận giá trị 3, 1 hoặc 0 ngày.");
  }
  if (new Set(offsets).size !== offsets.length) {
    errors.push("Mốc nhắc không được trùng nhau.");
  }

  const seen = new Set<string>();
  const byType = new Map<DeadlineType, PeriodDeadlineInput[]>();

  for (const deadline of values.deadlines) {
    const key = `${deadline.type}:${deadline.seq}`;
    if (seen.has(key)) {
      errors.push(`Deadline ${deadline.type} thứ tự ${deadline.seq} bị trùng.`);
      continue;
    }
    seen.add(key);

    if (deadline.type !== "PERIODIC_REPORT" && deadline.seq !== 1) {
      errors.push(`Deadline ${deadline.type} chỉ được sử dụng seq = 1.`);
    }

    if (!deadline.label.trim()) {
      errors.push(
        `Thiếu tên hiển thị cho deadline ${DEADLINE_TYPE_LABELS[deadline.type]}.`,
      );
    }
    if (!toIso(toLocalInputValue(deadline.deadlineAt))) {
      errors.push(
        `Chưa chọn thời điểm cho deadline ${DEADLINE_TYPE_LABELS[deadline.type]}.`,
      );
    }

    const items = byType.get(deadline.type) ?? [];
    items.push(deadline);
    byType.set(deadline.type, items);
  }

  for (const type of DEADLINE_TYPES) {
    if (!byType.has(type)) {
      errors.push(`Thiếu cấu hình deadline ${type}.`);
    }
  }

  const timeOf = (type: DeadlineType): number | null => {
    const deadline = byType.get(type)?.find((item) => item.seq === 1);
    const iso = toIso(toLocalInputValue(deadline?.deadlineAt ?? ""));
    return iso ? dayjs(iso).valueOf() : null;
  };

  for (let index = 0; index < MAIN_DEADLINE_ORDERING.length - 1; index += 1) {
    const current = MAIN_DEADLINE_ORDERING[index];
    const next = MAIN_DEADLINE_ORDERING[index + 1];
    const currentTime = timeOf(current);
    const nextTime = timeOf(next);
    if (currentTime === null || nextTime === null) continue;
    if (currentTime >= nextTime) {
      errors.push(
        `Deadline ${DEADLINE_TYPE_LABELS[current]} phải trước ${DEADLINE_TYPE_LABELS[next]}.`,
      );
    }
  }

  const reports = (byType.get("PERIODIC_REPORT") ?? []).sort(
    (a, b) => a.seq - b.seq,
  );
  reports.forEach((report, index) => {
    if (report.seq !== index + 1) {
      errors.push("Thứ tự các mốc báo cáo định kỳ phải liên tục từ 1.");
    }
  });

  const approvalTime = timeOf("TEACHER_APPROVAL");
  const finalTime = timeOf("FINAL_SUBMISSION");
  if (approvalTime !== null && finalTime !== null && reports.length > 0) {
    let previous = approvalTime;
    for (const report of reports) {
      const iso = toIso(toLocalInputValue(report.deadlineAt));
      if (!iso) continue;
      const at = dayjs(iso).valueOf();
      if (at <= previous || at >= finalTime) {
        errors.push(
          "Mỗi mốc báo cáo định kỳ phải sau hạn duyệt của giảng viên, trước hạn nộp cuối kỳ và theo đúng thứ tự.",
        );
        break;
      }
      previous = at;
    }
  }

  return errors;
}

/** Phân tích chuỗi id phân cách bởi dấu phẩy/xuống dòng. */
export function parseIdList(raw: string): { ids: number[]; error?: string } {
  const trimmed = raw.trim();
  if (!trimmed) return { ids: [] };

  const parts = trimmed.split(/[,\s;]+/).filter(Boolean);
  const ids: number[] = [];
  for (const part of parts) {
    const value = Number(part);
    if (!Number.isInteger(value) || value <= 0) {
      return { ids: [], error: `"${part}" không phải là id hợp lệ.` };
    }
    if (!ids.includes(value)) ids.push(value);
  }

  return { ids };
}
