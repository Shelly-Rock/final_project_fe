"use client";

import { useEffect, useState } from "react";
import { notificationApi } from "@/shared/services/api/notification.api";

type NotificationStats = Awaited<
  ReturnType<typeof notificationApi.getNotificationStats>
>;

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    notificationApi
      .getNotificationStats()
      .then((result) => {
        if (active) setStats(result);
      })
      .catch(() => {
        if (active) setError("Không thể tải thống kê thông báo.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <p className="py-8 text-center text-text-muted">Đang tải...</p>;
  }

  if (error || !stats) {
    return (
      <p role="alert" className="py-8 text-center text-error">
        {error || "Không có dữ liệu thống kê."}
      </p>
    );
  }

  const items = [
    { label: "Tổng thông báo", value: stats.total },
    { label: "Khẩn cấp", value: stats.urgent },
    { label: "Tỷ lệ đọc trung bình", value: `${stats.avgReadRate}%` },
    { label: "Cần xử lý", value: stats.pending },
  ];

  return (
    <section aria-label="Thống kê thông báo">
      <h2 className="mb-4 text-lg font-semibold">Thống kê thông báo</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded border border-border-subtle bg-surface-card p-4"
          >
            <p className="text-sm text-text-muted">{item.label}</p>
            <p className="mt-2 text-2xl font-semibold text-text-primary">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
