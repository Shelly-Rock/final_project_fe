"use client";

import { Box, Typography, LinearProgress, Button } from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from "@mui/icons-material";
import { useCallback, useState } from "react";
import * as XLSX from "xlsx";

interface ParsedRow {
  [key: string]: string | number | null;
}

interface ExcelUploadDropzoneProps {
  onUpload: (data: ParsedRow[], errors: string[]) => void;
  accept?: string;
  maxSize?: number;
  templateHeaders?: string[];
}

export function ExcelUploadDropzone({
  onUpload,
  accept = ".xlsx,.xls,.csv",
  maxSize = 5 * 1024 * 1024,
  templateHeaders = [],
}: ExcelUploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const [preview, setPreview] = useState<ParsedRow[] | null>(null);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [isParsed, setIsParsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const parseExcel = useCallback(
    (file: File) => {
      setIsLoading(true);
      setParseErrors([]);

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array", cellDates: true });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData: ParsedRow[] = XLSX.utils.sheet_to_json(worksheet, {
            defval: "",
          });

          if (jsonData.length === 0) {
            setParseErrors(["File rỗng hoặc không có dữ liệu."]);
            setIsParsed(false);
            setIsLoading(false);
            return;
          }

          const errors: string[] = [];
          const headers = Object.keys(jsonData[0]);

          if (templateHeaders.length > 0) {
            const missing = templateHeaders.filter(
              (h) => !headers.some((col) => col.toLowerCase().trim() === h.toLowerCase().trim())
            );
            if (missing.length > 0) {
              errors.push(`Thiếu cột bắt buộc: ${missing.join(", ")}`);
            }
          }

          // Check for empty required fields
          jsonData.forEach((row, idx) => {
            const rowNum = idx + 2;
            if (!row.mssv && !row.MSSV && !row["Mã SV"]) {
              errors.push(`Dòng ${rowNum}: Thiếu mã sinh viên`);
            }
          });

          setPreview(jsonData.slice(0, 10));
          setParseErrors(errors);
          setIsParsed(true);
          setIsLoading(false);
        } catch {
          setParseErrors(["Không thể đọc file. Vui lòng kiểm tra định dạng."]);
          setIsParsed(false);
          setIsLoading(false);
        }
      };
      reader.onerror = () => {
        setParseErrors(["Lỗi khi đọc file."]);
        setIsParsed(false);
        setIsLoading(false);
      };
      reader.readAsArrayBuffer(file);
    },
    [templateHeaders]
  );

  const handleFile = useCallback(
    (file: File) => {
      if (file.size > maxSize) {
        setParseErrors([`File quá lớn. Tối đa ${Math.round(maxSize / 1024 / 1024)}MB.`]);
        return;
      }
      setFileName(file.name);
      parseExcel(file);
    },
    [maxSize, parseExcel]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleConfirm = useCallback(() => {
    if (!preview) return;
    onUpload(preview, parseErrors);
  }, [preview, parseErrors, onUpload]);

  const handleReset = useCallback(() => {
    setFileName("");
    setPreview(null);
    setParseErrors([]);
    setIsParsed(false);
  }, []);

  return (
    <Box>
      {/* Dropzone */}
      {!isParsed && (
        <Box
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          sx={{
            border: "2px dashed",
            borderColor: isDragging ? "primary.main" : "divider",
            borderRadius: 2,
            p: 4,
            textAlign: "center",
            cursor: "pointer",
            bgcolor: isDragging ? "action.hover" : "background.paper",
            transition: "all 0.2s",
            "&:hover": { borderColor: "primary.main", bgcolor: "action.hover" },
          }}
          component="label"
        >
          <input
            type="file"
            accept={accept}
            onChange={handleChange}
            style={{ display: "none" }}
          />

          <CloudUploadIcon
            sx={{ fontSize: 48, color: "text.secondary", mb: 1 }}
          />
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
            Kéo thả file Excel vào đây
          </Typography>
          <Typography variant="body2" color="text.secondary">
            hoặc click để chọn file
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
            Định dạng: .xlsx, .xls, .csv — Tối đa {Math.round(maxSize / 1024 / 1024)}MB
          </Typography>
        </Box>
      )}

      {/* File info */}
      {fileName && (
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <CheckCircleIcon color="primary" fontSize="small" />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {fileName}
            </Typography>
            <Button size="small" onClick={handleReset} sx={{ ml: "auto" }}>
              Chọn lại
            </Button>
          </Box>

          {/* Parse errors */}
          {parseErrors.length > 0 && (
            <Box
              sx={{
                bgcolor: "error.50",
                border: "1px solid",
                borderColor: "error.main",
                borderRadius: 1,
                p: 2,
                mb: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <ErrorIcon color="error" fontSize="small" />
                <Typography variant="body2" color="error" sx={{ fontWeight: 600 }}>
                  {parseErrors.length} lỗi phát hiện
                </Typography>
              </Box>
              {parseErrors.slice(0, 5).map((err, idx) => (
                <Typography key={idx} variant="caption" sx={{ display: "block", color: "error.dark" }}>
                  • {err}
                </Typography>
              ))}
              {parseErrors.length > 5 && (
                <Typography variant="caption" sx={{ color: "error.main" }}>
                  ... và {parseErrors.length - 5} lỗi khác
                </Typography>
              )}
            </Box>
          )}

          {/* Loading */}
          {isLoading && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" sx={{ mb: 1, display: "block" }}>
                Đang xử lý...
              </Typography>
              <LinearProgress />
            </Box>
          )}
        </Box>
      )}

      {/* Preview */}
      {isParsed && preview && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
            Xem trước (10 dòng đầu):
          </Typography>
          <Box
            sx={{
              overflowX: "auto",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              mb: 2,
            }}
          >
            <Box
              component="table"
              sx={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}
            >
              <Box component="thead" sx={{ bgcolor: "grey.100" }}>
                <Box component="tr">
                  {Object.keys(preview[0]).map((key) => (
                    <Box
                      component="th"
                      key={key}
                      sx={{ px: 1.5, py: 1, textAlign: "left", fontWeight: 700, whiteSpace: "nowrap" }}
                    >
                      {key}
                    </Box>
                  ))}
                </Box>
              </Box>
              <Box component="tbody">
                {preview.map((row, idx) => (
                  <Box component="tr" key={idx} sx={{ "&:nth-of-type(odd)": { bgcolor: "grey.50" } }}>
                    {Object.values(row).map((val, i) => (
                      <Box
                        component="td"
                        key={i}
                        sx={{ px: 1.5, py: 0.75, whiteSpace: "nowrap" }}
                      >
                        {String(val ?? "-")}
                      </Box>
                    ))}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button variant="outlined" onClick={handleReset}>
              Chọn file khác
            </Button>
            <Button variant="contained" onClick={handleConfirm}>
              Xác nhận import
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}
