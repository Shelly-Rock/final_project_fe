"use client";

import React, { useState } from "react";
import { Card, Button, Typography, Space, Tag, Table, Segmented, Avatar } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { SegmentedValue } from "antd/es/segmented";

const { Title, Text } = Typography;

interface ThesisReview {
  id: number;
  student: string;
  mssv: string;
  thesis: string;
  council: string;
  deadline: string;
  status: "pending" | "in_progress" | "completed";
}

const mockReviews: ThesisReview[] = [
  {
    id: 1,
    student: "Lê Văn C",
    mssv: "20210003",
    thesis: "Hệ thống IoT cho nông nghiệp thông minh",
    council: "Hội đồng 1",
    deadline: "2024-05-20",
    status: "pending",
  },
  {
    id: 2,
    student: "Phạm Thị D",
    mssv: "20210004",
    thesis: "Ứng dụng Blockchain trong quản lý chuỗi cung ứng",
    council: "Hội đồng 2",
    deadline: "2024-05-22",
    status: "in_progress",
  },
];

const getStatusTag = (status: ThesisReview["status"]) => {
  const map: Record<ThesisReview["status"], { color: string; label: string }> = {
    pending: { color: "warning", label: "Chờ phản biện" },
    in_progress: { color: "processing", label: "Đang phản biện" },
    completed: { color: "success", label: "Hoàn thành" },
  };
  return map[status];
};

export default function TeacherReviewPage() {
  const [reviews] = useState<ThesisReview[]>(mockReviews);
  const [filter, setFilter] = useState<SegmentedValue>("all");

  const filteredReviews = reviews.filter((r) => {
    if (filter === "all") return true;
    return r.status === filter;
  });

  const columns: ColumnsType<ThesisReview> = [
    {
      title: "Sinh viên",
      dataIndex: "student",
      key: "student",
      render: (student, record) => (
        <Space>
          <Avatar style={{ background: "#2a5bc0" }}>{student.charAt(0)}</Avatar>
          <div>
            <Text strong>{student}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>{record.mssv}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Đề tài",
      dataIndex: "thesis",
      key: "thesis",
    },
    {
      title: "Hội đồng",
      dataIndex: "council",
      key: "council",
    },
    {
      title: "Hạn nộp",
      dataIndex: "deadline",
      key: "deadline",
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
      render: () => (
        <Button type="text" size="small" icon={<EyeOutlined />}>
          Xem
        </Button>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto" }}>
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ marginBottom: 4 }}>Phản biện khóa luận</Title>
        <Text type="secondary">Danh sách đề tài được phân công phản biện</Text>
      </div>

      {/* Stats */}
      <Card style={{ marginBottom: 24 }}>
        <Space>
          <Tag color="warning">{reviews.filter(r => r.status === "pending").length} Chờ phản biện</Tag>
          <Tag color="processing">{reviews.filter(r => r.status === "in_progress").length} Đang thực hiện</Tag>
          <Tag color="success">{reviews.filter(r => r.status === "completed").length} Hoàn thành</Tag>
        </Space>
      </Card>

      {/* Filter */}
      <Card style={{ marginBottom: 24 }}>
        <Segmented
          value={filter}
          onChange={setFilter}
          options={[
            { label: "Tất cả", value: "all" },
            { label: "Chờ phản biện", value: "pending" },
            { label: "Đang thực hiện", value: "in_progress" },
            { label: "Hoàn thành", value: "completed" },
          ]}
        />
      </Card>

      {/* Review Table */}
      <Card >
        <Table
          columns={columns}
          dataSource={filteredReviews}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
}
