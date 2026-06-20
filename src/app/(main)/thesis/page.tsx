"use client";

import React, { useState } from "react";
import { Card, Button, Typography, Row, Col, Tag, Segmented, Empty, Space } from "antd";
import {
  BookOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  TeamOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

interface Thesis {
  id: number;
  title: string;
  description: string;
  lecturer: string;
  major: string;
  status: "available" | "pending" | "registered";
  registeredCount: number;
  maxStudents: number;
}

const mockTheses: Thesis[] = [
  {
    id: 1,
    title: "Xây dựng hệ thống quản lý thư viện sử dụng React và Node.js",
    description: "Nghiên cứu và xây dựng ứng dụng quản lý thư viện với React, Node.js và MongoDB",
    lecturer: "TS. Nguyễn Văn A",
    major: "Công nghệ thông tin",
    status: "available",
    registeredCount: 0,
    maxStudents: 2,
  },
  {
    id: 2,
    title: "Ứng dụng AI trong nhận diện hình ảnh y tế",
    description: "Phát triển mô hình deep learning để hỗ trợ chẩn đoán hình ảnh y tế",
    lecturer: "PGS.TS. Trần Thị B",
    major: "Khoa học máy tính",
    status: "available",
    registeredCount: 1,
    maxStudents: 2,
  },
];

const statusConfig = {
  available: { color: "green", label: "Còn nhận", icon: <CheckCircleOutlined /> },
  pending: { color: "gold", label: "Chờ duyệt", icon: <ClockCircleOutlined /> },
  registered: { color: "blue", label: "Đã đăng ký", icon: <FileTextOutlined /> },
};

export default function ThesisListPage() {
  const [filter, setFilter] = useState<"all" | "available" | "pending" | "registered">("all");

  const filteredTheses = mockTheses.filter((t) => {
    if (filter === "all") return true;
    return t.status === filter;
  });

  const filterOptions = [
    { label: "Tất cả", value: "all" },
    { label: "Còn nhận", value: "available" },
    { label: "Chờ duyệt", value: "pending" },
    { label: "Đã đăng ký", value: "registered" },
  ];

  return (
    <div style={{ padding: "24px" }}>
      {/* Page Header */}
      <Title level={2} style={{ marginBottom: 8 }}>Danh sách đề tài</Title>
      <Text type="secondary">Xem và đăng ký đề tài khóa luận</Text>

      {/* Filter Segmented */}
      <Row style={{ marginTop: 24, marginBottom: 24 }}>
        <Col span={24}>
          <Segmented
            options={filterOptions}
            value={filter}
            onChange={(value) => setFilter(value as typeof filter)}
          />
        </Col>
      </Row>

      {/* Thesis List */}
      <Row gutter={[16, 16]}>
        {filteredTheses.map((thesis) => {
          const status = statusConfig[thesis.status];
          return (
            <Col key={thesis.id} xs={24} md={12} lg={8}>
              <Card
                hoverable
                style={{ height: "100%" }}
                cover={
                  <div style={{ padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Tag color="default">{thesis.major}</Tag>
                    <Tag icon={status.icon} color={status.color}>{status.label}</Tag>
                  </div>
                }
              >
                <Space direction="vertical" size="small" style={{ width: "100%" }}>
                  <Title level={5} style={{ margin: 0 }}>{thesis.title}</Title>
                  <Text type="secondary" ellipsis={{ tooltip: thesis.description }}>{thesis.description}</Text>
                  <Space>
                    <TeamOutlined style={{ color: "#999" }} />
                    <Text type="secondary">{thesis.lecturer}</Text>
                  </Space>
                  <Space>
                    <BookOutlined style={{ color: "#999" }} />
                    <Text type="secondary">{thesis.registeredCount} / {thesis.maxStudents} sinh viên</Text>
                  </Space>
                </Space>
              </Card>
            </Col>
          );
        })}
      </Row>

      {filteredTheses.length === 0 && (
        <Empty
          description="Không có đề tài nào"
          style={{ marginTop: 48 }}
        />
      )}
    </div>
  );
}
