"use client";

import React from "react";
import { Card, Typography, Row, Col, Button, Space, Tag } from "antd";
import {
  BookOutlined,
  TeamOutlined,
  TrophyOutlined,
  CalendarOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import Link from "next/link";

const { Title, Text, Paragraph } = Typography;

export default function MainPage() {
  const features = [
    {
      icon: <BookOutlined style={{ fontSize: 32, color: "#1677ff" }} />,
      title: "Quản lý đề tài",
      description: "Tạo, duyệt và theo dõi các đề tài khóa luận tốt nghiệp",
      link: "/thesis",
      color: "#e6f4ff",
    },
    {
      icon: <TeamOutlined style={{ fontSize: 32, color: "#52c41a" }} />,
      title: "Quản lý người dùng",
      description: "Quản lý tài khoản sinh viên, giảng viên và quản trị",
      link: "/user",
      color: "#f6ffed",
    },
    {
      icon: <CalendarOutlined style={{ fontSize: 32, color: "#faad14" }} />,
      title: "Quản lý học kỳ",
      description: "Thiết lập và quản lý các học kỳ, đợt bảo vệ",
      link: "/semester",
      color: "#fffbe6",
    },
    {
      icon: <TrophyOutlined style={{ fontSize: 32, color: "#722ed1" }} />,
      title: "Hội đồng bảo vệ",
      description: "Tổ chức và quản lý các hội đồng bảo vệ khóa luận",
      link: "/council",
      color: "#f9f0ff",
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      {/* Hero Section */}
      <Card
        style={{
          background: "linear-gradient(135deg, #1677ff 0%, #0958d9 100%)",
          border: "none",
          marginBottom: 24,
        }}
      >
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} md={16}>
            <Space direction="vertical" size="middle">
              <Title level={1} style={{ color: "#fff", margin: 0 }}>
                Hệ thống quản lý khóa luận TNUT
              </Title>
              <Paragraph style={{ color: "rgba(255,255,255,0.85)", fontSize: 16 }}>
                Hệ thống quản lý khóa luận tốt nghiệp dành cho sinh viên, giảng viên và ban quản trị.
                Theo dõi tiến độ, quản lý đề tài, tổ chức bảo vệ và chấm điểm.
              </Paragraph>
              <Space>
                <Link href="/dashboard">
                  <Button type="primary" size="large" ghost icon={<ArrowRightOutlined />}>
                    Đi đến Dashboard
                  </Button>
                </Link>
                <Link href="/thesis">
                  <Button size="large" ghost style={{ color: "#fff", borderColor: "#fff" }}>
                    Xem đề tài
                  </Button>
                </Link>
              </Space>
            </Space>
          </Col>
          <Col xs={24} md={8}>
            <div style={{ textAlign: "center", padding: "20px" }}>
              <BookOutlined style={{ fontSize: 120, color: "rgba(255,255,255,0.3)" }} />
            </div>
          </Col>
        </Row>
      </Card>

      {/* Stats Overview */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} md={6}>
          <Card>
            <div style={{ textAlign: "center" }}>
              <Title level={2} style={{ margin: 0, color: "#1677ff" }}>45</Title>
              <Text type="secondary">Đề tài</Text>
            </div>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card>
            <div style={{ textAlign: "center" }}>
              <Title level={2} style={{ margin: 0, color: "#52c41a" }}>120</Title>
              <Text type="secondary">Sinh viên</Text>
            </div>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card>
            <div style={{ textAlign: "center" }}>
              <Title level={2} style={{ margin: 0, color: "#faad14" }}>25</Title>
              <Text type="secondary">Giảng viên</Text>
            </div>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card>
            <div style={{ textAlign: "center" }}>
              <Title level={2} style={{ margin: 0, color: "#722ed1" }}>8</Title>
              <Text type="secondary">Hội đồng</Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Features */}
      <Title level={3} style={{ marginBottom: 16 }}>Chức năng chính</Title>
      <Row gutter={[16, 16]}>
        {features.map((feature, index) => (
          <Col key={index} xs={24} sm={12} lg={6}>
            <Link href={feature.link}>
              <Card
                hoverable
                style={{ height: "100%", backgroundColor: feature.color }}
              >
                <Space direction="vertical" size="middle" style={{ width: "100%", textAlign: "center" }}>
                  {feature.icon}
                  <div>
                    <Title level={5} style={{ margin: 0 }}>{feature.title}</Title>
                    <Text type="secondary">{feature.description}</Text>
                  </div>
                  <Tag color="blue" style={{ cursor: "pointer" }}>
                    Truy cập <ArrowRightOutlined />
                  </Tag>
                </Space>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>

      {/* Quick Links */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="Liên kết nhanh">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={8}>
                <Link href="/thesis/work">
                  <Button type="link" block icon={<BookOutlined />}>
                    Thực hiện khóa luận
                  </Button>
                </Link>
              </Col>
              <Col xs={24} md={8}>
                <Link href="/thesis/submission">
                  <Button type="link" block icon={<CalendarOutlined />}>
                    Nộp tài liệu
                  </Button>
                </Link>
              </Col>
              <Col xs={24} md={8}>
                <Link href="/thesis/result">
                  <Button type="link" block icon={<TrophyOutlined />}>
                    Xem kết quả
                  </Button>
                </Link>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
