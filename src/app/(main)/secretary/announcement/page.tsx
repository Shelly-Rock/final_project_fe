"use client";

import React from "react";
import { Card, Button, Typography, Empty } from "antd";
import { PlusOutlined, NotificationOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function SecretaryAnnouncementPage() {
  return (
    <div style={{ maxWidth: 1400, margin: "0 auto" }}>
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <Title level={2} style={{ marginBottom: 4 }}>Thông báo</Title>
            <Text type="secondary">Quản lý thông báo</Text>
          </div>
          <Button type="primary" icon={<PlusOutlined />}>
            Tạo thông báo
          </Button>
        </div>
      </div>

      {/* Content */}
      <Card >
        <Empty
          image={<NotificationOutlined style={{ fontSize: 64, color: "#d1d5db" }} />}
          description={
            <div>
              <Text type="secondary">Chưa có thông báo nào</Text>
            </div>
          }
        />
      </Card>
    </div>
  );
}
