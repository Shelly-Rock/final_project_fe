"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { FilePlus2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button, DataTable } from "@/shared/components";
import type { Column, HeaderAction } from "@/shared/components";
import {
  getScoreIssuanceCandidates,
  issueScoreSheets,
  type ScoreIssuanceCandidate,
} from "../services";

const defaultDeadline = () => {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
};

const areAllScoreSheetsIssued = (row: ScoreIssuanceCandidate) =>
  row.requiredCount > 0 && row.issuedCount >= row.requiredCount;

const getIssueButtonLabel = (row: ScoreIssuanceCandidate) => {
  if (!row.eligible) {
    return row.issuedCount > 0 ? "Chưa đủ điều kiện" : "Chưa được cấp phiếu";
  }
  if (areAllScoreSheetsIssued(row)) return "Đã cấp phiếu";
  return row.issuedCount > 0 ? "Cấp phiếu còn thiếu" : "Cấp phiếu";
};

export function ScoreIssuancePanel({ facultyId }: { facultyId?: string }) {
  const [rows, setRows] = useState<ScoreIssuanceCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ScoreIssuanceCandidate | null>(null);
  const [deadline, setDeadline] = useState(defaultDeadline);
  const [issuing, setIssuing] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getScoreIssuanceCandidates({
        page: 1,
        limit: 200,
        facultyId,
      });
      setRows(response.data);
    } catch {
      toast.error("Không thể tải danh sách cấp phiếu chấm");
    } finally {
      setLoading(false);
    }
  }, [facultyId]);

  useEffect(() => {
    load();
  }, [load]);

  const issuedLabel = useMemo(
    () => (row: ScoreIssuanceCandidate) =>
      row.requiredCount > 0 ? `${row.issuedCount}/${row.requiredCount}` : "—",
    [],
  );

  const openIssueDialog = (row: ScoreIssuanceCandidate) => {
    setDeadline(defaultDeadline());
    setSelected(row);
  };

  const columns: Column<ScoreIssuanceCandidate>[] = [
    {
      id: "projectCode",
      label: "Đề tài",
      minWidth: 220,
      format: (_, row) => (
        <Box>
          <Typography variant="body2" fontWeight={700}>
            {row.projectCode}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.projectName}
          </Typography>
        </Box>
      ),
    },
    {
      id: "student",
      label: "Sinh viên",
      format: (_, row) => (
        <Box>
          <Typography variant="body2">{row.student.name}</Typography>
          <Typography variant="caption" color="text.secondary">
            {row.student.studentId}
          </Typography>
        </Box>
      ),
    },
    {
      id: "committeeName",
      label: "Hội đồng",
      format: (_, row) => row.committeeName ?? "Chưa có lịch bảo vệ",
    },
    {
      id: "issuedCount",
      label: "Phiếu đã cấp",
      align: "center",
      format: (_, row) => (
        <Chip
          label={issuedLabel(row)}
          size="small"
          color={
            row.requiredCount > 0 && row.issuedCount >= row.requiredCount
              ? "success"
              : row.eligible
                ? "warning"
                : "default"
          }
        />
      ),
    },
    {
      id: "eligible",
      label: "Điều kiện",
      minWidth: 220,
      format: (_, row) =>
        row.eligible ? (
          <Chip label="Sẵn sàng cấp phiếu" size="small" color="success" />
        ) : (
          <Typography variant="caption" color="error">
            {row.reason}
          </Typography>
        ),
    },
    {
      id: "action",
      label: "Thao tác",
      minWidth: 180,
      format: (_, row) => (
        <Button
          size="small"
          variant="contained"
          leftIcon={<FilePlus2 size={16} />}
          disabled={!row.eligible || areAllScoreSheetsIssued(row)}
          onClick={() => openIssueDialog(row)}
        >
          {getIssueButtonLabel(row)}
        </Button>
      ),
    },
  ];

  const handleIssue = async () => {
    if (!selected) return;
    try {
      setIssuing(true);
      const result = await issueScoreSheets({
        projectIds: [selected.projectId],
        deadline: new Date(deadline).toISOString(),
      });
      toast.success(`Đã cấp ${result.issuedCount} phiếu chấm`);
      setSelected(null);
      await load();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Không thể cấp phiếu chấm",
      );
    } finally {
      setIssuing(false);
    }
  };

  const headerActions: HeaderAction[] = [
    {
      id: "refresh",
      label: "Làm mới",
      icon: <RefreshCw size={16} />,
      onClick: load,
      variant: "outlined",
    },
  ];

  return (
    <>
      <Alert severity="info" sx={{ mb: 2 }}>
        Mỗi sinh viên được cấp đúng 5 phiếu: GVHD, GVPB ngoài, Chủ tịch, Thư ký
        hội đồng và Phản biện trong.
      </Alert>
      <DataTable
        columns={columns}
        rows={rows}
        rowKey="projectId"
        headerActions={headerActions}
        loading={loading}
        showSearchInput={false}
        showFilterButton={false}
        showExportButton={false}
        showImportButton={false}
        emptyMessage="Chưa có đề tài đủ điều kiện cấp phiếu"
      />

      <Dialog
        open={!!selected}
        onClose={() => !issuing && setSelected(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Cấp phiếu chấm điểm</DialogTitle>
        <DialogContent dividers>
          {selected && (
            <Stack spacing={2}>
              <Box>
                <Typography fontWeight={700}>
                  {selected.projectCode} - {selected.projectName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selected.student.name} ({selected.student.studentId})
                </Typography>
              </Box>
              {selected.sheets.map((sheet) => (
                <Box
                  key={`${sheet.scoringType}-${sheet.teacherId}`}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 2,
                  }}
                >
                  <Typography variant="body2">{sheet.label}</Typography>
                  <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    <Typography variant="caption" color="text.secondary">
                      {sheet.teacherName}
                    </Typography>
                    <Chip
                      size="small"
                      label={sheet.issued ? "Đã cấp" : "Sẽ cấp"}
                      color={sheet.issued ? "success" : "primary"}
                    />
                  </Box>
                </Box>
              ))}
              <TextField
                label="Hạn chấm"
                type="datetime-local"
                value={deadline}
                onChange={(event) => setDeadline(event.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => setSelected(null)}
            disabled={issuing}
          >
            Hủy
          </Button>
          <Button variant="contained" onClick={handleIssue} disabled={issuing}>
            {issuing ? "Đang cấp..." : "Xác nhận cấp phiếu"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
