"use client";

import React, { useState } from "react";
import { Card, Typography, Row, Col, Table, Tag, Button, Space, Input, Select, Avatar, Empty, Modal, Form, DatePicker, InputNumber } from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  CalendarOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
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
  time: string;
  room: string;
  thesisCount: number;
}

const mockCouncilMembers: CouncilMember[] = [
  { id: 1, name: "TS. Nguyễn Văn A", role: "chairman" },
  { id: 2, name: "TS. Trần Thị B", role: "secretary" },
  { id: 3, name: "ThS. Lê Văn C", role: "member" },
  { id: 4, name: "TS. Phạm Thị D", role: "member" },
];

const mockSchedules: DefenseSchedule[] = [
  {
    id: 1,
    councilName: "Hội đồng sáng thứ 2",
    councilMembers: mockCouncilMembers,
    date: "2024-05-20",
    time: "08:00",
    room: "A101",
    thesisCount: 5,
  },
  {
    id: 2,
    councilName: "Hội đồng chiều thứ 3",
    councilMembers: mockCouncilMembers.slice(0, 3),
    date: "2024-05-21",
    time: "14:00",
    room: "B202",
    thesisCount: 4,
  },
  {
    id: 3,
    councilName: "Hội đồng sáng thứ 4",
    councilMembers: mockCouncilMembers.slice(1, 4),
    date: "2024-05-22",
    time: "08:00",
    room: "C303",
    thesisCount: 3,
  },
];

const roleLabels = {
  chairman: "Chủ tịch",
  secretary: "Thư ký",
  member: "Thành viên",
};

export default function ThesisDefenseSchedulePage() {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  const filteredSchedules = mockSchedules.filter(
    (s) =>
      s.councilName.toLowerCase().includes(search.toLowerCase()) ||
      s.room.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      console.log("Submit:", values);
      setModalOpen(false);
      form.resetFields();
    });
  };

  const columns: ColumnsType<DefenseSchedule> = [
    {
      title: "Tên hội đồng",
      dataIndex: "councilName",
      key: "councilName",
      render: (name) => (
        <Space>
          <TeamOutlined style={{ color: "#1677ff" }} />
          <Text strong>{name}</Text>
        </Space>
      ),
    },
    {
      title: "Thành viên",
      dataIndex: "councilMembers",
      key: "councilMembers",
      render: (members: CouncilMember[]) => (
        <Avatar.Group maxCount={3} size="small">
          {members.map((member) => (
            <Avatar key={member.id} style={{ backgroundColor: "#1677ff" }}>
              {member.name.split(" ").pop()?.[0]}
            </Avatar>
          ))}
        </Avatar.Group>
      ),
    },
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      width: 120,
      render: (date) => (
        <Space>
          <CalendarOutlined style={{ color: "#999" }} />
          <Text>{date}</Text>
        </Space>
      ),
    },
    {
      title: "Giờ",
      dataIndex: "time",
      key: "time",
      width: 80,
    },
    {
      title: "Phòng",
      dataIndex: "room",
      key: "room",
      width: 80,
      render: (room) => (
        <Tag icon={<EnvironmentOutlined />}>{room}</Tag>
      ),
    },
    {
      title: "Số đề tài",
      dataIndex: "thesisCount",
      key: "thesisCount",
      width: 100,
      align: "center",
      render: (count) => <Tag color="blue">{count}</Tag>,
    },
    {
      title: "",
      key: "action",
      width: 120,
      align: "center",
      render: () => (
        <Space>
          <Button type="text" size="small" icon={<EyeOutlined />} />
          <Button type="text" size="small" icon={<EditOutlined />} />
          <Button type="text" size="small" danger icon={<DeleteOutlined />} />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      {/* Page Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2} style={{ margin: 0 }}>Lịch bảo vệ</Title>
          <Text type="secondary">Quản lý lịch bảo vệ và hội đồng</Text>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
            Thêm lịch bảo vệ
          </Button>
        </Col>
      </Row>

      {/* Search */}
      <Row style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Space wrap>
            <Input
              placeholder="Tìm kiếm hội đồng, phòng..."
              prefix={<SearchOutlined style={{ color: "#999" }} />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: 300 }}
            />
          </Space>
        </Col>
      </Row>

      {/* Schedules Table */}
      <Card>
        {filteredSchedules.length === 0 ? (
          <Empty description="Không có lịch bảo vệ nào" />
        ) : (
          <Table
            columns={columns}
            dataSource={filteredSchedules}
            rowKey="id"
            pagination={false}
          />
        )}
      </Card>

      {/* Create Schedule Modal */}
      <Modal
        title="Thêm lịch bảo vệ"
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
            label="Ngày bảo vệ"
            rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="time"
            label="Giờ bắt đầu"
            rules={[{ required: true, message: "Vui lòng nhập giờ" }]}
          >
            <Input type="time" placeholder="08:00" />
          </Form.Item>
          <Form.Item
            name="room"
            label="Phòng"
            rules={[{ required: true, message: "Vui lòng nhập phòng" }]}
          >
            <Input placeholder="VD: A101" />
          </Form.Item>
          <Form.Item
            name="thesisCount"
            label="Số đề tài"
            rules={[{ required: true, message: "Vui lòng nhập số đề tài" }]}
          >
            <InputNumber min={1} max={20} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
