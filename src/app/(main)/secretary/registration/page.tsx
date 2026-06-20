"use client";

import React, { useState } from "react";
import { Card, Button, Typography, Space, Tag, Table, Segmented, Popconfirm } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { SegmentedValue } from "antd/es/segmented";

const { Title, Text } = Typography;

interface Registration {
  id: number;
  student: string;
  mssv: string;
  thesis: string;
  lecturer: string;
  registeredAt: string;
  status: "pending" | "approved" | "rejected";
}

const mockRegistrations: Registration[] = [
  {
    id: 1,
    student: "Nguyễn Văn A",
    mssv: "20210001",
    thesis: "Xây dựng hệ thống quản lý thư viện",
    lecturer: "TS. Nguyễn Văn GV",
    registeredAt: "2024-01-10",
    status: "pending",
  },
];

const getStatusTag = (status: Registration["status"]) => {
  const map: Record<Registration["status"], { color: string; label: string }> = {
    pending: { color: "gold", label: "Chờ xác nhận" },
    approved: { color: "success", label: "Đã xác nhận" },
    rejected: { color: "error", label: "Từ chối" },
  };
  return map[status];
};

export default function SecretaryRegistrationPage() {
  const [registrations] = useState<Registration[]>(mockRegistrations);
  const [filter, setFilter] = useState<SegmentedValue>("all");

  const filteredRegistrations = registrations.filter((r) => {
    if (filter === "all") return true;
    return r.status === filter;
  });

  const columns: ColumnsType<Registration> = [
    {
      title: "Sinh viên",
      dataIndex: "student",
      key: "student",
      render: (student, record) => (
        <div>
          <Text strong>{student}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>{record.mssv}</Text>
        </div>
      ),
    },
    {
      title: "Đề tài",
      dataIndex: "thesis",
      key: "thesis",
    },
    {
      title: "GV hướng dẫn",
      dataIndex: "lecturer",
      key: "lecturer",
    },
    {
      title: "Ngày đăng ký",
      dataIndex: "registeredAt",
      key: "registeredAt",
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
      width: 100,
      render: (_, record) => (
        record.status === "pending" ? (
          <Space>
            <Popconfirm title="Xác nhận đăng ký này?">
              <Button type="primary" size="small" icon={<CheckOutlined />} />
            </Popconfirm>
            <Popconfirm title="Từ chối đăng ký này?">
              <Button danger size="small" icon={<CloseOutlined />} />
            </Popconfirm>
          </Space>
        ) : null
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto" }}>
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ marginBottom: 4 }}>Quản lý đăng ký</Title>
        <Text type="secondary">Xác nhận đăng ký đề tài của sinh viên</Text>
      </div>

      {/* Filter */}
      <Card style={{ marginBottom: 24 }}>
        <Segmented
          value={filter}
          onChange={setFilter}
          options={[
            { label: "Tất cả", value: "all" },
            { label: "Chờ xác nhận", value: "pending" },
            { label: "Đã xác nhận", value: "approved" },
            { label: "Từ chối", value: "rejected" },
          ]}
        />
      </Card>

      {/* Registration Table */}
      <Card >
        <Table
          columns={columns}
          dataSource={filteredRegistrations}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
}
