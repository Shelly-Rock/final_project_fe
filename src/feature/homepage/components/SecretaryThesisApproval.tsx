"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid2";
import { THESIS_PROPOSALS, ThesisProposal, STATUS_COLORS } from "../data";
import { useDisclosure } from "@/shared/hooks";

const DEPARTMENTS = [
  "Công nghệ thông tin",
  "Kỹ thuật phần mềm",
  "Marketing",
  "IoT",
  "An toàn thông tin",
  "Khoa học dữ liệu",
  "Mạng máy tính",
];

interface SecretaryThesisApprovalProps {
  open: boolean;
  onClose: () => void;
  onApprove: (id: number) => void;
  onReject: (id: number, reason: string) => void;
  onEdit: (proposal: ThesisProposal) => void;
}

export function SecretaryThesisApproval({
  open,
  onClose,
  onApprove,
  onReject,
  onEdit,
}: SecretaryThesisApprovalProps) {
  const { isOpen: rejectDialogOpen, open: openRejectDialog, close: closeRejectDialog } =
    useDisclosure();
  const [selectedProposal, setSelectedProposal] =
    useState<ThesisProposal | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const pendingProposals = useMemo(
    () => THESIS_PROPOSALS.filter((p) => p.status === "Chờ duyệt"),
    []
  );

  const handleReject = useCallback(() => {
    if (selectedProposal && rejectionReason.trim()) {
      onReject(selectedProposal.id, rejectionReason);
      closeRejectDialog();
      setSelectedProposal(null);
      setRejectionReason("");
    }
  }, [selectedProposal, rejectionReason, onReject, closeRejectDialog]);

  const handleOpenReject = useCallback(
    (proposal: ThesisProposal) => {
      setSelectedProposal(proposal);
      openRejectDialog();
    },
    [openRejectDialog]
  );

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <i
              className="bi bi-clipboard-check-fill"
              style={{ color: "#1dab60" }}
            />
            Duyệt đề tài đồ án
          </Box>
        </DialogTitle>
        <DialogContent>
          {pendingProposals.length > 0 ? (
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
            >
              {pendingProposals.map((proposal) => {
                const colors = STATUS_COLORS[proposal.status] ?? {
                  bg: "#f3f4f6",
                  color: "#6b7280",
                };
                return (
                  <Card
                    key={proposal.id}
                    variant="outlined"
                    sx={{ p: 2, borderLeft: `4px solid ${colors.color}` }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 2,
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 600, mb: 0.5 }}
                        >
                          {proposal.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          {proposal.description}
                        </Typography>
                      </Box>
                      <Chip
                        label={proposal.status}
                        size="small"
                        sx={{
                          bgcolor: colors.bg,
                          color: colors.color,
                          fontWeight: 500,
                        }}
                      />
                    </Box>

                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid size={{ xs: 6, md: 3 }}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <i
                            className="bi bi-person-fill"
                            style={{ color: "#6b7280" }}
                          />
                          <Typography variant="body2">
                            <strong>GV:</strong> {proposal.teacherName}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 6, md: 3 }}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <i
                            className="bi bi-building"
                            style={{ color: "#6b7280" }}
                          />
                          <Typography variant="body2">
                            <strong>Khoa:</strong> {proposal.department}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 6, md: 3 }}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <i
                            className="bi bi-people-fill"
                            style={{ color: "#6b7280" }}
                          />
                          <Typography variant="body2">
                            <strong>SV:</strong> {proposal.maxStudents}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 6, md: 3 }}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <i
                            className="bi bi-calendar3"
                            style={{ color: "#6b7280" }}
                          />
                          <Typography variant="body2">
                            {proposal.createdAt}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        <strong>Yêu cầu:</strong> {proposal.requirements}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Kết quả:</strong> {proposal.expectedOutcome}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        justifyContent: "flex-end",
                        pt: 1,
                        borderTop: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        startIcon={<i className="bi bi-x-circle" />}
                        onClick={() => handleOpenReject(proposal)}
                      >
                        Từ chối
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        color="warning"
                        startIcon={<i className="bi bi-pencil-square" />}
                        onClick={() => onEdit(proposal)}
                      >
                        Sửa
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        color="success"
                        startIcon={<i className="bi bi-check-circle" />}
                        onClick={() => onApprove(proposal.id)}
                      >
                        Duyệt
                      </Button>
                    </Box>
                  </Card>
                );
              })}
            </Box>
          ) : (
            <Box
              sx={{
                textAlign: "center",
                py: 6,
                color: "text.secondary",
              }}
            >
              <i
                className="bi bi-check-circle"
                style={{
                  fontSize: 64,
                  color: "#1dab60",
                  display: "block",
                  marginBottom: 16,
                }}
              />
              <Typography variant="h6">Không có đề tài chờ duyệt</Typography>
              <Typography variant="body2" color="text.secondary">
                Tất cả đề tài đã được xử lý
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} color="inherit">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog
        open={rejectDialogOpen}
        onClose={closeRejectDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Từ chối đề tài</DialogTitle>
        <DialogContent>
          {selectedProposal && (
            <Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Vui lòng nhập lý do từ chối cho đề tài:
              </Typography>
              <Card
                variant="outlined"
                sx={{ p: 2, mb: 2, bgcolor: "background.default" }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {selectedProposal.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  GVHD: {selectedProposal.teacherName}
                </Typography>
              </Card>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Lý do từ chối"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="VD: Yêu cầu không phù hợp với chương trình đào tạo..."
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeRejectDialog} color="inherit">
            Hủy
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleReject}
            disabled={!rejectionReason.trim()}
          >
            Xác nhận từ chối
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

// Edit Proposal Dialog
interface EditProposalDialogProps {
  open: boolean;
  proposal: ThesisProposal | null;
  onClose: () => void;
  onSave: (proposal: ThesisProposal) => void;
}

export function EditProposalDialog({
  open,
  proposal,
  onClose,
  onSave,
}: EditProposalDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    expectedOutcome: "",
    department: "",
    maxStudents: 2,
  });

  const prevProposalRef = useRef<ThesisProposal | null>(null);

  useEffect(() => {
    if (proposal && proposal !== prevProposalRef.current) {
      prevProposalRef.current = proposal;
      setFormData({
        title: proposal.title,
        description: proposal.description,
        requirements: proposal.requirements,
        expectedOutcome: proposal.expectedOutcome,
        department: proposal.department,
        maxStudents: proposal.maxStudents,
      });
    }
  }, [proposal]);

  const handleSave = () => {
    if (proposal) {
      onSave({
        ...proposal,
        ...formData,
      });
      onClose();
    }
  };

  if (!proposal) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle sx={{ fontWeight: 600 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <i className="bi bi-pencil-square" style={{ color: "#e89b33" }} />
          Sửa đề tài
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Tên đề tài"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Mô tả đề tài"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                multiline
                rows={3}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                fullWidth
                select
                label="Khoa"
                value={formData.department}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    department: e.target.value,
                  }))
                }
              >
                {DEPARTMENTS.map((dept) => (
                  <MenuItem key={dept} value={dept}>
                    {dept}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={6}>
              <TextField
                fullWidth
                type="number"
                label="Số sinh viên tối đa"
                value={formData.maxStudents}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    maxStudents: parseInt(e.target.value),
                  }))
                }
                inputProps={{ min: 1, max: 5 }}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Yêu cầu công nghệ"
                value={formData.requirements}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    requirements: e.target.value,
                  }))
                }
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Kết quả mong đợi"
                value={formData.expectedOutcome}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    expectedOutcome: e.target.value,
                  }))
                }
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          Hủy
        </Button>
        <Button variant="contained" color="warning" onClick={handleSave}>
          Lưu thay đổi
        </Button>
      </DialogActions>
    </Dialog>
  );
}
