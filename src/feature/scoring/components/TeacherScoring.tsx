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
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Loader2,
  XCircle,
  AlertTriangle,
  BookOpen,
} from "lucide-react";
import {
  getMyScores,
  getMyStats,
  submitMyScore,
  updateMyScore,
  ScoringStatus,
  ScoringStats,
  Score,
  ScoringTypeLabels,
  ScoringStatusLabels,
  ScoringCriteria,
} from "../../services";
import { toast } from "sonner";

export default function TeacherScoringPage() {
  const [stats, setStats] = useState<ScoringStats | null>(null);
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"pending" | "submitted">(
    "pending",
  );
  const [selectedScore, setSelectedScore] = useState<Score | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Scoring form state
  const [scoreValue, setScoreValue] = useState<number>(0);
  const [criteriaScores, setCriteriaScores] = useState<Record<string, number>>(
    {},
  );
  const [notes, setNotes] = useState("");
  const [strengths, setStrengths] = useState("");
  const [weaknesses, setWeaknesses] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsData, scoresData] = await Promise.all([
        getMyStats(),
        getMyScores({ limit: 100 }),
      ]);
      setStats(statsData);
      setScores(scoresData.data);
    } catch {
      toast.error("Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredScores = scores.filter((s) => {
    if (activeTab === "pending") {
      return s.status === "PENDING" || s.status === "IN_PROGRESS";
    }
    return (
      s.status === "SUBMITTED" || s.status === "FAILED" || s.status === "PASSED"
    );
  });

  const openScoreDialog = (score: Score) => {
    setSelectedScore(score);
    setScoreValue(score.score || 0);
    setCriteriaScores(score.criteriaScores || {});
    setNotes(score.notes || "");
    setStrengths(score.strengths || "");
    setWeaknesses(score.weaknesses || "");
  };

  const calculateTotalScore = () => {
    if (Object.keys(criteriaScores).length === 0) return scoreValue;
    const total = Object.values(criteriaScores).reduce(
      (sum, val) => sum + val,
      0,
    );
    const maxPossible = ScoringCriteria.reduce((sum, c) => sum + c.weight, 0);
    return Math.round((total / maxPossible) * 10 * 100) / 100;
  };

  const handleSubmitScore = async () => {
    if (!selectedScore) return;

    if (scoreValue < 4) {
      toast.warning("Điểm dưới 4 - Sinh viên sẽ bị loại khỏi Hội đồng!", {
        duration: 5000,
      });
    }

    try {
      setIsSubmitting(true);
      await submitMyScore(selectedScore.id, {
        score: scoreValue,
        criteriaScores,
        notes,
        strengths,
        weaknesses,
      });
      toast.success("Nộp phiếu chấm thành công!");
      setSelectedScore(null);
      fetchData();
    } catch {
      toast.error("Không thể nộp phiếu chấm");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!selectedScore) return;

    try {
      setIsSubmitting(true);
      await updateMyScore(selectedScore.id, {
        score: scoreValue,
        criteriaScores,
        notes,
        strengths,
        weaknesses,
        status: "IN_PROGRESS",
      });
      toast.success("Lưu nháp thành công!");
      setSelectedScore(null);
      fetchData();
    } catch {
      toast.error("Không thể lưu nháp");
    } finally {
      setIsSubmitting(false);
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

  const getDaysRemaining = (deadline: string | null) => {
    if (!deadline) return null;
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const days = Math.ceil(
      (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );
    return days;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Phiếu chấm điểm độc lập
        </h1>
        <p className="text-muted-foreground">
          Chấm điểm đề tài khóa luận của sinh viên
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tổng số phiếu</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Chưa chấm</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {stats?.pending || 0}
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
              {stats?.submitted || 0}
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
              {stats?.failed || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rules Alert */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-orange-800">
                Quy tắc điểm liệt:
              </p>
              <ul className="text-orange-700 mt-1 space-y-1">
                <li>
                  • <strong>GVHD</strong>: Nếu chấm dưới 4 điểm, đề tài bị loại
                  ngay lập tức
                </li>
                <li>
                  • <strong>Hội đồng</strong>: Nếu bất kỳ thành viên nào chấm
                  dưới 4 điểm, sinh viên bị loại
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as "pending" | "submitted")}
      >
        <TabsList>
          <TabsTrigger value="pending">
            Chưa chấm ({stats?.pending || 0})
          </TabsTrigger>
          <TabsTrigger value="submitted">
            Đã nộp ({stats?.submitted || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách phiếu chấm</CardTitle>
              <CardDescription>
                Danh sách các đề tài cần được chấm điểm
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredScores.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Không có phiếu chấm nào cần xử lý
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Đề tài</TableHead>
                      <TableHead>Sinh viên</TableHead>
                      <TableHead>Loại</TableHead>
                      <TableHead>Thời hạn</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredScores.map((score) => {
                      const daysRemaining = getDaysRemaining(score.deadline);
                      return (
                        <TableRow key={score.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {score.project?.projectCode ||
                                  score.project?.projectId}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {score.project?.projectName}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {score.student?.firstName}{" "}
                                {score.student?.middleName}{" "}
                                {score.student?.lastName}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {score.student?.studentId}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {ScoringTypeLabels[score.scoringType]}
                            {score.role && ` - ${score.role}`}
                          </TableCell>
                          <TableCell>
                            {daysRemaining !== null && (
                              <Badge
                                variant={
                                  daysRemaining <= 0
                                    ? "destructive"
                                    : daysRemaining <= 1
                                      ? "warning"
                                      : "secondary"
                                }
                              >
                                {daysRemaining <= 0
                                  ? "Quá hạn"
                                  : `${daysRemaining} ngày`}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>{getStatusBadge(score.status)}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              onClick={() => openScoreDialog(score)}
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              Chấm điểm
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submitted" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Đã nộp</CardTitle>
              <CardDescription>Danh sách các phiếu chấm đã nộp</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredScores.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Chưa có phiếu chấm nào được nộp
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Đề tài</TableHead>
                      <TableHead>Sinh viên</TableHead>
                      <TableHead>Loại</TableHead>
                      <TableHead>Điểm</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Ngày nộp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredScores.map((score) => (
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
                          {score.student?.firstName} {score.student?.middleName}{" "}
                          {score.student?.lastName}
                        </TableCell>
                        <TableCell>
                          {ScoringTypeLabels[score.scoringType]}
                        </TableCell>
                        <TableCell>
                          {score.score !== null ? (
                            <span
                              className={
                                score.score < 4
                                  ? "text-red-600 font-bold"
                                  : "text-green-600"
                              }
                            >
                              {score.score}/10
                            </span>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(score.status)}</TableCell>
                        <TableCell>
                          {score.submittedAt
                            ? new Date(score.submittedAt).toLocaleDateString(
                                "vi-VN",
                              )
                            : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Score Dialog */}
      <Dialog
        open={!!selectedScore}
        onOpenChange={() => setSelectedScore(null)}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Phiếu chấm điểm</DialogTitle>
            <DialogDescription>
              {selectedScore?.project?.projectName}
            </DialogDescription>
          </DialogHeader>

          {selectedScore && (
            <div className="space-y-6">
              {/* Project Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Mã đề tài</p>
                  <p className="font-medium">
                    {selectedScore.project?.projectCode}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sinh viên</p>
                  <p className="font-medium">
                    {selectedScore.student?.firstName}{" "}
                    {selectedScore.student?.middleName}{" "}
                    {selectedScore.student?.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Loại chấm</p>
                  <p className="font-medium">
                    {ScoringTypeLabels[selectedScore.scoringType]}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Thời hạn</p>
                  <p className="font-medium">
                    {selectedScore.deadline
                      ? new Date(selectedScore.deadline).toLocaleDateString(
                          "vi-VN",
                        )
                      : "Không có"}
                  </p>
                </div>
              </div>

              {/* Criteria Scores */}
              <div className="space-y-4">
                <h3 className="font-semibold">Tiêu chí chấm điểm</h3>
                {ScoringCriteria.map((criteria) => (
                  <div key={criteria.key} className="flex items-center gap-4">
                    <Label className="w-1/3">
                      {criteria.label}
                      <span className="text-muted-foreground text-sm block">
                        ({criteria.weight}%)
                      </span>
                    </Label>
                    <Input
                      type="number"
                      min={0}
                      max={10}
                      step={0.5}
                      value={criteriaScores[criteria.key] || ""}
                      onChange={(e) =>
                        setCriteriaScores({
                          ...criteriaScores,
                          [criteria.key]: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-24"
                    />
                    <span className="text-muted-foreground">/10</span>
                  </div>
                ))}
              </div>

              {/* Overall Score */}
              <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
                <Label className="text-lg font-semibold">Tổng điểm</Label>
                <div className="text-3xl font-bold">
                  {calculateTotalScore()}/10
                  {calculateTotalScore() < 4 && (
                    <Badge variant="destructive" className="ml-2">
                      ĐIỂM LIỆT
                    </Badge>
                  )}
                </div>
              </div>

              {/* Manual Score Override */}
              <div className="flex items-center gap-4">
                <Label className="w-1/3">Hoặc nhập điểm trực tiếp</Label>
                <Input
                  type="number"
                  min={0}
                  max={10}
                  step={0.5}
                  value={scoreValue}
                  onChange={(e) =>
                    setScoreValue(parseFloat(e.target.value) || 0)
                  }
                  className="w-24"
                />
              </div>

              {/* Feedback */}
              <div className="space-y-4">
                <div>
                  <Label>Điểm mạnh</Label>
                  <Textarea
                    value={strengths}
                    onChange={(e) => setStrengths(e.target.value)}
                    placeholder="Nhận xét về điểm mạnh của đề tài..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Điểm yếu / Cần cải thiện</Label>
                  <Textarea
                    value={weaknesses}
                    onChange={(e) => setWeaknesses(e.target.value)}
                    placeholder="Nhận xét về điểm yếu cần cải thiện..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Ghi chú thêm</Label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ghi chú khác..."
                    rows={2}
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setSelectedScore(null)}>
              Đóng
            </Button>
            <Button
              variant="secondary"
              onClick={handleSaveDraft}
              disabled={isSubmitting}
            >
              Lưu nháp
            </Button>
            <Button
              onClick={handleSubmitScore}
              disabled={isSubmitting || scoreValue === 0}
              variant={scoreValue < 4 ? "destructive" : "default"}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : scoreValue < 4 ? (
                <>
                  <AlertCircle className="h-4 w-4 mr-1" />
                  Nộp (Sinh viên sẽ bị loại)
                </>
              ) : (
                "Nộp phiếu chấm"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
