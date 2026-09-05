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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Alert,
} from "@mui/material";
import {
  X,
  Upload,
  FileSpreadsheet,
  Trash2,
  Download,
  AlertCircle,
  Wand2,
} from "lucide-react";
import { mockFaculties, mockDepartments } from "@/feature/admin/mockData";

interface TeacherImportRow {
  code: string;
  name: string;
  email: string;
  phone?: string;
  facultyId: string;
  departmentId: string;
  academicTitle?: string;
  position?: string;
}

interface ImportExcelDialogProps {
  open: boolean;
  onClose: () => void;
  onImport: (data: TeacherImportRow[]) => void;
}

// Helper to find faculty by name
function findFacultyIdByName(name: string): string {
  const found = mockFaculties.find((f) =>
    f.name.toLowerCase().includes(name.toLowerCase()),
  );
  return found?.id || "";
}

// Helper to find department by name
function findDepartmentIdByName(name: string, facultyId?: string): string {
  const departments = facultyId
    ? mockDepartments.filter((d) => d.facultyId === facultyId)
    : mockDepartments;

  const found = departments.find((d) =>
    d.name.toLowerCase().includes(name.toLowerCase()),
  );
  return found?.id || "";
}

export function ImportExcelDialog({
  open,
  onClose,
  onImport,
}: ImportExcelDialogProps) {
  const [rows, setRows] = useState<TeacherImportRow[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = () => {
    setRows([]);
    setErrors([]);
    setFileName("");
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const parseCSV = (text: string): TeacherImportRow[] => {
    const lines = text.trim().split("\n");
    if (lines.length < 2) {
      throw new Error(
        "File CSV phải có ít nhất 1 dòng dữ liệu (không tính header)",
      );
    }

    const headerMap: Record<string, number> = {};

    // Match Vietnamese headers
    const expectedHeaders = [
      { key: "code", labels: ["mã gv", "magv", "code", "teacher_code"] },
      {
        key: "name",
        labels: ["họ tên", "hoten", "name", "fullname", "full_name"],
      },
      { key: "email", labels: ["email", "gmail", "mail"] },
      { key: "phone", labels: ["sđt", "sdt", "phone", "tel", "điện thoại"] },
      {
        key: "faculty",
        labels: ["khoa", "faculty", "f"],
      },
      {
        key: "department",
        labels: ["bộ môn", "bomon", "department", "chuyên ngành"],
      },
      {
        key: "academicTitle",
        labels: ["học hàm", "hoc ham", "academic_title", "học vị"],
      },
      { key: "position", labels: ["chức vụ", "chucvu", "position", "title"] },
    ];

    // Parse header line
    const headers = lines[0]
      .split(",")
      .map((h) => h.trim().toLowerCase().replace(/"/g, ""));

    expectedHeaders.forEach(({ key, labels }) => {
      const idx = headers.findIndex((h) => labels.some((l) => h.includes(l)));
      if (idx !== -1) {
        headerMap[key] = idx;
      }
    });

    // Validate required headers
    if (headerMap.code === undefined) throw new Error("Thiếu cột 'Mã GV'");
    if (headerMap.name === undefined) throw new Error("Thiếu cột 'Họ tên'");
    if (headerMap.email === undefined) throw new Error("Thiếu cột 'Email'");

    const data: TeacherImportRow[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Simple CSV parsing (handles basic cases)
      const values = line.split(",").map((v) => v.trim().replace(/"/g, ""));

      const facultyValue =
        headerMap.faculty !== undefined ? values[headerMap.faculty] : "";
      const departmentValue =
        headerMap.department !== undefined ? values[headerMap.department] : "";

      // Auto-map faculty and department
      const facultyId = findFacultyIdByName(facultyValue);
      const departmentId = findDepartmentIdByName(departmentValue, facultyId);

      data.push({
        code: values[headerMap.code] || "",
        name: values[headerMap.name] || "",
        email: values[headerMap.email] || "",
        phone:
          headerMap.phone !== undefined ? values[headerMap.phone] : undefined,
        facultyId,
        departmentId,
        academicTitle:
          headerMap.academicTitle !== undefined
            ? values[headerMap.academicTitle]
            : undefined,
        position:
          headerMap.position !== undefined
            ? values[headerMap.position]
            : undefined,
      });
    }

    return data;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = parseCSV(text);
        setRows(parsed);
        setErrors([]);
      } catch (err) {
        setErrors([(err as Error).message]);
        setRows([]);
      }
    };
    reader.onerror = () => {
      setErrors(["Không thể đọc file"]);
    };
    reader.readAsText(file);
  };

  const handleRemoveRow = (index: number) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImport = () => {
    if (rows.length === 0) {
      setErrors(["Không có dữ liệu để import"]);
      return;
    }
    onImport(rows);
    handleClose();
  };

  const downloadTemplate = () => {
    // Sample template - note that Mã GV is optional
    const template =
      "Mã GV,Họ tên,Email,Số điện thoại,Khoa,Bộ môn,Học hàm/Học vị,Chức vụ\n,Nguyễn Văn An,nv.an@ctu.edu.vn,0912345678,Khoa Công nghệ thông tin,Công nghệ phần mềm,Tiến sĩ,Trưởng ngành";
    const blob = new Blob([template], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "template_giang_vien.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={false}
      fullWidth
      PaperProps={{
        sx: {
          width: 700,
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
        {/* File Upload */}
        <Box
          sx={{
            border: "2px dashed",
            borderColor: "primary.main",
            borderRadius: 2,
            p: 3,
            textAlign: "center",
            mb: 3,
            cursor: "pointer",
            transition: "all 0.2s",
            "&:hover": {
              bgcolor: "primary.50",
            },
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileSelect}
            style={{ display: "none" }}
          />
          <Upload size={48} color="#2563eb" style={{ marginBottom: 8 }} />
          <Typography variant="body1" fontWeight={500}>
            {fileName
              ? `Đã chọn: ${fileName}`
              : "Kéo thả file hoặc click để chọn"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Hỗ trợ định dạng CSV, XLSX, XLS
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<Download size={18} />}
          onClick={downloadTemplate}
          size="small"
          sx={{ mb: 1 }}
        >
          Tải file mẫu
        </Button>

        {/* Helper text for auto-code generation */}
        <Alert
          severity="info"
          sx={{
            mb: 2,
            py: 1,
            "& .MuiAlert-message": {
              display: "flex",
              alignItems: "center",
              gap: 1,
            },
          }}
          icon={<Wand2 size={18} />}
        >
          <Typography variant="body2">
            <strong>Lưu ý:</strong> Cột Mã giảng viên có thể để trống. Hệ thống
            sẽ tự động cấp mã liên tục cho các dòng không nhập mã.
          </Typography>
        </Alert>

        {/* Errors */}
        {errors.length > 0 && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errors.map((err, i) => (
              <Box key={i}>{err}</Box>
            ))}
          </Alert>
        )}

        {/* Preview Table */}
        {rows.length > 0 && (
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Xem trước ({rows.length} dòng)
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "primary.main" }}>
                    <TableCell
                      sx={{ color: "white", fontWeight: 600, minWidth: 60 }}
                    >
                      #
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: 600 }}>
                      Mã GV
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: 600 }}>
                      Họ tên
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: 600 }}>
                      Email
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: 600 }}>
                      Khoa
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: 600 }}>
                      Bộ môn
                    </TableCell>
                    <TableCell
                      sx={{ color: "white", fontWeight: 600, minWidth: 60 }}
                    >
                      Xóa
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.slice(0, 10).map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        {row.code ? (
                          row.code
                        ) : (
                          <Box
                            component="span"
                            sx={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 0.5,
                              px: 1,
                              py: 0.25,
                              borderRadius: 1,
                              bgcolor: "action.hover",
                              color: "text.secondary",
                              fontSize: "0.75rem",
                              fontStyle: "italic",
                            }}
                          >
                            <Wand2 size={12} />
                            Sẽ tạo tự động
                          </Box>
                        )}
                      </TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>
                        {mockFaculties.find((f) => f.id === row.facultyId)
                          ?.name || "—"}
                      </TableCell>
                      <TableCell>
                        {mockDepartments.find((d) => d.id === row.departmentId)
                          ?.name || "—"}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleRemoveRow(index)}
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {rows.length > 10 && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Và {rows.length - 10} dòng khác...
              </Typography>
            )}
          </Box>
        )}

        {/* Empty State */}
        {rows.length === 0 && errors.length === 0 && (
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
        <Button variant="outlined" onClick={handleClose}>
          Hủy
        </Button>
        <Button
          onClick={handleImport}
          disabled={rows.length === 0}
          startIcon={<Upload size={18} />}
        >
          Import {rows.length > 0 && `(${rows.length})`}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
