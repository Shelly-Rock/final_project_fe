"use client";

import React from "react";
import { Row, Col, Card, Typography, Space, Progress } from "antd";
import {
  BookOutlined,
  FieldTimeOutlined,
  CheckCircleOutlined,
  TrophyOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

export default function AdminStatisticsPage() {
  return (
    <div style={{ maxWidth: 1400, margin: "0 auto" }}>
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ marginBottom: 4 }}>Thống kê hệ thống</Title>
        <Text type="secondary">Báo cáo và thống kê tổng quan</Text>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} lg={6}>
          <Card >
            <Space direction="vertical" size={4}>
              <Space>
                <BookOutlined style={{ fontSize: 20, color: "#2a5bc0" }} />
                <Text type="secondary">Tổng đề tài</Text>
              </Space>
              <Title level={2} style={{ margin: 0 }}>0</Title>
            </Space>
          </Card>
        </Col>
        <Col xs={12} lg={6}>
          <Card >
            <Space direction="vertical" size={4}>
              <Space>
                <FieldTimeOutlined style={{ fontSize: 20, color: "#e89b33" }} />
                <Text type="secondary">Đang thực hiện</Text>
              </Space>
              <Title level={2} style={{ margin: 0 }}>0</Title>
            </Space>
          </Card>
        </Col>
        <Col xs={12} lg={6}>
          <Card >
            <Space direction="vertical" size={4}>
              <Space>
                <CheckCircleOutlined style={{ fontSize: 20, color: "#1dab60" }} />
                <Text type="secondary">Hoàn thành</Text>
              </Space>
              <Title level={2} style={{ margin: 0 }}>0</Title>
            </Space>
          </Card>
        </Col>
        <Col xs={12} lg={6}>
          <Card >
            <Space direction="vertical" size={4}>
              <Space>
                <TrophyOutlined style={{ fontSize: 20, color: "#40b8d4" }} />
                <Text type="secondary">Điểm TB</Text>
              </Space>
              <Title level={2} style={{ margin: 0 }}>--</Title>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Phân bố theo ngành">
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <Progress type="circle" percent={0} />
              <div style={{ marginTop: 16 }}>
                <Text type="secondary">Biểu đồ sẽ hiển thị khi có dữ liệu</Text>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Tiến độ theo tháng">
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <Progress type="circle" percent={0} />
              <div style={{ marginTop: 16 }}>
                <Text type="secondary">Biểu đồ sẽ hiển thị khi có dữ liệu</Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
