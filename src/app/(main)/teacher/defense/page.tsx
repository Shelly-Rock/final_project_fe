"use client";

import React, { useState } from "react";
import { Row, Col, Card, Typography, Empty, Button, Space, Tag, Modal, Form, Input, Select, DatePicker, TimePicker, InputNumber, message, Table, Avatar } from "antd";
import { PlusOutlined, CalendarOutlined, TeamOutlined, EnvironmentOutlined, ClockCircleOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

const { Title, Text } = Typography;

interface DefenseSession {
  id: number;
  councilName: string;
  date: string;
  time: string;
  room: string;
  studentCount: number;
  status: "upcoming" | "ongoing" | "completed";
}

interface Council {
  id: number;
  name: string;
  chairman: string;
  members: string[];
}

const mockDefenseSessions: DefenseSession[] = [
  {
    id: 1,
    councilName: "Hội đồng sáng thứ 2 - Nhóm A",
    date: "2024-05-20",
    time: "08:00",
    room: "A101",
    studentCount: 5,
    status: "upcoming",
  },
  {
    id: 2,
    councilName: "Hội đồng chiều thứ 3 - Nhóm B",
    date: "2024-05-21",
    time: "14:00",
    room: "B202",
    studentCount: 4,
    status: "ongoing",
  },
];

const mockCouncils: Council[] = [
  {
    id: 1,
    name: "Hội đồng sáng thứ 2",
    chairman: "TS. Nguyễn Văn A",
    members: ["TS. Trần Thị B", "ThS. Lê Văn C", "TS. Phạm Thị D"],
  },
  {
    id: 2,
    name: "Hội đồng chiều thứ 3",
    chairman: "PGS.TS. Hoàng Văn E",
    members: ["TS. Ngô Thị F", "ThS. Đặng Văn G"],
  },
];

const roomOptions = [
  { value: "A101", label: "Phòng A101" },
  { value: "A102", label: "Phòng A102" },
  { value: "B201", label: "Phòng B201" },
  { value: "B202", label: "Phòng B202" },
  { value: "C301", label: "Phòng C301" },
  { value: "C302", label: "Phòng C302" },
];

const getStatusTag = (status: DefenseSession["status"]) => {
  const map = {
    upcoming: { color: "blue", label: "Sắp tới" },
    ongoing: { color: "green", label: "Đang diễn ra" },
    completed: { color: "default", label: "Đã kết thúc" },
  };
  return map[status];
};

export default function TeacherDefensePage() {
  const [sessions, setSessions] = useState<DefenseSession[]>(mockDefenseSessions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleCreateSession = () => {
    form.validateFields().then((values) => {
      const newSession: DefenseSession = {
        id: Math.max(...sessions.map((s) => s.id)) + 1,
        councilName: values.councilName,
        date: values.date.format("YYYY-MM-DD"),
        time: values.time.format("HH:mm"),
        room: values.room,
        studentCount: values.studentCount || 0,
        status: "upcoming",
      };
      setSessions([...sessions, newSession]);
      message.success("Tạo lịch bảo vệ thành công!");
      setIsModalOpen(false);
      form.resetFields();
    });
  };

  const sessionColumns: ColumnsType<DefenseSession> = [
    {
      title: "Hội đồng",
      dataIndex: "councilName",
      key: "councilName",
      render: (name, record) => {
        const statusTag = getStatusTag(record.status);
        return (
          <Space orientation="vertical" size={2}>
            <Space>
              <Text strong>{name}</Text>
              <Tag color={statusTag.color}>{statusTag.label}</Tag>
            </Space>
          </Space>
        );
      },
    },
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      width: 110,
      render: (date) => (
        <Space>
          <CalendarOutlined style={{ color: "#999" }} />
          {date}
        </Space>
      ),
    },
    {
      title: "Giờ",
      dataIndex: "time",
      key: "time",
      width: 80,
      render: (time) => (
        <Space>
          <ClockCircleOutlined style={{ color: "#999" }} />
          {time}
        </Space>
      ),
    },
    {
      title: "Phòng",
      dataIndex: "room",
      key: "room",
      width: 90,
      render: (room) => <Tag icon={<EnvironmentOutlined />}>{room}</Tag>,
    },
    {
      title: "SV",
      dataIndex: "studentCount",
      key: "studentCount",
      width: 60,
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
          <Button type="text" size="small" icon={<EditOutlined />}>Sửa</Button>
          <Button type="text" size="small" icon={<EyeOutlined />}>Chi tiết</Button>
        </Space>
      ),
    },
  ];

  const councilColumns: ColumnsType<Council> = [
    {
      title: "Tên hội đồng",
      dataIndex: "name",
      key: "name",
      render: (name) => (
        <Space>
          <Avatar icon={<TeamOutlined />} style={{ backgroundColor: "#1677ff" }} />
          <Text strong>{name}</Text>
        </Space>
      ),
    },
    {
      title: "Chủ tịch",
      dataIndex: "chairman",
      key: "chairman",
      render: (chairman) => <Text type="secondary">{chairman}</Text>,
    },
    {
      title: "Thành viên",
      dataIndex: "members",
      key: "members",
      render: (members) => (
        <Text type="secondary" ellipsis={{ tooltip: members.join(", ") }}>
          {members.join(", ")}
        </Text>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto" }}>
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <Title level={2} style={{ marginBottom: 4 }}>Lịch bảo vệ</Title>
            <Text type="secondary">Quản lý lịch bảo vệ khóa luận</Text>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
            Tạo lịch bảo vệ
          </Button>
        </div>
      </div>

      <Row gutter={[16, 16]}>
        {/* Defense Sessions */}
        <Col xs={24} lg={14}>
          <Card title="Lịch bảo vệ của tôi">
            {sessions.length === 0 ? (
              <Empty
                image={<CalendarOutlined style={{ fontSize: 64, color: "#d1d5db" }} />}
                description={
                  <div>
                    <Text type="secondary">Chưa có lịch bảo vệ</Text>
                  </div>
                }
              />
            ) : (
              <Table
                columns={sessionColumns}
                dataSource={sessions}
                rowKey="id"
                pagination={false}
                size="middle"
              />
            )}
          </Card>
        </Col>

        {/* Councils */}
        <Col xs={24} lg={10}>
          <Card title="Hội đồng của tôi">
            {mockCouncils.length === 0 ? (
              <Empty
                image={<TeamOutlined style={{ fontSize: 64, color: "#d1d5db" }} />}
                description={
                  <div>
                    <Text type="secondary">Chưa tham gia hội đồng nào</Text>
                  </div>
                }
              />
            ) : (
              <Table
                columns={councilColumns}
                dataSource={mockCouncils}
                rowKey="id"
                pagination={false}
                size="middle"
              />
            )}
          </Card>
        </Col>
      </Row>

      {/* Create Defense Schedule Modal */}
      <Modal
        title="Tạo lịch bảo vệ mới"
        open={isModalOpen}
        onOk={handleCreateSession}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        okText="Tạo mới"
        cancelText="Hủy"
        width={560}
        transitionName=""
        maskTransitionName=""
        centered
      >
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: 24 }}
        >
          <Form.Item
            name="councilName"
            label="Tên hội đồng / buổi bảo vệ"
            rules={[{ required: true, message: "Vui lòng nhập tên hội đồng" }]}
          >
            <Input placeholder="VD: Hội đồng sáng thứ 2 - Nhóm A" />
          </Form.Item>

          <Form.Item
            name="date"
            label="Ngày bảo vệ"
            rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
          >
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item
            name="time"
            label="Giờ bắt đầu"
            rules={[{ required: true, message: "Vui lòng chọn giờ" }]}
          >
            <TimePicker format="HH:mm" minuteStep={15} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="room"
            label="Phòng"
            rules={[{ required: true, message: "Vui lòng chọn phòng" }]}
          >
            <Select placeholder="Chọn phòng" options={roomOptions} />
          </Form.Item>

          <Form.Item
            name="studentCount"
            label="Số sinh viên (không bắt buộc)"
          >
            <InputNumber min={0} max={20} style={{ width: "100%" }} placeholder="Số sinh viên dự kiến" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
