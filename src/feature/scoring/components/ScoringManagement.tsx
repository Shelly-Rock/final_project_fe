"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Eye,
} from "lucide-react";
import {
  getAllScores,
  getAllResults,
  getScoresByProject,
  getResultByProject,
  ScoringType,
  ScoringStatus,
  Score,
  ScoringResult,
  ScoringTypeLabels,
  ScoringStatusLabels,
} from "../../services";
import { toast } from "sonner";

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

export default function ScoringManagementPage() {
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
  const [totalPages, setTotalPages] = useState(1);
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
      setTotalPages(data.meta.totalPages);
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

  const getStatusBadge = (status: ScoringStatus) => {
    const variants: Record<
      ScoringStatus,
      "secondary" | "success" | "destructive" | "warning"
    > = {
      PENDING: "secondary",
      IN_PROGRESS: "warning",
      SUBMITTED: "success",
      FAILED: "destructive",
      PASSED: "success",
    };
    return (
      <Badge variant={variants[status]}>{ScoringStatusLabels[status]}</Badge>
    );
  };

  const getFinalStatusBadge = (result: ScoringResult) => {
    if (result.isEliminated) {
      if (result.isGvhdFailed) {
        return <Badge variant="destructive">Loại (GVHD)</Badge>;
      }
      return <Badge variant="destructive">Loại (Hội đồng)</Badge>;
    }
    return <Badge variant="success">Đạt</Badge>;
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
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Quản lý chấm điểm độc lập
        </h1>
        <p className="text-muted-foreground">
          Theo dõi và quản lý phiếu chấm của giảng viên
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tổng phiếu</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Chưa chấm</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {stats.pending}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Đã nộp</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {stats.submitted}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Bị rớt</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {stats.failed}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as "scores" | "results")}
      >
        <TabsList>
          <TabsTrigger value="scores">Danh sách phiếu chấm</TabsTrigger>
          <TabsTrigger value="results">Kết quả tổng hợp</TabsTrigger>
        </TabsList>

        <TabsContent value="scores" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Tìm kiếm đề tài, sinh viên..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>

                <Select
                  value={scoringType}
                  onValueChange={(v) => {
                    setScoringType(v as ScoringType | "ALL");
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Loại chấm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Tất cả loại</SelectItem>
                    <SelectItem value="GVHD">GVHD</SelectItem>
                    <SelectItem value="COMMITTEE">Hội đồng</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={status}
                  onValueChange={(v) => {
                    setStatus(v as ScoringStatus | "ALL");
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Tất cả</SelectItem>
                    <SelectItem value="PENDING">Chưa chấm</SelectItem>
                    <SelectItem value="IN_PROGRESS">Đang chấm</SelectItem>
                    <SelectItem value="SUBMITTED">Đã nộp</SelectItem>
                    <SelectItem value="FAILED">Rớt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Table */}
          <Card>
            <CardContent className="pt-6">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Đề tài</TableHead>
                        <TableHead>Sinh viên</TableHead>
                        <TableHead>Người chấm</TableHead>
                        <TableHead>Loại</TableHead>
                        <TableHead>Điểm</TableHead>
                        <TableHead>Trạng thái</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredScores.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            Không có dữ liệu
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredScores.map((score) => (
                          <TableRow key={score.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">
                                  {score.project?.projectCode}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {score.project?.projectName}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              {score.student?.firstName}{" "}
                              {score.student?.middleName}{" "}
                              {score.student?.lastName}
                            </TableCell>
                            <TableCell>{score.teacher?.name}</TableCell>
                            <TableCell>
                              {ScoringTypeLabels[score.scoringType]}
                            </TableCell>
                            <TableCell>
                              {score.score !== null ? (
                                <span
                                  className={
                                    score.score < 4
                                      ? "text-red-600 font-bold"
                                      : ""
                                  }
                                >
                                  {score.score}/10
                                </span>
                              ) : (
                                "-"
                              )}
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(score.status)}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between pt-4">
                      <p className="text-sm text-muted-foreground">
                        Trang {page} / {totalPages} (Tổng: {total})
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          disabled={page === 1}
                        >
                          Trước
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setPage((p) => Math.min(totalPages, p + 1))
                          }
                          disabled={page === totalPages}
                        >
                          Sau
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Kết quả tổng hợp</CardTitle>
              <CardDescription>
                Danh sách sinh viên và kết quả chấm điểm
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Đề tài</TableHead>
                      <TableHead>Sinh viên</TableHead>
                      <TableHead>GVHD</TableHead>
                      <TableHead>Hội đồng</TableHead>
                      <TableHead>Kết quả</TableHead>
                      <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          Không có dữ liệu
                        </TableCell>
                      </TableRow>
                    ) : (
                      results.map((result) => (
                        <TableRow key={result.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {result.project?.projectCode}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {result.project?.projectName}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {result.student?.firstName}{" "}
                            {result.student?.middleName}{" "}
                            {result.student?.lastName}
                          </TableCell>
                          <TableCell>
                            {result.gvhdScore !== null ? (
                              <span
                                className={
                                  result.gvhdScore < 4
                                    ? "text-red-600 font-bold"
                                    : "text-green-600"
                                }
                              >
                                {result.gvhdScore}/10
                              </span>
                            ) : (
                              <Badge variant="secondary">Chưa chấm</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {result.totalCommitteeScores > 0 ? (
                              <span>
                                {result.totalCommitteeScores}/4 đã chấm
                                {result.failedCount > 0 && (
                                  <Badge variant="destructive" className="ml-1">
                                    {result.failedCount} rớt
                                  </Badge>
                                )}
                              </span>
                            ) : (
                              <Badge variant="secondary">Chưa chấm</Badge>
                            )}
                          </TableCell>
                          <TableCell>{getFinalStatusBadge(result)}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                viewResultDetails(result.projectId)
                              }
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Chi tiết
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Result Details Dialog */}
      <Dialog
        open={!!selectedResult}
        onOpenChange={() => setSelectedResult(null)}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Chi tiết kết quả chấm điểm</DialogTitle>
            <DialogDescription>
              {selectedResult?.project?.projectName}
            </DialogDescription>
          </DialogHeader>

          {selectedResult && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground">Điểm GVHD</p>
                    <p
                      className={`text-2xl font-bold ${
                        (selectedResult.gvhdScore || 0) < 4
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {selectedResult.gvhdScore !== null
                        ? `${selectedResult.gvhdScore}/10`
                        : "-"}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground">
                      Điểm Hội đồng
                    </p>
                    <p className="text-2xl font-bold">
                      {selectedResult.totalCommitteeScores}/4
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground">Kết quả</p>
                    {getFinalStatusBadge(selectedResult)}
                  </CardContent>
                </Card>
              </div>

              {/* Committee Scores */}
              <div>
                <h3 className="font-semibold mb-3">Điểm của Hội đồng</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vai trò</TableHead>
                      <TableHead>Người chấm</TableHead>
                      <TableHead>Điểm</TableHead>
                      <TableHead>Trạng thái</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedResult.committeeScores.map((cs, index) => (
                      <TableRow key={index}>
                        <TableCell>{cs.role}</TableCell>
                        <TableCell>{cs.teacherName}</TableCell>
                        <TableCell>
                          <span
                            className={
                              cs.score !== null && cs.score < 4
                                ? "text-red-600 font-bold"
                                : ""
                            }
                          >
                            {cs.score !== null ? `${cs.score}/10` : "-"}
                          </span>
                        </TableCell>
                        <TableCell>
                          {cs.score !== null &&
                            (cs.score < 4 ? (
                              <Badge variant="destructive">Rớt</Badge>
                            ) : (
                              <Badge variant="success">Đạt</Badge>
                            ))}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
