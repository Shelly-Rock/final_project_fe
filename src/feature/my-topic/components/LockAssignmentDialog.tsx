import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  Alert,
} from "@mui/material";
import { MyTopic } from "../types";

export interface LockAssignmentDialogProps {
  open: boolean;
  topic: MyTopic | null;
  onClose: () => void;
  onSubmit: (
    topicId: number,
    assignments: {
      projectId: number;
      assignedTask: string;
      isLeader: boolean;
    }[],
  ) => Promise<void>;
}

export function LockAssignmentDialog({
  open,
  topic,
  onClose,
  onSubmit,
}: LockAssignmentDialogProps) {
  const [tasks, setTasks] = useState<Record<number, string>>({});
  const [leaderId, setLeaderId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const approvedStudents = useMemo(
    () =>
      topic?.registeredStudents?.filter((s) => s.status === "Approved") || [],
    [topic?.registeredStudents],
  );

  // Khởi tạo state khi mở dialog
  useEffect(() => {
    if (open && approvedStudents.length > 0) {
      const initialTasks: Record<number, string> = {};
      approvedStudents.forEach((s) => {
        initialTasks[s.id] = "";
      });
      setTasks(initialTasks);
      setLeaderId(null);
      setError(null);
    }
  }, [open, approvedStudents]);

  if (!topic) return null;

  const handleSubmit = async () => {
    setError(null);
    if (!leaderId) {
      setError("Vui lòng chọn 1 Trưởng nhóm.");
      return;
    }

    // Check missing tasks
    const missingTask = approvedStudents.some((s) => !tasks[s.id]?.trim());
    if (missingTask) {
      setError("Vui lòng điền nhiệm vụ cho tất cả thành viên.");
      return;
    }

    setLoading(true);
    try {
      const assignments = approvedStudents.map((s) => ({
        projectId: s.id, // Ở FE đang map project.id -> Student.id
        assignedTask: tasks[s.id].trim(),
        isLeader: s.id === leaderId,
      }));

      await onSubmit(topic.id, assignments);
      onClose();
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Đã xảy ra lỗi khi phân công nhiệm vụ.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={!loading ? onClose : undefined}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Phân công nhiệm vụ & Trưởng nhóm</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Đề tài <strong>{topic.name}</strong> sẽ được khóa. Vui lòng giao nhiệm
          vụ cho từng sinh viên đã duyệt và chọn ra 1 Trưởng nhóm.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {approvedStudents.length === 0 ? (
          <Alert severity="warning">
            Không có sinh viên nào đã được duyệt.
          </Alert>
        ) : (
          <RadioGroup
            value={leaderId ?? ""}
            onChange={(e) => setLeaderId(Number(e.target.value))}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {approvedStudents.map((student) => (
                <Box
                  key={student.id}
                  sx={{
                    p: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                    bgcolor:
                      leaderId === student.id ? "primary.50" : "transparent",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {student.studentCode} - {student.studentName}
                    </Typography>
                    <FormControlLabel
                      value={student.id}
                      control={<Radio size="small" />}
                      label="Trưởng nhóm"
                      sx={{ m: 0 }}
                    />
                  </Box>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Nhập nhiệm vụ được giao..."
                    value={tasks[student.id] || ""}
                    onChange={(e) =>
                      setTasks({ ...tasks, [student.id]: e.target.value })
                    }
                    multiline
                    rows={2}
                  />
                </Box>
              ))}
            </Box>
          </RadioGroup>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Hủy bỏ
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || approvedStudents.length === 0}
        >
          Khóa & Phân công
        </Button>
      </DialogActions>
    </Dialog>
  );
}
