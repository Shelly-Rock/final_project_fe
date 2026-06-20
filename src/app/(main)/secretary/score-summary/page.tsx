"use client";

import React from "react";
import { Card, Typography, Empty } from "antd";
import { BarChartOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function SecretaryScoreSummaryPage() {
  return (
    <div style={{ maxWidth: 1400, margin: "0 auto" }}>
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ marginBottom: 4 }}>Tổng hợp điểm</Title>
        <Text type="secondary">Tổng hợp và xuất điểm khóa luận</Text>
      </div>

      {/* Content */}
      <Card >
        <Empty
          image={<BarChartOutlined style={{ fontSize: 64, color: "#d1d5db" }} />}
          description={
            <div>
              <Text type="secondary">Danh sách điểm tổng hợp</Text>
            </div>
          }
        />
      </Card>
    </div>
  );
}
