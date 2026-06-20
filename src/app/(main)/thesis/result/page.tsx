"use client";

import React from "react";
import { Card, Typography, Row, Col, Empty } from "antd";
import { TrophyOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function ThesisResultPage() {
  return (
    <div style={{ padding: "24px" }}>
      {/* Page Header */}
      <Title level={2} style={{ marginBottom: 8 }}>Kết quả khóa luận</Title>
      <Text type="secondary">Xem điểm và kết quả bảo vệ</Text>

      {/* Overall Score */}
      <Row gutter={[16, 16]} style={{ marginTop: 24, marginBottom: 24 }}>
        <Col xs={24} md={8}>
          <Card>
            <div style={{ textAlign: "center", padding: "32px 0" }}>
              <Text type="secondary" style={{ display: "block", marginBottom: 8 }}>
                Điểm quá trình
              </Text>
              <Title level={2} style={{ margin: 0, color: "#999" }}>--</Title>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <div style={{ textAlign: "center", padding: "32px 0" }}>
              <Text type="secondary" style={{ display: "block", marginBottom: 8 }}>
                Điểm bảo vệ
              </Text>
              <Title level={2} style={{ margin: 0, color: "#999" }}>--</Title>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card style={{ backgroundColor: "#1677ff", border: "none" }}>
            <div style={{ textAlign: "center", padding: "32px 0" }}>
              <Text style={{ display: "block", marginBottom: 8, color: "rgba(255,255,255,0.65)" }}>
                Điểm tổng kết
              </Text>
              <Title level={2} style={{ margin: 0, color: "#fff" }}>--</Title>
              <Text style={{ display: "block", marginTop: 8, color: "rgba(255,255,255,0.65)", fontSize: 12 }}>
                Chưa có kết quả
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Score Details */}
      <Row>
        <Col span={24}>
          <Card title="Chi tiết điểm">
            <Empty
              description={
                <span>
                  Kết quả sẽ được cập nhật sau khi bảo vệ
                </span>
              }
              style={{ padding: "48px 0" }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
