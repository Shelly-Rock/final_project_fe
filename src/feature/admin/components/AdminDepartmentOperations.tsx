"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Chip,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  ClipboardList,
  GraduationCap,
  PieChartIcon,
  UsersRound,
} from "lucide-react";
import { periodService } from "@/feature/registration-period/services";
import { topicManageService } from "@/feature/project-governance/services/topicManage.service";
import { adminConfigService } from "@/feature/project-governance/services/adminConfig.service";
import { progressTrackingService } from "@/feature/progress-tracking/services";
import { committeeService } from "@/feature/committee/services";
import { defenseService } from "@/feature/defense-schedule/services";
import { submissionService } from "@/feature/submission/services";
import {
  getMeetings,
  getTranscripts,
  type MeetingListItem,
  type TranscriptDetail,
} from "@/feature/scoring/services";
import type { GovernanceStage } from "@/feature/project-governance/types";
import type { ManagedTopicRow } from "@/feature/project-governance/types";
import type { TeacherOverrideRow } from "@/feature/project-governance/types";
import type { StudentProgress } from "@/feature/progress-tracking/services/progress-tracking.service";
import type { DefenseSession } from "@/feature/defense-schedule/services/defense.service";

const C = {
  blue: "#2a78d6",
  blueSoft: "#eff6ff",
  orange: "#eb6834",
  orangeSoft: "#fff7ed",
  green: "#1baf7a",
  greenSoft: "#ecfdf5",
  yellow: "#eda100",
  yellowSoft: "#fffbeb",
  violet: "#4a3aa7",
  violetSoft: "#f5f3ff",
  red: "#e34948",
  redSoft: "#fef2f2",
  ink: "#0f172a",
  muted: "#64748b",
  faint: "#94a3b8",
  line: "#e2e8f0",
  surface: "#ffffff",
};

const cardSx = {
  p: 2.5,
  borderRadius: "18px",
  border: `1px solid ${C.line}`,
  bgcolor: C.surface,
  boxShadow: "0 14px 36px rgba(15, 23, 42, 0.06)",
};

const WEEKDAYS = [
  "Chủ nhật",
  "Thứ 2",
  "Thứ 3",
  "Thứ 4",
  "Thứ 5",
  "Thứ 6",
  "Thứ 7",
];

function settled<T>(r: PromiseSettledResult<T>, fallback: T): T {
  return r.status === "fulfilled" ? r.value : fallback;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function formatDay(d: Date) {
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`;
}

function formatTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function stageOf(
  stages: GovernanceStage[],
  type: GovernanceStage["type"],
): GovernanceStage | undefined {
  return stages.find((s) => s.type === type && s.enabled);
}

function isLater(stage?: GovernanceStage) {
  if (!stage) return true;
  return stage.state === "UPCOMING" || stage.state === "DISABLED";
}

type ActionTone = "due" | "later";

interface ActionRow {
  id: string;
  title: string;
  subtitle: string;
  tone: ActionTone;
  href?: string;
}

interface TeacherRow {
  id: string;
  name: string;
  email: string;
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  lateReports: number;
  used: number;
  quota: number;
}

interface TimelineEvent {
  id: string;
  at: Date;
  iso: string;
  title: string;
  detail: string;
  color: string;
  bg: string;
}

const STAGE_STYLE: Record<string, { color: string; bg: string }> = {
  FORM_02: { color: C.blue, bg: "#eff6ff" },
  STUDENT_REGISTRATION: { color: C.yellow, bg: "#fffbeb" },
  TEACHER_APPROVAL: { color: C.yellow, bg: "#fffbeb" },
  TOPIC_CREATION: { color: C.violet, bg: "#f5f3ff" },
  PERIODIC_REPORT: { color: C.green, bg: "#ecfdf5" },
  FINAL_SUBMISSION: { color: C.orange, bg: "#fff7ed" },
  MEETING: { color: "#64748b", bg: "#f8fafc" },
  DEFENSE: { color: C.violet, bg: "#f5f3ff" },
};

async function loadOperations() {
  const periods = await periodService.getAll();
  const period = periods.find((p) => p.status === "open") ?? periods[0] ?? null;

  if (!period) {
    return {
      period: null as typeof period,
      topics: [] as ManagedTopicRow[],
      teachers: [] as TeacherOverrideRow[],
      stages: [] as GovernanceStage[],
      progress: {
        pendingReports: 0,
        overdueReports: 0,
        totalStudents: 0,
      },
      students: [] as StudentProgress[],
      committee: {
        totalCommittees: 0,
        committeesMissingMembers: 0,
      },
      defense: { scheduled: 0, totalSessions: 0 },
      sessions: [] as DefenseSession[],
      submission: { total: 0, pending: 0 },
      meetingsOpen: 0,
      unpublished: 0,
      defaultQuota: 5,
    };
  }

  const results = await Promise.allSettled([
    topicManageService.listManaged({
      periodId: period.id,
      limit: 100,
      sortBy: "createdAt",
      sortOrder: "desc",
    }),
    adminConfigService.listTeacherOverrides({
      periodId: period.id,
      page: 1,
      limit: 50,
    }),
    topicManageService.governanceState(period.id),
    progressTrackingService.getStatistics(),
    progressTrackingService.getStudentProgress({ page: 1, limit: 100 }),
    committeeService.getStats(),
    defenseService.getStats(),
    defenseService.getDefenseSessions({
      page: 1,
      limit: 50,
      status: "SCHEDULED",
    }),
    submissionService.getStats(),
    getMeetings({ page: 1, limit: 100, finalized: false }),
    getTranscripts({ page: 1, limit: 100, published: false }),
  ]);

  const topicsPage = settled(results[0], {
    items: [] as ManagedTopicRow[],
    total: 0,
    page: 1,
    limit: 100,
    totalPages: 0,
    periodId: period.id,
    facets: { statuses: [], faculties: [], departments: [], teachers: [] },
  });
  const teacherPage = settled(results[1], {
    items: [] as TeacherOverrideRow[],
    total: 0,
    page: 1,
    limit: 50,
    config: {
      defaultTopicLimit: 5,
      maxTopicLimit: 10,
      maxStudentsPerTopic: 5,
    },
  });
  const governance = settled(results[2], {
    periodId: period.id,
    stages: [] as GovernanceStage[],
    locks: {
      topicWritable: true,
      registrationOpen: true,
      approvalOpen: true,
      reportOpen: true,
      finalSubmissionOpen: false,
    },
    config: {
      defaultTopicLimit: 5,
      maxTopicLimit: 10,
      maxStudentsPerTopic: 5,
      alertsEnabled: false,
      alertOffsetsDays: [] as number[],
      lastAlertRunAt: null as string | null,
    },
    serverTime: new Date().toISOString(),
  });
  const progress = settled(results[3], {
    totalStudents: 0,
    onTrackStudents: 0,
    extendedStudents: 0,
    topicChangedStudents: 0,
    bannedStudents: 0,
    pendingReports: 0,
    overdueReports: 0,
    averageReportsPerStudent: 0,
    complianceRate: 0,
  });
  const studentsPage = settled(results[4], {
    data: [] as StudentProgress[],
    total: 0,
    page: 1,
    limit: 100,
    totalPages: 0,
  });
  const committee = settled(results[5], {
    totalCommittees: 0,
    committeesWithFullMembers: 0,
    committeesMissingMembers: 0,
    totalExternalReviewers: 0,
  });
  const defense = settled(results[6], {
    totalSessions: 0,
    scheduled: 0,
    completed: 0,
    cancelled: 0,
    totalProjectsDefended: 0,
    averageScore: null as number | null,
  });
  const sessionsPage = settled(results[7], {
    data: [] as DefenseSession[],
    total: 0,
    page: 1,
    limit: 50,
    totalPages: 0,
  });
  const submission = settled(results[8], {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const emptyPage = {
    page: 1,
    limit: 100,
    total: 0,
    totalPages: 0,
  };
  const meetings = settled(results[9], {
    data: [] as MeetingListItem[],
    meta: emptyPage,
  });
  const transcripts = settled(results[10], {
    data: [] as TranscriptDetail[],
    meta: emptyPage,
  });

  return {
    period,
    topics: topicsPage.items ?? [],
    teachers: teacherPage.items ?? [],
    stages: governance.stages ?? [],
    progress,
    students: studentsPage.data ?? [],
    committee,
    defense,
    sessions: sessionsPage.data ?? [],
    submission,
    meetingsOpen: meetings.meta?.total ?? meetings.data?.length ?? 0,
    unpublished: transcripts.meta?.total ?? transcripts.data?.length ?? 0,
    defaultQuota:
      teacherPage.config?.defaultTopicLimit ??
      governance.config?.defaultTopicLimit ??
      5,
  };
}

export function AdminDepartmentOperations() {
  const router = useRouter();
  const [tab, setTab] = useState<"teachers" | "topics">("teachers");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-department-operations"],
    queryFn: loadOperations,
  });

  const now = useMemo(() => new Date(), []);
  const horizon = useMemo(() => new Date(now.getTime() + 14 * 86400000), [now]);

  const waitingSecretary = useMemo(
    () =>
      (data?.topics ?? []).reduce(
        (n, t) => n + (t.registrationSummary?.waitingSecretary ?? 0),
        0,
      ),
    [data],
  );

  const unlockedOrNoLead = useMemo(
    () => (data?.topics ?? []).filter((t) => !t.locked || !t.teacher).length,
    [data],
  );

  const teacherRows: TeacherRow[] = useMemo(() => {
    const map = new Map<string, TeacherRow>();

    const ensure = (id: string, name: string, email: string): TeacherRow => {
      const cur = map.get(id);
      if (cur) return cur;
      const row: TeacherRow = {
        id,
        name,
        email,
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        lateReports: 0,
        used: 0,
        quota: data?.defaultQuota ?? 5,
      };
      map.set(id, row);
      return row;
    };

    (data?.teachers ?? []).forEach((t) => {
      const id = String(t.id || t.teacher_id);
      const row = ensure(id, t.name, t.email);
      row.used = t.submittedTopics;
      row.quota = t.assignedQuota || row.quota;
      row.name = t.name;
      row.email = t.email;
    });

    (data?.topics ?? []).forEach((topic) => {
      if (!topic.teacher) return;
      const tid = String(topic.teacher.id);
      let row = [...map.values()].find(
        (r) =>
          r.id === tid ||
          r.name === topic.teacher?.name ||
          r.email === topic.teacher?.email,
      );
      if (!row) {
        row = ensure(tid, topic.teacher.name, topic.teacher.email);
      }
      row.total += 1;
      if (topic.status === "PENDING") row.pending += 1;
      else if (topic.status === "APPROVED") row.approved += 1;
      else if (topic.status === "REJECTED") row.rejected += 1;
    });

    (data?.students ?? []).forEach((s) => {
      const overdue =
        Boolean(s.nextDeadline) &&
        new Date(s.nextDeadline as string).getTime() < now.getTime() &&
        s.totalReportsSubmitted < s.totalReportsRequired;
      if (!overdue) return;
      const row = [...map.values()].find(
        (r) => r.id === String(s.teacherId) || r.name === s.teacherName,
      );
      if (row) row.lateReports += 1;
    });

    return Array.from(map.values()).sort(
      (a, b) => b.total - a.total || a.name.localeCompare(b.name),
    );
  }, [data, now]);

  const overQuota = teacherRows.filter((t) => t.used > t.quota).length;

  const overdueReports = Math.max(
    data?.progress.overdueReports ?? 0,
    (data?.students ?? []).filter(
      (s) =>
        Boolean(s.nextDeadline) &&
        new Date(s.nextDeadline as string).getTime() < now.getTime() &&
        s.totalReportsSubmitted < s.totalReportsRequired,
    ).length,
    data?.progress.pendingReports ?? 0,
  );

  const dist = useMemo(() => {
    const topics = data?.topics ?? [];
    const approved = topics.filter((t) => t.status === "APPROVED").length;
    const pending = topics.filter((t) => t.status === "PENDING").length;
    const late = topics.filter((t) => !t.locked && t.status !== "REJECTED")
      .length
      ? topics.filter((t) => {
          const lockStage = stageOf(data?.stages ?? [], "TOPIC_CREATION");
          if (!lockStage) return false;
          return (
            !t.locked &&
            new Date(lockStage.deadlineAt).getTime() < now.getTime()
          );
        }).length
      : 0;
    const total = approved + pending + late || topics.length || 1;
    return {
      approved,
      pending,
      late,
      total,
      approveRate: Math.round((approved / (topics.length || 1)) * 100),
      slices: [
        {
          name: "Đã hoàn thành",
          value: approved,
          pct: Math.round((approved / total) * 100),
          color: C.green,
        },
        {
          name: "Chờ duyệt",
          value: pending,
          pct: Math.round((pending / total) * 100),
          color: C.yellow,
        },
        {
          name: "Trễ hạn",
          value: late,
          pct: Math.round((late / total) * 100),
          color: C.red,
        },
      ],
    };
  }, [data, now]);

  const supervising = teacherRows.filter((t) => t.total > 0 || t.used > 0);
  const gvCount = supervising.length || teacherRows.length;
  const occupiedStudents = (data?.topics ?? []).reduce(
    (n, t) => n + (t.occupiedStudents || t.registeredStudents || 0),
    0,
  );
  const avgSv =
    gvCount > 0 ? Math.round((occupiedStudents / gvCount) * 10) / 10 : 0;
  const gvOk = overQuota === 0;

  const actions: ActionRow[] = useMemo(() => {
    const stages = data?.stages ?? [];
    const period = data?.period;
    const studentDl = period ? new Date(period.studentDeadline) : undefined;

    const items: ActionRow[] = [
      {
        id: "reg",
        title: `${waitingSecretary} đăng ký chờ thư ký xác nhận`,
        subtitle: studentDl
          ? `Hạn: ${formatDay(studentDl)}/${studentDl.getFullYear()}  ·  Phụ trách: Thư ký Khoa`
          : "Phụ trách: Thư ký Khoa",
        tone:
          waitingSecretary > 0
            ? "due"
            : isLater(
                  stageOf(stages, "STUDENT_REGISTRATION") ??
                    stageOf(stages, "TEACHER_APPROVAL"),
                )
              ? "later"
              : "due",
        href: "/project-config",
      },
      {
        id: "form02",
        title: `${overdueReports} Form-02 / Báo cáo quá hạn`,
        subtitle:
          overdueReports > 0
            ? "Quá hạn  ·  Nhắc GVHD"
            : "Nhắc GVHD khi đến hạn nộp",
        tone:
          overdueReports > 0
            ? "due"
            : isLater(
                  stageOf(stages, "FORM_02") ??
                    stageOf(stages, "PERIODIC_REPORT"),
                )
              ? "later"
              : "due",
        href: "/progress-tracking/admin",
      },
      {
        id: "lock",
        title: `${unlockedOrNoLead} đề tài chưa khóa / chưa có chủ nhiệm`,
        subtitle: (() => {
          const s = stageOf(stages, "TOPIC_CREATION");
          return s
            ? `Hạn khóa: ${formatDay(new Date(s.deadlineAt))}  ·  Bộ môn`
            : "Cần khóa danh sách đề tài";
        })(),
        tone:
          unlockedOrNoLead > 0
            ? "due"
            : isLater(stageOf(stages, "TOPIC_CREATION"))
              ? "later"
              : "due",
        href: "/project-config",
      },
      {
        id: "quota",
        title: `${overQuota} giảng viên vượt định mức hướng dẫn`,
        subtitle: `Quota: ${data?.defaultQuota ?? 5} đề tài/GV  ·  Cần phân bổ lại`,
        tone: overQuota > 0 ? "due" : "later",
        href: "/project-config",
      },
      {
        id: "submit",
        title: `${data?.submission.pending ?? 0} bài nộp cuối kỳ thiếu`,
        subtitle: (() => {
          const s = stageOf(stages, "FINAL_SUBMISSION");
          if (!s) return "Chưa mở cổng nộp bài";
          return `Mở từ ${formatDay(new Date(s.deadlineAt))}`;
        })(),
        tone: isLater(stageOf(stages, "FINAL_SUBMISSION")) ? "later" : "due",
        href: "/submission/admin",
      },
      {
        id: "council",
        title: "Hội đồng chưa hoàn thiện / chưa xếp lịch",
        subtitle: data?.committee.committeesMissingMembers
          ? `${data.committee.committeesMissingMembers} hội đồng thiếu thành viên`
          : data?.defense.scheduled
            ? `${data.defense.scheduled} ca đã xếp`
            : "Ban chủ nhiệm Khoa",
        tone:
          (data?.committee.totalCommittees ?? 0) === 0
            ? "later"
            : (data?.committee.committeesMissingMembers ?? 0) > 0 ||
                (data?.defense.scheduled ?? 0) === 0
              ? "due"
              : "later",
        href: "/committee",
      },
      {
        id: "score",
        title: "Điểm chưa chốt / chưa công bố",
        subtitle:
          data?.unpublished || data?.meetingsOpen
            ? `${data.meetingsOpen} chờ họp  ·  ${data.unpublished} chưa công bố`
            : "Sau bảo vệ",
        tone:
          (data?.meetingsOpen ?? 0) + (data?.unpublished ?? 0) > 0
            ? "due"
            : "later",
        href: "/scoring/admin",
      },
    ];
    return items;
  }, [data, waitingSecretary, overdueReports, unlockedOrNoLead, overQuota]);

  const timeline: TimelineEvent[] = useMemo(() => {
    const events: TimelineEvent[] = [];
    (data?.stages ?? [])
      .filter((s) => s.enabled)
      .forEach((s) => {
        const at = new Date(s.deadlineAt);
        if (Number.isNaN(at.getTime())) return;
        if (at < new Date(now.getTime() - 12 * 3600000)) return;
        if (at > horizon) return;
        const style = STAGE_STYLE[s.type] ?? STAGE_STYLE.MEETING;
        events.push({
          id: `st-${s.id}`,
          at,
          iso: s.deadlineAt,
          title: s.label,
          detail: `${formatTime(s.deadlineAt) || "—"}  ·  ${
            s.state === "OPEN"
              ? "Đang mở"
              : s.state === "CLOSED"
                ? "Đã đóng"
                : "Sắp tới"
          }`,
          color: style.color,
          bg: style.bg,
        });
      });

    const period = data?.period;
    if (period) {
      [
        {
          id: "p-sv",
          iso: period.studentDeadline,
          title: "Hạn xác nhận đăng ký SV",
          type: "STUDENT_REGISTRATION",
          extra: waitingSecretary
            ? `${waitingSecretary} đơn chờ xử lý`
            : "Đợt đăng ký",
        },
        {
          id: "p-gv",
          iso: period.teacherDeadline,
          title: "Hạn giảng viên nộp đề tài",
          type: "TOPIC_CREATION",
          extra: "Hệ thống tự động",
        },
      ].forEach((p) => {
        const at = new Date(p.iso);
        if (Number.isNaN(at.getTime())) return;
        if (at < new Date(now.getTime() - 12 * 3600000) || at > horizon) return;
        if (events.some((e) => Math.abs(e.at.getTime() - at.getTime()) < 60000))
          return;
        const style = STAGE_STYLE[p.type] ?? STAGE_STYLE.MEETING;
        events.push({
          id: p.id,
          at,
          iso: p.iso,
          title: p.title,
          detail: `${formatTime(p.iso) || "—"}  ·  ${p.extra}`,
          color: style.color,
          bg: style.bg,
        });
      });
    }

    (data?.sessions ?? []).forEach((ss) => {
      const at = new Date(`${ss.defenseDate}T${ss.startTime || "00:00"}`);
      if (Number.isNaN(at.getTime())) return;
      if (at < now || at > horizon) return;
      const style = STAGE_STYLE.DEFENSE;
      events.push({
        id: `df-${ss.id}`,
        at,
        iso: at.toISOString(),
        title: `Bảo vệ · ${ss.committeeName}`,
        detail: `${ss.startTime || "—"}  ·  ${ss.room || "Chưa có phòng"}`,
        color: style.color,
        bg: style.bg,
      });
    });

    return events.sort((a, b) => a.at.getTime() - b.at.getTime()).slice(0, 8);
  }, [data, now, horizon, waitingSecretary]);

  const rangeLabel =
    timeline.length > 0
      ? `${formatDay(timeline[0].at)} – ${formatDay(timeline[timeline.length - 1].at)}/${timeline[timeline.length - 1].at.getFullYear()}`
      : `${formatDay(now)} – ${formatDay(horizon)}/${horizon.getFullYear()}`;

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1.65fr 1fr" },
            gap: 2,
          }}
        >
          <Skeleton
            variant="rounded"
            height={420}
            sx={{ borderRadius: "16px" }}
          />
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Skeleton
              variant="rounded"
              height={280}
              sx={{ borderRadius: "16px" }}
            />
            <Skeleton
              variant="rounded"
              height={120}
              sx={{ borderRadius: "16px" }}
            />
          </Box>
        </Box>
        <Skeleton
          variant="rounded"
          height={280}
          sx={{ borderRadius: "16px" }}
        />
        <Skeleton
          variant="rounded"
          height={360}
          sx={{ borderRadius: "16px" }}
        />
      </Box>
    );
  }

  const donutData = dist.slices.filter((s) => s.value > 0);
  const donutFill = donutData.length
    ? donutData
    : [{ name: "Trống", value: 1, color: C.line, pct: 0 }];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1.65fr 1fr" },
          gap: 2,
          alignItems: "stretch",
        }}
      >
        <Box
          sx={{
            ...cardSx,
            position: "relative",
            overflow: "hidden",
            background:
              "linear-gradient(180deg, #ffffff 0%, #fbfdff 62%, #f8fafc 100%)",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: "0 0 auto 0",
              height: 96,
              background:
                "radial-gradient(circle at top left, rgba(42, 120, 214, 0.12), transparent 42%)",
              pointerEvents: "none",
            }}
          />
          <Box
            sx={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              mb: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "14px",
                  bgcolor: C.blueSoft,
                  color: C.blue,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ClipboardList size={21} />
              </Box>
              <Box>
                <Typography
                  sx={{ fontWeight: 800, fontSize: 17, color: C.ink }}
                >
                  Việc cần xử lý hôm nay
                </Typography>
                <Typography sx={{ fontSize: 12.5, color: C.muted, mt: 0.2 }}>
                  Ưu tiên các mục đang đến hạn hoặc cần can thiệp
                </Typography>
              </Box>
            </Box>
            <Chip
              label={`${actions.filter((a) => a.tone === "due").length}/${actions.length} cần xử lý`}
              size="small"
              sx={{
                height: 26,
                fontSize: 11.5,
                fontWeight: 800,
                bgcolor: C.orangeSoft,
                color: C.orange,
                border: `1px solid rgba(235, 104, 52, 0.22)`,
              }}
            />
          </Box>
          <Box sx={{ position: "relative", display: "grid", gap: 1 }}>
            {actions.map((a, idx) => {
              const due = a.tone === "due";
              const firstDue =
                due && actions.findIndex((x) => x.tone === "due") === idx;
              const Icon = due ? AlertTriangle : Clock3;
              const color = due ? (firstDue ? C.orange : C.blue) : C.faint;
              const bg = due
                ? firstDue
                  ? C.orangeSoft
                  : C.blueSoft
                : "#f8fafc";
              return (
                <Box
                  key={a.id}
                  onClick={() => due && a.href && router.push(a.href)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.4,
                    p: 1.35,
                    borderRadius: "14px",
                    border: `1px solid ${firstDue ? "rgba(235, 104, 52, 0.28)" : C.line}`,
                    bgcolor: due ? "rgba(255,255,255,0.88)" : "#f8fafc",
                    cursor: due && a.href ? "pointer" : "default",
                    opacity: due ? 1 : 0.72,
                    boxShadow: firstDue
                      ? "0 10px 26px rgba(235, 104, 52, 0.10)"
                      : "none",
                    transition: "all 0.18s ease",
                    "&:hover": due
                      ? {
                          transform: "translateY(-1px)",
                          borderColor: color,
                          boxShadow: "0 12px 26px rgba(15, 23, 42, 0.08)",
                        }
                      : undefined,
                  }}
                >
                  <Box
                    sx={{
                      width: 34,
                      height: 34,
                      borderRadius: "12px",
                      bgcolor: bg,
                      color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={18} />
                  </Box>
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography
                      sx={{
                        fontSize: 14,
                        fontWeight: 750,
                        color: C.ink,
                        lineHeight: 1.35,
                      }}
                    >
                      {a.title}
                    </Typography>
                    <Typography
                      sx={{ fontSize: 12.5, color: C.muted, mt: 0.25 }}
                      noWrap
                    >
                      {a.subtitle}
                    </Typography>
                  </Box>
                  <Chip
                    label={due ? "Xử lý" : "Chưa đến hạn"}
                    size="small"
                    sx={{
                      height: 24,
                      borderRadius: "999px",
                      fontSize: 11,
                      fontWeight: 800,
                      bgcolor: due ? bg : "#f1f5f9",
                      color,
                      flexShrink: 0,
                    }}
                  />
                </Box>
              );
            })}
          </Box>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box
            sx={{
              ...cardSx,
              flex: 1,
              position: "relative",
              overflow: "hidden",
              background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                mb: 1.5,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "13px",
                    bgcolor: C.greenSoft,
                    color: C.green,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PieChartIcon size={19} />
                </Box>
                <Box>
                  <Typography
                    sx={{ fontWeight: 800, fontSize: 16, color: C.ink }}
                  >
                    Phân bố đề tài
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: C.muted }}>
                    Theo trạng thái xử lý hiện tại
                  </Typography>
                </Box>
              </Box>
              <Chip
                label={`${data?.topics.length ?? 0} đề tài`}
                size="small"
                sx={{
                  height: 24,
                  fontSize: 11,
                  fontWeight: 800,
                  bgcolor: "#f1f5f9",
                  color: C.muted,
                }}
              />
            </Box>

            <Box sx={{ position: "relative", height: 188 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutFill}
                    dataKey="value"
                    innerRadius={58}
                    outerRadius={80}
                    paddingAngle={2}
                    stroke={C.surface}
                    strokeWidth={3}
                  >
                    {donutFill.map((d, i) => (
                      <Cell key={i} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v, n) => [`${v ?? 0} đề tài`, String(n)]}
                    contentStyle={{
                      borderRadius: 12,
                      border: `1px solid ${C.line}`,
                      boxShadow: "0 12px 28px rgba(15, 23, 42, 0.12)",
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 30,
                    fontWeight: 900,
                    color: C.ink,
                    lineHeight: 1,
                  }}
                >
                  {data?.topics.length ? `${dist.approveRate}%` : "—"}
                </Typography>
                <Typography sx={{ fontSize: 12, color: C.muted, mt: 0.5 }}>
                  tỷ lệ duyệt
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "grid", gap: 1, mt: 1 }}>
              {dist.slices.map((s) => (
                <Box
                  key={s.name}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1.5,
                    p: 1,
                    borderRadius: "12px",
                    bgcolor: "rgba(248, 250, 252, 0.82)",
                    border: `1px solid #f1f5f9`,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        bgcolor: s.color,
                        boxShadow: `0 0 0 3px ${s.color}18`,
                        flexShrink: 0,
                      }}
                    />
                    <Typography sx={{ fontSize: 12.5, color: C.muted }}>
                      {s.name}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      sx={{ fontSize: 12.5, fontWeight: 800, color: C.ink }}
                    >
                      {s.value}
                    </Typography>
                    <Typography
                      sx={{ fontSize: 12.5, fontWeight: 800, color: s.color }}
                    >
                      {s.pct}%
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          <Box
            sx={{
              ...cardSx,
              background:
                "linear-gradient(135deg, #ffffff 0%, #f8fbff 55%, #eef6ff 100%)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "13px",
                  bgcolor: C.violetSoft,
                  color: C.violet,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <GraduationCap size={20} />
              </Box>
              <Box>
                <Typography
                  sx={{ fontWeight: 800, fontSize: 16, color: C.ink }}
                >
                  Giảng viên hướng dẫn
                </Typography>
                <Typography sx={{ fontSize: 12, color: C.muted }}>
                  Tải hướng dẫn theo quota
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: 42,
                    fontWeight: 900,
                    color: C.ink,
                    lineHeight: 0.95,
                    letterSpacing: "-0.04em",
                  }}
                >
                  {gvCount}
                </Typography>
                <Typography sx={{ fontSize: 13, color: C.muted, mt: 0.75 }}>
                  GV đang HD
                </Typography>
              </Box>
              <Box sx={{ textAlign: "right" }}>
                <Chip
                  icon={
                    gvOk ? (
                      <CheckCircle2 size={14} />
                    ) : (
                      <AlertTriangle size={14} />
                    )
                  }
                  label={gvOk ? "Tốt" : "Quá tải"}
                  size="small"
                  sx={{
                    height: 26,
                    fontSize: 11.5,
                    fontWeight: 800,
                    bgcolor: gvOk ? C.greenSoft : C.redSoft,
                    color: gvOk ? C.green : C.red,
                    mb: 0.75,
                    "& .MuiChip-icon": {
                      color: "inherit",
                      ml: 0.75,
                    },
                  }}
                />
                <Typography sx={{ fontSize: 12.5, color: C.faint }}>
                  TB {avgSv} SV/GV
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                mt: 2.25,
                p: 1.25,
                borderRadius: "14px",
                bgcolor: "rgba(255,255,255,0.72)",
                border: `1px solid ${C.line}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1.5,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <UsersRound size={17} color={C.blue} />
                <Typography sx={{ fontSize: 12.5, color: C.muted }}>
                  Tổng giảng viên
                </Typography>
              </Box>
              <Typography sx={{ fontSize: 13, fontWeight: 800, color: C.ink }}>
                {teacherRows.length} người
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{ ...cardSx, p: 0, overflow: "hidden" }}>
        <Box
          sx={{
            px: 2.5,
            py: 1.75,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            borderBottom: `1px solid ${C.line}`,
            background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
          }}
        >
          <Box sx={{ display: "flex", gap: 1 }}>
            {(
              [
                { key: "teachers", label: "Giảng viên" },
                { key: "topics", label: "Đề tài / Nhóm" },
              ] as const
            ).map((t) => (
              <Box
                key={t.key}
                onClick={() => setTab(t.key)}
                sx={{
                  px: 1.6,
                  py: 0.8,
                  cursor: "pointer",
                  borderRadius: "999px",
                  bgcolor: tab === t.key ? C.blueSoft : "transparent",
                  border: `1px solid ${tab === t.key ? "rgba(42, 120, 214, 0.22)" : "transparent"}`,
                  transition: "all 0.18s ease",
                  "&:hover": {
                    bgcolor: tab === t.key ? C.blueSoft : "#f1f5f9",
                  },
                }}
              >
                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: 800,
                    color: tab === t.key ? C.blue : C.muted,
                  }}
                >
                  {t.label}
                </Typography>
              </Box>
            ))}
          </Box>
          <Typography sx={{ fontSize: 12.5, color: C.faint, fontWeight: 600 }}>
            {tab === "teachers"
              ? `${teacherRows.length} giảng viên`
              : `${data?.topics.length ?? 0} đề tài`}
          </Typography>
        </Box>

        {tab === "teachers" ? (
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "#f8fafc" }}>
                {[
                  "Họ tên",
                  "Email",
                  "Tổng ĐT",
                  "Chờ",
                  "Duyệt",
                  "Từ chối",
                  "BC trễ",
                  "Quota",
                ].map((h) => (
                  <TableCell
                    key={h}
                    sx={{
                      fontSize: 11,
                      fontWeight: 800,
                      color: C.muted,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                      borderColor: C.line,
                      py: 1.35,
                    }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {teacherRows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    sx={{ py: 4, textAlign: "center", color: C.muted }}
                  >
                    Chưa có dữ liệu giảng viên cho đợt hiện tại.
                  </TableCell>
                </TableRow>
              ) : (
                teacherRows.map((row) => {
                  const over = row.used > row.quota;
                  const full = row.used === row.quota;
                  const bar = over ? C.red : full ? C.orange : C.green;
                  const pct = row.quota
                    ? Math.min(100, Math.round((row.used / row.quota) * 100))
                    : 0;
                  return (
                    <TableRow
                      key={row.id}
                      hover
                      sx={{
                        "& td": { borderColor: "#f1f5f9", py: 1.45 },
                        "&:hover": { bgcolor: "#f8fafc" },
                      }}
                    >
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Box
                            sx={{
                              width: 30,
                              height: 30,
                              borderRadius: "10px",
                              bgcolor: C.violetSoft,
                              color: C.violet,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 12,
                              fontWeight: 900,
                              flexShrink: 0,
                            }}
                          >
                            {row.name.trim().charAt(0).toUpperCase() || "G"}
                          </Box>
                          <Typography
                            sx={{
                              fontSize: 13.5,
                              fontWeight: 700,
                              color: C.ink,
                            }}
                          >
                            {row.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: 13, color: C.muted }}>
                          {row.email || "—"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: 13.5, fontWeight: 700 }}>
                          {row.total}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          sx={{
                            fontSize: 13.5,
                            fontWeight: 700,
                            color: row.pending ? C.yellow : C.faint,
                          }}
                        >
                          {row.pending}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          sx={{
                            fontSize: 13.5,
                            fontWeight: 700,
                            color: row.approved ? C.green : C.faint,
                          }}
                        >
                          {row.approved}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          sx={{
                            fontSize: 13.5,
                            fontWeight: 700,
                            color: row.rejected ? C.red : C.faint,
                          }}
                        >
                          {row.rejected}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          sx={{
                            fontSize: 13.5,
                            fontWeight: 700,
                            color: row.lateReports ? C.red : C.faint,
                          }}
                        >
                          {row.lateReports}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ minWidth: 140 }}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Box
                            sx={{
                              flex: 1,
                              height: 6,
                              bgcolor: "#f1f5f9",
                              borderRadius: 3,
                              overflow: "hidden",
                              minWidth: 56,
                            }}
                          >
                            <Box
                              sx={{
                                width: `${pct}%`,
                                height: "100%",
                                bgcolor: bar,
                                borderRadius: 3,
                              }}
                            />
                          </Box>
                          <Typography
                            sx={{
                              fontSize: 12,
                              fontWeight: 700,
                              color: bar,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {row.used}/{row.quota}
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "#fafbfc" }}>
                {[
                  "Mã ĐT",
                  "Tên đề tài",
                  "GVHD",
                  "Nhóm",
                  "Trạng thái",
                  "Khóa",
                ].map((h) => (
                  <TableCell
                    key={h}
                    sx={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: C.muted,
                      textTransform: "uppercase",
                      letterSpacing: 0.4,
                      borderColor: C.line,
                      py: 1.25,
                    }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {(data?.topics ?? []).length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    sx={{ py: 4, textAlign: "center", color: C.muted }}
                  >
                    Chưa có đề tài trong đợt hiện tại.
                  </TableCell>
                </TableRow>
              ) : (
                (data?.topics ?? []).slice(0, 12).map((t) => {
                  const statusColor =
                    t.status === "APPROVED"
                      ? C.green
                      : t.status === "REJECTED"
                        ? C.red
                        : C.yellow;
                  return (
                    <TableRow
                      key={t.id}
                      hover
                      sx={{ "& td": { borderColor: "#f1f5f9", py: 1.35 } }}
                    >
                      <TableCell>
                        <Typography
                          sx={{ fontSize: 13, fontWeight: 600, color: C.ink }}
                        >
                          {t.code || "—"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          sx={{ fontSize: 13.5, fontWeight: 600, color: C.ink }}
                        >
                          {t.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: 13, color: C.muted }}>
                          {t.teacher?.name || "Chưa có GV"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: 13.5, fontWeight: 700 }}>
                          {t.occupiedStudents || t.registeredStudents || 0}/
                          {t.maxStudents}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={t.statusLabel || t.status}
                          size="small"
                          sx={{
                            height: 22,
                            fontSize: 11,
                            fontWeight: 700,
                            bgcolor: `${statusColor}18`,
                            color: statusColor,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography
                          sx={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: t.locked ? C.green : C.yellow,
                          }}
                        >
                          {t.locked ? "Đã khóa" : "Chưa khóa"}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        )}
      </Box>

      <Box sx={cardSx}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Typography sx={{ fontWeight: 700, fontSize: 16, color: C.ink }}>
            Lịch 14 ngày tới
          </Typography>
          <Typography sx={{ fontSize: 12, color: C.faint }}>
            {rangeLabel}
          </Typography>
        </Box>
        {timeline.length === 0 ? (
          <Typography sx={{ fontSize: 13, color: C.muted, py: 2 }}>
            Không có mốc hạn nào trong 14 ngày tới.
          </Typography>
        ) : (
          timeline.map((ev, i) => {
            const today = isSameDay(ev.at, now);
            return (
              <Box
                key={ev.id}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "72px 20px 1fr",
                  gap: 1.5,
                  alignItems: "stretch",
                }}
              >
                <Box sx={{ pt: 1.25, textAlign: "right" }}>
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: today ? C.blue : C.ink,
                    }}
                  >
                    {formatDay(ev.at)}
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: C.faint }}>
                    {today ? "Hôm nay" : WEEKDAYS[ev.at.getDay()]}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    position: "relative",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {i < timeline.length - 1 && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 22,
                        bottom: -8,
                        width: 2,
                        bgcolor: "#eef2f6",
                      }}
                    />
                  )}
                  <Box
                    sx={{
                      mt: 1.4,
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      bgcolor: C.surface,
                      border: `3px solid ${ev.color}`,
                      zIndex: 1,
                      boxShadow: today ? `0 0 0 4px ${ev.color}22` : "none",
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    mb: 1.25,
                    px: 2,
                    py: 1.25,
                    borderRadius: "12px",
                    bgcolor: ev.bg,
                  }}
                >
                  <Typography
                    sx={{ fontSize: 14, fontWeight: 700, color: C.ink }}
                  >
                    {ev.title}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: C.muted, mt: 0.25 }}>
                    {ev.detail}
                  </Typography>
                </Box>
              </Box>
            );
          })
        )}
      </Box>
    </Box>
  );
}
