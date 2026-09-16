"use client";

import React, { useState } from "react";
import { TrendingUp, Users, Mail, Clock } from "lucide-react";

interface Analytics {
  totalSent: number;
  totalRead: number;
  readRate: number;
  avgDeliveryTime: string;
  recipientsByType: { type: string; count: number }[];
  topNotifications: { id: string; title: string; reads: number }[];
}

const AnalyticsDashboard: React.FC = () => {
  const [analytics] = useState<Analytics>({
    totalSent: 128,
    totalRead: 121,
    readRate: 94.5,
    avgDeliveryTime: "2.3s",
    recipientsByType: [
      { type: "Students", count: 450 },
      { type: "Teachers", count: 89 },
      { type: "Admins", count: 12 },
    ],
    topNotifications: [
      { id: "1", title: "Exam Schedule Update", reads: 89 },
      { id: "2", title: "Important Announcement", reads: 76 },
      { id: "3", title: "System Maintenance", reads: 54 },
    ],
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Thống kê Thông báo</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tổng gửi
              </p>
              <p className="text-2xl font-bold">{analytics.totalSent}</p>
            </div>
            <Mail className="w-8 h-8 text-blue-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Đã đọc
              </p>
              <p className="text-2xl font-bold">{analytics.totalRead}</p>
            </div>
            <Users className="w-8 h-8 text-green-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tỉ lệ đọc
              </p>
              <p className="text-2xl font-bold">{analytics.readRate}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Thời gian gửi
              </p>
              <p className="text-2xl font-bold">{analytics.avgDeliveryTime}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-600 opacity-20" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recipients by Type */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-4">Người nhận theo loại</h3>
          <div className="space-y-2">
            {analytics.recipientsByType.map((item, idx) => {
              const total = analytics.recipientsByType.reduce(
                (s, i) => s + i.count,
                0
              );
              const percentage = (item.count / total) * 100;
              return (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{item.type}</span>
                    <span className="font-semibold">{item.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Notifications */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-4">Thông báo hàng đầu</h3>
          <div className="space-y-3">
            {analytics.topNotifications.map((notif, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <span className="text-sm truncate flex-1">{notif.title}</span>
                <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                  {notif.reads}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
