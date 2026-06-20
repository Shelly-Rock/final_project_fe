"use client";

import React from "react";
import { Row, Col, Card, Typography, Space, Progress, Empty } from "antd";

const { Title, Text } = Typography;

export default function StudentDashboardPage() {
  return (
    <div style={{ padding: "24px" }}>
      <Row gutter={[0, 24]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Title level={2} style={{ marginBottom: 8 }}>Tổng quan - Sinh viên</Title>
          <Text type="secondary">Chào mừng bạn đến với hệ thống quản lý khóa luận</Text>
        </Col>
      </Row>

      {/* Quick Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ height: "100%" }}>
            <Space direction="horizontal" size="middle" style={{ width: "100%" }}>
              <div style={{ background: "#e6f7ff", borderRadius: 8, padding: 12 }}>
                <Text type="secondary" style={{ fontSize: 24 }}>📚</Text>
              </div>
              <div>
                <Text type="secondary" style={{ display: "block", fontSize: 12 }}>Đề tài của tôi</Text>
                <Title level={4} style={{ marginBottom: 0 }}>Chưa đăng ký</Title>
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card style={{ height: "100%" }}>
            <Space direction="horizontal" size="middle" style={{ width: "100%" }}>
              <div style={{ background: "#f6ffed", borderRadius: 8, padding: 12 }}>
                <Text type="secondary" style={{ fontSize: 24 }}>📋</Text>
              </div>
              <div>
                <Text type="secondary" style={{ display: "block", fontSize: 12 }}>Milestone</Text>
                <Title level={4} style={{ marginBottom: 0 }}>0 / 0</Title>
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card style={{ height: "100%" }}>
            <Space direction="horizontal" size="middle" style={{ width: "100%" }}>
              <div style={{ background: "#fff7e6", borderRadius: 8, padding: 12 }}>
                <Text type="secondary" style={{ fontSize: 24 }}>📅</Text>
              </div>
              <div>
                <Text type="secondary" style={{ display: "block", fontSize: 12 }}>Báo cáo tuần</Text>
                <Title level={4} style={{ marginBottom: 0 }}>0 báo cáo</Title>
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card style={{ height: "100%" }}>
            <Space direction="horizontal" size="middle" style={{ width: "100%" }}>
              <div style={{ background: "#e6f7ff", borderRadius: 8, padding: 12 }}>
                <Text type="secondary" style={{ fontSize: 24 }}>🏆</Text>
              </div>
              <div>
                <Text type="secondary" style={{ display: "block", fontSize: 12 }}>Điểm hiện tại</Text>
                <Title level={4} style={{ marginBottom: 0 }}>--</Title>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card >
            <Title level={5} style={{ marginBottom: 0 }}>Hoạt động gần đây</Title>
          </Card>
          <Card style={{ marginTop: 16 }}>
            <Empty description="Chưa có hoạt động nào" />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card >
            <Title level={5} style={{ marginBottom: 0 }}>Thông báo</Title>
          </Card>
          <Card style={{ marginTop: 16 }}>
            <Empty description="Không có thông báo mới" />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
