"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Divider,
  Alert,
  TextField,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Paper,
  IconButton,
} from "@mui/material";
import {
  Download as DownloadIcon,
  Print as PrintIcon,
  CheckCircle as ConfirmIcon,
  ArrowBack as BackIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import { jsPDF } from "jspdf";

interface Application {
  id: string;
  topicName: string;
  lecturer: string;
  department: string;
  priority: number;
}

const mockApplication: Application = {
  id: "a1",
  topicName: "Ứng dụng AI trong y tế",
  lecturer: "TS. Nguyễn Văn A",
  department: "CNTT",
  priority: 1,
};

const mockStudent = {
  mssv: "20210001",
  hoTen: "Nguyễn Văn Minh",
  lop: "CNTT-K62",
  khoa: "Công nghệ thông tin",
  khoaHoc: "K2020",
};

export default function StudentConfirmationPage() {
  const router = useRouter();
  const [application] = useState<Application>(mockApplication);
  const [agreed, setAgreed] = useState(false);
  const [signed, setSigned] = useState(false);
  const [signedName, setSignedName] = useState("");
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [pdfPreview, setPdfPreview] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" | "warning" }>({ open: false, message: "", severity: "success" });

  const handleDownloadPDF = useCallback(() => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("PHIẾU ĐĂNG KÝ ĐỀ TÀI LUẬN VĂN", 105, 20, { align: "center" });

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Ngày: ${new Date().toLocaleDateString("vi-VN")}`, 105, 30, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("THÔNG TIN SINH VIÊN", 20, 50);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const studentInfo = [
      `MSSV: ${mockStudent.mssv}`,
      `Họ tên: ${mockStudent.hoTen}`,
      `Lớp: ${mockStudent.lop}`,
      `Khoa: ${mockStudent.khoa}`,
      `Khóa: ${mockStudent.khoaHoc}`,
    ];
    studentInfo.forEach((line, i) => doc.text(line, 20, 60 + i * 8));

    doc.setFont("helvetica", "bold");
    doc.text("THÔNG TIN ĐỀ TÀI", 20, 110);
    doc.setFont("helvetica", "normal");
    const topicInfo = [
      `Tên đề tài: ${application.topicName}`,
      `GVHD: ${application.lecturer}`,
      `Khoa: ${application.department}`,
      `Nguyện vọng: NV${application.priority}`,
    ];
    topicInfo.forEach((line, i) => doc.text(line, 20, 120 + i * 8));

    doc.setFont("helvetica", "bold");
    doc.text("CAM KẾT", 20, 155);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const commitments = [
      "1. Tôi cam kết thực hiện đề tài nghiêm túc, đúng tiến độ.",
      "2. Tôi chịu trách nhiệm về nội dung và kết quả của đề tài.",
      "3. Tôi tuân thủ các quy định của nhà trường về luận văn.",
    ];
    commitments.forEach((line, i) => doc.text(line, 20, 165 + i * 8));

    doc.text(`Hà Nội, ngày ${new Date().toLocaleDateString("vi-VN")}`, 140, 200);
    doc.text("Chữ ký sinh viên:", 140, 220);
    doc.line(130, 235, 190, 235);
    doc.text(mockStudent.hoTen, 140, 245);

    doc.save(`PhieuDangKy_${mockStudent.mssv}.pdf`);
    setSnackbar({ open: true, message: "Đã tải phiếu đăng ký PDF!", severity: "success" });
  }, [application]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleSign = useCallback(() => {
    if (!signedName.trim()) {
      setSnackbar({ open: true, message: "Vui lòng nhập tên!", severity: "error" });
      return;
    }
    setSigned(true);
    setAgreed(true);
    setSnackbar({ open: true, message: "Đã ký xác nhận thành công!", severity: "success" });
  }, [signedName]);

  const handleSubmit = useCallback(() => {
    if (!agreed || !signed) {
      setSnackbar({ open: true, message: "Vui lòng ký xác nhận trước!", severity: "error" });
      return;
    }
    setConfirmDialog(true);
  }, [agreed, signed]);

  const handleConfirmSubmit = useCallback(() => {
    setConfirmDialog(false);
    setSnackbar({ open: true, message: "Xác nhận đăng ký thành công! Chờ duyệt từ GVHD.", severity: "success" });
    setTimeout(() => router.push("/dashboard"), 2000);
  }, [router]);

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <IconButton onClick={() => router.push("/student/my-applications")}>
          <BackIcon />
        </IconButton>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Xác nhận đăng ký
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tải phiếu đăng ký, ký xác nhận và gửi cho Thư ký.
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Main: PDF preview / Form */}
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Phiếu đăng ký đề tài
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<ViewIcon />}
                    onClick={() => setPdfPreview(true)}
                  >
                    Xem trước
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={handleDownloadPDF}
                  >
                    Tải PDF
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<PrintIcon />}
                    onClick={handlePrint}
                  >
                    In
                  </Button>
                </Box>
              </Box>

              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  bgcolor: "grey.50",
                  fontFamily: "serif",
                  minHeight: 400,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ textAlign: "center", fontWeight: 700, mb: 2, textTransform: "uppercase" }}
                >
                  PHIẾU ĐĂNG KÝ ĐỀ TÀI LUẬN VĂN
                </Typography>
                <Typography variant="body2" sx={{ textAlign: "center", mb: 3 }}>
                  Ngày: {new Date().toLocaleDateString("vi-VN")}
                </Typography>

                <Divider sx={{ mb: 2 }} />

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                    I. THÔNG TIN SINH VIÊN
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    {[
                      `MSSV: ${mockStudent.mssv}`,
                      `Họ tên: ${mockStudent.hoTen}`,
                      `Lớp: ${mockStudent.lop}`,
                      `Khoa: ${mockStudent.khoa}`,
                      `Khóa: ${mockStudent.khoaHoc}`,
                    ].map((line) => (
                      <Typography key={line} variant="body2" sx={{ mb: 0.5 }}>
                        {line}
                      </Typography>
                    ))}
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                    II. THÔNG TIN ĐỀ TÀI
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    {[
                      `Tên đề tài: ${application.topicName}`,
                      `GVHD: ${application.lecturer}`,
                      `Khoa: ${application.department}`,
                      `Nguyện vọng: NV${application.priority}`,
                    ].map((line) => (
                      <Typography key={line} variant="body2" sx={{ mb: 0.5 }}>
                        {line}
                      </Typography>
                    ))}
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                    III. CAM KẾT
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    {[
                      "1. Tôi cam kết thực hiện đề tài nghiêm túc, đúng tiến độ.",
                      "2. Tôi chịu trách nhiệm về nội dung và kết quả của đề tài.",
                      "3. Tôi tuân thủ các quy định của nhà trường về luận văn.",
                    ].map((line) => (
                      <Typography key={line} variant="body2" sx={{ mb: 0.5 }}>
                        {line}
                      </Typography>
                    ))}
                  </Box>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
                  <Box sx={{ textAlign: "center", mr: 4 }}>
                    <Typography variant="body2">Hà Nội, ngày ___ tháng ___ năm 2026</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>Người đăng ký</Typography>
                    {signed ? (
                      <Box sx={{ mt: 3 }}>
                        <Typography sx={{ fontStyle: "italic", fontSize: "1.1rem", fontFamily: "Dancing Script" }}>
                          {signedName}
                        </Typography>
                        <Divider sx={{ mt: 1 }} />
                      </Box>
                    ) : (
                      <Box sx={{ height: 60 }} />
                    )}
                  </Box>
                </Box>
              </Paper>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar: Sign + Confirm */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                Ký xác nhận online
              </Typography>

              <TextField
                fullWidth
                size="small"
                label="Họ tên (ký xác nhận)"
                value={signedName}
                onChange={(e) => setSignedName(e.target.value)}
                sx={{ mb: 2 }}
                disabled={signed}
              />

              <Button
                fullWidth
                variant="contained"
                color="primary"
                startIcon={<ConfirmIcon />}
                onClick={handleSign}
                disabled={signed}
              >
                {signed ? "Đã ký!" : "Ký xác nhận"}
              </Button>

              {signed && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  <Typography variant="caption">
                    Chữ ký của bạn đã được xác nhận.
                  </Typography>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                Xác nhận đăng ký
              </Typography>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    disabled={!signed}
                  />
                }
                label={
                  <Typography variant="body2">
                    Tôi đã đọc và đồng ý với các cam kết trên.
                  </Typography>
                }
                sx={{ mb: 2 }}
              />

              <Alert severity="warning" sx={{ mb: 2 }}>
                <Typography variant="caption">
                  Sau khi xác nhận, bạn sẽ không thể thay đổi đề tài đã đăng ký.
                </Typography>
              </Alert>

              <Button
                fullWidth
                variant="contained"
                color="success"
                startIcon={<ConfirmIcon />}
                onClick={handleSubmit}
                disabled={!agreed || !signed}
              >
                Gửi xác nhận đăng ký
              </Button>
            </CardContent>
          </Card>

          <Alert severity="info">
            <Typography variant="caption">
              Sau khi xác nhận, Thư ký sẽ duyệt và thông báo kết quả qua email trong 3-5 ngày làm việc.
            </Typography>
          </Alert>
        </Grid>
      </Grid>

      {/* PDF Preview Dialog */}
      <Dialog open={pdfPreview} onClose={() => setPdfPreview(false)} maxWidth="md" fullWidth>
        <DialogTitle>Xem trước phiếu đăng ký</DialogTitle>
        <DialogContent>
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              bgcolor: "white",
              fontFamily: "serif",
              minHeight: 500,
              boxShadow: 3,
            }}
          >
            <Typography variant="h6" sx={{ textAlign: "center", fontWeight: 700, mb: 2 }}>
              PHIẾU ĐĂNG KÝ ĐỀ TÀI LUẬN VĂN
            </Typography>
            <Typography variant="body2" sx={{ textAlign: "center", mb: 3 }}>
              Ngày: {new Date().toLocaleDateString("vi-VN")}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>I. THÔNG TIN SINH VIÊN</Typography>
            {[`MSSV: ${mockStudent.mssv}`, `Họ tên: ${mockStudent.hoTen}`, `Lớp: ${mockStudent.lop}`, `Khoa: ${mockStudent.khoa}`].map((l) => (
              <Typography key={l} variant="body2">{l}</Typography>
            ))}
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, mt: 2 }}>II. THÔNG TIN ĐỀ TÀI</Typography>
            {[`Tên: ${application.topicName}`, `GVHD: ${application.lecturer}`, `NV: ${application.priority}`].map((l) => (
              <Typography key={l} variant="body2">{l}</Typography>
            ))}
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPdfPreview(false)}>Đóng</Button>
          <Button variant="contained" startIcon={<DownloadIcon />} onClick={() => { setPdfPreview(false); handleDownloadPDF(); }}>
            Tải PDF
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm submit dialog */}
      <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Xác nhận gửi đăng ký</DialogTitle>
        <DialogContent>
          <Alert severity="success" sx={{ mb: 2 }}>
            <Typography variant="body2">
              Bạn đã hoàn tất đăng ký đề tài. Thông tin sẽ được gửi đến GVHD và Thư ký.
            </Typography>
          </Alert>
          <Typography variant="body2">
            Sau khi gửi, bạn sẽ nhận được email xác nhận và chờ duyệt trong 3-5 ngày.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)}>Hủy</Button>
          <Button variant="contained" color="success" onClick={handleConfirmSubmit}>
            Xác nhận gửi
          </Button>
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
