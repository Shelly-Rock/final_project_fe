"use client";

import { useState } from "react";
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
import { THESIS_PROPOSALS, ThesisProposal } from "../data";

interface TopicSelectionFormProps {
  open: boolean;
  onClose: () => void;
  onSelect: (proposal: ThesisProposal) => void;
}

export function TopicSelectionForm({
  open,
  onClose,
  onSelect,
}: TopicSelectionFormProps) {
  const [selectedProposal, setSelectedProposal] =
    useState<ThesisProposal | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const approvedProposals = THESIS_PROPOSALS.filter(
    (p) => p.status === "Đã duyệt" && p.currentStudents < p.maxStudents,
  );

  const filteredProposals = approvedProposals.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.department.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleConfirm = () => {
    if (selectedProposal) {
      onSelect(selectedProposal);
      setConfirmOpen(false);
      setSelectedProposal(null);
      onClose();
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <i
              className="bi bi-journal-bookmark-fill"
              style={{ color: "#2a5bc0" }}
            />
            Chọn đề tài đồ án
          </Box>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            size="small"
            placeholder="Tìm kiếm theo tên đề tài, giảng viên, khoa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <Box sx={{ mr: 1, color: "text.secondary" }}>
                  <i className="bi bi-search" />
                </Box>
              ),
            }}
          />

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {filteredProposals.map((proposal) => (
              <Card
                key={proposal.id}
                variant="outlined"
                sx={{
                  p: 2,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  borderColor:
                    selectedProposal?.id === proposal.id
                      ? "primary.main"
                      : "divider",
                  bgcolor:
                    selectedProposal?.id === proposal.id
                      ? "primary.50"
                      : "background.paper",
                  "&:hover": {
                    borderColor: "primary.main",
                    boxShadow: 1,
                  },
                }}
                onClick={() => setSelectedProposal(proposal)}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 1,
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
                    label={`${proposal.currentStudents}/${proposal.maxStudents} SV`}
                    size="small"
                    sx={{
                      bgcolor: "background.default",
                      fontWeight: 500,
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                    alignItems: "center",
                  }}
                >
                  <Chip
                    icon={<i className="bi bi-person-fill" />}
                    label={proposal.teacherName}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    icon={<i className="bi bi-building" />}
                    label={proposal.department}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    icon={<i className="bi bi-code" />}
                    label={proposal.requirements}
                    size="small"
                    sx={{
                      bgcolor: "primary.50",
                      color: "primary.main",
                      fontSize: "0.7rem",
                    }}
                  />
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    <strong>Kết quả mong đợi:</strong>{" "}
                    {proposal.expectedOutcome}
                  </Typography>
                </Box>
              </Card>
            ))}

            {filteredProposals.length === 0 && (
              <Box
                sx={{
                  textAlign: "center",
                  py: 4,
                  color: "text.secondary",
                }}
              >
                <i
                  className="bi bi-inbox"
                  style={{ fontSize: 48, display: "block", marginBottom: 8 }}
                />
                <Typography>Không có đề tài phù hợp</Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} color="inherit">
            Đóng
          </Button>
          <Button
            variant="contained"
            disabled={!selectedProposal}
            onClick={() => setConfirmOpen(true)}
          >
            Chọn đề tài
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Xác nhận chọn đề tài</DialogTitle>
        <DialogContent>
          {selectedProposal && (
            <Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Bạn có chắc chắn muốn chọn đề tài này?
              </Typography>
              <Card
                variant="outlined"
                sx={{ p: 2, bgcolor: "background.default" }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {selectedProposal.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  GVHD: {selectedProposal.teacherName}
                </Typography>
              </Card>
              <Typography
                variant="caption"
                color="warning.main"
                sx={{ display: "block", mt: 2 }}
              >
                <i className="bi bi-exclamation-triangle" /> Sau khi chọn, bạn
                không thể thay đổi đề tài.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="inherit">
            Hủy
          </Button>
          <Button variant="contained" color="primary" onClick={handleConfirm}>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
