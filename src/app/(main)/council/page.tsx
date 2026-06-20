"use client";

import React, { useState } from "react";
import { Card, Button, Typography, Row, Col, Table, Tag, Space, Modal, Form, Input, Select, Avatar, Tooltip, Empty } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  TeamOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

const { Title, Text } = Typography;

interface CouncilMember {
  id: number;
  name: string;
  role: "chairman" | "secretary" | "member";
}

interface DefenseSchedule {
  id: number;
  councilName: string;
  councilMembers: CouncilMember[];
  date: string;
  room: string;
  defenses: unknown[];
}

const mockCouncilMembers: CouncilMember[] = [
  { id: 1, name: "TS. Nguyễn Văn A", role: "chairman" },
  { id: 2, name: "TS. Trần Thị B", role: "secretary" },
  { id: 3, name: "ThS. Lê Văn C", role: "member" },
];

const mockDefenseSchedules: DefenseSchedule[] = [
  {
    id: 1,
    councilName: "Hội đồng sáng thứ 2",
    councilMembers: mockCouncilMembers,
    date: "2024-05-20",
    room: "A101",
    defenses: [1, 2, 3],
  },
  {
    id: 2,
    councilName: "Hội đồng chiều thứ 3",
    councilMembers: mockCouncilMembers.slice(0, 3),
    date: "2024-05-21",
    room: "B202",
    defenses: [4, 5],
  },
];

const roleLabels = {
  chairman: "Chủ tịch",
  secretary: "Thư ký",
  member: "Thành viên",
};

export default function CouncilPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      console.log("Submit:", values);
      setModalOpen(false);
      form.resetFields();
    });
  };

  const columns: ColumnsType<DefenseSchedule> = [
    {
      title: "Mã hội đồng",
      dataIndex: "id",
      key: "id",
      width: 120,
      render: (id) => <Tag variant="outlined">{id}</Tag>,
    },
    {
      title: "Tên/Tiêu đề",
      dataIndex: "councilName",
      key: "councilName",
      render: (name) => (
        <Space>
          <TeamOutlined />
          <Text strong>{name}</Text>
        </Space>
      ),
    },
    {
      title: "Thành viên",
      dataIndex: "councilMembers",
      key: "councilMembers",
      render: (members: CouncilMember[]) => (
        <Avatar.Group maxCount={4} size="small">
          {members.map((member) => (
            <Tooltip key={member.id} title={`${member.name} (${roleLabels[member.role]})`}>
              <Avatar style={{ backgroundColor: "#1677ff" }}>
                {member.name.split(" ").pop()?.[0]}
              </Avatar>
            </Tooltip>
          ))}
        </Avatar.Group>
      ),
    },
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      width: 120,
    },
    {
      title: "Phòng",
      dataIndex: "room",
      key: "room",
      width: 80,
    },
    {
      title: "",
      key: "action",
      width: 120,
      align: "center",
      render: () => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button type="text" size="small" icon={<EyeOutlined />} />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button type="text" size="small" danger icon={<DeleteOutlined />} />
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
          <Title level={2} style={{ margin: 0 }}>Quản lý hội đồng</Title>
          <Text type="secondary">Quản lý các hội đồng bảo vệ và thành viên</Text>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
            Thêm hội đồng
          </Button>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} md={8}>
          <Card>
            <Title level={2} style={{ margin: 0 }}>{mockDefenseSchedules.length}</Title>
            <Text type="secondary">Tổng hội đồng</Text>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Title level={2} style={{ margin: 0 }}>{mockCouncilMembers.length}</Title>
            <Text type="secondary">Thành viên</Text>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Title level={2} style={{ margin: 0 }}>
              {mockDefenseSchedules.reduce((acc, c) => acc + c.defenses.length, 0)}
            </Title>
            <Text type="secondary">Lịch bảo vệ</Text>
          </Card>
        </Col>
      </Row>

      {/* Council Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={mockDefenseSchedules}
          rowKey="id"
          pagination={false}
        />
      </Card>

      {/* Create Council Modal */}
      <Modal
        title="Thêm hội đồng mới"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSubmit}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="councilName"
            label="Tên hội đồng"
            rules={[{ required: true, message: "Vui lòng nhập tên hội đồng" }]}
          >
            <Input placeholder="VD: Hội đồng sáng thứ 2" />
          </Form.Item>
          <Form.Item
            name="date"
            label="Ngày họp"
            rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item
            name="room"
            label="Phòng"
            rules={[{ required: true, message: "Vui lòng nhập phòng" }]}
          >
            <Input placeholder="VD: A101" />
          </Form.Item>
          <Form.Item name="chairman" label="Chủ tịch">
            <Select placeholder="Chọn chủ tịch">
              {mockCouncilMembers
                .filter((m) => m.role === "chairman")
                .map((m) => (
                  <Select.Option key={m.id} value={m.id}>
                    {m.name}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item name="secretary" label="Thư ký">
            <Select placeholder="Chọn thư ký">
              {mockCouncilMembers
                .filter((m) => m.role === "secretary")
                .map((m) => (
                  <Select.Option key={m.id} value={m.id}>
                    {m.name}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
