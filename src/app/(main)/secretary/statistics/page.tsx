"use client";

import React from "react";
import { Card, Typography, Empty } from "antd";
import { BarChartOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function SecretaryStatisticsPage() {
  return (
    <div style={{ maxWidth: 1400, margin: "0 auto" }}>
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ marginBottom: 4 }}>Thống kê</Title>
        <Text type="secondary">Báo cáo và thống kê khóa luận</Text>
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
