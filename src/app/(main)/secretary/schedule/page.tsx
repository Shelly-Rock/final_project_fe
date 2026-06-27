"use client";

import { useState, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Paper,
} from "@mui/material";
import {
  Download as DownloadIcon,
  Add as AddIcon,
  AutoFixHigh as AutoIcon,
} from "@mui/icons-material";
import { RoomTimeGrid, type DefenseSlot, type TimeSlot, type Room } from "@/shared/components/RoomTimeGrid";
import { ConflictWarningBadge } from "@/shared/components/ConflictWarningBadge";
import * as XLSX from "xlsx";

const ROOMS: Room[] = [
  { id: "r1", name: "P.301", capacity: 30 },
  { id: "r2", name: "P.302", capacity: 30 },
  { id: "r3", name: "P.303", capacity: 20 },
  { id: "r4", name: "P.304", capacity: 20 },
  { id: "r5", name: "P.305", capacity: 40 },
];

const TIME_SLOTS: TimeSlot[] = [
  { time: "07:30", label: "07:30" },
  { time: "08:00", label: "08:00" },
  { time: "08:30", label: "08:30" },
  { time: "09:00", label: "09:00" },
  { time: "09:30", label: "09:30" },
  { time: "10:00", label: "10:00" },
  { time: "10:30", label: "10:30" },
  { time: "11:00", label: "11:00" },
  { time: "11:30", label: "11:30" },
  { time: "12:00", label: "12:00" },
  { time: "12:30", label: "12:30" },
  { time: "13:00", label: "13:00" },
  { time: "13:30", label: "13:30" },
  { time: "14:00", label: "14:00" },
  { time: "14:30", label: "14:30" },
  { time: "15:00", label: "15:00" },
  { time: "15:30", label: "15:30" },
  { time: "16:00", label: "16:00" },
  { time: "16:30", label: "16:30" },
  { time: "17:00", label: "17:00" },
  { time: "17:30", label: "17:30" },
  { time: "18:00", label: "18:00" },
];

interface ScheduleThesis {
  id: string;
  studentName: string;
  topicName: string;
  lecturer: string;
}

const mockTheses: ScheduleThesis[] = [
  { id: "t1", studentName: "Nguyễn Văn Minh", topicName: "Ứng dụng AI trong y tế", lecturer: "TS. Nguyễn Văn A" },
  { id: "t2", studentName: "Trần Thị Lan", topicName: "Hệ thống IoT", lecturer: "TS. Nguyễn Văn A" },
  { id: "t3", studentName: "Lê Văn Hoàng", topicName: "Blockchain", lecturer: "PGS. Lê Văn C" },
  { id: "t4", studentName: "Phạm Thị Mai", topicName: "NLP cho tiếng Việt", lecturer: "TS. Phạm Thị D" },
  { id: "t5", studentName: "Vũ Văn Long", topicName: "Bảo mật 5G", lecturer: "GS. Hoàng Văn E" },
  { id: "t6", studentName: "Đặng Thị Hà", topicName: "AR/VR trong giáo dục", lecturer: "TS. Đặng Thị F" },
];

const mockSlots: DefenseSlot[] = [
  { id: "s1", thesisId: "t1", studentName: "Nguyễn Văn Minh", topicName: "Ứng dụng AI trong y tế", room: "P.301", time: "08:00", duration: 30 },
  { id: "s2", thesisId: "t2", studentName: "Trần Thị Lan", topicName: "Hệ thống IoT", room: "P.301", time: "08:30", duration: 30 },
  { id: "s3", thesisId: "t3", studentName: "Lê Văn Hoàng", topicName: "Blockchain", room: "P.302", time: "08:00", duration: 30 },
  { id: "s4", thesisId: "t4", studentName: "Phạm Thị Mai", topicName: "NLP cho tiếng Việt", room: "P.302", time: "08:30", duration: 30 },
  { id: "s5", thesisId: "t5", studentName: "Vũ Văn Long", topicName: "Bảo mật 5G", room: "P.301", time: "08:00", duration: 30 }, // conflict with s1
];

function autoArrange(slots: DefenseSlot[], theses: ScheduleThesis[], rooms: Room[], times: TimeSlot[]): DefenseSlot[] {
  const assigned: DefenseSlot[] = [];
  const roomTimes: Record<string, Set<string>> = {};

  for (const thesis of theses) {
    for (const room of rooms) {
      for (const time of times) {
        const roomKey = room.name;
        if (!roomTimes[roomKey]) roomTimes[roomKey] = new Set();
        if (roomTimes[roomKey].has(time.time)) continue;

        // Conflict: same lecturer in same time slot across rooms
        const lecturerConflict = assigned.some(
          (a) => a.time === time.time && a.studentName !== thesis.studentName
        );
        if (lecturerConflict) continue;

        roomTimes[roomKey].add(time.time);
        assigned.push({
          id: `auto-${thesis.id}`,
          thesisId: thesis.id,
          studentName: thesis.studentName,
          topicName: thesis.topicName,
          room: room.name,
          time: time.time,
          duration: 30,
        });
        break;
      }
      if (!assigned.find((a) => a.thesisId === thesis.id)) continue;
      break;
    }
  }
  return assigned;
}

export default function SecretarySchedulePage() {
  const [slots, setSlots] = useState<DefenseSlot[]>(mockSlots);
  const [addDialog, setAddDialog] = useState(false);
  const [newSlot, setNewSlot] = useState({ thesisId: "", room: "", time: "" });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" | "warning" }>({ open: false, message: "", severity: "success" });

  // Conflict detection
  const conflictCount = (() => {
    const map: Record<string, number> = {};
    slots.forEach((s) => {
      const key = `${s.room}-${s.time}`;
      map[key] = (map[key] ?? 0) + 1;
    });
    return Object.values(map).filter((v) => v > 1).length;
  })();

  const unassignedTheses = mockTheses.filter(
    (t) => !slots.some((s) => s.thesisId === t.id)
  );

  const handleSlotMove = useCallback((slotId: string, newRoom: string, newTime: string) => {
    setSlots((prev) =>
      prev.map((s) => (s.id === slotId ? { ...s, room: newRoom, time: newTime } : s))
    );
  }, []);

  const handleSlotRemove = useCallback((slotId: string) => {
    setSlots((prev) => prev.filter((s) => s.id !== slotId));
    setSnackbar({ open: true, message: "Đã xóa khỏi lịch!", severity: "success" });
  }, []);

  const handleAutoArrange = useCallback(() => {
    const newSlots = autoArrange(slots, unassignedTheses, ROOMS, TIME_SLOTS);
    setSlots((prev) => {
      const existing = prev.filter((s) => !s.id.startsWith("auto-"));
      return [...existing, ...newSlots];
    });
    setSnackbar({
      open: true,
      message: `Tự động xếp ${newSlots.length} đề tài!`,
      severity: "success",
    });
  }, [slots, unassignedTheses]);

  const handleAddSlot = useCallback(() => {
    if (!newSlot.thesisId || !newSlot.room || !newSlot.time) {
      setSnackbar({ open: true, message: "Vui lòng điền đầy đủ thông tin!", severity: "error" });
      return;
    }
    const thesis = mockTheses.find((t) => t.id === newSlot.thesisId);
    if (!thesis) return;
    const newS: DefenseSlot = {
      id: `s${Date.now()}`,
      thesisId: thesis.id,
      studentName: thesis.studentName,
      topicName: thesis.topicName,
      room: newSlot.room,
      time: newSlot.time,
      duration: 30,
    };
    setSlots((prev) => [...prev, newS]);
    setAddDialog(false);
    setNewSlot({ thesisId: "", room: "", time: "" });
    setSnackbar({ open: true, message: "Đã thêm vào lịch!", severity: "success" });
  }, [newSlot]);

  const handleExportWord = useCallback(() => {
    // Export to Excel as Word isn't directly supported — use formatted XLSX
    const data = slots
      .sort((a, b) => a.time.localeCompare(b.time))
      .map((s, idx) => ({
        STT: idx + 1,
        Giờ: s.time,
        Phòng: s.room,
        "Họ tên SV": s.studentName,
        "Mã đề tài": s.thesisId,
        "Tên đề tài": s.topicName,
        GVHD: mockTheses.find((t) => t.id === s.thesisId)?.lecturer ?? "",
      }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "LichBaoVe");

    // Auto column widths
    const colWidths = [
      { wch: 5 }, { wch: 8 }, { wch: 8 }, { wch: 20 }, { wch: 12 }, { wch: 30 }, { wch: 20 },
    ];
    ws["!cols"] = colWidths;

    XLSX.writeFile(wb, "LichBaoVe_2026.xlsx");
    setSnackbar({ open: true, message: "Đã xuất file Excel lịch bảo vệ!", severity: "success" });
  }, [slots]);

  const unassignedCount = unassignedTheses.length;

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
          Xếp lịch bảo vệ
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Lưới giờ/phòng — kéo thả để sắp xếp, highlight đỏ khi xung đột.
        </Typography>
      </Box>

      {/* Summary */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2, mb: 3 }}>
        {[
          { label: "Tổng đề tài", value: mockTheses.length, color: "primary.main" },
          { label: "Đã xếp lịch", value: slots.length, color: "success.main" },
          { label: "Chưa xếp", value: unassignedCount, color: unassignedCount > 0 ? "warning.main" : "success.main" },
          { label: "Xung đột", value: conflictCount, color: conflictCount > 0 ? "error.main" : "success.main" },
        ].map((s) => (
          <Paper key={s.label} variant="outlined" sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h4" sx={{ fontWeight: 900, color: s.color }}>{s.value}</Typography>
            <Typography variant="caption" color="text.secondary">{s.label}</Typography>
          </Paper>
        ))}
      </Box>

      {/* Conflict warning */}
      {conflictCount > 0 && (
        <Alert severity="error" sx={{ mb: 2 }} icon={<ConflictWarningBadge count={conflictCount} />}>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            Có <strong>{conflictCount} xung đột</strong> trong lịch! Kiểm tra và sắp xếp lại.
          </Typography>
        </Alert>
      )}

      {/* Controls */}
      <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
        <Button
          variant="outlined"
          startIcon={<AutoIcon />}
          onClick={handleAutoArrange}
          disabled={unassignedCount === 0}
        >
          Tự động xếp ({unassignedCount} đề tài)
        </Button>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => setAddDialog(true)}
        >
          Thêm vào lịch
        </Button>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={handleExportWord}
          sx={{ ml: "auto" }}
        >
          Xuất lịch bảo vệ
        </Button>
      </Box>

      {/* Room Time Grid */}
      <RoomTimeGrid
        rooms={ROOMS}
        timeSlots={TIME_SLOTS}
        slots={slots}
        onSlotMove={handleSlotMove}
        onSlotRemove={handleSlotRemove}
        onAutoArrange={handleAutoArrange}
      />

      {/* Unassigned theses */}
      {unassignedCount > 0 && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
              Đề tài chưa xếp lịch ({unassignedCount})
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {unassignedTheses.map((t) => (
                <Chip
                  key={t.id}
                  label={`${t.studentName} — ${t.topicName.substring(0, 30)}...`}
                  size="small"
                  color="warning"
                  variant="outlined"
                  onClick={() => {
                    setNewSlot((p) => ({ ...p, thesisId: t.id }));
                    setAddDialog(true);
                  }}
                />
              ))}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Add slot dialog */}
      <Dialog open={addDialog} onClose={() => setAddDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Thêm vào lịch bảo vệ</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid item xs={12}>
              <FormControl fullWidth size="small">
                <InputLabel>Chọn đề tài</InputLabel>
                <Select
                  label="Chọn đề tài"
                  value={newSlot.thesisId}
                  onChange={(e) => setNewSlot((p) => ({ ...p, thesisId: e.target.value }))}
                >
                  {mockTheses.map((t) => (
                    <MenuItem key={t.id} value={t.id} disabled={!!slots.find((s) => s.thesisId === t.id)}>
                      {t.studentName} — {t.topicName}
                      {slots.find((s) => s.thesisId === t.id) ? " (đã xếp)" : ""}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Phòng</InputLabel>
                <Select
                  label="Phòng"
                  value={newSlot.room}
                  onChange={(e) => setNewSlot((p) => ({ ...p, room: e.target.value }))}
                >
                  {ROOMS.map((r) => (
                    <MenuItem key={r.id} value={r.name}>{r.name} ({r.capacity} chỗ)</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Giờ bắt đầu</InputLabel>
                <Select
                  label="Giờ bắt đầu"
                  value={newSlot.time}
                  onChange={(e) => setNewSlot((p) => ({ ...p, time: e.target.value }))}
                >
                  {TIME_SLOTS.map((t) => (
                    <MenuItem key={t.time} value={t.time}>{t.time}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialog(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleAddSlot}>Thêm vào lịch</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
