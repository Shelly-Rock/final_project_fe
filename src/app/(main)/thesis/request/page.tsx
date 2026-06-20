"use client";

import React, { useState } from "react";
import { Card, Button, Typography, Row, Col, Table, Tag, Space, Modal, Form, Input, Select, Empty, message } from "antd";
import {
  PlusOutlined,
  EyeOutlined,
  FileTextOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

const { Title, Text } = Typography;

interface Request {
  id: number;
  type: "extend" | "complaint";
  title: string;
  content: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  response?: string;
}

const mockRequests: Request[] = [];

const statusConfig = {
  pending: { color: "gold", label: "Chờ xử lý" },
  approved: { color: "green", label: "Đã duyệt" },
  rejected: { color: "red", label: "Từ chối" },
};

const typeConfig = {
  extend: { color: "gold", label: "Gia hạn" },
  complaint: { color: "red", label: "Khiếu nại" },
};

export default function ThesisRequestPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [requestType, setRequestType] = useState<"extend" | "complaint">("extend");
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      message.success("Yêu cầu đã được gửi thành công!");
      setModalOpen(false);
      form.resetFields();
    });
  };

  const columns: ColumnsType<Request> = [
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      width: 120,
      render: (type) => {
        const config = typeConfig[type as keyof typeof typeConfig];
        return <Tag color={config.color} icon={type === "extend" ? <FileTextOutlined /> : <WarningOutlined />}>{config.label}</Tag>;
      },
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Ngày gửi",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => {
        const config = statusConfig[status as keyof typeof statusConfig];
        return <Tag color={config.color}>{config.label}</Tag>;
      },
    },
    {
      title: "",
      key: "action",
      width: 80,
      render: () => (
        <Button type="text" icon={<EyeOutlined />} />
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      {/* Page Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2} style={{ margin: 0 }}>Yêu cầu</Title>
          <Text type="secondary">Gửi yêu cầu gia hạn hoặc khiếu nại</Text>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
            Tạo yêu cầu mới
          </Button>
        </Col>
      </Row>

      {/* Request History */}
      <Card title="Lịch sử yêu cầu">
        {mockRequests.length === 0 ? (
          <Empty
            description="Chưa có yêu cầu nào"
            style={{ padding: "48px 0" }}
          />
        ) : (
          <Table
            columns={columns}
            dataSource={mockRequests}
            rowKey="id"
            pagination={false}
          />
        )}
      </Card>

      {/* Create Request Modal */}
      <Modal
        title={requestType === "extend" ? "Yêu cầu gia hạn" : "Khiếu nại"}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSubmit}
        okText="Gửi yêu cầu"
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ type: requestType }}
        >
          <Form.Item
            name="type"
            label="Loại yêu cầu"
          >
            <Select
              options={[
                { label: "Gia hạn", value: "extend" },
                { label: "Khiếu nại", value: "complaint" },
              ]}
              onChange={(value) => setRequestType(value)}
            />
          </Form.Item>
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
          >
            <Input placeholder="Nhập tiêu đề" />
          </Form.Item>
          <Form.Item
            name="content"
            label="Nội dung"
            rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
          >
            <Input.TextArea rows={5} placeholder="Mô tả chi tiết..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
