"use client";

import React from "react";
import { Row, Col, Card, Typography, Empty } from "antd";

const { Title, Text } = Typography;

export default function StudentResultPage() {
  return (
    <div style={{ padding: "24px" }}>
      <Row gutter={[0, 24]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Title level={2} style={{ marginBottom: 8 }}>Kết quả khóa luận</Title>
          <Text type="secondary">Xem điểm và kết quả bảo vệ</Text>
        </Col>
      </Row>

      {/* Overall Score */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={8}>
          <Card style={{ textAlign: "center" }}>
            <Text type="secondary" style={{ display: "block", marginBottom: 8 }}>Điểm quá trình</Text>
            <Title level={2} type="secondary" style={{ marginBottom: 0 }}>--</Title>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card style={{ textAlign: "center" }}>
            <Text type="secondary" style={{ display: "block", marginBottom: 8 }}>Điểm bảo vệ</Text>
            <Title level={2} type="secondary" style={{ marginBottom: 0 }}>--</Title>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card style={{ textAlign: "center", background: "#1890ff" }}
          >
            <Text style={{ display: "block", marginBottom: 8, color: "rgba(255,255,255,0.65)" }}>
              Điểm tổng kết
            </Text>
            <Title level={2} style={{ marginBottom: 0, color: "#fff" }}>--</Title>
            <Text style={{ color: "rgba(255,255,255,0.65)", marginTop: 8, display: "block" }}>
              Chưa có kết quả
            </Text>
          </Card>
        </Col>
      </Row>

      {/* Score Details */}
      <Row>
        <Col span={24}>
          <Card >
            <Title level={5} style={{ marginBottom: 16 }}>Chi tiết điểm</Title>
            <Empty description="Kết quả sẽ được cập nhật sau khi bảo vệ" />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
