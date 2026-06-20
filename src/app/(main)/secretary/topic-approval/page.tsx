"use client";

import React, { useState } from "react";
import { Card, Button, Typography, Space, Tag, Table, Segmented, Row, Col, Popconfirm } from "antd";
import { CheckOutlined, CloseOutlined, EyeOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { SegmentedValue } from "antd/es/segmented";

const { Title, Text } = Typography;

interface Thesis {
  id: number;
  title: string;
  lecturer: string;
  student: string;
  major: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
}

const mockTheses: Thesis[] = [
  {
    id: 1,
    title: "Xây dựng hệ thống quản lý thư viện",
    lecturer: "TS. Nguyễn Văn A",
    student: "Nguyễn Văn Sinh Viên",
    major: "CNTT",
    submittedAt: "2024-01-10",
    status: "pending",
  },
  {
    id: 2,
    title: "Ứng dụng AI trong y tế",
    lecturer: "PGS.TS. Trần Thị B",
    student: "Trần Thị Sinh Viên",
    major: "Khoa học máy tính",
    submittedAt: "2024-01-08",
    status: "pending",
  },
];

const getStatusTag = (status: Thesis["status"]) => {
  const map: Record<Thesis["status"], { color: string; label: string }> = {
    pending: { color: "gold", label: "Chờ duyệt" },
    approved: { color: "success", label: "Đã duyệt" },
    rejected: { color: "error", label: "Từ chối" },
  };
  return map[status];
};

export default function SecretaryTopicApprovalPage() {
  const [theses] = useState<Thesis[]>(mockTheses);
  const [filter, setFilter] = useState<SegmentedValue>("pending");

  const filteredTheses = theses.filter((t) => {
    if (filter === "all") return true;
    return t.status === filter;
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
      title: "Giảng viên",
      dataIndex: "lecturer",
      key: "lecturer",
    },
    {
      title: "Sinh viên",
      dataIndex: "student",
      key: "student",
    },
    {
      title: "Ngày nộp",
      dataIndex: "submittedAt",
      key: "submittedAt",
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
      title: "",
      key: "actions",
      width: 150,
      render: (_, record) => (
        record.status === "pending" ? (
          <Space>
            <Button type="primary" size="small" icon={<CheckOutlined />} />
            <Popconfirm title="Từ chối đề tài này?">
              <Button danger size="small" icon={<CloseOutlined />} />
            </Popconfirm>
            <Button type="text" size="small" icon={<EyeOutlined />} />
          </Space>
        ) : (
          <Button type="text" size="small" icon={<EyeOutlined />} />
        )
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto" }}>
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ marginBottom: 4 }}>Duyệt đề tài</Title>
        <Text type="secondary">Phê duyệt đề tài khóa luận</Text>
      </div>

      {/* Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} lg={6}>
          <Card >
            <Text type="secondary">Tổng đề tài</Text>
            <Title level={3} style={{ margin: 0 }}>{theses.length}</Title>
          </Card>
        </Col>
        <Col xs={12} lg={6}>
          <Card >
            <Text type="secondary">Chờ duyệt</Text>
            <Title level={3} style={{ margin: 0 }}>{theses.filter(t => t.status === "pending").length}</Title>
          </Card>
        </Col>
        <Col xs={12} lg={6}>
          <Card >
            <Text type="secondary">Đã duyệt</Text>
            <Title level={3} style={{ margin: 0 }}>{theses.filter(t => t.status === "approved").length}</Title>
          </Card>
        </Col>
        <Col xs={12} lg={6}>
          <Card >
            <Text type="secondary">Từ chối</Text>
            <Title level={3} style={{ margin: 0 }}>{theses.filter(t => t.status === "rejected").length}</Title>
          </Card>
        </Col>
      </Row>

      {/* Filter */}
      <Card style={{ marginBottom: 24 }}>
        <Segmented
          value={filter}
          onChange={setFilter}
          options={[
            { label: "Tất cả", value: "all" },
            { label: "Chờ duyệt", value: "pending" },
            { label: "Đã duyệt", value: "approved" },
            { label: "Từ chối", value: "rejected" },
          ]}
        />
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
