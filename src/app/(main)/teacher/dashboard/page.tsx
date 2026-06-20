"use client";

import React from "react";
import { Row, Col, Card, Typography, Space } from "antd";
import {
  BulbOutlined,
  TeamOutlined,
  AuditOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

export default function TeacherDashboardPage() {
  return (
    <div style={{ maxWidth: 1400, margin: "0 auto" }}>
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ marginBottom: 4 }}>Tổng quan - Giảng viên</Title>
        <Text type="secondary">Chào mừng bạn đến với hệ thống quản lý khóa luận</Text>
      </div>

      {/* Quick Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} lg={6}>
          <Card >
            <Space direction="vertical" size={4}>
              <Space>
                <BulbOutlined style={{ fontSize: 20, color: "#2a5bc0" }} />
                <Text type="secondary">Đề tài hướng dẫn</Text>
              </Space>
              <Title level={2} style={{ margin: 0 }}>0</Title>
            </Space>
          </Card>
        </Col>
        <Col xs={12} lg={6}>
          <Card >
            <Space direction="vertical" size={4}>
              <Space>
                <TeamOutlined style={{ fontSize: 20, color: "#1dab60" }} />
                <Text type="secondary">SV đang hướng dẫn</Text>
              </Space>
              <Title level={2} style={{ margin: 0 }}>0</Title>
            </Space>
          </Card>
        </Col>
        <Col xs={12} lg={6}>
          <Card >
            <Space direction="vertical" size={4}>
              <Space>
                <AuditOutlined style={{ fontSize: 20, color: "#e89b33" }} />
                <Text type="secondary">Phản biện</Text>
              </Space>
              <Title level={2} style={{ margin: 0 }}>0</Title>
            </Space>
          </Card>
        </Col>
        <Col xs={12} lg={6}>
          <Card >
            <Space direction="vertical" size={4}>
              <Space>
                <CalendarOutlined style={{ fontSize: 20, color: "#40b8d4" }} />
                <Text type="secondary">Lịch bảo vệ</Text>
              </Space>
              <Title level={2} style={{ margin: 0 }}>0</Title>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity & Notifications */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="Hoạt động gần đây">
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <Text type="secondary">Chưa có hoạt động nào</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Thông báo">
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <Text type="secondary">Không có thông báo mới</Text>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
