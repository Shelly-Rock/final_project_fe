"use client";

import React from "react";
import { Card, Button, Typography, Row, Col, Avatar, Empty, Tag, Space } from "antd";
import {
  FileWordOutlined,
  CodeOutlined,
  FilePptOutlined,
  UploadOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

interface DocumentItem {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const documents: DocumentItem[] = [
  {
    id: 1,
    title: "Báo cáo khóa luận",
    description: "File Word/PDF, dung lượng tối đa 50MB",
    icon: <FileWordOutlined style={{ fontSize: 24 }} />,
    color: "#1677ff",
  },
  {
    id: 2,
    title: "Mã nguồn",
    description: "Nén thành file ZIP, bao gồm README",
    icon: <CodeOutlined style={{ fontSize: 24 }} />,
    color: "#52c41a",
  },
  {
    id: 3,
    title: "Bài trình bày",
    description: "File PowerPoint, tối đa 20 slides",
    icon: <FilePptOutlined style={{ fontSize: 24 }} />,
    color: "#ff4d4f",
  },
];

export default function ThesisSubmissionPage() {
  return (
    <div style={{ padding: "24px" }}>
      {/* Page Header */}
      <Title level={2} style={{ marginBottom: 8 }}>Nộp tài liệu</Title>
      <Text type="secondary">Nộp bài và tài liệu khóa luận</Text>

      {/* Submission Content */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        {/* Document List */}
        <Col xs={24} lg={16}>
          <Card title="Danh sách tài liệu cần nộp">
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              {documents.map((item) => (
                <div key={item.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Space direction="horizontal" size="middle">
                    <Avatar
                      style={{ backgroundColor: item.color, verticalAlign: "middle" }}
                      size="large"
                    >
                      {item.icon}
                    </Avatar>
                    <Space direction="vertical" size={0}>
                      <Text strong>{item.title}</Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>{item.description}</Text>
                    </Space>
                  </Space>
                  <Button type="primary" ghost icon={<UploadOutlined />}>
                    Tải lên
                  </Button>
                </div>
              ))}
            </Space>
          </Card>
        </Col>

        {/* Submission Status */}
        <Col xs={24} lg={8}>
          <Card title="Trạng thái nộp">
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <Avatar
                size={80}
                style={{ backgroundColor: "#fff7e6", marginBottom: 16, display: "inline-flex" }}
                icon={<ClockCircleOutlined style={{ fontSize: 40, color: "#faad14" }} />}
              />
              <br />
              <Tag color="warning" style={{ marginBottom: 8 }}>Đang chờ nộp</Tag>
              <br />
              <Text type="secondary">Hạn nộp: 15/05/2024</Text>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
