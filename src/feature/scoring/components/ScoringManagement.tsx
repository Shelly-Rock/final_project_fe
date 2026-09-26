"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Tabs,
  Tab,
  Paper,
  Typography,
  Chip,
  LinearProgress,
  useTheme,
} from "@mui/material";
import { GRADIENT_STYLES } from "@/shared/constants/gradients";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  ClipboardList,
  Users,
  UserCheck,
  ChevronRight,
  FileCheck,
  Megaphone,
} from "lucide-react";
import { toast } from "sonner";
import { DataTable } from "@/shared/components";
import type { Column } from "@/shared/components";
import {
  getAllScores,
  getAllResults,
  getResultByProject,
  getMeetings,
  getTranscripts,
  ScoringType,
  ScoringStatus,
  Score,
  ScoringResult,
  MeetingListItem,
  TranscriptDetail,
} from "../services";
import { ScoringStats, ScoringStatCard } from "./ScoringStats";
import { ScoringTable } from "./ScoringTable";
import { ScoringResultsTable } from "./ScoringResultsTable";
import {
  ScoringResultDetailsDialog,
  ScoreDetailDialog,
} from "./ScoringResultDetailsDialog";

const C = {
  blue: "#2a78d6",
  orange: "#eb6834",
  green: "#1baf7a",
  yellow: "#eda100",
  violet: "#4a3aa7",
  red: "#e34948",
};

const isDone = (s: Score) =>
  s.status === "SUBMITTED" || s.status === "PASSED" || s.status === "FAILED";

const isOverdue = (score: Score) => {
  if (!score.deadline) return false;
  if (isDone(score)) return false;
  return new Date(score.deadline).getTime() < Date.now();
};

const daysLeft = (deadline: string | null) => {
  if (!deadline) return null;
  return Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000);
};

const studentName = (
  s?: {
    firstName?: string;
    middleName?: string;
    lastName?: string;
  } | null,
) => {
  if (!s) return "-";
  return (
    [s.lastName, s.middleName, s.firstName].filter(Boolean).join(" ") || "-"
  );
};

interface TeacherRow {
  id: string;
  name: string;
  assigned: number;
  submitted: number;
  pending: number;
  overdue: number;
  avg: number | null;
}

type ActionKind = "urgent" | "warn" | "ready";

interface ActionItem {
  id: string;
  kind: ActionKind;
  title: string;
  subtitle: string;
  onClick: () => void;
}

export function ScoringManagementPage() {
  const router = useRouter();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const ink = theme.palette.text.primary;
  const muted = theme.palette.text.secondary;
  const line = theme.palette.divider;
  const paper = theme.palette.background.paper;
  const cardSx = {
    p: 2.5,
    borderRadius: 3,
    border: "1px solid",
    borderColor: "divider",
    bgcolor: isDark ? "#1e293b" : "background.paper",
    backgroundImage: isDark ? GRADIENT_STYLES.darkGradient : "none",
    boxShadow: isDark ? "none" : "0 1px 3px rgba(0,0,0,0.06)",
    height: "100%",
  };
  const [overviewScores, setOverviewScores] = useState<Score[]>([]);
  const [scores, setScores] = useState<Score[]>([]);
  const [overviewResults, setOverviewResults] = useState<ScoringResult[]>([]);
  const [results, setResults] = useState<ScoringResult[]>([]);
  const [meetingsOpen, setMeetingsOpen] = useState<MeetingListItem[]>([]);
  const [meetingsDone, setMeetingsDone] = useState<MeetingListItem[]>([]);
  const [transcriptsDraft, setTranscriptsDraft] = useState<TranscriptDetail[]>(
    [],
  );
  const [transcriptsPub, setTranscriptsPub] = useState<TranscriptDetail[]>([]);
  const [scoreTotal, setScoreTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"scores" | "results" | "teachers">(
    "scores",
  );
  const [selectedResult, setSelectedResult] = useState<ScoringResult | null>(
    null,
  );
  const [selectedScore, setSelectedScore] = useState<Score | null>(null);

  const [scoringType, setScoringType] = useState<ScoringType | "ALL">("ALL");
  const [status, setStatus] = useState<ScoringStatus | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [resultSearch, setResultSearch] = useState("");
  const [teacherSearch, setTeacherSearch] = useState("");

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const loadOverview = useCallback(async () => {
    const [scoresRes, resultsRes, openM, doneM, draftT, pubT] =
      await Promise.allSettled([
        getAllScores({ page: 1, limit: 100 }),
        getAllResults({ page: 1, limit: 100 }),
        getMeetings({ page: 1, limit: 100, finalized: false }),
        getMeetings({ page: 1, limit: 100, finalized: true }),
        getTranscripts({ page: 1, limit: 100, published: false }),
        getTranscripts({ page: 1, limit: 100, published: true }),
      ]);
    if (scoresRes.status === "fulfilled") {
      const list = scoresRes.value.data ?? [];
      setOverviewScores(list);
      setScoreTotal(scoresRes.value.meta?.total ?? list.length);
      setScores((prev) => (prev.length ? prev : list));
    }
    if (resultsRes.status === "fulfilled") {
      const list = resultsRes.value.data ?? [];
      setOverviewResults(list);
      setResults((prev) => (prev.length ? prev : list));
    }
    if (openM.status === "fulfilled") setMeetingsOpen(openM.value.data ?? []);
    if (doneM.status === "fulfilled") setMeetingsDone(doneM.value.data ?? []);
    if (draftT.status === "fulfilled")
      setTranscriptsDraft(draftT.value.data ?? []);
    if (pubT.status === "fulfilled") setTranscriptsPub(pubT.value.data ?? []);
  }, []);

  const fetchScores = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllScores({
        page,
        limit: 20,
        ...(scoringType !== "ALL" ? { scoringType } : {}),
        ...(status !== "ALL" ? { status } : {}),
      });
      setScores(data.data);
      setTotal(data.meta.total);
    } catch {
      toast.error("Không thể tải danh sách phiếu chấm");
    } finally {
      setLoading(false);
    }
  }, [page, scoringType, status]);

  const fetchResults = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllResults({ page, limit: 20 });
      setResults(data.data);
      setTotal(data.meta.total);
    } catch {
      toast.error("Không thể tải kết quả chấm điểm");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  useEffect(() => {
    if (activeTab === "scores") fetchScores();
    else if (activeTab === "results") fetchResults();
  }, [activeTab, fetchScores, fetchResults]);

  const viewResultDetails = async (projectId: number) => {
    try {
      const result = await getResultByProject(projectId);
      setSelectedResult(result);
    } catch {
      toast.error("Không thể tải chi tiết kết quả");
    }
  };

  const gvhd = overviewScores.filter((s) => s.scoringType === "GVHD");
  const committee = overviewScores.filter((s) => s.scoringType === "COMMITTEE");
  const gvhdDone = gvhd.filter(isDone).length;
  const committeeDone = committee.filter(isDone).length;
  const pendingScores = overviewScores.filter(
    (s) => s.status === "PENDING" || s.status === "IN_PROGRESS",
  );
  const overdueScores = overviewScores.filter(isOverdue);
  const passedCount = overviewResults.filter(
    (r) => !r.isEliminated && r.gvhdScore !== null,
  ).length;
  const eliminatedCount = overviewResults.filter((r) => r.isEliminated).length;
  const scoringInProgress = Math.max(
    overviewResults.length - passedCount - eliminatedCount,
    0,
  );
  const readyToFinalize = meetingsOpen.filter(
    (m) =>
      m.scoredCount > 0 && m.scoredCount === m.totalCount && !m.isFinalized,
  );
  const readyToPublish = transcriptsDraft.filter(
    (t) => t.isFinalized && !t.isPublished,
  );

  const committeeProjectIds = new Set(committee.map((s) => s.projectId));
  const committeeCompleteProjects = [...committeeProjectIds].filter((id) =>
    committee.filter((s) => s.projectId === id).every(isDone),
  ).length;
  const resultFinalized = overviewResults.filter((r) =>
    Boolean(r.finalStatus),
  ).length;

  const meetingDoneCount = meetingsDone.length || resultFinalized;
  const meetingTotalCount =
    meetingsOpen.length + meetingsDone.length || committeeCompleteProjects;
  const publishDoneCount = transcriptsPub.length;
  const publishTotalCount =
    transcriptsPub.length + transcriptsDraft.length || resultFinalized;

  const pipeline = [
    {
      label: "1. Gán phiếu",
      value: scoreTotal || overviewScores.length,
      subtext: "phiếu đã gán",
      icon: <ClipboardList size={18} />,
      iconColor: C.blue,
    },
    {
      label: "2. GVHD chấm",
      value: `${gvhdDone}/${gvhd.length}`,
      subtext: "đã nộp / tổng phiếu GVHD",
      icon: <UserCheck size={18} />,
      iconColor: C.violet,
    },
    {
      label: "3. Hội đồng chấm",
      value: `${committeeDone}/${committee.length}`,
      subtext: "đã nộp / tổng phiếu hội đồng",
      icon: <Users size={18} />,
      iconColor: C.blue,
    },
    {
      label: "4. Họp chốt",
      value: `${meetingDoneCount}/${meetingTotalCount}`,
      subtext: "đã chốt / tổng phiên họp",
      icon: <FileCheck size={18} />,
      iconColor: C.orange,
    },
    {
      label: "5. Công bố",
      value: `${publishDoneCount}/${publishTotalCount}`,
      subtext: "đã publish / tổng bảng điểm",
      icon: <Megaphone size={18} />,
      iconColor: C.green,
    },
  ];

  const stats = {
    total: scoreTotal || overviewScores.length,
    pending: pendingScores.length,
    overdue: overdueScores.length,
    waitingMeeting:
      readyToFinalize.length ||
      meetingsOpen.length ||
      Math.max(committeeCompleteProjects - meetingDoneCount, 0),
    waitingPublish: readyToPublish.length || transcriptsDraft.length,
    published: transcriptsPub.length,
  };

  const donutData = [
    { name: "Đạt", value: passedCount, color: C.green },
    { name: "Loại", value: eliminatedCount, color: C.red },
    { name: "Đang chấm", value: scoringInProgress, color: C.yellow },
  ].filter((d) => d.value > 0);
  const donutTotal = donutData.reduce((a, b) => a + b.value, 0) || 1;
  const passRate = Math.round((passedCount / donutTotal) * 100);

  const buckets = [
    { name: "< 4", min: 0, max: 4, color: C.red },
    { name: "4–5.4", min: 4, max: 5.5, color: C.orange },
    { name: "5.5–6.9", min: 5.5, max: 7, color: C.yellow },
    { name: "7–8.4", min: 7, max: 8.5, color: C.blue },
    { name: "≥ 8.5", min: 8.5, max: 11, color: C.green },
  ];
  const distData = buckets.map((b) => ({
    name: b.name,
    count: overviewScores.filter(
      (s) => s.score !== null && s.score >= b.min && s.score < b.max,
    ).length,
    fill: b.color,
  }));

  const teacherRows: TeacherRow[] = useMemo(() => {
    const map = new Map<string, TeacherRow & { sum: number; n: number }>();
    overviewScores.forEach((s) => {
      const id = String(
        s.teacherId ?? s.teacher?.teacherId ?? s.teacher?.name ?? s.id,
      );
      const name = s.teacher?.name || "Không rõ";
      const cur = map.get(id) || {
        id,
        name,
        assigned: 0,
        submitted: 0,
        pending: 0,
        overdue: 0,
        avg: null,
        sum: 0,
        n: 0,
      };
      cur.assigned += 1;
      if (isDone(s)) cur.submitted += 1;
      else cur.pending += 1;
      if (isOverdue(s)) cur.overdue += 1;
      if (s.score !== null) {
        cur.sum += s.score;
        cur.n += 1;
      }
      map.set(id, cur);
    });
    return Array.from(map.values())
      .map((t) => ({
        ...t,
        avg: t.n ? Math.round((t.sum / t.n) * 10) / 10 : null,
      }))
      .sort((a, b) => b.pending - a.pending || b.overdue - a.overdue);
  }, [overviewScores]);

  const actions: ActionItem[] = useMemo(() => {
    const items: ActionItem[] = [];
    overdueScores.slice(0, 4).forEach((s) => {
      items.push({
        id: `od-${s.id}`,
        kind: "urgent",
        title: `${studentName(s.student)} — quá hạn chấm`,
        subtitle: `${s.teacher?.name || "GV"} · ${s.scoringType === "GVHD" ? "GVHD" : "Hội đồng"}`,
        onClick: () => setSelectedScore(s),
      });
    });
    pendingScores
      .filter((s) => !isOverdue(s))
      .slice(0, 3)
      .forEach((s) => {
        const d = daysLeft(s.deadline);
        items.push({
          id: `pd-${s.id}`,
          kind: d !== null && d <= 2 ? "warn" : "warn",
          title: `${studentName(s.student)} — chưa nộp phiếu`,
          subtitle:
            d === null
              ? `${s.teacher?.name || "GV"} · chưa có hạn`
              : `${s.teacher?.name || "GV"} · còn ${d} ngày`,
          onClick: () => setSelectedScore(s),
        });
      });
    readyToFinalize.slice(0, 2).forEach((m) => {
      items.push({
        id: `mt-${m.projectId}`,
        kind: "ready",
        title: `${m.projectCode} — đủ phiếu, sẵn sàng chốt`,
        subtitle: `${studentName(m.student)} · ${m.scoredCount}/${m.totalCount} phiếu`,
        onClick: () => router.push(`/scoring/meeting/${m.projectId}`),
      });
    });
    readyToPublish.slice(0, 2).forEach((t) => {
      items.push({
        id: `pb-${t.projectId}`,
        kind: "ready",
        title: `${t.projectCode} — chờ công bố điểm`,
        subtitle: `${studentName(t.student)} · điểm ${t.finalScore ?? "—"}`,
        onClick: () => router.push(`/scoring/transcript/${t.projectId}`),
      });
    });
    return items.slice(0, 6);
  }, [overdueScores, pendingScores, readyToFinalize, readyToPublish, router]);

  const filteredScores = scores.filter((s) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.project?.projectName?.toLowerCase().includes(q) ||
      s.project?.projectCode?.toLowerCase().includes(q) ||
      s.student?.studentId?.toLowerCase().includes(q) ||
      studentName(s.student).toLowerCase().includes(q) ||
      s.teacher?.name?.toLowerCase().includes(q)
    );
  });

  const filteredResults = results.filter((r) => {
    if (!resultSearch) return true;
    const q = resultSearch.toLowerCase();
    return (
      r.project?.projectName?.toLowerCase().includes(q) ||
      r.project?.projectCode?.toLowerCase().includes(q) ||
      r.student?.studentId?.toLowerCase().includes(q) ||
      studentName(r.student).toLowerCase().includes(q)
    );
  });

  const filteredTeachers = teacherRows.filter((t) =>
    teacherSearch
      ? t.name.toLowerCase().includes(teacherSearch.toLowerCase())
      : true,
  );

  const teacherColumns: Column<TeacherRow>[] = [
    {
      id: "name",
      label: "Giảng viên",
      minWidth: 180,
      format: (_, row) => (
        <Typography variant="body2" fontWeight={600}>
          {row.name}
        </Typography>
      ),
    },
    { id: "assigned", label: "Giao", align: "center" },
    { id: "submitted", label: "Đã nộp", align: "center" },
    {
      id: "progress",
      label: "Tiến độ",
      minWidth: 160,
      format: (_, row) => {
        const pct = row.assigned
          ? Math.round((row.submitted / row.assigned) * 100)
          : 0;
        return (
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: ink }}>
              {pct}%
            </Typography>
            <LinearProgress
              variant="determinate"
              value={pct}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: line,
                "& .MuiLinearProgress-bar": {
                  bgcolor: pct === 100 ? C.green : C.blue,
                  borderRadius: 3,
                },
              }}
            />
          </Box>
        );
      },
    },
    {
      id: "overdue",
      label: "Quá hạn",
      align: "center",
      format: (_, row) =>
        row.overdue > 0 ? (
          <Chip label={row.overdue} size="small" color="error" />
        ) : (
          "—"
        ),
    },
    {
      id: "avg",
      label: "Điểm TB",
      align: "center",
      format: (_, row) =>
        row.avg !== null ? (
          <Typography fontWeight={700}>{row.avg}</Typography>
        ) : (
          "—"
        ),
    },
  ];

  const kindStyle: Record<
    ActionKind,
    { bg: string; color: string; label: string }
  > = {
    urgent: {
      bg: isDark ? "rgba(227,73,72,0.18)" : "#fef2f2",
      color: C.red,
      label: "KHẨN",
    },
    warn: {
      bg: isDark ? "rgba(237,161,0,0.18)" : "#fffbeb",
      color: C.yellow,
      label: "CẢNH BÁO",
    },
    ready: {
      bg: isDark ? "rgba(27,175,122,0.18)" : "#ecfdf5",
      color: C.green,
      label: "SẴN SÀNG",
    },
  };

  return (
    <>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(5, 1fr)",
          },
          gap: 2,
          mb: 2.5,
        }}
      >
        {pipeline.map((step) => (
          <ScoringStatCard
            key={step.label}
            label={step.label}
            value={step.value}
            subtext={step.subtext}
            icon={step.icon}
            iconColor={step.iconColor}
          />
        ))}
      </Box>

      <ScoringStats stats={stats} />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.2fr 0.9fr 1fr" },
          gap: 2,
          mb: 2.5,
        }}
      >
        <Paper elevation={0} sx={cardSx}>
          <Typography
            sx={{ fontWeight: 700, fontSize: 15, mb: 1.5, color: ink }}
          >
            Việc cần làm hôm nay
          </Typography>
          {actions.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              Không có phiếu quá hạn hay bước nào đang chờ.
            </Typography>
          ) : (
            actions.map((a) => {
              const k = kindStyle[a.kind];
              return (
                <Box
                  key={a.id}
                  onClick={a.onClick}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    py: 1,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    cursor: "pointer",
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                >
                  <Box
                    sx={{
                      px: 0.75,
                      py: 0.25,
                      borderRadius: 1,
                      bgcolor: k.bg,
                      color: k.color,
                      fontSize: 10,
                      fontWeight: 800,
                      letterSpacing: 0.4,
                      flexShrink: 0,
                    }}
                  >
                    {k.label}
                  </Box>
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography variant="body2" fontWeight={600} noWrap>
                      {a.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {a.subtitle}
                    </Typography>
                  </Box>
                  <ChevronRight size={14} color={muted} />
                </Box>
              );
            })
          )}
        </Paper>

        <Paper elevation={0} sx={cardSx}>
          <Typography
            sx={{ fontWeight: 700, fontSize: 15, mb: 0.5, color: ink }}
          >
            Kết quả bảo vệ
          </Typography>
          <Typography sx={{ fontSize: 12, color: muted, mb: 1 }}>
            Tỷ lệ đạt trên đề tài đã có kết quả
          </Typography>
          <Box sx={{ position: "relative", height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={
                    donutData.length
                      ? donutData
                      : [{ name: "Trống", value: 1, color: line }]
                  }
                  dataKey="value"
                  innerRadius={52}
                  outerRadius={74}
                  paddingAngle={2}
                  stroke={paper}
                  strokeWidth={2}
                >
                  {(donutData.length ? donutData : [{ color: line }]).map(
                    (d, i) => (
                      <Cell key={i} fill={d.color} />
                    ),
                  )}
                </Pie>
                <Tooltip
                  formatter={(v, n) => [`${v ?? 0} đề tài`, String(n)]}
                  contentStyle={{
                    borderRadius: 8,
                    border: `1px solid ${line}`,
                    fontSize: 12,
                    background: paper,
                    color: ink,
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
                  fontSize: 22,
                  fontWeight: 800,
                  color: ink,
                  lineHeight: 1,
                }}
              >
                {donutData.length ? `${passRate}%` : "—"}
              </Typography>
              <Typography sx={{ fontSize: 11, color: muted }}>Đạt</Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {[
              { name: "Đạt", color: C.green, value: passedCount },
              { name: "Loại", color: C.red, value: eliminatedCount },
              { name: "Đang chấm", color: C.yellow, value: scoringInProgress },
            ].map((l) => (
              <Box
                key={l.name}
                sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: l.color,
                  }}
                />
                <Typography sx={{ fontSize: 12, color: ink }}>
                  {l.name} {l.value}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>

        <Paper elevation={0} sx={cardSx}>
          <Typography
            sx={{ fontWeight: 700, fontSize: 15, mb: 0.5, color: ink }}
          >
            Phân bố điểm phiếu
          </Typography>
          <Typography sx={{ fontSize: 12, color: muted, mb: 1 }}>
            Số phiếu theo khoảng điểm (thang 10)
          </Typography>
          <Box sx={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distData} barCategoryGap="18%">
                <CartesianGrid vertical={false} stroke={line} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: muted }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: muted }}
                  axisLine={false}
                  tickLine={false}
                  width={28}
                />
                <Tooltip
                  formatter={(v) => [`${v ?? 0} phiếu`, "Số phiếu"]}
                  contentStyle={{
                    borderRadius: 8,
                    border: `1px solid ${line}`,
                    fontSize: 12,
                    background: paper,
                    color: ink,
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={36}>
                  {distData.map((d) => (
                    <Cell key={d.name} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Box>

      <Paper
        elevation={0}
        sx={{
          mb: 2,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: isDark ? "#1e293b" : "background.paper",
          backgroundImage: isDark ? GRADIENT_STYLES.darkGradient : "none",
          boxShadow: isDark ? "none" : "0 1px 3px rgba(0,0,0,0.06)",
        }}
      >
        <Tabs
          value={activeTab === "scores" ? 0 : activeTab === "results" ? 1 : 2}
          onChange={(_, v) => {
            setActiveTab(v === 0 ? "scores" : v === 1 ? "results" : "teachers");
            setPage(1);
          }}
          sx={{ px: 1, minHeight: 48 }}
        >
          <Tab
            icon={<ClipboardList size={16} />}
            iconPosition="start"
            label="Phiếu chấm"
            sx={{ textTransform: "none", fontWeight: 600, minHeight: 48 }}
          />
          <Tab
            icon={<Users size={16} />}
            iconPosition="start"
            label="Kết quả tổng hợp"
            sx={{ textTransform: "none", fontWeight: 600, minHeight: 48 }}
          />
          <Tab
            icon={<UserCheck size={16} />}
            iconPosition="start"
            label="Tiến độ giảng viên"
            sx={{ textTransform: "none", fontWeight: 600, minHeight: 48 }}
          />
        </Tabs>
      </Paper>

      {activeTab === "scores" && (
        <ScoringTable
          scores={filteredScores}
          loading={loading}
          page={page}
          total={total}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          scoringType={scoringType}
          onScoringTypeChange={(v) => {
            setScoringType(v);
            setPage(1);
          }}
          status={status}
          onStatusChange={(v) => {
            setStatus(v);
            setPage(1);
          }}
          onPageChange={setPage}
          onRefresh={fetchScores}
          onView={setSelectedScore}
        />
      )}

      {activeTab === "results" && (
        <ScoringResultsTable
          results={filteredResults}
          loading={loading}
          page={page}
          total={total}
          searchQuery={resultSearch}
          onSearchChange={setResultSearch}
          onViewDetails={viewResultDetails}
          onPageChange={setPage}
          onRefresh={fetchResults}
        />
      )}

      {activeTab === "teachers" && (
        <DataTable
          columns={teacherColumns}
          rows={filteredTeachers}
          rowKey="id"
          loading={false}
          emptyMessage="Chưa có dữ liệu giảng viên chấm"
          showSearchInput
          searchValue={teacherSearch}
          onSearchChange={setTeacherSearch}
          showFilterButton={false}
          showExportButton
          showImportButton={false}
        />
      )}

      <ScoringResultDetailsDialog
        open={!!selectedResult}
        onClose={() => setSelectedResult(null)}
        result={selectedResult}
      />
      <ScoreDetailDialog
        open={!!selectedScore}
        onClose={() => setSelectedScore(null)}
        score={selectedScore}
      />
    </>
  );
}
