"use client";

import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  Typography,
  Tag,
  Button,
  Table,
  Segmented,
  Modal,
  Form,
  Input,
  DatePicker,
  Space,
  Empty,
} from "antd";
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

export default function StudentRequestPage() {
  const [requests] = useState<Request[]>(mockRequests);
  const [showModal, setShowModal] = useState(false);
  const [requestType, setRequestType] = useState<"extend" | "complaint">("extend");
  const [form] = Form.useForm();

  const getStatusTag = (status: Request["status"]) => {
    const colorMap: Record<string, string> = {
      pending: "gold",
      approved: "green",
      rejected: "red",
    };
    const textMap: Record<string, string> = {
      pending: "Chờ xử lý",
      approved: "Đã duyệt",
      rejected: "Từ chối",
    };
    return <Tag color={colorMap[status]}>{textMap[status]}</Tag>;
  };

  const getTypeTag = (type: Request["type"]) => {
    return type === "extend" ? (
      <Tag color="gold">Gia hạn</Tag>
    ) : (
      <Tag color="red">Khiếu nại</Tag>
    );
  };

  const columns: ColumnsType<Request> = [
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      render: (type: Request["type"]) => getTypeTag(type),
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
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: Request["status"]) => getStatusTag(status),
    },
    {
      title: "",
      key: "action",
      render: () => (
        <Button type="link" size="small">
          Xem
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Row gutter={[0, 24]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Space direction="vertical" size={0} style={{ width: "100%" }}>
            <Space direction="horizontal" style={{ width: "100%", justifyContent: "space-between" }}>
              <Space direction="vertical" size={0}>
                <Title level={2} style={{ marginBottom: 8 }}>Yêu cầu</Title>
                <Text type="secondary">Gửi yêu cầu gia hạn hoặc khiếu nại</Text>
              </Space>
              <Button
                type="primary"
                icon="+"
                onClick={() => setShowModal(true)}
              >
                Tạo yêu cầu mới
              </Button>
            </Space>
          </Space>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={12}>
          <Card
            style={{ cursor: "pointer", height: "100%" }}
            onClick={() => {
              setRequestType("extend");
              setShowModal(true);
            }}
          >
            <Space direction="horizontal" size="middle">
              <div style={{ background: "#fff7e6", borderRadius: 8, padding: 12 }}>
                <Text style={{ fontSize: 24 }}>⏰</Text>
              </div>
              <Space direction="vertical" size={0}>
                <Text strong>Yêu cầu gia hạn</Text>
                <Text type="secondary" style={{ fontSize: 12 }}>Gửi yêu cầu gia hạn deadline</Text>
              </Space>
            </Space>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card
            style={{ cursor: "pointer", height: "100%" }}
            onClick={() => {
              setRequestType("complaint");
              setShowModal(true);
            }}
          >
            <Space direction="horizontal" size="middle">
              <div style={{ background: "#fff1f0", borderRadius: 8, padding: 12 }}>
                <Text style={{ fontSize: 24 }}>⚠️</Text>
              </div>
              <Space direction="vertical" size={0}>
                <Text strong>Khiếu nại</Text>
                <Text type="secondary" style={{ fontSize: 12 }}>Phản ánh vấn đề về điểm số</Text>
              </Space>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Request History */}
      <Row>
        <Col span={24}>
          <Card >
            <Title level={5} style={{ marginBottom: 16 }}>Lịch sử yêu cầu</Title>
            {requests.length === 0 ? (
              <Empty description="Chưa có yêu cầu nào" />
            ) : (
              <Table
                columns={columns}
                dataSource={requests}
                rowKey="id"
                pagination={false}
              />
            )}
          </Card>
        </Col>
      </Row>

      {/* Modal */}
      <Modal
        title={requestType === "extend" ? "Yêu cầu gia hạn" : "Khiếu nại"}
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={[
          <Button key="cancel" onClick={() => setShowModal(false)}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={() => setShowModal(false)}>
            Gửi yêu cầu
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Tiêu đề" name="title">
            <Input placeholder="Nhập tiêu đề" />
          </Form.Item>
          <Form.Item label="Nội dung" name="content">
            <Input.TextArea rows={5} placeholder="Mô tả chi tiết..." />
          </Form.Item>
          {requestType === "extend" && (
            <Form.Item label="Ngày muốn gia hạn đến" name="extendDate">
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
}
