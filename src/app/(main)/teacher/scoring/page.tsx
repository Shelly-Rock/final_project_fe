"use client";

import React, { useState } from "react";
import { Card, Button, Typography, Space, Tag, Table, Segmented, Row, Col } from "antd";
import { EditOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { SegmentedValue } from "antd/es/segmented";

const { Title, Text } = Typography;

interface ThesisScore {
  id: number;
  student: string;
  mssv: string;
  thesis: string;
  type: "process" | "defense";
  score?: number;
  maxScore: number;
  deadline: string;
  status: "pending" | "scored";
}

const mockScores: ThesisScore[] = [
  {
    id: 1,
    student: "Nguyễn Văn A",
    mssv: "20210001",
    thesis: "Xây dựng hệ thống quản lý thư viện",
    type: "process",
    score: 8.5,
    maxScore: 10,
    deadline: "2024-05-15",
    status: "scored",
  },
  {
    id: 2,
    student: "Trần Thị B",
    mssv: "20210002",
    thesis: "Ứng dụng AI trong nhận diện hình ảnh",
    type: "process",
    maxScore: 10,
    deadline: "2024-05-15",
    status: "pending",
  },
];

export default function TeacherScoringPage() {
  const [scores] = useState<ThesisScore[]>(mockScores);
  const [filter, setFilter] = useState<SegmentedValue>("all");

  const filteredScores = scores.filter((s) => {
    if (filter === "all") return true;
    return s.type === filter;
  });

  const columns: ColumnsType<ThesisScore> = [
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
      ellipsis: true,
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <Tag color={type === "process" ? "blue" : "orange"}>
          {type === "process" ? "Quá trình" : "Bảo vệ"}
        </Tag>
      ),
    },
    {
      title: "Điểm",
      dataIndex: "score",
      key: "score",
      render: (score, record) => (
        score ? (
          <Text strong style={{ color: "#1dab60" }}>{score} / {record.maxScore}</Text>
        ) : (
          <Text type="secondary">--</Text>
        )
      ),
    },
    {
      title: "Hạn",
      dataIndex: "deadline",
      key: "deadline",
    },
    {
      title: "",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<EditOutlined />}
        >
          {record.status === "pending" ? "Chấm điểm" : "Xem"}
        </Button>
      ),
    },
  ];

  const avgScore = scores.filter(s => s.status === "scored").length > 0
    ? (scores.filter(s => s.status === "scored").reduce((acc, s) => acc + (s.score || 0), 0) / scores.filter(s => s.status === "scored").length).toFixed(1)
    : "--";

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto" }}>
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ marginBottom: 4 }}>Chấm điểm</Title>
        <Text type="secondary">Chấm điểm quá trình và bảo vệ</Text>
      </div>

      {/* Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} lg={6}>
          <Card >
            <Text type="secondary">Tổng cần chấm</Text>
            <Title level={3} style={{ margin: 0 }}>{scores.length}</Title>
          </Card>
        </Col>
        <Col xs={12} lg={6}>
          <Card >
            <Text type="secondary">Chờ chấm</Text>
            <Title level={3} style={{ margin: 0 }}>{scores.filter(s => s.status === "pending").length}</Title>
          </Card>
        </Col>
        <Col xs={12} lg={6}>
          <Card >
            <Text type="secondary">Đã chấm</Text>
            <Title level={3} style={{ margin: 0 }}>{scores.filter(s => s.status === "scored").length}</Title>
          </Card>
        </Col>
        <Col xs={12} lg={6}>
          <Card >
            <Text type="secondary">Điểm TB đã chấm</Text>
            <Title level={3} style={{ margin: 0 }}>{avgScore}</Title>
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
            { label: "Điểm quá trình", value: "process" },
            { label: "Điểm bảo vệ", value: "defense" },
          ]}
        />
      </Card>

      {/* Score Table */}
      <Card >
        <Table
          columns={columns}
          dataSource={filteredScores}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
}
