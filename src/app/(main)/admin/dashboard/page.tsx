"use client";

import React from "react";
import { Row, Col, Card, Statistic, Typography, Empty } from "antd";
import {
  CalendarOutlined,
  TeamOutlined,
  SafetyOutlined,
  BookOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

export default function AdminDashboardPage() {
  return (
    <div style={{ maxWidth: 1400, margin: "0 auto" }}>
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ marginBottom: 4 }}>Tổng quan - Quản trị</Title>
        <Text type="secondary">Quản lý toàn bộ hệ thống</Text>
      </div>

      {/* Quick Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ height: "100%" }}>
            <Statistic
              title={<Text type="secondary">Kỳ khóa luận</Text>}
              value={0}
              prefix={<CalendarOutlined style={{ color: "#2a5bc0" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ height: "100%" }}>
            <Statistic
              title={<Text type="secondary">Người dùng</Text>}
              value={0}
              prefix={<TeamOutlined style={{ color: "#1dab60" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ height: "100%" }}>
            <Statistic
              title={<Text type="secondary">Hội đồng</Text>}
              value={0}
              prefix={<SafetyOutlined style={{ color: "#e89b33" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ height: "100%" }}>
            <Statistic
              title={<Text type="secondary">Khóa luận</Text>}
              value={0}
              prefix={<BookOutlined style={{ color: "#40b8d4" }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* System Status */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Kỳ khóa luận hiện tại">
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <CalendarOutlined style={{ fontSize: 48, color: "#d1d5db", marginBottom: 16 }} />
              <div>
                <Text type="secondary">Chưa có kỳ khóa luận nào</Text>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Hoạt động gần đây">
            <div style={{ textAlign: "center", padding: "40px 0" }}>
            <Empty description="Chưa có hoạt động nào" />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
