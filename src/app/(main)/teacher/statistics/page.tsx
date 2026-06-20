"use client";

import React from "react";
import { Card, Typography, Empty } from "antd";
import { BarChartOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function TeacherStatisticsPage() {
  return (
    <div style={{ maxWidth: 1400, margin: "0 auto" }}>
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ marginBottom: 4 }}>Thống kê cá nhân</Title>
        <Text type="secondary">Thống kê hoạt động và kết quả hướng dẫn</Text>
      </div>

      {/* Content */}
      <Card >
        <Empty
          image={<BarChartOutlined style={{ fontSize: 64, color: "#d1d5db" }} />}
          description={
            <div>
              <Text type="secondary">Thống kê sẽ được hiển thị khi có dữ liệu</Text>
            </div>
          }
        />
      </Card>
    </div>
  );
}
