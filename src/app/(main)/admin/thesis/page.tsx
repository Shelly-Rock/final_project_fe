"use client";

import React, { useState } from "react";
import { Card, Button, Typography, Space, Tag, Table, Input, Progress, Select, Row, Col } from "antd";
import {
  SearchOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

const { Title, Text } = Typography;

interface Thesis {
  id: number;
  title: string;
  student: string;
  lecturer: string;
  major: string;
  status: "pending" | "approved" | "in_progress" | "defended" | "completed";
  progress: number;
}

const mockTheses: Thesis[] = [
  {
    id: 1,
    title: "Xây dựng hệ thống quản lý thư viện",
    student: "Nguyễn Văn A",
    lecturer: "TS. Nguyễn Văn GV",
    major: "CNTT",
    status: "in_progress",
    progress: 60,
  },
  {
    id: 2,
    title: "Ứng dụng AI trong y tế",
    student: "Trần Thị B",
    lecturer: "PGS.TS. Trần Thị GV",
    major: "Khoa học máy tính",
    status: "approved",
    progress: 20,
  },
];

const statusOptions = [
  { value: "all", label: "Tất cả" },
  { value: "pending", label: "Chờ duyệt" },
  { value: "approved", label: "Đã duyệt" },
  { value: "in_progress", label: "Đang thực hiện" },
  { value: "defended", label: "Đã bảo vệ" },
  { value: "completed", label: "Hoàn thành" },
];

const getStatusTag = (status: Thesis["status"]) => {
  const map: Record<Thesis["status"], { color: string; label: string }> = {
    pending: { color: "gold", label: "Chờ duyệt" },
    approved: { color: "blue", label: "Đã duyệt" },
    in_progress: { color: "processing", label: "Đang thực hiện" },
    defended: { color: "success", label: "Đã bảo vệ" },
    completed: { color: "default", label: "Hoàn thành" },
  };
  return map[status];
};

export default function AdminThesisPage() {
  const [theses] = useState<Thesis[]>(mockTheses);
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTheses = theses.filter((t) => {
    const matchStatus = filter === "all" || t.status === filter;
    const matchSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       t.student.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  const columns: ColumnsType<Thesis> = [
    {
      title: "Đề tài",
      dataIndex: "title",
      key: "title",
      render: (title, record) => (
        <div>
          <Text strong>{title}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>{record.major}</Text>
        </div>
      ),
    },
    {
      title: "Sinh viên",
      dataIndex: "student",
      key: "student",
    },
    {
      title: "GV hướng dẫn",
      dataIndex: "lecturer",
      key: "lecturer",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const tag = getStatusTag(status);
        return <Tag color={tag.color}>{tag.label}</Tag>;
      },
    },
    {
      title: "Tiến độ",
      dataIndex: "progress",
      key: "progress",
      width: 150,
      render: (progress) => (
        <Progress percent={progress} size="small" />
      ),
    },
    {
      title: "",
      key: "actions",
      width: 80,
      render: () => (
        <Button type="text" size="small" icon={<EyeOutlined />} />
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto" }}>
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ marginBottom: 4 }}>Quản lý khóa luận</Title>
        <Text type="secondary">Xem và quản lý tất cả khóa luận</Text>
      </div>

      {/* Filter */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Input
              placeholder="Tìm kiếm đề tài, sinh viên..."
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
              options={statusOptions}
            />
          </Col>
        </Row>
      </Card>

      {/* Thesis Table */}
      <Card >
        <Table
          columns={columns}
          dataSource={filteredTheses}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
}
