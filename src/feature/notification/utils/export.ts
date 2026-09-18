import { INotification } from "@/shared/types/notification.types";
import * as XLSX from "xlsx";

export interface ExportOptions {
  format: "csv" | "excel" | "json";
  includeReadStatus?: boolean;
  includeSender?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export const exportNotifications = (
  notifications: INotification[],
  options: ExportOptions,
) => {
  const filtered = filterNotificationsByDate(notifications, options.dateRange);
  const formatted = formatNotificationsForExport(filtered, options);

  switch (options.format) {
    case "csv":
      return exportAsCSV(formatted);
    case "excel":
      return exportAsExcel(formatted);
    case "json":
      return exportAsJSON(formatted);
    default:
      throw new Error(`Unsupported export format: ${options.format}`);
  }
};

const filterNotificationsByDate = (
  notifications: INotification[],
  dateRange?: { start: Date; end: Date },
): INotification[] => {
  if (!dateRange) return notifications;

  return notifications.filter((n) => {
    const createdDate = new Date(n.createdAt);
    return createdDate >= dateRange.start && createdDate <= dateRange.end;
  });
};

interface FormattedNotification {
  [key: string]: string | number | boolean;
}

const formatNotificationsForExport = (
  notifications: INotification[],
  options: ExportOptions,
): FormattedNotification[] => {
  return notifications.map((n) => {
    const row: FormattedNotification = {
      ID: n.id,
      Title: n.title,
      Type: n.type,
      Message: n.message,
      "Created At": new Date(n.createdAt).toLocaleString("vi-VN"),
    };

    if (options.includeReadStatus) {
      row["Read Status"] = n.isRead ? "Đã đọc" : "Chưa đọc";
    }

    if (options.includeSender) {
      row["Sender ID"] = n.senderId || "N/A";
    }

    return row;
  });
};

const exportAsCSV = (data: FormattedNotification[]): string => {
  if (data.length === 0) return "";

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          // Escape quotes and wrap in quotes if contains comma
          const str = String(value).replace(/"/g, '""');
          return str.includes(",") ? `"${str}"` : str;
        })
        .join(","),
    ),
  ].join("\n");

  return csvContent;
};

const exportAsExcel = (data: FormattedNotification[]): void => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Notifications");

  // Auto-size columns
  const maxWidth = 50;
  const colWidths = Object.keys(data[0] || {}).map(() => maxWidth);
  worksheet["!cols"] = colWidths.map((width) => ({ wch: width }));

  XLSX.writeFile(workbook, `notifications-${new Date().getTime()}.xlsx`);
};

const exportAsJSON = (data: FormattedNotification[]): string => {
  return JSON.stringify(data, null, 2);
};

// Download helpers
export const downloadAsCSV = (
  data: FormattedNotification[] | INotification[],
): void => {
  let formatted: FormattedNotification[];

  if (data.length === 0) return;

  // Check if already formatted or needs formatting
  if ("title" in data[0] && !("ID" in data[0])) {
    formatted = formatNotificationsForExport(data as INotification[], {
      format: "csv",
      includeReadStatus: true,
    });
  } else {
    formatted = data as FormattedNotification[];
  }

  const csv = exportAsCSV(formatted);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `notifications-${new Date().getTime()}.csv`);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const downloadAsJSON = (
  data: INotification[] | FormattedNotification[],
): void => {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `notifications-${new Date().getTime()}.json`);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
