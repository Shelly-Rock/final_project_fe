"use client";

import React, { useState } from "react";
import { Row, Col, Card, Button, Typography, Space, Tag, Table, Input, Select, Avatar, Modal, Form, message } from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

const { Title, Text } = Typography;

interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "secretary" | "teacher" | "student";
  status: "active" | "inactive";
}

const mockUsers: User[] = [
  { id: 1, name: "Admin User", email: "admin@example.edu.vn", role: "admin", status: "active" },
  { id: 2, name: "Thư ký Khoa", email: "secretary@example.edu.vn", role: "secretary", status: "active" },
  { id: 3, name: "GV Nguyễn Văn A", email: "nguyenvana@example.edu.vn", role: "teacher", status: "active" },
  { id: 4, name: "SV Nguyễn Văn B", email: "sinhvien@example.edu.vn", role: "student", status: "active" },
];

const roleOptions = [
  { value: "all", label: "Tất cả" },
  { value: "admin", label: "Admin" },
  { value: "secretary", label: "Thư ký" },
  { value: "teacher", label: "Giảng viên" },
  { value: "student", label: "Sinh viên" },
];

const getRoleTag = (role: User["role"]) => {
  const map: Record<User["role"], { color: string; label: string }> = {
    admin: { color: "red", label: "Admin" },
    secretary: { color: "gold", label: "Thư ký" },
    teacher: { color: "blue", label: "Giảng viên" },
    student: { color: "green", label: "Sinh viên" },
  };
  return map[role];
};

export default function AdminUserPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  const handleCreateUser = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = (id: number) => {
    Modal.confirm({
      title: "Xóa người dùng",
      content: "Bạn có chắc chắn muốn xóa người dùng này không?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        setUsers(users.filter((u) => u.id !== id));
        message.success("Đã xóa người dùng");
      },
    });
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      if (editingUser) {
        setUsers(
          users.map((u) =>
            u.id === editingUser.id ? { ...u, ...values } : u
          )
        );
        message.success("Cập nhật người dùng thành công");
      } else {
        const newUser: User = {
          id: Math.max(...users.map((u) => u.id)) + 1,
          ...values,
        };
        setUsers([...users, newUser]);
        message.success("Thêm người dùng mới thành công");
      }
      setIsModalOpen(false);
      form.resetFields();
    });
  };

  const filteredUsers = users.filter((u) => {
    const matchRole = filter === "all" || u.role === filter;
    const matchSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       u.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchRole && matchSearch;
  });

  const columns: ColumnsType<User> = [
    {
      title: "Người dùng",
      dataIndex: "name",
      key: "name",
      render: (name) => (
        <Space>
          <Avatar icon={<UserOutlined />} style={{ background: "#1e3a5f" }} />
          <Text strong>{name}</Text>
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email) => <Text type="secondary">{email}</Text>,
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role) => {
        const tag = getRoleTag(role);
        return <Tag color={tag.color}>{tag.label}</Tag>;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "active" ? "success" : "default"}>
          {status === "active" ? "Hoạt động" : "Khóa"}
        </Tag>
      ),
    },
    {
      title: "",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space>
          <Button type="text" size="small" icon={<EditOutlined />} onClick={() => handleEditUser(record)} />
          <Button type="text" size="small" danger icon={<DeleteOutlined />} onClick={() => handleDeleteUser(record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto" }}>
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <Title level={2} style={{ marginBottom: 4 }}>Quản lý người dùng</Title>
            <Text type="secondary">Quản lý tài khoản người dùng</Text>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateUser}>
            Thêm người dùng
          </Button>
        </div>
      </div>

      {/* Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} lg={6}>
          <Card >
            <Text type="secondary">Tổng người dùng</Text>
            <Title level={3} style={{ margin: 0 }}>{users.length}</Title>
          </Card>
        </Col>
        <Col xs={12} lg={6}>
          <Card >
            <Text type="secondary">Giảng viên</Text>
            <Title level={3} style={{ margin: 0 }}>{users.filter(u => u.role === "teacher").length}</Title>
          </Card>
        </Col>
        <Col xs={12} lg={6}>
          <Card >
            <Text type="secondary">Sinh viên</Text>
            <Title level={3} style={{ margin: 0 }}>{users.filter(u => u.role === "student").length}</Title>
          </Card>
        </Col>
        <Col xs={12} lg={6}>
          <Card >
            <Text type="secondary">Thư ký</Text>
            <Title level={3} style={{ margin: 0 }}>{users.filter(u => u.role === "secretary").length}</Title>
          </Card>
        </Col>
      </Row>

      {/* Search & Filter */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Input
              placeholder="Tìm kiếm người dùng..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col xs={24} md={8}>
            <Select
              style={{ width: "100%" }}
              value={filter}
              onChange={setFilter}
              options={roleOptions}
            />
          </Col>
        </Row>
      </Card>

      {/* User Table */}
      <Card >
        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={editingUser ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        okText={editingUser ? "Cập nhật" : "Thêm mới"}
        cancelText="Hủy"
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: 24 }}
        >
          <Form.Item
            name="name"
            label="Họ và tên"
            rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
          >
            <Input placeholder="Nhập họ và tên" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input placeholder="Nhập địa chỉ email" />
          </Form.Item>

          <Form.Item
            name="role"
            label="Vai trò"
            rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}
          >
            <Select
              placeholder="Chọn vai trò"
              options={[
                { value: "admin", label: "Admin" },
                { value: "secretary", label: "Thư ký" },
                { value: "teacher", label: "Giảng viên" },
                { value: "student", label: "Sinh viên" },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
          >
            <Select
              placeholder="Chọn trạng thái"
              options={[
                { value: "active", label: "Hoạt động" },
                { value: "inactive", label: "Khóa" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
