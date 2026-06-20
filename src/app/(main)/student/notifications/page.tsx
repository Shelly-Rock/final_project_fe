"use client";

import React from "react";
import { Row, Col, Card, Typography, Empty, Avatar, Space } from "antd";

const { Title, Text } = Typography;

export default function StudentNotificationsPage() {
  const notifications: any[] = [];

  return (
    <div style={{ padding: "24px" }}>
      <Row gutter={[0, 24]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Title level={2} style={{ marginBottom: 8 }}>Thông báo</Title>
          <Text type="secondary">Danh sách thông báo của bạn</Text>
        </Col>
      </Row>

      {notifications.length === 0 ? (
        <Card >
          <Empty description="Không có thông báo nào" />
        </Card>
      ) : (
        <Card style={{ padding: 0 }}>
          {notifications.map((noti, index) => (
            <div
              key={index}
              style={{
                borderBottom: index < notifications.length - 1 ? "1px solid #f0f0f0" : "none",
                padding: 16,
              }}
            >
              <Space direction="horizontal" size="middle" align="start">
                <Avatar
                  style={{ background: "#f0f0f0", color: "#595959" }}
                  icon={<Text>🔔</Text>}
                />
                <Space direction="vertical" size={0}>
                  <Text strong>{noti.title}</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>{noti.message}</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>{noti.time}</Text>
                </Space>
              </Space>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
