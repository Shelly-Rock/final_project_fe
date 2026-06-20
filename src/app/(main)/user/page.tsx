"use client";

import React, { useState } from "react";
import { Card, Button, Typography, Row, Col, Table, Tag, Space, Input, Avatar, Empty } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

const { Title, Text } = Typography;

interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "teacher" | "student";
  department: string;
  status: "active" | "inactive";
}

const mockUsers: User[] = [
  { id: 1, name: "Nguyễn Văn A", email: "nguyenvana@example.com", role: "admin", department: "Khoa CNTT", status: "active" },
  { id: 2, name: "Trần Thị B", email: "tranthib@example.com", role: "teacher", department: "Khoa CNTT", status: "active" },
  { id: 3, name: "Lê Văn C", email: "levanc@example.com", role: "student", department: "Khoa CNTT", status: "active" },
  { id: 4, name: "Phạm Thị D", email: "phamthid@example.com", role: "teacher", department: "Khoa KHMT", status: "active" },
  { id: 5, name: "Hoàng Văn E", email: "hoangvane@example.com", role: "student", department: "Khoa CNTT", status: "inactive" },
];

const roleConfig = {
  admin: { color: "purple", label: "Quản trị viên" },
  teacher: { color: "blue", label: "Giảng viên" },
  student: { color: "green", label: "Sinh viên" },
};

const statusConfig = {
  active: { color: "success", label: "Hoạt động" },
  inactive: { color: "default", label: "Khóa" },
};

export default function UserPage() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState(mockUsers);

  const filteredUsers = data.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const columns: ColumnsType<User> = [
    {
      title: "Người dùng",
      key: "user",
      minWidth: 200,
      render: (_, record) => (
        <Space>
          <Avatar style={{ backgroundColor: "#1677ff" }}>
            {record.name.charAt(0)}
          </Avatar>
          <Space direction="vertical" size={0}>
            <Text strong>{record.name}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>{record.email}</Text>
          </Space>
        </Space>
      ),
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      width: 120,
      render: (role) => {
        const config = roleConfig[role as keyof typeof roleConfig];
        return <Tag color={config.color}>{config.label}</Tag>;
      },
    },
    {
      title: "Khoa",
      dataIndex: "department",
      key: "department",
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
      width: 100,
      align: "center",
      render: () => (
        <Space>
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
          <Title level={2} style={{ margin: 0 }}>Người dùng</Title>
          <Text type="secondary">Quản lý tài khoản người dùng</Text>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />}>
            Thêm người dùng
          </Button>
        </Col>
      </Row>

      {/* Search */}
      <Row style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Input
            placeholder="Tìm kiếm..."
            prefix={<SearchOutlined style={{ color: "#999" }} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 250 }}
          />
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} md={6}>
          <Card>
            <Title level={2} style={{ margin: 0 }}>{mockUsers.length}</Title>
            <Text type="secondary">Tổng người dùng</Text>
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <Title level={2} style={{ margin: 0 }}>{mockUsers.filter((u) => u.role === "admin").length}</Title>
            <Text type="secondary">Quản trị viên</Text>
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <Title level={2} style={{ margin: 0 }}>{mockUsers.filter((u) => u.role === "teacher").length}</Title>
            <Text type="secondary">Giảng viên</Text>
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <Title level={2} style={{ margin: 0 }}>{mockUsers.filter((u) => u.role === "student").length}</Title>
            <Text type="secondary">Sinh viên</Text>
          </Card>
        </Col>
      </Row>

      {/* User Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
}
