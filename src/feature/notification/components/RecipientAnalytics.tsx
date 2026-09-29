"use client";

interface NotificationAnalytics {
  id: number;
  title: string;
  sentAt: string;
  totalRecipients: number;
  readCount: number;
  unreadCount: number;
}

interface RecipientAnalyticsProps {
  analytics?: NotificationAnalytics;
}

export default function RecipientAnalytics({
  analytics,
}: RecipientAnalyticsProps) {
  if (!analytics) {
    return (
      <p className="py-8 text-center text-text-muted">
        Chưa có dữ liệu thống kê cho thông báo này.
      </p>
    );
  }

  const readRate = analytics.totalRecipients
    ? (analytics.readCount / analytics.totalRecipients) * 100
    : 0;

  return (
    <section className="space-y-4" aria-label="Thống kê người nhận">
      <div>
        <h3 className="text-sm font-semibold text-text-primary">
          {analytics.title}
        </h3>
        <p className="mt-1 text-xs text-text-muted">
          Gửi lúc: {new Date(analytics.sentAt).toLocaleString("vi-VN")}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Người nhận", value: analytics.totalRecipients },
          { label: "Đã đọc", value: analytics.readCount },
          { label: "Chưa đọc", value: analytics.unreadCount },
          { label: "Tỷ lệ đọc", value: `${readRate.toFixed(1)}%` },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded border border-border-subtle bg-surface-subtle p-3"
          >
            <p className="text-xs text-text-muted">{item.label}</p>
            <p className="mt-1 text-lg font-semibold text-text-primary">
              {item.value}
            </p>
          </div>
        ))}
      </div>
      <p className="text-sm text-text-muted">
        Backend chưa cung cấp thống kê người nhận theo khoa.
      </p>
    </section>
  );
}
