"use client";

import { useCallback } from "react";
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
} from "@mui/material";
import {
  Download as ExportIcon,
  TableChart as ExcelIcon,
  PictureAsPdf as PdfIcon,
  Article as WordIcon,
} from "@mui/icons-material";
import * as XLSX from "xlsx";
import { useState } from "react";

export interface ExcelSheet {
  sheetName: string;
  data: Record<string, unknown>[];
}

interface ExportExcelButtonProps {
  sheets: ExcelSheet[];
  filename?: string;
  variant?: "contained" | "outlined" | "text";
  color?: "primary" | "success" | "info";
  label?: string;
  disabled?: boolean;
}

export function ExportExcelButton({
  sheets,
  filename = "BaoCao",
  variant = "contained",
  color = "primary",
  label = "Xuất Excel",
  disabled = false,
}: ExportExcelButtonProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const exportAll = useCallback(() => {
    if (!sheets.length) return;
    const wb = XLSX.utils.book_new();
    for (const sheet of sheets) {
      if (!sheet.data?.length) continue;
      const ws = XLSX.utils.json_to_sheet(sheet.data);
      XLSX.utils.book_append_sheet(wb, ws, sheet.sheetName);
    }
    XLSX.writeFile(wb, `${filename}.xlsx`);
    handleClose();
  }, [sheets, filename]);

  const exportSingle = useCallback((idx: number) => {
    const sheet = sheets[idx];
    if (!sheet.data?.length) return;
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(sheet.data);
    XLSX.utils.book_append_sheet(wb, ws, sheet.sheetName);
    XLSX.writeFile(wb, `${filename}_${sheet.sheetName}.xlsx`);
    handleClose();
  }, [sheets, filename]);

  if (sheets.length === 1) {
    return (
      <Button
        variant={variant}
        color={color}
        startIcon={<ExcelIcon />}
        onClick={exportAll}
        disabled={disabled}
      >
        {label}
      </Button>
    );
  }

  return (
    <>
      <Button
        variant={variant}
        color={color}
        startIcon={<ExportIcon />}
        onClick={handleOpen}
        disabled={disabled}
        aria-controls={open ? "export-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        {label}
      </Button>
      <Menu
        id="export-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ "aria-labelledby": "export-button" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={exportAll} sx={{ minWidth: 200 }}>
          <ListItemIcon>
            <ExcelIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              Tất cả ({sheets.length} sheets)
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Mỗi sheet = 1 phần báo cáo
            </Typography>
          </ListItemText>
        </MenuItem>

        <Divider />

        {sheets.map((sheet, idx) => (
          <MenuItem key={idx} onClick={() => exportSingle(idx)}>
            <ListItemIcon>
              <ExcelIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2">{sheet.sheetName}</Typography>
              <Typography variant="caption" color="text.secondary">
                {sheet.data.length} dòng
              </Typography>
            </ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
