"use client";

import React from "react";
import { Card, Button, Typography, Empty } from "antd";
import { PlusOutlined, CalendarOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function SecretaryDefensePage() {
  return (
    <div style={{ maxWidth: 1400, margin: "0 auto" }}>
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <Title level={2} style={{ marginBottom: 4 }}>Lịch bảo vệ</Title>
            <Text type="secondary">Quản lý lịch bảo vệ khóa luận</Text>
          </div>
          <Button type="primary" icon={<PlusOutlined />}>
            Tạo lịch bảo vệ
          </Button>
        </div>
      </div>

      {/* Content */}
      <Card >
        <Empty
          image={<CalendarOutlined style={{ fontSize: 64, color: "#d1d5db" }} />}
          description={
            <div>
              <Text type="secondary">Chưa có lịch bảo vệ</Text>
            </div>
          }
        />
      </Card>
    </div>
  );
}
