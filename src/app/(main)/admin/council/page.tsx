"use client";

import React, { useState } from "react";
import { Row, Col, Card, Button, Typography, Space, Tag, Avatar, Modal, Form, Input, Select, DatePicker, message } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  TeamOutlined,
  BookOutlined,
  UserOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

interface Council {
  id: number;
  name: string;
  major: string;
  members: string[];
  thesisCount: number;
  defenseDate?: string;
  status: "pending" | "active" | "completed";
}

const mockCouncils: Council[] = [
  {
    id: 1,
    name: "Hội đồng 1 - CNTT",
    major: "Công nghệ thông tin",
    members: ["TS. Nguyễn Văn A", "TS. Trần Thị B", "ThS. Lê Văn C"],
    thesisCount: 10,
    defenseDate: "2026-06-15",
    status: "active",
  },
  {
    id: 2,
    name: "Hội đồng 2 - KHMT",
    major: "Khoa học máy tính",
    members: ["PGS.TS. Phạm Văn D", "TS. Hoàng Thị E"],
    thesisCount: 8,
    status: "pending",
  },
];

const majorOptions = [
  { value: "Công nghệ thông tin", label: "Công nghệ thông tin" },
  { value: "Khoa học máy tính", label: "Khoa học máy tính" },
  { value: "Hệ thống thông tin", label: "Hệ thống thông tin" },
  { value: "Mạng máy tính", label: "Mạng máy tính" },
];

const teacherOptions = [
  { value: "TS. Nguyễn Văn A", label: "TS. Nguyễn Văn A" },
  { value: "TS. Trần Thị B", label: "TS. Trần Thị B" },
  { value: "ThS. Lê Văn C", label: "ThS. Lê Văn C" },
  { value: "PGS.TS. Phạm Văn D", label: "PGS.TS. Phạm Văn D" },
  { value: "TS. Hoàng Thị E", label: "TS. Hoàng Thị E" },
  { value: "ThS. Đặng Văn F", label: "ThS. Đặng Văn F" },
];

const getStatusTag = (status: Council["status"]) => {
  const map: Record<Council["status"], { color: string; label: string }> = {
    pending: { color: "gold", label: "Chờ" },
    active: { color: "success", label: "Hoạt động" },
    completed: { color: "blue", label: "Hoàn thành" },
  };
  return map[status];
};

export default function AdminCouncilPage() {
  const [councils, setCouncils] = useState<Council[]>(mockCouncils);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCouncil, setEditingCouncil] = useState<Council | null>(null);
  const [form] = Form.useForm();

  const handleCreateCouncil = () => {
    setEditingCouncil(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEditCouncil = (council: Council) => {
    setEditingCouncil(council);
    form.setFieldsValue({
      ...council,
      defenseDate: council.defenseDate ? council.defenseDate : undefined,
    });
    setIsModalOpen(true);
  };

  const handleDeleteCouncil = (id: number) => {
    Modal.confirm({
      title: "Xóa hội đồng",
      content: "Bạn có chắc chắn muốn xóa hội đồng này không?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        setCouncils(councils.filter((c) => c.id !== id));
        message.success("Đã xóa hội đồng");
      },
    });
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      const councilData = {
        name: values.name,
        major: values.major,
        members: values.members || [],
        defenseDate: values.defenseDate?.format("YYYY-MM-DD"),
        thesisCount: editingCouncil?.thesisCount || 0,
        status: "pending" as const,
      };

      if (editingCouncil) {
        setCouncils(
          councils.map((c) =>
            c.id === editingCouncil.id ? { ...c, ...councilData } : c
          )
        );
        message.success("Cập nhật hội đồng thành công");
      } else {
        const newCouncil: Council = {
          id: Math.max(...councils.map((c) => c.id)) + 1,
          ...councilData,
        };
        setCouncils([...councils, newCouncil]);
        message.success("Tạo hội đồng mới thành công");
      }
      setIsModalOpen(false);
      form.resetFields();
    });
  };

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto" }}>
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <Title level={2} style={{ marginBottom: 4 }}>Quản lý hội đồng</Title>
            <Text type="secondary">Tạo và quản lý hội đồng bảo vệ</Text>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateCouncil}>
            Tạo hội đồng
          </Button>
        </div>
      </div>

      {/* Council Grid */}
      <Row gutter={[16, 16]}>
        {councils.map((council) => {
          const statusTag = getStatusTag(council.status);
          return (
            <Col xs={24} sm={12} lg={8} key={council.id}>
              <Card
                style={{ height: "100%" }}
                actions={[
                  <Button key="edit" type="text" icon={<EditOutlined />} onClick={() => handleEditCouncil(council)}>Sửa</Button>,
                  <Button key="view" type="text" icon={<EyeOutlined />}>Xem</Button>,
                  <Button key="delete" type="text" danger icon={<DeleteOutlined />} onClick={() => handleDeleteCouncil(council.id)}>Xóa</Button>,
                ]}
              >
                <Card.Meta
                  title={
                    <Space orientation="vertical" size={4}>
                      <Space>
                        <Text strong>{council.name}</Text>
                        <Tag color={statusTag.color}>{statusTag.label}</Tag>
                      </Space>
                      <Text type="secondary" style={{ fontSize: 12 }}>{council.major}</Text>
                    </Space>
                  }
                  description={
                    <div style={{ marginTop: 16 }}>
                      <div style={{ marginBottom: 12 }}>
                        <Text type="secondary" style={{ display: "block", marginBottom: 8 }}>
                          <TeamOutlined /> Thành viên:
                        </Text>
                        {council.members.map((member, idx) => (
                          <div key={idx} style={{ paddingLeft: 16, fontSize: 13 }}>
                            <Avatar size="small" icon={<UserOutlined />} style={{ marginRight: 8, background: "#1e3a5f" }} />
                            {member}
                          </div>
                        ))}
                      </div>
                      <Space wrap>
                        <Tag icon={<BookOutlined />}>{council.thesisCount} đề tài</Tag>
                        {council.defenseDate && (
                          <Tag color="blue">{council.defenseDate}</Tag>
                        )}
                      </Space>
                    </div>
                  }
                />
              </Card>
            </Col>
          );
        })}
      </Row>

      {councils.length === 0 && (
        <Card >
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <TeamOutlined style={{ fontSize: 48, color: "#d1d5db", marginBottom: 16 }} />
            <div>
              <Text type="secondary">Chưa có hội đồng nào</Text>
            </div>
          </div>
        </Card>
      )}

      {/* Create/Edit Modal */}
      <Modal
        title={editingCouncil ? "Chỉnh sửa hội đồng" : "Tạo hội đồng mới"}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        okText={editingCouncil ? "Cập nhật" : "Tạo mới"}
        cancelText="Hủy"
        width={560}
      >
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: 24 }}
        >
          <Form.Item
            name="name"
            label="Tên hội đồng"
            rules={[{ required: true, message: "Vui lòng nhập tên hội đồng" }]}
          >
            <Input placeholder="Ví dụ: Hội đồng 1 - CNTT" />
          </Form.Item>

          <Form.Item
            name="major"
            label="Chuyên ngành"
            rules={[{ required: true, message: "Vui lòng chọn chuyên ngành" }]}
          >
            <Select
              placeholder="Chọn chuyên ngành"
              options={majorOptions}
            />
          </Form.Item>

          <Form.Item
            name="members"
            label="Thành viên hội đồng"
            rules={[{ required: true, message: "Vui lòng chọn ít nhất một thành viên" }]}
          >
            <Select
              mode="multiple"
              placeholder="Chọn thành viên"
              options={teacherOptions}
            />
          </Form.Item>

          <Form.Item
            name="defenseDate"
            label="Ngày bảo vệ"
          >
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" placeholder="Chọn ngày bảo vệ" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
