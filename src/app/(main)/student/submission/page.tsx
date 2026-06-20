"use client";

import React from "react";
import { Row, Col, Card, Typography, Button, Avatar, Space, Empty } from "antd";

const { Title, Text } = Typography;

export default function StudentSubmissionPage() {
  const documents = [
    {
      icon: "📄",
      title: "Báo cáo khóa luận",
      description: "File Word/PDF, dung lượng tối đa 50MB",
      color: "#1890ff",
      bg: "#e6f7ff",
    },
    {
      icon: "💻",
      title: "Mã nguồn",
      description: "Nén thành file ZIP, bao gồm README",
      color: "#52c41a",
      bg: "#f6ffed",
    },
    {
      icon: "📊",
      title: "Bài trình bày",
      description: "File PowerPoint, tối đa 20 slides",
      color: "#ff4d4f",
      bg: "#fff1f0",
    },
    {
      icon: "📋",
      title: "Tài liệu phụ lục",
      description: "Các tài liệu bổ sung khác (nếu có)",
      color: "#faad14",
      bg: "#fff7e6",
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Row gutter={[0, 24]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Title level={2} style={{ marginBottom: 8 }}>Nộp tài liệu</Title>
          <Text type="secondary">Nộp bài và tài liệu khóa luận</Text>
        </Col>
      </Row>

      {/* Submission Checklist */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card style={{ marginBottom: 16 }}>
            <Title level={5} style={{ marginBottom: 0 }}>Danh sách tài liệu cần nộp</Title>
          </Card>
          <Card >
            {documents.map((doc, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px 0",
                  borderBottom: index < documents.length - 1 ? "1px solid #f0f0f0" : "none",
                }}
              >
                <Space direction="horizontal" size="middle">
                  <Avatar
                    style={{ background: doc.bg, color: doc.color }}
                    size={40}
                  >
                    <Text style={{ fontSize: 18 }}>{doc.icon}</Text>
                  </Avatar>
                  <Space direction="vertical" size={0}>
                    <Text strong>{doc.title}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>{doc.description}</Text>
                  </Space>
                </Space>
                <Button type="primary" ghost size="small">
                  Tải lên
                </Button>
              </div>
            ))}
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          {/* Submission Status */}
          <Card style={{ marginBottom: 16 }}>
            <Title level={5} style={{ marginBottom: 0 }}>Trạng thái nộp</Title>
          </Card>
          <Card style={{ marginBottom: 16, textAlign: "center" }}>
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <Avatar
                size={80}
                style={{ background: "#fff7e6", color: "#faad14", display: "inline-flex" }}
              >
                <Text style={{ fontSize: 36 }}>⏰</Text>
              </Avatar>
              <Title level={5} style={{ marginBottom: 0 }}>Đang chờ nộp</Title>
              <Text type="secondary">Hạn nộp: 15/05/2024</Text>
              <Text type="secondary" style={{ fontSize: 12 }}>Còn 30 ngày</Text>
            </Space>
          </Card>

          {/* Submitted Files */}
          <Card >
            <Title level={5} style={{ marginBottom: 0 }}>Đã nộp</Title>
          </Card>
          <Card style={{ marginTop: 16 }}>
            <Empty description="Chưa có tài liệu nào được nộp" />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
