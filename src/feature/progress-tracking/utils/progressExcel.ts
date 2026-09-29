import * as XLSX from "xlsx";
import type {
  ProgressReport,
  StudentProgress,
} from "../services/progress-tracking.service";

export interface StudentProgressImportRow {
  studentId: number;
  status?: StudentProgress["status"];
  banReason?: string;
  totalReportsRequired?: number;
  nextDeadline?: string;
}

const STATUS_ALIASES: Record<string, StudentProgress["status"]> = {
  ON_TRACK: "ON_TRACK",
  "DANG TIEN HANH": "ON_TRACK",
  DANG_TIEN_HANH: "ON_TRACK",
  EXTENDED: "EXTENDED",
  "GIA HAN": "EXTENDED",
  GIA_HAN: "EXTENDED",
  TOPIC_CHANGED: "TOPIC_CHANGED",
  "DOI DE TAI": "TOPIC_CHANGED",
  DOI_DE_TAI: "TOPIC_CHANGED",
  BANNED: "BANNED",
  "CAM THI": "BANNED",
  CAM_THI: "BANNED",
};

function normalizeHeader(value: unknown) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "");
}

function normalizeText(value: unknown) {
  return String(value ?? "").trim();
}

function getValue(record: Record<string, unknown>, names: string[]) {
  const normalized = new Map(
    Object.entries(record).map(([key, value]) => [normalizeHeader(key), value]),
  );
  for (const name of names) {
    const value = normalized.get(normalizeHeader(name));
    if (value !== undefined && value !== "") return value;
  }
  return undefined;
}

export function exportStudentProgressToExcel(rows: StudentProgress[]) {
  const data = rows.map((row) => ({
    studentId: row.studentId,
    studentMssv: row.studentMssv ?? "",
    studentName: row.studentName ?? "",
    topicName: row.topicName ?? "",
    teacherName: row.teacherName ?? "",
    status: row.status,
    isBanned: row.isBanned ? "TRUE" : "FALSE",
    banReason: row.banReason ?? "",
    totalReportsRequired: row.totalReportsRequired,
    totalReportsSubmitted: row.totalReportsSubmitted,
    nextDeadline: row.nextDeadline ?? "",
    lastReportDate: row.lastReportDate ?? "",
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "StudentProgress");
  XLSX.writeFile(workbook, "student_progress.xlsx");
}

export function exportProgressReportsToExcel(rows: ProgressReport[]) {
  const data = rows.map((row) => ({
    reportId: row.id,
    title: row.title,
    studentId: row.studentId,
    studentName: row.studentName ?? "",
    teacherId: row.teacherId,
    teacherName: row.teacherName ?? "",
    month: row.month,
    year: row.year,
    status: row.status,
    score: row.score ?? "",
    feedback: row.feedback ?? "",
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "ProgressReports");
  XLSX.writeFile(workbook, "progress_reports.xlsx");
}

export async function parseStudentProgressImport(
  file: File,
): Promise<StudentProgressImportRow[]> {
  const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" });
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  if (!firstSheet) throw new Error("File khong co sheet du lieu.");

  const records = XLSX.utils.sheet_to_json<Record<string, unknown>>(
    firstSheet,
    {
      defval: "",
    },
  );
  if (records.length === 0) throw new Error("File khong co dong du lieu.");

  const rows: StudentProgressImportRow[] = [];
  const errors: string[] = [];

  records.forEach((record, index) => {
    const rowNumber = index + 2;
    const rawStudentId = getValue(record, ["studentId", "student_id"]);
    const studentId = Number(rawStudentId);
    if (!Number.isInteger(studentId) || studentId <= 0) {
      errors.push(`Dong ${rowNumber}: studentId khong hop le.`);
      return;
    }

    const rawStatus = getValue(record, ["status"]);
    const rawStatusText = normalizeText(rawStatus);
    const normalizedStatus = rawStatusText
      .toUpperCase()
      .replace(/[\s-]+/g, "_");
    const status = rawStatusText
      ? (STATUS_ALIASES[normalizedStatus] ??
        STATUS_ALIASES[rawStatusText.toUpperCase()])
      : undefined;
    if (rawStatusText && !status) {
      errors.push(`Dong ${rowNumber}: status khong hop le.`);
      return;
    }

    const rawRequired = getValue(record, [
      "totalReportsRequired",
      "total_reports_required",
    ]);
    const totalReportsRequired =
      rawRequired === undefined || normalizeText(rawRequired) === ""
        ? undefined
        : Number(rawRequired);
    if (
      totalReportsRequired !== undefined &&
      (!Number.isInteger(totalReportsRequired) || totalReportsRequired < 0)
    ) {
      errors.push(`Dong ${rowNumber}: totalReportsRequired khong hop le.`);
      return;
    }

    rows.push({
      studentId,
      status,
      banReason:
        normalizeText(getValue(record, ["banReason", "ban_reason"])) ||
        undefined,
      totalReportsRequired,
      nextDeadline:
        normalizeText(getValue(record, ["nextDeadline", "next_deadline"])) ||
        undefined,
    });
  });

  if (errors.length > 0) throw new Error(errors.slice(0, 5).join(" "));
  return rows;
}
