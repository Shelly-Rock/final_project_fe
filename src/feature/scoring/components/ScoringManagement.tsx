"use client";

import { useState, useEffect, useCallback } from "react";
import { Box, Tabs, Tab, CircularProgress } from "@mui/material";
import { Card, CardHeader, CardContentDiv } from "@/shared/components";
import {
  getAllScores,
  getAllResults,
  getScoresByProject,
  getResultByProject,
  ScoringType,
  ScoringStatus,
  Score,
  ScoringResult,
} from "../services";
import { toast } from "sonner";
import { ScoringStats } from "./ScoringStats";
import { ScoringTable } from "./ScoringTable";
import { ScoringResultsTable } from "./ScoringResultsTable";
import { ScoringFilterCard } from "./ScoringFilterCard";
import { ScoringResultDetailsDialog } from "./ScoringResultDetailsDialog";

interface EnrichedResult extends ScoringResult {
  project?: {
    projectId: string;
    projectCode: string;
    projectName: string;
  };
  student?: {
    studentId: string;
    firstName: string;
    middleName: string;
    lastName: string;
  };
}

export function ScoringManagementPage() {
  const [scores, setScores] = useState<Score[]>([]);
  const [results, setResults] = useState<EnrichedResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"scores" | "results">("scores");
  const [selectedResult, setSelectedResult] = useState<ScoringResult | null>(
    null,
  );
  const [, setProjectScores] = useState<Score[]>([]);

  // Filters
  const [scoringType, setScoringType] = useState<ScoringType | "ALL">("ALL");
  const [status, setStatus] = useState<ScoringStatus | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

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
      setTotalPages(data.meta.totalPages);
      setTotal(data.meta.total);
    } catch {
      toast.error("Không thể tải kết quả chấm điểm");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    if (activeTab === "scores") {
      fetchScores();
    } else {
      fetchResults();
    }
  }, [activeTab, fetchScores, fetchResults]);

  const viewResultDetails = async (projectId: number) => {
    try {
      const [result, projectScoresData] = await Promise.all([
        getResultByProject(projectId),
        getScoresByProject(projectId),
      ]);
      setSelectedResult(result);
      setProjectScores(projectScoresData);
    } catch {
      toast.error("Không thể tải chi tiết kết quả");
    }
  };

  // Stats
  const stats = {
    total: scores.length,
    pending: scores.filter((s) => s.status === "PENDING").length,
    submitted: scores.filter((s) => s.status === "SUBMITTED").length,
    failed: scores.filter((s) => s.status === "FAILED").length,
  };

  const filteredScores = scores.filter((s) => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      s.project?.projectName?.toLowerCase().includes(search) ||
      s.project?.projectCode?.toLowerCase().includes(search) ||
      s.student?.studentId?.toLowerCase().includes(search)
    );
  });

  return (
    <>
      <ScoringStats stats={stats} />

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={activeTab === "scores" ? 0 : 1}
          onChange={(_, v) => setActiveTab(v === 0 ? "scores" : "results")}
        >
          <Tab label="Danh sách phiếu chấm" />
          <Tab label="Kết quả tổng hợp" />
        </Tabs>
      </Box>

      {activeTab === "scores" && (
        <Box>
          <Box sx={{ mb: 3 }}>
            <ScoringFilterCard
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
            />
          </Box>
          <ScoringTable
            scores={filteredScores}
            loading={loading}
            page={page}
            total={total}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </Box>
      )}

      {activeTab === "results" && (
        <Card>
          <CardHeader
            title="Kết quả tổng hợp"
            subtitle="Danh sách sinh viên và kết quả chấm điểm"
          />
          <CardContentDiv padding={2}>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                <CircularProgress />
              </Box>
            ) : (
              <ScoringResultsTable
                results={results}
                loading={loading}
                page={page}
                total={total}
                onViewDetails={(projectId) => viewResultDetails(projectId)}
                onPageChange={(newPage) => setPage(newPage)}
              />
            )}
          </CardContentDiv>
        </Card>
      )}

      <ScoringResultDetailsDialog
        open={!!selectedResult}
        onClose={() => setSelectedResult(null)}
        result={selectedResult}
      />
    </>
  );
}
