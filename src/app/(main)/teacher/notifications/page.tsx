"use client";

import React from "react";
import { Card, Typography, Empty } from "antd";
import { BellOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function TeacherNotificationsPage() {
  return (
    <div style={{ maxWidth: 1400, margin: "0 auto" }}>
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ marginBottom: 4 }}>Thông báo</Title>
        <Text type="secondary">Danh sách thông báo của bạn</Text>
      </div>

      {/* Content */}
      <Card >
        <Empty
          image={<BellOutlined style={{ fontSize: 64, color: "#d1d5db" }} />}
          description={
            <div>
              <Text type="secondary">Không có thông báo nào</Text>
            </div>
          }
        />
      </Card>
    </div>
  );
}
