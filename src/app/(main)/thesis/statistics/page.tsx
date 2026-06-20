"use client";

import React, { useState } from "react";
import { Card, Typography, Row, Col, Table, Tag, Input, Select, Space, Avatar } from "antd";
import {
  SearchOutlined,
  BookOutlined,
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

const { Title, Text } = Typography;

interface Topic {
  id: number;
  code: string;
  name: string;
  lecturer: string;
  status: "pending" | "approved" | "in_progress" | "completed";
  registeredStudents: string[];
  maxStudents: number;
}

const mockTopics: Topic[] = [
  { id: 1, code: "DT001", name: "Xây dựng app quản lý thư viện", lecturer: "TS. Nguyễn Văn A", status: "approved", registeredStudents: ["Nguyễn Văn B"], maxStudents: 2 },
  { id: 2, code: "DT002", name: "Ứng dụng AI trong y tế", lecturer: "PGS.TS. Trần Thị B", status: "in_progress", registeredStudents: ["Trần Văn C", "Lê Thị D"], maxStudents: 2 },
  { id: 3, code: "DT003", name: "Hệ thống IoT smart home", lecturer: "TS. Hoàng Văn E", status: "pending", registeredStudents: [], maxStudents: 2 },
  { id: 4, code: "DT004", name: "Blockchain trong logistics", lecturer: "TS. Phạm Thị F", status: "completed", registeredStudents: ["Ngô Văn G"], maxStudents: 2 },
  { id: 5, code: "DT005", name: "ML trong phát hiện gian lận", lecturer: "ThS. Lê Văn H", status: "approved", registeredStudents: ["Đặng Thị I"], maxStudents: 2 },
];

const statusConfig = {
  pending: { color: "gold", label: "Chờ duyệt" },
  approved: { color: "blue", label: "Đã duyệt" },
  in_progress: { color: "cyan", label: "Đang thực hiện" },
  completed: { color: "green", label: "Hoàn thành" },
};

export default function ThesisStatisticsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredTopics = mockTopics.filter((topic) => {
    const matchesSearch =
      topic.name.toLowerCase().includes(search.toLowerCase()) ||
      topic.code.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || topic.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: mockTopics.length,
    pending: mockTopics.filter((t) => t.status === "pending").length,
    approved: mockTopics.filter((t) => t.status === "approved").length,
    inProgress: mockTopics.filter((t) => t.status === "in_progress").length,
    completed: mockTopics.filter((t) => t.status === "completed").length,
  };

  const columns: ColumnsType<Topic> = [
    {
      title: "Mã đề tài",
      dataIndex: "code",
      key: "code",
      width: 100,
      render: (code) => <Tag variant="outlined">{code}</Tag>,
    },
    {
      title: "Tên đề tài",
      dataIndex: "name",
      key: "name",
      render: (name) => <Text strong>{name}</Text>,
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
      title: "Số SV",
      key: "students",
      width: 80,
      render: (_, record) => (
        <Text>{record.registeredStudents.length} / {record.maxStudents}</Text>
      ),
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
  ];

  return (
    <div style={{ padding: "24px" }}>
      {/* Page Header */}
      <Title level={2} style={{ marginBottom: 8 }}>Thống kê khóa luận</Title>
      <Text type="secondary">Báo cáo tổng quan về tình hình khóa luận</Text>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginTop: 24, marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Space>
              <Avatar size="large" style={{ backgroundColor: "#1677ff" }} icon={<BookOutlined />} />
              <Space direction="vertical" size={0}>
                <Title level={2} style={{ margin: 0 }}>{stats.total}</Title>
                <Text type="secondary">Tổng đề tài</Text>
              </Space>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Space>
              <Avatar size="large" style={{ backgroundColor: "#faad14" }} icon={<ClockCircleOutlined />} />
              <Space direction="vertical" size={0}>
                <Title level={2} style={{ margin: 0 }}>{stats.pending}</Title>
                <Text type="secondary">Chờ duyệt</Text>
              </Space>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Space>
              <Avatar size="large" style={{ backgroundColor: "#13c2c2" }} icon={<UserOutlined />} />
              <Space direction="vertical" size={0}>
                <Title level={2} style={{ margin: 0 }}>{stats.inProgress}</Title>
                <Text type="secondary">Đang thực hiện</Text>
              </Space>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Space>
              <Avatar size="large" style={{ backgroundColor: "#52c41a" }} icon={<CheckCircleOutlined />} />
              <Space direction="vertical" size={0}>
                <Title level={2} style={{ margin: 0 }}>{stats.completed}</Title>
                <Text type="secondary">Hoàn thành</Text>
              </Space>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Status Summary */}
      <Card style={{ marginBottom: 24 }}>
        <Title level={5} style={{ marginBottom: 16 }}>Tỷ lệ theo trạng thái</Title>
        <Space wrap size="middle">
          <Tag color="default">Tổng: {stats.total}</Tag>
          <Tag color="gold">Chờ duyệt: {stats.pending}</Tag>
          <Tag color="blue">Đã duyệt: {stats.approved}</Tag>
          <Tag color="cyan">Đang thực hiện: {stats.inProgress}</Tag>
          <Tag color="green">Hoàn thành: {stats.completed}</Tag>
        </Space>
      </Card>

      {/* Filters */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={12}>
          <Input
            placeholder="Tìm kiếm đề tài..."
            prefix={<SearchOutlined style={{ color: "#999" }} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%" }}
          />
        </Col>
        <Col xs={24} md={6}>
          <Select
            placeholder="Trạng thái"
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: "100%" }}
            options={[
              { label: "Tất cả", value: "all" },
              { label: "Chờ duyệt", value: "pending" },
              { label: "Đã duyệt", value: "approved" },
              { label: "Đang thực hiện", value: "in_progress" },
              { label: "Hoàn thành", value: "completed" },
            ]}
          />
        </Col>
        <Col xs={24} md={6}>
          <Text type="secondary">Hiển thị {filteredTopics.length} / {mockTopics.length} đề tài</Text>
        </Col>
      </Row>

      {/* Topics Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredTopics.slice(0, 10)}
          rowKey="id"
          pagination={false}
        />
      </Card>
    </div>
  );
}
