"use client";

import React, { useState } from "react";
import { Card, Typography, Row, Col, Table, Tag, Button, Space, Input, Segmented, Empty, Avatar, Modal, Form, Select, InputNumber } from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  BookOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

const { Title, Text } = Typography;

interface Registration {
  id: number;
  studentName: string;
  studentCode: string;
  topicName: string;
  lecturer: string;
  registeredAt: string;
  status: "pending" | "approved" | "rejected";
}

const mockRegistrations: Registration[] = [
  { id: 1, studentName: "Nguyễn Văn A", studentCode: "SV001", topicName: "Xây dựng app quản lý thư viện", lecturer: "TS. Nguyễn Văn X", registeredAt: "2024-05-01", status: "approved" },
  { id: 2, studentName: "Trần Thị B", studentCode: "SV002", topicName: "Ứng dụng AI trong y tế", lecturer: "PGS.TS. Trần Thị Y", registeredAt: "2024-05-02", status: "pending" },
  { id: 3, studentName: "Lê Văn C", studentCode: "SV003", topicName: "Hệ thống IoT smart home", lecturer: "TS. Hoàng Văn Z", registeredAt: "2024-05-03", status: "pending" },
  { id: 4, studentName: "Phạm Thị D", studentCode: "SV004", topicName: "Blockchain trong logistics", lecturer: "TS. Phạm Thị W", registeredAt: "2024-05-04", status: "rejected" },
  { id: 5, studentName: "Hoàng Văn E", studentCode: "SV005", topicName: "ML trong phát hiện gian lận", lecturer: "ThS. Lê Văn V", registeredAt: "2024-05-05", status: "approved" },
];

const statusConfig = {
  pending: { color: "gold", label: "Chờ duyệt", icon: <ClockCircleOutlined /> },
  approved: { color: "green", label: "Đã duyệt", icon: <CheckCircleOutlined /> },
  rejected: { color: "red", label: "Từ chối", icon: <CloseCircleOutlined /> },
};

export default function ThesisRegistrationPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  const filteredRegistrations = mockRegistrations.filter((r) => {
    const matchesSearch =
      r.studentName.toLowerCase().includes(search.toLowerCase()) ||
      r.studentCode.toLowerCase().includes(search.toLowerCase()) ||
      r.topicName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: mockRegistrations.length,
    pending: mockRegistrations.filter((r) => r.status === "pending").length,
    approved: mockRegistrations.filter((r) => r.status === "approved").length,
    rejected: mockRegistrations.filter((r) => r.status === "rejected").length,
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      console.log("Submit:", values);
      setModalOpen(false);
      form.resetFields();
    });
  };

  const columns: ColumnsType<Registration> = [
    {
      title: "Sinh viên",
      key: "student",
      render: (_, record) => (
        <Space>
          <Avatar style={{ backgroundColor: "#1677ff" }}>
            {record.studentName.charAt(0)}
          </Avatar>
          <Space direction="vertical" size={0}>
            <Text strong>{record.studentName}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>{record.studentCode}</Text>
          </Space>
        </Space>
      ),
    },
    {
      title: "Đề tài",
      dataIndex: "topicName",
      key: "topicName",
      render: (topic) => (
        <Space>
          <BookOutlined style={{ color: "#999" }} />
          <Text>{topic}</Text>
        </Space>
      ),
    },
    {
      title: "GV hướng dẫn",
      dataIndex: "lecturer",
      key: "lecturer",
      width: 180,
      render: (lecturer) => (
        <Space>
          <UserOutlined style={{ color: "#999" }} />
          <Text>{lecturer}</Text>
        </Space>
      ),
    },
    {
      title: "Ngày đăng ký",
      dataIndex: "registeredAt",
      key: "registeredAt",
      width: 130,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => {
        const config = statusConfig[status as keyof typeof statusConfig];
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.label}
          </Tag>
        );
      },
    },
    {
      title: "",
      key: "action",
      width: 80,
      render: () => (
        <Button type="text" size="small" icon={<EyeOutlined />} />
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      {/* Page Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2} style={{ margin: 0 }}>Đăng ký đề tài</Title>
          <Text type="secondary">Quản lý đăng ký đề tài khóa luận của sinh viên</Text>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
            Thêm đăng ký
          </Button>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} md={6}>
          <Card>
            <div style={{ textAlign: "center" }}>
              <Title level={2} style={{ margin: 0, color: "#1677ff" }}>{stats.total}</Title>
              <Text type="secondary">Tổng đăng ký</Text>
            </div>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card>
            <div style={{ textAlign: "center" }}>
              <Title level={2} style={{ margin: 0, color: "#faad14" }}>{stats.pending}</Title>
              <Text type="secondary">Chờ duyệt</Text>
            </div>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card>
            <div style={{ textAlign: "center" }}>
              <Title level={2} style={{ margin: 0, color: "#52c41a" }}>{stats.approved}</Title>
              <Text type="secondary">Đã duyệt</Text>
            </div>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card>
            <div style={{ textAlign: "center" }}>
              <Title level={2} style={{ margin: 0, color: "#ff4d4f" }}>{stats.rejected}</Title>
              <Text type="secondary">Từ chối</Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Filter Segmented */}
      <Row style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Segmented
            options={[
              { label: `Tất cả (${stats.total})`, value: "all" },
              { label: `Chờ duyệt (${stats.pending})`, value: "pending" },
              { label: `Đã duyệt (${stats.approved})`, value: "approved" },
              { label: `Từ chối (${stats.rejected})`, value: "rejected" },
            ]}
            value={statusFilter}
            onChange={(value) => setStatusFilter(value as typeof statusFilter)}
          />
        </Col>
      </Row>

      {/* Search */}
      <Row style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Input
            placeholder="Tìm kiếm sinh viên, mã SV, đề tài..."
            prefix={<SearchOutlined style={{ color: "#999" }} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 300 }}
          />
        </Col>
      </Row>

      {/* Registrations Table */}
      <Card>
        {filteredRegistrations.length === 0 ? (
          <Empty description="Không có đăng ký nào" />
        ) : (
          <Table
            columns={columns}
            dataSource={filteredRegistrations}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        )}
      </Card>

      {/* Create Registration Modal */}
      <Modal
        title="Thêm đăng ký đề tài"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSubmit}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="student"
            label="Sinh viên"
            rules={[{ required: true, message: "Vui lòng chọn sinh viên" }]}
          >
            <Select placeholder="Chọn sinh viên">
              {mockRegistrations.map((r) => (
                <Select.Option key={r.id} value={r.id}>
                  {r.studentName} ({r.studentCode})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="topic"
            label="Đề tài"
            rules={[{ required: true, message: "Vui lòng chọn đề tài" }]}
          >
            <Select placeholder="Chọn đề tài">
              {mockRegistrations.map((r) => (
                <Select.Option key={r.id} value={r.id}>
                  {r.topicName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Select.Option value="pending">Chờ duyệt</Select.Option>
              <Select.Option value="approved">Đã duyệt</Select.Option>
              <Select.Option value="rejected">Từ chối</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
