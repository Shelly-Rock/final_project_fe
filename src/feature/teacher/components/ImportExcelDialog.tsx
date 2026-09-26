"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  IconButton,
  Alert,
} from "@mui/material";
import {
  X,
  Upload,
  FileSpreadsheet,
  Download,
  AlertCircle,
} from "lucide-react";
import * as XLSX from "xlsx";

interface Faculty {
  id: string;
  name: string;
}

interface Department {
  id: string;
  name: string;
  facultyId?: string;
}

interface ImportExcelDialogProps {
  open: boolean;
  onClose: () => void;
  onImport: (file: File) => void | Promise<void>;
  faculties: Faculty[];
  departments: Department[];
}

export function ImportExcelDialog({
  open,
  onClose,
  onImport,
}: ImportExcelDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = () => {
    setSelectedFile(null);
    setErrors([]);
    setImporting(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validExtension = /\.(xlsx|xls)$/i.test(file.name);
    if (!validExtension) {
      setSelectedFile(null);
      setErrors(["Vui lòng chọn file Excel định dạng .xlsx hoặc .xls"]);
      return;
    }

    setSelectedFile(file);
    setErrors([]);
  };

  const handleImport = async () => {
    if (!selectedFile) {
      setErrors(["Vui lòng chọn file Excel để import"]);
      return;
    }

    setImporting(true);
    try {
      await onImport(selectedFile);
      handleClose();
    } catch (error) {
      setErrors([
        error instanceof Error
          ? error.message
          : "Import danh sách giảng viên thất bại",
      ]);
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    const rows = [
      {
        code: "GV001",
        name: "Nguyễn Văn An",
        email: "nv.an@nttu.edu.vn",
        phone: "0912345678",
        facultyId: "KHOA_CNTT",
        departmentId: "BM_KTPM",
        academicTitle: "DOCTOR",
        position: "Giảng viên",
        dateOfBirth: "1990-01-15",
        gender: "MALE",
        address: "TP. Hồ Chí Minh",
      },
    ];
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "GiangVien");
    XLSX.writeFile(workbook, "template_giang_vien.xlsx");
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={false}
      fullWidth
      PaperProps={{
        sx: {
          width: 620,
          maxWidth: "calc(100vw - 32px)",
          maxHeight: "calc(100vh - 64px)",
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid",
          borderColor: "divider",
          pb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <FileSpreadsheet size={24} color="#2563eb" />
          <Typography
            variant="h6"
            component="span"
            fontWeight={600}
            sx={{ color: "text.primary" }}
          >
            Import danh sách giảng viên
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Box
          sx={{
            border: "2px dashed",
            borderColor: selectedFile ? "success.main" : "primary.main",
            borderRadius: 2,
            p: 3,
            textAlign: "center",
            mb: 3,
            cursor: "pointer",
            transition: "all 0.2s",
            "&:hover": {
              bgcolor: "action.hover",
            },
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileSelect}
            style={{ display: "none" }}
          />
          <Upload size={48} color="#2563eb" style={{ marginBottom: 8 }} />
          <Typography variant="body1" fontWeight={500}>
            {selectedFile
              ? `Đã chọn: ${selectedFile.name}`
              : "Click để chọn file Excel"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Hỗ trợ định dạng XLSX, XLS
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<Download size={18} />}
          onClick={downloadTemplate}
          size="small"
          sx={{ mb: 2 }}
        >
          Tải file mẫu
        </Button>

        <Alert severity="info" sx={{ mb: 2 }} icon={<AlertCircle size={18} />}>
          <Typography variant="body2">
            File cần có các cột bắt buộc:{" "}
            <strong>code, name, email, facultyId, departmentId</strong>. Mã
            giảng viên không được để trống và phải có định dạng{" "}
            <strong>GV + số</strong>, ví dụ <strong>GV001</strong>.
          </Typography>
        </Alert>

        {errors.length > 0 && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errors.map((err, i) => (
              <Box key={i}>{err}</Box>
            ))}
          </Alert>
        )}

        {!selectedFile && errors.length === 0 && (
          <Box
            sx={{
              textAlign: "center",
              py: 4,
              color: "text.secondary",
            }}
          >
            <AlertCircle size={48} style={{ opacity: 0.5, marginBottom: 8 }} />
            <Typography>Chưa chọn file</Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 2,
          pt: 1,
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Button variant="outlined" onClick={handleClose} disabled={importing}>
          Hủy
        </Button>
        <Button
          onClick={handleImport}
          disabled={!selectedFile || importing}
          startIcon={<Upload size={18} />}
        >
          {importing ? "Đang import..." : "Import"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
