"use client";

import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  Typography,
  Tag,
  Button,
  Segmented,
  Space,
  Modal,
  Descriptions,
  Avatar,
  Empty,
} from "antd";

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
  {
    id: 3,
    title: "Hệ thống IoT cho nông nghiệp thông minh",
    description: "Thiết kế và triển khai hệ thống IoT giám sát môi trường trồng trọt",
    lecturer: "ThS. Lê Văn C",
    major: "Điện tử viễn thông",
    status: "pending",
    registeredCount: 2,
    maxStudents: 2,
  },
];

export default function StudentTopicPage() {
  const [theses] = useState<Thesis[]>(mockTheses);
  const [filter, setFilter] = useState<"all" | "available" | "pending" | "registered">("all");
  const [selectedThesis, setSelectedThesis] = useState<Thesis | null>(null);

  const filteredTheses = theses.filter((t) => {
    if (filter === "all") return true;
    return t.status === filter;
  });

  const getStatusTag = (status: Thesis["status"]) => {
    const colorMap: Record<string, string> = {
      available: "green",
      pending: "gold",
      registered: "cyan",
    };
    const textMap: Record<string, string> = {
      available: "Còn nhận",
      pending: "Chờ duyệt",
      registered: "Đã đăng ký",
    };
    return <Tag color={colorMap[status]}>{textMap[status]}</Tag>;
  };

  const filterOptions = [
    { label: "Tất cả", value: "all" },
    { label: "Còn nhận", value: "available" },
    { label: "Chờ duyệt", value: "pending" },
    { label: "Đã đăng ký", value: "registered" },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Row gutter={[0, 24]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Title level={2} style={{ marginBottom: 8 }}>Đăng ký đề tài</Title>
          <Text type="secondary">Danh sách đề tài khóa luận có sẵn</Text>
        </Col>
      </Row>

      {/* Filter Tabs */}
      <Row style={{ marginBottom: 24 }}>
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
        {filteredTheses.map((thesis) => (
          <Col key={thesis.id} xs={24} md={12} lg={8}>
            <Card style={{ height: "100%" }}>
              <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                <Space direction="horizontal" style={{ width: "100%", justifyContent: "space-between" }}>
                  <Tag>{thesis.major}</Tag>
                  {getStatusTag(thesis.status)}
                </Space>
                <Title level={5} style={{ marginBottom: 0 }}>{thesis.title}</Title>
                <Text type="secondary" style={{ fontSize: 12 }}>{thesis.description}</Text>
                <Space direction="horizontal" size="small">
                  <Text type="secondary" style={{ fontSize: 12 }}>👤 {thesis.lecturer}</Text>
                </Space>
                <Space direction="horizontal" size="small">
                  <Text type="secondary" style={{ fontSize: 12 }}>👥 {thesis.registeredCount} / {thesis.maxStudents} sinh viên</Text>
                </Space>
                <Space direction="vertical" style={{ width: "100%" }}>
                  {thesis.status === "available" && thesis.registeredCount < thesis.maxStudents && (
                    <Button
                      type="primary"
                      block
                      onClick={() => setSelectedThesis(thesis)}
                    >
                      Đăng ký
                    </Button>
                  )}
                  <Button
                    block
                    onClick={() => setSelectedThesis(thesis)}
                  >
                    Xem chi tiết
                  </Button>
                </Space>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      {filteredTheses.length === 0 && (
        <Card >
          <Empty description="Không có đề tài nào phù hợp" />
        </Card>
      )}

      {/* Modal */}
      <Modal
        title="Chi tiết đề tài"
        open={!!selectedThesis}
        onCancel={() => setSelectedThesis(null)}
        footer={[
          <Button key="close" onClick={() => setSelectedThesis(null)}>
            Đóng
          </Button>,
          selectedThesis?.status === "available" && selectedThesis.registeredCount < selectedThesis.maxStudents && (
            <Button key="register" type="primary">
              Đăng ký đề tài này
            </Button>
          ),
        ]}
      >
        {selectedThesis && (
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Title level={5}>{selectedThesis.title}</Title>
            <Text type="secondary">{selectedThesis.description}</Text>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Giảng viên">{selectedThesis.lecturer}</Descriptions.Item>
              <Descriptions.Item label="Ngành">{selectedThesis.major}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái">{getStatusTag(selectedThesis.status)}</Descriptions.Item>
              <Descriptions.Item label="Đăng ký">{selectedThesis.registeredCount}/{selectedThesis.maxStudents}</Descriptions.Item>
            </Descriptions>
          </Space>
        )}
      </Modal>
    </div>
  );
}
