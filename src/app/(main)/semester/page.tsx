"use client";

import React, { useState } from "react";
import { Card, Button, Typography, Row, Col, Table, Tag, Space, Modal, Form, Input, DatePicker, Empty, Tooltip } from "antd";
import {
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import type { ColumnsType } from "antd/es/table";

const { Title, Text } = Typography;

interface Semester {
  id: number;
  code: string;
  name: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  defenseDate?: string;
  status: "active" | "in_progress" | "completed" | "archived";
}

const mockSemesters: Semester[] = [
  {
    id: 1,
    code: "2024-2025-HK1",
    name: "Học kỳ 1 - 2024-2025",
    startDate: "2024-09-01",
    endDate: "2025-01-15",
    registrationDeadline: "2024-09-30",
    defenseDate: "2025-01-10",
    status: "completed",
  },
  {
    id: 2,
    code: "2024-2025-HK2",
    name: "Học kỳ 2 - 2024-2025",
    startDate: "2025-02-01",
    endDate: "2025-06-15",
    registrationDeadline: "2025-02-28",
    defenseDate: "2025-06-10",
    status: "in_progress",
  },
  {
    id: 3,
    code: "2025-2026-HK1",
    name: "Học kỳ 1 - 2025-2026",
    startDate: "2025-09-01",
    endDate: "2026-01-15",
    registrationDeadline: "2025-09-30",
    status: "active",
  },
];

const statusConfig = {
  active: { color: "blue", label: "Hoạt động" },
  in_progress: { color: "orange", label: "Đang thực hiện" },
  completed: { color: "green", label: "Hoàn thành" },
  archived: { color: "default", label: "Đã lưu trữ" },
};

export default function SemesterListPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  const activeSemesters = mockSemesters.filter((s) => s.status !== "archived");
  const completedCount = mockSemesters.filter((s) => s.status === "completed").length;
  const inProgressCount = mockSemesters.filter((s) => s.status === "in_progress").length;

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      console.log("Submit:", values);
      setModalOpen(false);
      form.resetFields();
    });
  };

  const columns: ColumnsType<Semester> = [
    {
      title: "Mã học kỳ",
      dataIndex: "code",
      key: "code",
      width: 150,
      render: (code) => <Tag variant="outlined">{code}</Tag>,
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      render: (name) => <Text strong>{name}</Text>,
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      width: 130,
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      key: "endDate",
      width: 130,
    },
    {
      title: "Hạn đăng ký",
      dataIndex: "registrationDeadline",
      key: "registrationDeadline",
      width: 130,
    },
    {
      title: "Ngày bảo vệ",
      dataIndex: "defenseDate",
      key: "defenseDate",
      width: 130,
      render: (date) => date || "-",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 130,
      render: (status) => {
        const config = statusConfig[status as keyof typeof statusConfig];
        return <Tag color={config.color}>{config.label}</Tag>;
      },
    },
    {
      title: "",
      key: "action",
      width: 100,
      align: "center",
      render: () => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button type="text" size="small" icon={<EyeOutlined />} />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button type="text" size="small" icon={<EditOutlined />} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      {/* Page Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2} style={{ margin: 0 }}>Quản lý học kỳ</Title>
          <Text type="secondary">Quản lý các học kỳ và đợt khóa luận tốt nghiệp</Text>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
            Thêm học kỳ
          </Button>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} md={8}>
          <Card>
            <Title level={2} style={{ margin: 0 }}>{activeSemesters.length}</Title>
            <Text type="secondary">Tổng học kỳ</Text>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Title level={2} style={{ margin: 0, color: "#fa8c16" }}>{inProgressCount}</Title>
            <Text type="secondary">Đang thực hiện</Text>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Title level={2} style={{ margin: 0, color: "#52c41a" }}>{completedCount}</Title>
            <Text type="secondary">Hoàn thành</Text>
          </Card>
        </Col>
      </Row>

      {/* Semester Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={mockSemesters}
          rowKey="id"
          pagination={false}
        />
      </Card>

      {/* Create Semester Modal */}
      <Modal
        title="Thêm học kỳ mới"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSubmit}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="code"
            label="Mã học kỳ"
            rules={[{ required: true, message: "Vui lòng nhập mã học kỳ" }]}
          >
            <Input placeholder="VD: 2025-2026-HK1" />
          </Form.Item>
          <Form.Item
            name="name"
            label="Tên học kỳ"
            rules={[{ required: true, message: "Vui lòng nhập tên học kỳ" }]}
          >
            <Input placeholder="VD: Học kỳ 1 - 2025-2026" />
          </Form.Item>
          <Form.Item
            name="startDate"
            label="Ngày bắt đầu"
            rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu" }]}
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item
            name="endDate"
            label="Ngày kết thúc"
            rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc" }]}
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item
            name="registrationDeadline"
            label="Hạn đăng ký"
            rules={[{ required: true, message: "Vui lòng chọn hạn đăng ký" }]}
          >
            <Input type="date" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
