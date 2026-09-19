"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Download } from "lucide-react";
import { toast } from "sonner";

interface RecipientStatus {
  department: string;
  total: number;
  read: number;
  unread: number;
  readPercentage: number;
}

interface NotificationAnalytics {
  id: number;
  title: string;
  sentAt: string;
  totalRecipients: number;
  readCount: number;
  unreadCount: number;
  byDepartment: RecipientStatus[];
}

interface RecipientAnalyticsProps {
  notificationId?: number;
  analytics?: NotificationAnalytics;
}

const COLORS = ["#38bdf8", "#34d399", "#fbbf24", "#f87171"];

const RecipientAnalytics: React.FC<RecipientAnalyticsProps> = ({
  notificationId,
  analytics,
}) => {
  const [data, setData] = useState<NotificationAnalytics | null>(
    analytics || null,
  );
  const [loading, setLoading] = useState(!analytics);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API call
      const mockData: NotificationAnalytics = {
        id: notificationId || 1,
        title: "Nhắc hạn nộp báo cáo tháng 12/2024",
        sentAt: new Date().toISOString(),
        totalRecipients: 50,
        readCount: 46,
        unreadCount: 4,
        byDepartment: [
          {
            department: "Khoa CNTT",
            total: 10,
            read: 10,
            unread: 0,
            readPercentage: 100,
          },
          {
            department: "Khoa Điện-Điện tử",
            total: 12,
            read: 11,
            unread: 1,
            readPercentage: 92,
          },
          {
            department: "Khoa Cơ khí",
            total: 8,
            read: 6,
            unread: 2,
            readPercentage: 75,
          },
          {
            department: "Viện Sau ĐH",
            total: 20,
            read: 19,
            unread: 1,
            readPercentage: 95,
          },
        ],
      };
      setData(mockData);
    } catch (error) {
      toast.error("Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!analytics && notificationId) {
      loadAnalytics();
    }
  }, [notificationId, analytics]);

  const exportToCSV = () => {
    if (!data) return;

    const csvContent = [
      ["Phòng/Khoa", "Tổng cộng", "Đã đọc", "Chưa đọc", "Tỷ lệ (%)"],
      ...data.byDepartment.map((d) => [
        d.department,
        d.total,
        d.read,
        d.unread,
        d.readPercentage.toFixed(1),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `notification-analytics-${data.id}.csv`;
    a.click();
    toast.success("Đã tải xuống báo cáo");
  };

  if (loading) {
    return <div className="text-center py-8 text-text-muted">Đang tải...</div>;
  }

  if (!data) {
    return (
      <div className="text-center py-8 text-text-muted">Không có dữ liệu</div>
    );
  }

  const summaryData = [
    { name: "Đã đọc", value: data.readCount, color: "#34d399" },
    { name: "Chưa đọc", value: data.unreadCount, color: "#f87171" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">
            {data.title}
          </h3>
          <p className="text-xs text-text-muted mt-1">
            Gửi lúc: {new Date(data.sentAt).toLocaleString("vi-VN")}
          </p>
        </div>
        <button
          onClick={exportToCSV}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary hover:bg-sky-400 text-on-primary text-xs font-semibold transition-colors"
        >
          <Download className="w-4 h-4" />
          Tải CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-surface-subtle border border-border-subtle">
          <p className="text-xs text-text-muted mb-1">Tổng người nhận</p>
          <p className="text-2xl font-bold text-primary">
            {data.totalRecipients}
          </p>
        </div>
        <div className="p-4 rounded-lg bg-surface-subtle border border-border-subtle">
          <p className="text-xs text-text-muted mb-1">Đã đọc</p>
          <p className="text-2xl font-bold text-secondary">{data.readCount}</p>
        </div>
        <div className="p-4 rounded-lg bg-surface-subtle border border-border-subtle">
          <p className="text-xs text-text-muted mb-1">Tỷ lệ đọc</p>
          <p className="text-2xl font-bold text-text-primary">
            {((data.readCount / data.totalRecipients) * 100).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="p-4 rounded-lg bg-surface-subtle border border-border-subtle">
          <p className="text-xs font-medium text-text-secondary mb-3">
            Tỷ lệ tiếp nhận
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={summaryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {summaryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#131b2c",
                  border: "1px solid #1e293b",
                  borderRadius: "0.5rem",
                  color: "#f1f5f9",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-4 mt-3 text-xs">
            {summaryData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-text-secondary">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart */}
        <div className="p-4 rounded-lg bg-surface-subtle border border-border-subtle">
          <p className="text-xs font-medium text-text-secondary mb-3">
            Theo phòng/khoa
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.byDepartment}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey="department"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#131b2c",
                  border: "1px solid #1e293b",
                  borderRadius: "0.5rem",
                  color: "#f1f5f9",
                }}
              />
              <Bar
                dataKey="readPercentage"
                fill="#34d399"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Department Table */}
      <div className="rounded-lg bg-surface-subtle border border-border-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-subtle/80">
                <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  Phòng/Khoa
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-text-muted uppercase tracking-wider">
                  Tổng
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-text-muted uppercase tracking-wider">
                  Đã đọc
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-text-muted uppercase tracking-wider">
                  Chưa đọc
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-text-muted uppercase tracking-wider">
                  Tỷ lệ (%)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/60">
              {data.byDepartment.map((dept) => (
                <tr
                  key={dept.department}
                  className="hover:bg-surface-card transition-colors"
                >
                  <td className="px-4 py-3 text-text-primary">
                    {dept.department}
                  </td>
                  <td className="px-4 py-3 text-center text-text-secondary">
                    {dept.total}
                  </td>
                  <td className="px-4 py-3 text-center text-secondary font-medium">
                    {dept.read}
                  </td>
                  <td className="px-4 py-3 text-center text-error font-medium">
                    {dept.unread}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className="font-mono font-medium text-primary">
                        {dept.readPercentage.toFixed(1)}%
                      </span>
                      <div className="w-16 h-1.5 bg-surface-subtle rounded-full overflow-hidden">
                        <div
                          className="h-full bg-secondary rounded-full transition-all"
                          style={{ width: `${dept.readPercentage}%` }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecipientAnalytics;
