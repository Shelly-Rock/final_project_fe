import type { StudentImportRow } from "../types";

const REQUIRED_COLUMNS = ["stt", "mssv", "hoten", "khoa", "khoahoc", "gmail"];

export async function importStudentsFromFile(
  onSuccess: (data: StudentImportRow[]) => void,
  onError: (message: string) => void,
): Promise<void> {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".csv,.xlsx,.xls,.txt";

  input.onchange = async (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        let text = e.target?.result as string;
        if (text.charCodeAt(0) === 0xfeff) {
          text = text.slice(1);
        }
        const lines = text.split("\n").filter((line) => line.trim());

        if (lines.length < 2) {
          onError("File không hợp lệ hoặc không có dữ liệu");
          return;
        }

        // Detect delimiter: count comma vs semicolon
        const firstLine = lines[0];
        const commaCount = (firstLine.match(/,/g) || []).length;
        const semicolonCount = (firstLine.match(/;/g) || []).length;
        const delimiter = semicolonCount > commaCount ? ";" : ",";

        const headers = firstLine
          .split(delimiter)
          .map((h) => h.trim().toLowerCase().replace(/\s+/g, ""));
        console.log("Headers found:", headers, "using delimiter:", delimiter);

        const missingCols = REQUIRED_COLUMNS.filter(
          (col) => !headers.includes(col),
        );
        if (missingCols.length > 0) {
          onError(`Thiếu cột bắt buộc: ${missingCols.join(", ")}`);
          return;
        }

        const rows: StudentImportRow[] = [];
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          const values = line.split(delimiter).map((v) => v.trim());

          // Check if we have enough columns
          if (values.length < 6) continue;

          // Check if name (hoTen) is present
          const hotenIdx = headers.indexOf("hoten");
          if (hotenIdx === -1 || !values[hotenIdx]) continue;

          const row: Partial<StudentImportRow> = {};
          headers.forEach((header, idx) => {
            const value = values[idx] ?? "";
            (row as Record<string, string | number>)[header] =
              header === "stt" ? parseInt(value) || i : value;
          });
          rows.push(row as StudentImportRow);
        }

        if (rows.length === 0) {
          onError("Không tìm thấy dữ liệu sinh viên hợp lệ");
          return;
        }

        onSuccess(rows);
      } catch {
        onError("Không thể đọc file. Vui lòng kiểm tra định dạng file.");
      }
    };

    reader.onerror = () => {
      onError("Không thể đọc file");
    };

    reader.readAsText(file);
  };

  input.click();
}
