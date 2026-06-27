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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
  Divider,
  IconButton,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Groups as GroupsIcon,
} from "@mui/icons-material";
import { CouncilBuilder, type Council, type CouncilMember, type ThesisInCouncil } from "@/shared/components/CouncilBuilder";

const mockLecturers: CouncilMember[] = [
  { id: "l1", name: "Nguyễn Văn A", title: "TS.", faculty: "CNTT" },
  { id: "l2", name: "Trần Thị B", title: "ThS.", faculty: "CNTT" },
  { id: "l3", name: "Lê Văn C", title: "PGS.", faculty: "KHMT" },
  { id: "l4", name: "Phạm Thị D", title: "TS.", faculty: "KHMT" },
  { id: "l5", name: "Hoàng Văn E", title: "GS.", faculty: "ATTT", isExternal: true },
  { id: "l6", name: "Vũ Thị F", title: "TS.", faculty: "HTTT" },
];

const mockTheses: ThesisInCouncil[] = [
  { id: "t1", studentName: "Nguyễn Văn Minh", topicName: "Ứng dụng AI trong y tế", lecturer: "TS. Nguyễn Văn A" },
  { id: "t2", studentName: "Trần Thị Lan", topicName: "Hệ thống IoT", lecturer: "TS. Nguyễn Văn A" },
  { id: "t3", studentName: "Lê Văn Hoàng", topicName: "Blockchain", lecturer: "PGS. Lê Văn C" },
  { id: "t4", studentName: "Phạm Thị Mai", topicName: "NLP cho tiếng Việt", lecturer: "TS. Phạm Thị D" },
  { id: "t5", studentName: "Vũ Văn Long", topicName: "Bảo mật 5G", lecturer: "GS. Hoàng Văn E" },
  { id: "t6", studentName: "Đặng Thị Hà", topicName: "AR/VR trong giáo dục", lecturer: "TS. Đặng Thị F" },
];

const mockCouncils: Council[] = [
  {
    id: "c1",
    name: "Hội đồng A",
    date: "2026-12-10",
    room: "P.301",
    members: {
      chutich: { id: "l1", name: "Nguyễn Văn A", title: "TS.", faculty: "CNTT" },
      pth: { id: "l3", name: "Lê Văn C", title: "PGS.", faculty: "KHMT" },
      uv1: { id: "l4", name: "Phạm Thị D", title: "TS.", faculty: "KHMT" },
      uv2: { id: "l6", name: "Vũ Thị F", title: "TS.", faculty: "HTTT" },
    },
    theses: [mockTheses[0], mockTheses[1]],
  },
  {
    id: "c2",
    name: "Hội đồng B",
    date: "2026-12-10",
    room: "P.302",
    members: {
      chutich: { id: "l3", name: "Lê Văn C", title: "PGS.", faculty: "KHMT" },
      pth: { id: "l5", name: "Hoàng Văn E", title: "GS.", faculty: "ATTT", isExternal: true },
      uv1: { id: "l2", name: "Trần Thị B", title: "ThS.", faculty: "CNTT" },
      uv2: { id: "l1", name: "Nguyễn Văn A", title: "TS.", faculty: "CNTT" },
    },
    theses: [mockTheses[2], mockTheses[3]],
  },
];

export default function SecretaryCouncilsPage() {
  const [councils, setCouncils] = useState<Council[]>(mockCouncils);
  const [builderOpen, setBuilderOpen] = useState(false);
  const [editingCouncil, setEditingCouncil] = useState<Partial<Council> | null>(null);
  const [builderInfo, setBuilderInfo] = useState({ name: "", date: "", room: "" });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" });

  const openNewCouncil = useCallback(() => {
    setEditingCouncil(null);
    setBuilderInfo({ name: "", date: "", room: "" });
    setBuilderOpen(true);
  }, []);

  const openEditCouncil = useCallback((council: Council) => {
    setEditingCouncil(council);
    setBuilderInfo({ name: council.name, date: council.date, room: council.room });
    setBuilderOpen(true);
  }, []);

  const handleSaveCouncil = useCallback((savedCouncil: Partial<Council>) => {
    const finalCouncil = {
      ...savedCouncil,
      name: builderInfo.name || `Hội đồng ${councils.length + 1}`,
      date: builderInfo.date || new Date().toISOString().split("T")[0],
      room: builderInfo.room || "",
    };

    if (editingCouncil?.id) {
      setCouncils((prev) =>
        prev.map((c) => (c.id === editingCouncil.id ? { ...c, ...finalCouncil } as Council : c))
      );
      setSnackbar({ open: true, message: "Cập nhật Hội đồng thành công!", severity: "success" });
    } else {
      setCouncils((prev) => [
        ...prev,
        { ...finalCouncil, id: `c${Date.now()}` } as Council,
      ]);
      setSnackbar({ open: true, message: "Tạo Hội đồng mới thành công!", severity: "success" });
    }
    setBuilderOpen(false);
  }, [editingCouncil, builderInfo, councils.length]);

  const handleDeleteCouncil = useCallback((id: string) => {
    setCouncils((prev) => prev.filter((c) => c.id !== id));
    setSnackbar({ open: true, message: "Đã xóa Hội đồng!", severity: "success" });
  }, []);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
          Quản lý Hội đồng bảo vệ
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Tạo và quản lý các Hội đồng bảo vệ. Mỗi HĐ gồm 4 vai trò cố định: Chủ tịch, Phó Chủ tịch, UV1, UV2.
        </Typography>
      </Box>

      {/* Summary */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, mb: 3 }}>
        <Paper variant="outlined" sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="h4" sx={{ fontWeight: 900, color: "primary.main" }}>{councils.length}</Typography>
          <Typography variant="caption" color="text.secondary">Tổng Hội đồng</Typography>
        </Paper>
        <Paper variant="outlined" sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="h4" sx={{ fontWeight: 900, color: "success.main" }}>
            {councils.reduce((acc, c) => acc + (c.theses?.length ?? 0), 0)}
          </Typography>
          <Typography variant="caption" color="text.secondary">Đề tài được xếp</Typography>
        </Paper>
        <Paper variant="outlined" sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="h4" sx={{ fontWeight: 900, color: "warning.main" }}>
            {councils.reduce((acc, c) => acc + (c.members ? Object.keys(c.members).length : 0), 0)}
          </Typography>
          <Typography variant="caption" color="text.secondary">GV tham gia</Typography>
        </Paper>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openNewCouncil}>
          Tạo Hội đồng mới
        </Button>
      </Box>

      {/* Councils table */}
      <Card>
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "primary.50" }}>
                <TableCell sx={{ fontWeight: 700 }}>STT</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Tên HĐ</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Ngày</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Phòng</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Thành viên</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Đề tài</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {councils.map((council, idx) => (
                <TableRow key={council.id} sx={{ "&:nth-of-type(odd)": { bgcolor: "grey.50" } }}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <GroupsIcon color="primary" fontSize="small" />
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {council.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{council.date}</TableCell>
                  <TableCell>{council.room}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                      {(["chutich", "pth", "uv1", "uv2"] as const).map((role) => {
                        const m = council.members?.[role];
                        return m ? (
                          <Chip
                            key={role}
                            label={`${role === "chutich" ? "CT" : role === "pth" ? "PCT" : role === "uv1" ? "UV1" : "UV2"}: ${m.name}`}
                            size="small"
                            variant="outlined"
                            color={role === "chutich" ? "primary" : role === "pth" ? "info" : "default"}
                            sx={{ fontSize: "0.65rem" }}
                          />
                        ) : null;
                      })}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {council.theses?.length ?? 0} đề tài
                    </Typography>
                    {council.theses?.map((t) => (
                      <Typography key={t.id} variant="caption" color="text.secondary" sx={{ display: "block" }}>
                        • {t.studentName}
                      </Typography>
                    ))}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => openEditCouncil(council)}
                    >
                      Sửa
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteCouncil(council.id)}
                    >
                      Xóa
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {councils.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: "center", py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      Chưa có Hội đồng nào. Bấm "Tạo Hội đồng mới" để bắt đầu.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Builder dialog */}
      <Dialog
        open={builderOpen}
        onClose={() => setBuilderOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          {editingCouncil ? "Chỉnh sửa Hội đồng" : "Tạo Hội đồng mới"}
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="caption">
              4 vai trò cố định: <strong>Chủ tịch, Phó Chủ tịch, UV1, UV2</strong>.
              Không trùng giảng viên, đề tài phải thuộc HĐ. GV ngoài trường được phép.
            </Typography>
          </Alert>

          {/* Basic info */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size="small"
                label="Tên Hội đồng"
                value={builderInfo.name}
                onChange={(e) => setBuilderInfo((p) => ({ ...p, name: e.target.value }))}
                placeholder="VD: Hội đồng A"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size="small"
                label="Ngày bảo vệ"
                type="date"
                value={builderInfo.date}
                onChange={(e) => setBuilderInfo((p) => ({ ...p, date: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size="small"
                label="Phòng"
                value={builderInfo.room}
                onChange={(e) => setBuilderInfo((p) => ({ ...p, room: e.target.value }))}
                placeholder="VD: P.301"
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <CouncilBuilder
            council={editingCouncil ?? undefined}
            allLecturers={mockLecturers}
            theses={mockTheses}
            onSave={handleSaveCouncil}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBuilderOpen(false)}>Đóng</Button>
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
